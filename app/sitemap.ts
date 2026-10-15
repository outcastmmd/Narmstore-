import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq } from "drizzle-orm";
import { siteUrl } from "@/lib/site-url";

export default async function Sitemap() {
  const base = siteUrl();
  const apps = await db.select({ slug: s.apps.slug, updatedAt: s.apps.updatedAt })
    .from(s.apps).where(eq(s.apps.isPublished, true));
  const cats = await db.select({ slug: s.categories.slug }).from(s.categories)
    .where(eq(s.categories.isActive, true));

  const urls = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/categories`, lastModified: new Date() },
    { url: `${base}/popular`, lastModified: new Date() },
    { url: `${base}/latest`, lastModified: new Date() },
    ...cats.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date() })),
    ...apps.map((a) => ({ url: `${base}/app/${a.slug}`, lastModified: a.updatedAt })),
  ];
  return urls;
}
