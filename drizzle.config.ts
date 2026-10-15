import { defineConfig } from "drizzle-kit";

function dbUrl(): string {
  const url = process.env.DATABASE_URL!;
  if (/localhost|127\.0\.0\.1/.test(url) || url.includes("sslmode=")) return url;
  return url + (url.includes("?") ? "&" : "?") + "sslmode=require";
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: dbUrl() },
});
