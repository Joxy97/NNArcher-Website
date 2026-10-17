import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateBooking, formatBooking } from "./src/contact.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
try {
  await fs.access(path.join(dist, "index.html"));
} catch {
  console.log("Run npm run build before starting the website.");
  process.exit(1);
}
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const smtpReady = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
let mailer;
if (smtpReady) {
  const nodemailer = await import("nodemailer");
  mailer = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    connectionTimeout: 10000,
    socketTimeout: 20000,
  });
}
const attempts = new Map();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
const headers = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'self'",
};
function json(res, status, data) {
  res.writeHead(status, {
    ...headers,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}
async function contact(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    let allowed = false;
    try {
      allowed =
        new URL(origin).host === req.headers.host ||
        origin === process.env.SITE_ORIGIN;
    } catch {}
    if (!allowed) return json(res, 403, { ok: false, error: "Invalid origin" });
  }
  const contentType = req.headers["content-type"] || "";
  if (
    !contentType.startsWith("application/json") &&
    !contentType.startsWith("application/x-www-form-urlencoded")
  )
    return json(res, 415, { ok: false, error: "Unsupported content type" });
  let bytes = 0,
    chunks = [];
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 16000) {
      json(res, 413, { ok: false, error: "Request too large" });
      return;
    }
    chunks.push(chunk);
  }
  let data;
  try {
    const text = Buffer.concat(chunks).toString("utf8");
    if (contentType.startsWith("application/json")) data = JSON.parse(text);
    else {
      const fields = new URLSearchParams(text);
      data = Object.fromEntries(fields);
      data.communication = fields.getAll("communication");
    }
  } catch {
    return json(res, 400, { ok: false, error: "Invalid request" });
  }
  if (data?.website) return json(res, 200, { ok: true });
  const errors = validateBooking(data);
  if (errors.length)
    return json(res, 400, {
      ok: false,
      error: "Please check the form",
      fields: errors,
    });
  if (!smtpReady)
    return json(res, 503, {
      ok: false,
      error: "Email delivery is not configured",
    });
  const key = req.socket.remoteAddress;
  const now = Date.now();
  for (const [ip, times] of attempts) {
    const recent = times.filter((t) => now - t < 3600000);
    if (recent.length) attempts.set(ip, recent);
    else attempts.delete(ip);
  }
  const times = attempts.get(key) || [];
  if (times.length >= 5)
    return json(res, 429, { ok: false, error: "Please try again later" });
  attempts.set(key, [...times, now]);
  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO || "photo@nnarcher.com",
      replyTo: { name: data.name, address: data.email },
      subject: `Upit za fotografisanje — ${data.service}`,
      text: formatBooking(data),
    });
    json(res, 200, { ok: true });
  } catch {
    console.error("Contact delivery failed. Check SMTP settings.");
    json(res, 502, { ok: false, error: "Delivery failed" });
  }
}
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (
      ["/api/config", "/contact-config.json"].includes(url.pathname) &&
      req.method === "GET"
    )
      return json(res, 200, { mode: smtpReady ? "smtp" : "email" });
    if (url.pathname === "/api/contact" && req.method === "POST")
      return await contact(req, res);
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { ...headers, Allow: "GET, HEAD" });
      return res.end();
    }
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return json(res, 400, { ok: false });
    }
    const legacyHome = pathname.match(/^(\/en)?\/home(?:-1)?(?:\/index\.html|\/)?$/);
    const canonicalPath = legacyHome ? `${legacyHome[1] || ""}/` : url.pathname.endsWith("/index.html") ? url.pathname.slice(0, -10) : null;
    if (canonicalPath) {
      res.writeHead(301, { ...headers, Location: canonicalPath.replace(/^\/+/, "/") + url.search });
      return res.end();
    }
    let filename = path.resolve(dist, "." + pathname);
    const relative = path.relative(dist, filename);
    if (relative.startsWith("..") || path.isAbsolute(relative))
      return json(res, 403, { ok: false });
    let status = 200;
    try {
      const stat = await fs.stat(filename);
      if (stat.isDirectory()) {
        if (!pathname.endsWith("/")) {
          res.writeHead(301, { ...headers, Location: url.pathname.replace(/^\/+/, "/") + "/" + url.search });
          return res.end();
        }
        filename = path.join(filename, "index.html");
      }
      await fs.access(filename);
    } catch {
      filename = path.join(dist, pathname.startsWith("/en/") ? "en/404.html" : "404.html");
      status = 404;
    }
    const stat = await fs.stat(filename);
    res.writeHead(status, {
      ...headers,
      "Content-Type":
        types[path.extname(filename)] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control":
        filename.includes(path.join("assets", "images")) ||
        filename.endsWith(".woff2")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
    });
    if (req.method === "HEAD") return res.end();
    res.end(await fs.readFile(filename));
  } catch {
    if (!res.headersSent) json(res, 500, { ok: false, error: "Server error" });
    else res.end();
  }
});
server.listen(port, host, () => {
  console.log(
    `NNPhotoArcher website: http://${host === "0.0.0.0" ? "localhost" : host}:${port}`,
  );
  console.log(
    `Contact delivery: ${smtpReady ? "SMTP configured" : "email draft fallback (set SMTP in .env for direct submission)"}`,
  );
});
const shutdown = () => server.close(() => process.exit(0));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
