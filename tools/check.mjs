import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { validateBooking, formatBooking } from "../src/contact.mjs";
import { createEnglishTranslator } from "../src/english.mjs";
import { escape } from "../src/site.mjs";
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const files = await fs.readdir(dist, { recursive: true });
let links = 0;
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = await fs.readFile(path.join(dist, file), "utf8");
  assert.match(html, file.replaceAll("\\", "/").startsWith("en/") ? /<html lang="en">/ : /<html lang="sr-Latn">/);
  assert.ok(
    !/squarespace|sqspcdn|images\.squarespace-cdn/.test(html),
    "Unexpected Squarespace runtime dependency: " + file,
  );
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
    const href = match[1].replace(/&amp;/g, "&");
    if (!href.startsWith("/")) continue;
    const url = new URL(href + (match[2] || ""), "https://local.test");
    let target = path.join(dist, url.pathname);
    const stat = await fs.stat(target);
    if (stat.isDirectory()) target = path.join(target, "index.html");
    await fs.access(target);
    if (url.hash && target.endsWith(".html")) {
      const destination = await fs.readFile(target, "utf8");
      assert.ok(
        destination.includes(`id="${url.hash.slice(1)}"`),
        `Missing anchor ${url.hash} in ${target}`,
      );
    }
    links++;
  }
}
const content = JSON.parse(
  await fs.readFile(path.join(root, "src/content.json"), "utf8"),
);
assert.equal(
  content.galleries.reduce((n, g) => n + g.images.length, 0),
  60,
);
assert.equal(Object.keys(content.images).length, 71);
for (const image of Object.values(content.images))
  for (const v of image.variants) await fs.access(path.join(dist, v.src));
for (const [kind, route] of [
  ["privacy", "privacy-policy"],
  ["terms", "privacy-policy-1"],
]) {
  const html = await fs.readFile(path.join(dist, route, "index.html"), "utf8");
  const plain = html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  for (const text of content.legal[kind])
    assert.ok(
      plain.includes(text.text),
      "Missing legal text: " + text.text.slice(0, 80),
    );
  const english = await fs.readFile(path.join(dist, "en", route, "index.html"), "utf8");
  const translate = createEnglishTranslator(content);
  for (const text of content.legal[kind])
    assert.ok(
      english.includes(escape(translate(text.text))),
      "Missing English legal text: " + text.text.slice(0, 80),
    );
}
for (const route of ["", "works/", "usluge/", "o-meni/", "about/"]) {
  const serbian = await fs.readFile(path.join(dist, route, "index.html"), "utf8");
  const english = await fs.readFile(path.join(dist, "en", route, "index.html"), "utf8");
  assert.ok(serbian.includes(`href="/en/${route}"`), `Missing English link on ${route}`);
  assert.ok(english.includes(`href="/${route}"`), `Missing Serbian link on en/${route}`);
}
const englishBooking = await fs.readFile(path.join(dist, "en/about/index.html"), "utf8");
assert.match(englishBooking, /<option value="Venčanje">Wedding<\/option>/);
assert.match(englishBooking, /<button class="button submit-button" type="submit">SEND ENQUIRY<\/button>/);
const valid = {
  name: "Local Test",
  email: "test@example.invalid",
  phone: "+381 65 123 4567",
  service: "Portret",
  date: "2027-06-15",
  details: "Local verification only",
  communication: ["Telefonom"],
};
assert.deepEqual(validateBooking(valid), []);
assert.ok(validateBooking({ ...valid, email: "invalid" }).includes("email"));
assert.ok(validateBooking({ ...valid, date: "2027-02-31" }).includes("date"));
assert.ok(
  validateBooking({
    ...valid,
    name: "Injected\r\nBcc: test@example.invalid",
  }).includes("name"),
);
assert.ok(
  validateBooking({ ...valid, communication: ["invalid"] }).includes(
    "communication",
  ),
);
assert.ok(
  validateBooking({ ...valid, details: "x".repeat(5001) }).includes("details"),
);
assert.match(formatBooking(valid), /Portret/);
console.log(
  `Passed: ${links} local links/assets; 71 images; 60 gallery placements; complete legal text; contact validation.`,
);
await import("./check-seo.mjs");
