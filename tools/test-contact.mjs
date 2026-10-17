// Tests the real SMTP path using a local in-memory SMTP sink. No external mail is sent.
import net from "node:net";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const messages = [];
const smtp = net.createServer((socket) => {
  socket.write("220 local.test ESMTP\r\n");
  let buffer = "",
    inData = false,
    message = "";
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    let end;
    while ((end = buffer.indexOf("\r\n")) !== -1) {
      const line = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      if (inData) {
        if (line === ".") {
          messages.push(message);
          message = "";
          inData = false;
          socket.write("250 Message accepted\r\n");
        } else message += line + "\n";
        continue;
      }
      if (/^EHLO|^HELO/.test(line))
        socket.write("250-local.test\r\n250 SIZE 20000\r\n");
      else if (/^MAIL FROM|^RCPT TO|^RSET/.test(line))
        socket.write("250 OK\r\n");
      else if (line === "DATA") {
        inData = true;
        socket.write("354 Send message\r\n");
      } else if (line === "QUIT") {
        socket.end("221 Bye\r\n");
      } else socket.write("250 OK\r\n");
    }
  });
});
await new Promise((resolve) => smtp.listen(0, "127.0.0.1", resolve));
const smtpPort = smtp.address().port;
const appPort = 4174;
const child = spawn(process.execPath, ["server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: String(appPort),
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: String(smtpPort),
    SMTP_SECURE: "false",
    SMTP_USER: "",
    SMTP_FROM: "website@example.invalid",
    SMTP_TO: "inbox@example.invalid",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Server startup timeout")),
      10000,
    );
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("NNPhotoArcher website:")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.on("error", reject);
  });
  const config = await fetch(`http://127.0.0.1:${appPort}/contact-config.json`).then(
    (r) => r.json(),
  );
  assert.equal(config.mode, "smtp");
  const valid = {
    name: "Local Test",
    email: "test@example.invalid",
    phone: "+381 65 123 4567",
    service: "Portret",
    date: "2027-06-15",
    details: "Local verification only",
    communication: ["Telefonom"],
  };
  const send = (data) =>
    fetch(`http://127.0.0.1:${appPort}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  assert.equal((await send({ ...valid, email: "invalid" })).status, 400);
  assert.equal((await send({ ...valid, website: "spam" })).status, 200);
  assert.equal(messages.length, 0);
  const response = await send(valid);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(messages.length, 1);
  assert.match(messages[0], /Local verification only/);
  assert.match(messages[0], /Reply-To: Local Test <test@example.invalid>/);
  const cross = await fetch(`http://127.0.0.1:${appPort}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://unrelated.example",
    },
    body: JSON.stringify(valid),
  });
  assert.equal(cross.status, 403);
  for (let i = 0; i < 4; i++) assert.equal((await send(valid)).status, 200);
  assert.equal((await send(valid)).status, 429);
  console.log(
    "Passed: local SMTP delivery, Reply-To, required fields, honeypot, origin check, and rate limit. No external email sent.",
  );
} finally {
  child.kill();
  smtp.close();
}
