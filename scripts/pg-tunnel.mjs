// تونل لوکال به PostgreSQL ابری از طریق HTTP Proxy (CONNECT)
// این تونل فقط لوله‌ی خام TCP است؛ خودِ کلاینت PostgreSQL ارتقای SSLRequest→TLS را انجام می‌دهد.
// استفاده:
//   node scripts/pg-tunnel.mjs &
//   DATABASE_URL="postgresql://USER:PASS@127.0.0.1:5433/narmstore" DB_SSL=require \
//     DB_SSL_SERVERNAME="<real-db-host>" npx tsx db/sync-fdroid.ts
import net from "node:net";

const DB_HOST = process.env.PG_TUNNEL_HOST || "dpg-db8jmevavr4c73frecdg-a.oregon-postgres.render.com";
const DB_PORT = Number(process.env.PG_TUNNEL_PORT || 5432);
const LOCAL_PORT = Number(process.env.PG_TUNNEL_LOCAL_PORT || 5433);

const proxyUrl = new URL(process.env.HTTPS_PROXY || process.env.https_proxy);
const PROXY_HOST = proxyUrl.hostname;
const PROXY_PORT = Number(proxyUrl.port || 3128);
const PROXY_AUTH = "Basic " + Buffer.from(
  decodeURIComponent(proxyUrl.username) + ":" + decodeURIComponent(proxyUrl.password)
).toString("base64");

function handleClient(client) {
  const proxy = net.connect(PROXY_PORT, PROXY_HOST, () => {
    proxy.write(
      `CONNECT ${DB_HOST}:${DB_PORT} HTTP/1.1\r\n` +
      `Host: ${DB_HOST}:${DB_PORT}\r\n` +
      `Proxy-Authorization: ${PROXY_AUTH}\r\n` +
      `Proxy-Connection: Keep-Alive\r\n\r\n`
    );
  });

  let raw = Buffer.alloc(0);
  proxy.on("data", (chunk) => {
    raw = Buffer.concat([raw, chunk]);
    const str = raw.toString("latin1");
    const hEnd = str.indexOf("\r\n\r\n");
    if (hEnd === -1) return;
    proxy.removeAllListeners("data");
    const statusLine = str.slice(0, str.indexOf("\r\n"));
    if (!/^HTTP\/1\.[01] 200/.test(statusLine)) {
      console.error("proxy CONNECT failed:", statusLine);
      client.destroy(); proxy.destroy(); return;
    }
    const rest = raw.subarray(hEnd + 4);
    if (rest.length) client.write(rest);
    proxy.pipe(client).pipe(proxy);
    const onErr = () => { try { client.destroy(); } catch {} try { proxy.destroy(); } catch {} };
    client.on("error", onErr);
    proxy.on("error", onErr);
  });
  proxy.on("error", (e) => { console.error("proxy error:", e.message); client.destroy(); });
  client.on("error", () => proxy.destroy());
}

net.createServer(handleClient).listen(LOCAL_PORT, "127.0.0.1", () => {
  console.log(`tunnel ready: 127.0.0.1:${LOCAL_PORT} -> ${DB_HOST}:${DB_PORT} (via proxy)`);
});
