import { connection } from "next/server";
import { db } from "./db";
import * as s from "@/db/schema";
import { eq, and, desc, sql, inArray, like, or } from "drizzle-orm";
import { normalizeFa } from "./fa";

// تمام کوئری‌های فروشگاه داینامیک‌اند (هر درخواست، داده‌ی تازه)
async function dyn() {
  await connection();
}

// تعداد دانلود واقعی هر اپ (رویدادهای یکتا)
const dlCount = sql<number>`(select count(*) from ${s.downloadEvents} where ${s.downloadEvents.appId} = ${s.apps.id})`.as("download_count");
const curVersion = sql<string | null>`(select ${s.appVersions.versionName} from ${s.appVersions} where ${s.appVersions.appId} = ${s.apps.id} and ${s.appVersions.isCurrent} = true and ${s.appVersions.status} = 'active' limit 1)`.as("version_name");

const cardCols = {
  id: s.apps.id, slug: s.apps.slug, nameFa: s.apps.nameFa, nameEn: s.apps.nameEn,
  iconUrl: s.apps.iconUrl, shortDesc: s.apps.shortDesc,
  versionName: curVersion, downloadCount: dlCount,
};

const pub = eq(s.apps.isPublished, true);

export async function getRootCategories() {
  await dyn();
  const rows = await db.select({
    id: s.categories.id, slug: s.categories.slug, nameFa: s.categories.nameFa, icon: s.categories.icon,
    appCount: sql<number>`(select count(*) from ${s.appCategories} join ${s.apps} on ${s.apps.id} = ${s.appCategories.appId} where ${s.appCategories.categoryId} = ${s.categories.id} and ${s.apps.isPublished} = true)`.as("app_count"),
  }).from(s.categories)
    .where(and(eq(s.categories.isActive, true), sql`${s.categories.parentId} is null`))
    .orderBy(s.categories.sortOrder, s.categories.nameFa);
  return rows;
}

export async function getFeaturedApps(limit = 8) {
  await dyn();
  return db.select(cardCols).from(s.apps)
    .where(and(pub, eq(s.apps.featured, true)))
    .orderBy(desc(s.apps.updatedAt)).limit(limit);
}

export async function getEditorChoice(limit = 8) {
  await dyn();
  return db.select(cardCols).from(s.apps)
    .where(and(pub, eq(s.apps.editorChoice, true)))
    .orderBy(desc(s.apps.updatedAt)).limit(limit);
}

export async function getPopularApps(limit = 8) {
  await dyn();
  return db.select(cardCols).from(s.apps)
    .where(pub)
    .orderBy(desc(dlCount), desc(s.apps.updatedAt)).limit(limit);
}

export async function getLatestApps(limit = 8) {
  await dyn();
  return db.select(cardCols).from(s.apps)
    .where(pub)
    .orderBy(desc(s.apps.updatedAt)).limit(limit);
}

export async function getOpenSourceApps(limit = 8) {
  await dyn();
  return db.select(cardCols).from(s.apps)
    .where(and(pub, eq(s.apps.isOpenSource, true)))
    .orderBy(desc(dlCount)).limit(limit);
}

export async function getAppBySlug(slug: string) {
  await dyn();
  const rows = await db.select({
    id: s.apps.id, slug: s.apps.slug, packageName: s.apps.packageName,
    nameFa: s.apps.nameFa, nameEn: s.apps.nameEn,
    iconUrl: s.apps.iconUrl, shortDesc: s.apps.shortDesc, description: s.apps.description,
    license: s.apps.license, isOpenSource: s.apps.isOpenSource,
    sourceType: s.apps.sourceType, sourceUrl: s.apps.sourceUrl,
    minSdk: s.apps.minSdk, createdAt: s.apps.createdAt, updatedAt: s.apps.updatedAt,
    developerName: s.developers.name, developerWebsite: s.developers.website,
  }).from(s.apps)
    .leftJoin(s.developers, eq(s.apps.developerId, s.developers.id))
    .where(and(eq(s.apps.slug, slug), pub)).limit(1);
  const app = rows[0];
  if (!app) return null;

  const versions = await db.select().from(s.appVersions)
    .where(and(eq(s.appVersions.appId, app.id), eq(s.appVersions.status, "active")))
    .orderBy(desc(s.appVersions.versionCode)).limit(10);

  const cats = await db.select({
    slug: s.categories.slug, nameFa: s.categories.nameFa, icon: s.categories.icon,
  }).from(s.appCategories)
    .innerJoin(s.categories, eq(s.appCategories.categoryId, s.categories.id))
    .where(eq(s.appCategories.appId, app.id));

  const shots = await db.select().from(s.appScreenshots)
    .where(eq(s.appScreenshots.appId, app.id)).orderBy(s.appScreenshots.sortOrder);

  const current = versions.find((v) => v.isCurrent) ?? versions[0] ?? null;
  const perms = current
    ? (await db.select().from(s.appPermissions).where(eq(s.appPermissions.versionId, current.id)))
    : [];

  const dl = await db.select({ c: sql<number>`count(*)` }).from(s.downloadEvents)
    .where(eq(s.downloadEvents.appId, app.id));
  const downloadCount = Number(dl[0]?.c ?? 0);

  // اپ‌های مشابه: هم‌دسته‌ای‌ها
  const catIds = (await db.select({ id: s.appCategories.categoryId })
    .from(s.appCategories).where(eq(s.appCategories.appId, app.id))).map((r) => r.id);
  let similar: typeof cardCols extends never ? never : Awaited<ReturnType<typeof getPopularApps>> = [];
  if (catIds.length) {
    similar = await db.select(cardCols).from(s.apps)
      .innerJoin(s.appCategories, eq(s.appCategories.appId, s.apps.id))
      .where(and(pub, inArray(s.appCategories.categoryId, catIds), sql`${s.apps.id} != ${app.id}`))
      .groupBy(s.apps.id)
      .orderBy(desc(dlCount)).limit(6) as typeof similar;
  }

  return { ...app, versions, categories: cats, screenshots: shots, current, permissions: perms, downloadCount, similar };
}

export type SearchFilters = {
  category?: string;
  openSource?: boolean;
  sort?: "popular" | "newest" | "updated" | "name";
  minSdk?: number;
};

export async function searchApps(query: string, filters: SearchFilters = {}, limit = 40, offset = 0) {
  await dyn();
  const q = normalizeFa(query);
  const conds = [pub];

  if (q) {
    // جست‌وجو در نام فارسی/انگلیسی، نام بسته، توسعه‌دهنده و توضیح — با نرمال‌سازی فارسی
    conds.push(sql`(
      ${s.apps.nameFa} ilike ${"%" + query.trim() + "%"}
      or ${s.apps.nameEn} ilike ${"%" + query.trim() + "%"}
      or ${s.apps.packageName} ilike ${"%" + query.trim() + "%"}
      or ${s.apps.shortDesc} ilike ${"%" + query.trim() + "%"}
    )`);
  }
  if (filters.openSource) conds.push(eq(s.apps.isOpenSource, true));
  if (filters.minSdk) conds.push(sql`${s.apps.minSdk} <= ${filters.minSdk}`);

  let categoryAppIds: string[] | null = null;
  if (filters.category) {
    const cat = await db.select({ id: s.categories.id }).from(s.categories)
      .where(eq(s.categories.slug, filters.category)).limit(1);
    if (cat[0]) {
      const rows = await db.select({ appId: s.appCategories.appId }).from(s.appCategories)
        .where(eq(s.appCategories.categoryId, cat[0].id));
      categoryAppIds = rows.map((r) => r.appId);
      conds.push(categoryAppIds.length ? inArray(s.apps.id, categoryAppIds) : sql`false`);
    }
  }

  const orderBy = filters.sort === "newest" ? desc(s.apps.createdAt)
    : filters.sort === "name" ? s.apps.nameFa
    : filters.sort === "popular" ? desc(dlCount)
    : desc(s.apps.updatedAt);

  const [items, total] = await Promise.all([
    db.select(cardCols).from(s.apps).where(and(...conds)).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ c: sql<number>`count(*)` }).from(s.apps).where(and(...conds)),
  ]);
  return { items, total: Number(total[0]?.c ?? 0) };
}

export async function getCategoryBySlug(slug: string) {
  await dyn();
  const rows = await db.select().from(s.categories).where(eq(s.categories.slug, slug)).limit(1);
  const cat = rows[0];
  if (!cat || !cat.isActive) return null;
  const children = await db.select().from(s.categories)
    .where(and(eq(s.categories.parentId, cat.id), eq(s.categories.isActive, true)))
    .orderBy(s.categories.sortOrder);
  return { ...cat, children };
}

export async function getCategoryApps(slug: string, limit = 40, offset = 0, sort: SearchFilters["sort"] = "updated") {
  await dyn();
  const cat = await getCategoryBySlug(slug);
  if (!cat) return null;
  const orderBy = sort === "popular" ? desc(dlCount) : sort === "name" ? s.apps.nameFa : desc(s.apps.updatedAt);
  const [items, total] = await Promise.all([
    db.select(cardCols).from(s.apps)
      .innerJoin(s.appCategories, eq(s.appCategories.appId, s.apps.id))
      .where(and(pub, eq(s.appCategories.categoryId, cat.id)))
      .orderBy(orderBy).limit(limit).offset(offset),
    db.select({ c: sql<number>`count(*)` }).from(s.apps)
      .innerJoin(s.appCategories, eq(s.appCategories.appId, s.apps.id))
      .where(and(pub, eq(s.appCategories.categoryId, cat.id))),
  ]);
  return { category: cat, items, total: Number(total[0]?.c ?? 0) };
}

export async function getAllCategories() {
  await dyn();
  return db.select().from(s.categories)
    .where(eq(s.categories.isActive, true))
    .orderBy(s.categories.sortOrder, s.categories.nameFa);
}

export async function getDashboardStats() {
  await dyn();
  const [a, v, d, r] = await Promise.all([
    db.select({ c: sql<number>`count(*)` }).from(s.apps).where(pub),
    db.select({ c: sql<number>`count(*)` }).from(s.appVersions).where(eq(s.appVersions.status, "active")),
    db.select({ c: sql<number>`count(*)` }).from(s.downloadEvents),
    db.select({ c: sql<number>`count(*)` }).from(s.reports).where(eq(s.reports.status, "open")),
  ]);
  return {
    apps: Number(a[0]?.c ?? 0),
    versions: Number(v[0]?.c ?? 0),
    downloads: Number(d[0]?.c ?? 0),
    openReports: Number(r[0]?.c ?? 0),
  };
}
