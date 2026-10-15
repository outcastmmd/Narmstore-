import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as { __db?: ReturnType<typeof drizzle> };

function createDb() {
  const client = postgres(process.env.DATABASE_URL!, { max: 10 });
  return drizzle(client, { schema });
}

export const db = globalForDb.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.__db = db;
