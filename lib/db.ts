import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as { __db?: ReturnType<typeof drizzle> };

function createDb() {
  const url = process.env.DATABASE_URL!;
  // Render و دیتابیس‌های ابری SSL اجباری می‌خواهند؛ لوکال نه
  const ssl = /localhost|127\.0\.0\.1/.test(url) ? false : "require";
  const client = postgres(url, { max: 10, ssl });
  return drizzle(client, { schema });
}

export const db = globalForDb.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.__db = db;
