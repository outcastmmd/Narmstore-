/**
 * Runtime smoke test for NarmStore critical pages.
 *
 * Hits the deployed site and asserts the three critical paths work:
 *   1. Homepage loads and shows the store branding
 *   2. An app detail page loads (plain GET)
 *   3. The same app page loads as an RSC payload (the exact request shape
 *      Next.js uses for client-side navigation). This is what caught the
 *      2026-10-16 `onClick`-in-server-component bug: plain GET returned 200
 *      while the RSC request failed.
 *   4. Search returns results for a common query
 *
 * Usage:
 *   BASE_URL=https://narmstore.onrender.com node tests/smoke.mjs
 *
 * Render free tier cold-starts (~25s), so the test retries with backoff.
 * Keep it fast: target < 2 min total.
 */
const BASE = (process.env.BASE_URL || "https://narmstore.onrender.com").replace(/\/$/, "");
const TIMEOUT_MS = 30000;
const MAX_WAIT_MS = 120000; // cold start budget

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal, redirect: "follow" });
    const text = await res.text();
    return { status: res.status, text };
  } finally {
    clearTimeout(t);
  }
}

async function waitForBoot() {
  const start = Date.now();
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt++;
    try {
      const { status } = await fetchWithTimeout(`${BASE}/`);
      if (status === 200) return;
      console.log(`  boot check ${attempt}: status ${status}, retrying...`);
    } catch (e) {
      console.log(`  boot check ${attempt}: ${e.cause?.code || e.message}, retrying...`);
    }
    if (Date.now() - start > MAX_WAIT_MS) {
      throw new Error(`site did not respond with 200 within ${MAX_WAIT_MS / 1000}s`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

check("homepage returns 200 with branding", async () => {
  const { status, text } = await fetchWithTimeout(`${BASE}/`);
  if (status !== 200) throw new Error(`status ${status}`);
  if (!text.includes("نرم‌استور")) throw new Error("missing نرم‌استور branding");
});

check("app page returns 200 (plain GET)", async () => {
  const { status, text } = await fetchWithTimeout(`${BASE}/app/org-localsend-localsend_app`);
  if (status !== 200) throw new Error(`status ${status}`);
  if (!text.includes("لوکال‌سند")) throw new Error("missing app name لوکال‌سند");
});

check("app page RSC payload returns 200 (client-navigation shape)", async () => {
  // Next.js client navigation fetches the RSC payload; a serialization
  // failure here (e.g. function prop in a server component) returns 500
  // even when the plain HTML GET returns 200.
  const { status } = await fetchWithTimeout(`${BASE}/app/org-localsend-localsend_app`, {
    headers: { RSC: "1" },
  });
  if (status !== 200) throw new Error(`RSC request status ${status} (expected 200)`);
});

check("search returns results", async () => {
  const { status, text } = await fetchWithTimeout(`${BASE}/search?q=${encodeURIComponent("تلگرام")}`);
  if (status !== 200) throw new Error(`status ${status}`);
  if (!text.includes("نتایج جست‌وجو")) throw new Error("missing search results heading");
});

async function main() {
  console.log(`[smoke] target: ${BASE}`);
  console.log("[smoke] waiting for site to respond...");
  await waitForBoot();
  console.log("[smoke] site is up, running checks...");
  let failed = 0;
  for (const { name, fn } of checks) {
    try {
      await fn();
      console.log(`[smoke] PASS: ${name}`);
    } catch (e) {
      failed++;
      console.error(`[smoke] FAIL: ${name} — ${e.message}`);
    }
  }
  if (failed) {
    console.error(`[smoke] ${failed}/${checks.length} checks failed`);
    process.exit(1);
  }
  console.log(`[smoke] all ${checks.length} checks passed`);
}

main().catch((e) => {
  console.error(`[smoke] ERROR: ${e.message}`);
  process.exit(1);
});
