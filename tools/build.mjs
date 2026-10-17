import fs from "node:fs/promises";
import path from "node:path";
import { createSite } from "../src/site.mjs";
import { sitemapXml, siteOrigin } from "../src/seo.mjs";
const root = path.resolve(import.meta.dirname, "..");
const content = JSON.parse(
  await fs.readFile(path.join(root, "src/content.json"), "utf8"),
);
const dist = path.join(root, "dist");
const indexable = !["deploy-preview", "branch-deploy", "dev"].includes(process.env.CONTEXT);
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
for (const language of ["sr", "en"]) {
  for (const [name, html] of createSite(content, language, { indexable, verification: process.env.GOOGLE_SITE_VERIFICATION })) {
    const output = language === "en" ? path.join("en", name) : name;
    await fs.mkdir(path.dirname(path.join(dist, output)), { recursive: true });
    await fs.writeFile(path.join(dist, output), html);
  }
}
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  sitemapXml(content),
);
await fs.writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);
await fs.writeFile(path.join(dist, "_headers"),
  (indexable ? "/404.html\n  X-Robots-Tag: noindex\n/en/404.html\n  X-Robots-Tag: noindex\n" : "/*\n  X-Robots-Tag: noindex, follow\n"));
await fs.writeFile(path.join(dist, "_redirects"),
  "/home / 301!\n/home-1 / 301!\n/en/home /en/ 301!\n/en/home-1 /en/ 301!\n/en/* /en/404.html 404\n");
console.log("Built all pages and local assets in dist/.");
