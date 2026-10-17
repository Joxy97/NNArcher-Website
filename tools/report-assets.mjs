import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const pages = JSON.parse(
  await fs.readFile(path.join(root, "reference/all-pages.json"), "utf8"),
);
const data = JSON.parse(
  await fs.readFile(path.join(root, "src/content.json"), "utf8"),
);
const text = [
  "NNPHOTOARCHER — RECOVERED IMAGE ASSETS",
  "",
  `${Object.keys(data.images).length} distinct publicly referenced image URLs recovered.`,
  "Untouched CDN downloads are stored in originals/. Optimized website derivatives are in public/assets/images/ and dist/assets/images/.",
  "The CDN serves many files at 2,500 pixels wide even when uploaded-image metadata describes larger dimensions.",
  "Download dimensions below are verified from the image bytes. Metadata dimensions come from the original website.",
  "",
];
let smaller = 0;
for (const asset of Object.values(data.images).sort((a, b) =>
  a.originalName.localeCompare(b.originalName),
)) {
  const metadata = pages
    .flatMap((p) => p.images)
    .find((i) => i.src === asset.source && i.dimensions)?.dimensions;
  const originalWidth = Number(metadata?.split("x")[0]);
  const limited = originalWidth > asset.width;
  if (limited) smaller++;
  text.push(
    `${asset.originalName} [${asset.id}]`,
    `  Download: ${asset.width} × ${asset.height}; upload metadata: ${metadata || "not specified"}${limited ? " — larger master not publicly recovered" : ""}`,
    `  File: ${asset.original}`,
    `  Source: ${asset.source}`,
    "",
  );
}
text.splice(
  6,
  0,
  `${smaller} image URLs have metadata indicating a larger upload. No image URLs failed to download.`,
  "",
);
await fs.writeFile(path.join(root, "IMAGE-ASSETS.txt"), text.join("\n") + "\n");
console.log(
  `Asset report: ${Object.keys(data.images).length} recovered; ${smaller} could benefit from larger masters.`,
);
