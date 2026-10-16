// آیکون‌های PWA — از فایل‌های JSON (base64) در زمان بیلد ساخته می‌شوند
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "icons");
mkdirSync(dir, { recursive: true });
const files = {
  ...JSON.parse(readFileSync(join(root, "scripts", "icons-data-1.json"), "utf8")),
  ...JSON.parse(readFileSync(join(root, "scripts", "icons-data-2.json"), "utf8")),
};
for (const [n, b] of Object.entries(files)) writeFileSync(join(dir, n), Buffer.from(b, "base64"));
console.log("icons generated");
