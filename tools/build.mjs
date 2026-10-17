import fs from "node:fs/promises";
import path from "node:path";
import { createSite } from "../src/site.mjs";
const root = path.resolve(import.meta.dirname, "..");
const content = JSON.parse(
  await fs.readFile(path.join(root, "src/content.json"), "utf8"),
);
const dist = path.join(root, "dist");
await fs.mkdir(dist, { recursive: true });
await fs.cp(path.join(root, "public"), dist, { recursive: true });
for (const name of ["styles.css", "app.js"])
  await fs.copyFile(path.join(root, "src", name), path.join(dist, name));
if (process.env.CONTACT_DELIVERY === "netlify")
  await fs.writeFile(
    path.join(dist, "contact-config.json"),
    JSON.stringify({ mode: "netlify" }),
  );
const focalRules = content.galleries
  .flatMap((g) =>
    g.positions.map(
      (position, i) =>
        `[data-gallery="${g.id}"][data-index="${i}"] img { object-position: ${position}; }`,
    ),
  )
  .join("\n");
await fs.appendFile(
  path.join(dist, "styles.css"),
  "\n/* Original gallery focal points. */\n" + focalRules + "\n",
);
for (const [name, html] of createSite(content)) {
  await fs.mkdir(path.dirname(path.join(dist, name)), { recursive: true });
  await fs.writeFile(path.join(dist, name), html);
}
const paths = [
  "/",
  "/works/",
  "/usluge/",
  "/o-meni/",
  "/about/",
  "/privacy-policy/",
  "/privacy-policy-1/",
];
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    paths
      .map((p) => `<url><loc>https://www.nnarcher.com${p}</loc></url>`)
      .join("") +
    "</urlset>",
);
await fs.writeFile(
  path.join(dist, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://www.nnarcher.com/sitemap.xml\n",
);
console.log("Built all pages and local assets in dist/.");
