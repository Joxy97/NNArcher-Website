import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createSite } from "../src/site.mjs";
import { absoluteUrl, indexableRoutes, localizedRoute, servicePages, siteOrigin } from "../src/seo.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const isPreview = ["deploy-preview", "branch-deploy", "dev"].includes(process.env.CONTEXT);
const content = JSON.parse(await fs.readFile(path.join(root, "src/content.json"), "utf8"));
const sitemap = await fs.readFile(path.join(dist, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = indexableRoutes.flatMap((route) => ["sr", "en"].map((lang) => absoluteUrl(localizedRoute(route, lang))));
assert.deepEqual([...urls].sort(), [...expected].sort(), "Sitemap must contain exactly the canonical language variants");
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
assert.match(sitemap, /xmlns:image=/);
assert.match(sitemap, /hreflang="x-default"/);
assert.doesNotMatch(sitemap, /<lastmod>|<priority>|<changefreq>/, "Do not manufacture modification dates or priority hints");

const titles = new Set(), descriptions = new Set(), pages = new Map();
for (const route of indexableRoutes) {
  for (const language of ["sr", "en"]) {
    const pathname = localizedRoute(route, language);
    const html = await fs.readFile(path.join(dist, pathname, "index.html"), "utf8");
    pages.set(pathname, html);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && description, `Missing search metadata on ${pathname}`);
    assert.ok(!titles.has(title), `Duplicate title on ${pathname}`);
    assert.ok(!descriptions.has(description), `Duplicate description on ${pathname}`);
    titles.add(title); descriptions.add(description);
    assert.ok(html.includes(`<link rel="canonical" href="${absoluteUrl(pathname)}">`), `Incorrect canonical on ${pathname}`);
    assert.match(html, isPreview ? /name="robots" content="noindex, follow"/ : /name="robots" content="index, follow, max-image-preview:large"/);
    for (const lang of ["sr", "en"]) assert.ok(html.includes(`hreflang="${lang}" href="${absoluteUrl(localizedRoute(route, lang))}"`), `Missing language counterpart on ${pathname}`);
    assert.ok(html.includes(`property="og:url" content="${absoluteUrl(pathname)}"`));
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]);
    assert.equal(graph["@context"], "https://schema.org");
    assert.ok(graph["@graph"].some((node) => node["@id"] === absoluteUrl(pathname) + "#webpage"));
    assert.ok(graph["@graph"].every((node) => node["@id"]?.startsWith(siteOrigin)));
    assert.ok(!JSON.stringify(graph).includes("aggregateRating"), "No unsupported review claims");
    assert.ok(!JSON.stringify(graph).includes("streetAddress"), "Do not invent a studio address");
    const landing = servicePages.find((page) => page.sr.path === route);
    if (landing) {
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      const service = graph["@graph"].find((node) => node["@type"] === "Service");
      assert.equal(service.name, landing[language].name);
      assert.ok(service.areaServed.some((area) => area.name === "Beograd"));
      assert.ok(service.areaServed.some((area) => area.name === "Novi Sad"));
      assert.ok(html.includes('class="service-questions"') && html.includes('class="packages"'));
      assert.ok(html.includes(`class="language-switch" href="${localizedRoute(route, language === "sr" ? "en" : "sr")}"`));
    }
    assert.doesNotMatch(html, /name="keywords"|display:\s*none[^>]*>fotograf/i);
  }
}
for (const page of servicePages) {
  for (const language of ["sr", "en"]) {
    const target = localizedRoute(page.sr.path, language);
    const home = pages.get(localizedRoute("/", language));
    const gallery = pages.get(localizedRoute("/works/", language));
    assert.ok(home.includes(`href="${target}"`) && gallery.includes(`href="${target}"`), `Orphan service page: ${target}`);
    const overview = pages.get(localizedRoute("/usluge/", language));
    assert.equal((overview.match(/<h1[ >]/g) || []).length, 1, "USLUGE must keep one page heading");
    assert.ok(overview.includes(`href="#${page.id}"`), `Missing scroll button for ${page.id}`);
    assert.equal((overview.match(new RegExp(`id="${page.id}"`, "g")) || []).length, 1, `Missing or duplicate scroll target for ${page.id}`);
    const section = overview.match(new RegExp(`<section[^>]*id="${page.id}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
    assert.ok(section?.includes('class="service-questions"') && section.includes('class="packages"'), `Incomplete USLUGE section: ${page.id}`);
  }
}
for (const language of ["sr", "en"]) {
  for (const [name, html] of createSite(content, language, { indexable: false }))
    assert.match(html, /name="robots" content="noindex, follow"/, `Preview is indexable: ${name}`);
  const notFound = await fs.readFile(path.join(dist, language === "en" ? "en/404.html" : "404.html"), "utf8");
  assert.match(notFound, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(notFound, /rel="canonical"/);
}
const redirects = await fs.readFile(path.join(dist, "_redirects"), "utf8");
assert.match(redirects, /\/home \/ 301!/);
assert.match(redirects, /\/en\/\* \/en\/404\.html 404/);
assert.match(await fs.readFile(path.join(dist, "robots.txt"), "utf8"), /Sitemap: https:\/\/www\.nnarcher\.com\/sitemap\.xml/);
const headers = await fs.readFile(path.join(dist, "_headers"), "utf8");
if (isPreview) assert.match(headers, /^\/\*\n  X-Robots-Tag: noindex, follow/);
else assert.doesNotMatch(headers, /^\/\*\n  X-Robots-Tag: noindex/);
console.log(`Passed SEO: ${urls.length} canonical pages, unique metadata, reciprocal languages, structured data, linked services, image sitemap, and preview noindex.`);
