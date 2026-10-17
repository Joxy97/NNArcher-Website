import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pages = JSON.parse(
  await fs.readFile(path.join(root, "reference/all-pages.json"), "utf8"),
);
const assetRoot = path.join(root, "public/assets");
await fs.mkdir(path.join(root, "originals"), { recursive: true });
await fs.mkdir(path.join(root, "src"), { recursive: true });
await fs.mkdir(path.join(assetRoot, "images"), { recursive: true });
await fs.mkdir(path.join(assetRoot, "fonts"), { recursive: true });
const sources = [
  ...new Set(
    pages
      .flatMap((p) => p.images.map((i) => i.src))
      .filter((s) => /^https:/.test(s)),
  ),
];
const assets = {};
let done = 0;
async function download(url, filename) {
  try {
    return await fs.readFile(filename);
  } catch {}
  let last;
  for (let n = 0; n < 3; n++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(filename, bytes);
      return bytes;
    } catch (e) {
      last = e;
    }
  }
  throw last;
}
async function worker() {
  while (sources.length) {
    const source = sources.shift();
    const hash = crypto
      .createHash("sha256")
      .update(source)
      .digest("hex")
      .slice(0, 8);
    const originalName = decodeURIComponent(
      new URL(source).pathname.split("/").pop(),
    ).replace(/\+/g, " ");
    const ext = path.extname(originalName).toLowerCase();
    const id =
      path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9-]+/g, "-")
        .replace(/-+$/, "")
        .toLowerCase() +
      "-" +
      hash;
    const original = `originals/${id}${ext}`;
    const bytes = await download(source, path.join(root, original));
    const meta = await sharp(bytes).metadata();
    const variants = [];
    for (const width of [480, 960, 1600, 2400]) {
      const target = `assets/images/${id}-${width}.webp`;
      try {
        await fs.access(path.join(root, "public", target));
      } catch {
        await sharp(bytes)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 88, effort: 4 })
          .toFile(path.join(root, "public", target));
      }
      variants.push({ width: Math.min(width, meta.width), src: "/" + target });
    }
    assets[source] = {
      id,
      source,
      original,
      originalName,
      width: meta.width,
      height: meta.height,
      variants,
    };
    console.log(
      `Image ${++done}: ${originalName} (${meta.width}×${meta.height})`,
    );
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
const faces = [
  ...new Set(
    pages.flatMap((p) =>
      [...p.html.matchAll(/@font-face\s*\{[^}]+\}/g)].map((m) => m[0]),
    ),
  ),
];
const fontBlocks = [];
const fontUrls = new Map();
for (let block of faces) {
  const url = block.match(/url\(['"]([^'"]+)['"]\)/)?.[1];
  if (
    !url ||
    !/font-family:\s*'(Playfair Display|Hind)'/.test(block) ||
    !/\/(latin|latin-ext)\.woff2/.test(url)
  )
    continue;
  if (!fontUrls.has(url)) {
    const filename = `font-${crypto.createHash("sha256").update(url).digest("hex").slice(0, 10)}.woff2`;
    await download(url, path.join(assetRoot, "fonts", filename));
    fontUrls.set(url, filename);
  }
  block = block.replace(url, `/assets/fonts/${fontUrls.get(url)}`);
  if (!fontBlocks.includes(block)) fontBlocks.push(block);
}
await fs.writeFile(
  path.join(root, "public/fonts.css"),
  fontBlocks.join("\n\n") + "\n",
);
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
const imgSources = (html) =>
  [...html.matchAll(/<img\b[^>]*>/g)]
    .map((m) =>
      decode(
        m[0].match(/data-src="([^"]+)"/)?.[1] ||
          m[0].match(/src="([^"]+)"/)?.[1] ||
          "",
      ),
    )
    .filter(Boolean);
const page = (route) => pages.find((p) => new URL(p.url).pathname === route);
const home = page("/");
const works = page("/works");
let cursor = 0;
const galleries = works.sections
  .filter((s) => s.id)
  .map((s) => {
    const urls = imgSources(s.html);
    const images = works.images.slice(cursor, cursor + urls.length);
    cursor += urls.length;
    // Fluid Engine's DOM order differs from its visual order. Preserve the visible rows.
    const ordered = images.sort((a, b) =>
      Math.abs(a.rect.y - b.rect.y) > 20
        ? a.rect.y - b.rect.y
        : a.rect.x - b.rect.x,
    );
    return {
      id: s.id,
      title: {
        vencanja: "VENČANJA",
        poslovne: "POSLOVNO FOTOGRAFISANJE",
        portreti: "PORTRETI",
        proslave: "PROSLAVE",
      }[s.id],
      serviceAnchor: s.id === "poslovne" ? "poslovni" : s.id,
      images: ordered.map((i) => assets[i.src].id),
      positions: ordered.map((i) => i.style.objectPosition),
    };
  });
const mainTexts = (route) =>
  page(route)
    .texts.filter(
      (t) =>
        ["P", "H1", "H2", "H3", "H4"].includes(t.tag) &&
        !/^Instagram:|^E-mail:|^Tel\.|^©|^Kontakt i|^Politika privatnosti$|^Uslovi korišćenja$/.test(
          t.text,
        ),
    )
    .map((t) => ({ tag: t.tag.toLowerCase(), text: t.text.trim() }));
const content = {
  capturedAt: new Date().toISOString(),
  source: "https://www.nnarcher.com",
  images: Object.fromEntries(Object.values(assets).map((a) => [a.id, a])),
  home: {
    hero: assets[home.images[0].src].id,
    serviceImages: [...new Set(imgSources(home.sections[1].html))].map(
      (s) => assets[s].id,
    ),
    arrow: assets[home.images.find((i) => i.src.endsWith("Arrow.png")).src].id,
    portrait:
      assets[home.images.find((i) => i.src.includes("IMG_7793")).src].id,
    banner: assets[home.images.at(-1).src].id,
    texts: mainTexts("/"),
  },
  galleries,
  services: {
    images: page("/usluge").images.map((i) => assets[i.src].id),
    texts: mainTexts("/usluge"),
  },
  about: {
    images: page("/o-meni").images.map((i) => assets[i.src].id),
    texts: mainTexts("/o-meni"),
  },
  contact: { images: page("/about").images.map((i) => assets[i.src].id) },
  legal: {
    privacy: mainTexts("/privacy-policy"),
    terms: mainTexts("/privacy-policy-1"),
  },
};
await fs.writeFile(
  path.join(root, "src/content.json"),
  JSON.stringify(content, null, 2) + "\n",
);
await fs.writeFile(
  path.join(root, "reference/asset-manifest.json"),
  JSON.stringify(
    {
      capturedAt: content.capturedAt,
      images: Object.values(assets),
      fonts: [...fontUrls.keys()],
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Imported ${done} uploaded images, ${fontUrls.size} font files, ${galleries.reduce((n, g) => n + g.images.length, 0)} gallery placements. No missing images.`,
);
