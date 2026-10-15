<div align="center">

# نـرم‌استـور | NarmStore

**فروشگاه فارسی نرم‌افزار اندروید — معرفی، بررسی و دانلود امن**
**A Persian Android app store — discover, review & safely download apps**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-ready-0d7a5f?style=flat-square)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[🇬🇧 English](#-english) • [🇮🇷 فارسی](#-فارسی)

</div>

---

## 🇬🇧 English

### Overview

**NarmStore** is a Persian (Farsi) RTL web app store for Android software — a place to discover, review, and safely download Android apps with direct links and file authenticity verification. It ships as an installable **PWA**, works offline for visited pages, and syncs new app versions automatically from the official F-Droid repository.

### ✨ Features

| Area | What it does |
|---|---|
| 🏠 **Storefront** | Persian RTL interface, dark/light theme, mobile-first responsive design |
| 🔍 **Search** | Full-text Persian search with normalization (ي/ی, ك/ک, half-spaces) |
| 🗂️ **Categories** | Multi-level categories, sorting, pagination |
| 📱 **App pages** | Versions, file size, min SDK, package name, license, SHA-256, permissions, screenshots, changelog, similar apps |
| ⬇️ **Real downloads** | `GET /api/download/[id]` logs a privacy-friendly event (24h dedup by daily-hashed IP — no raw IPs stored), then 302-redirects to the real APK |
| 👥 **User accounts** | Sign up / log in, favorites (❤️), star ratings & reviews with admin moderation |
| ⭐ **Reviews** | One review per user per app, pending → approved flow, average rating display |
| 🔄 **Auto-sync** | Daily job pulls the F-Droid index and queues new versions as `pending` — nothing publishes without admin approval |
| 📲 **PWA** | Installable on Android, offline cache (stale-while-revalidate), install prompt banner |
| 🛠️ **Admin panel** | Dashboard, app CRUD, version lifecycle (`pending → active / disabled / rejected`), categories, reports, review moderation, audit log |
| 🔐 **Security** | scrypt password hashing, HMAC-signed httpOnly sessions, rate limiting, Zod validation everywhere |
| 🌐 **SEO** | Metadata, canonical URLs, Open Graph, dynamic sitemap, robots.txt |

### 🧱 Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4, Vazirmatn font, RTL-first
- **Database:** PostgreSQL 16 + Drizzle ORM (21 tables)
- **Validation:** Zod
- **Auth:** scrypt + HMAC-signed sessions (no JWT library needed)
- **Data source:** Official F-Droid `index-v2.json` (real data only — no fake download counts or links)

### 🚀 Deploy on Render (free)

This repo ships with a `render.yaml` Blueprint — web service + PostgreSQL in one click:

1. Sign up at [render.com](https://render.com) with GitHub
2. **New → Blueprint**, select this repo, **Apply**
3. The build runs: icon generation → `npm install` → `drizzle-kit migrate` → `next build`
4. `DATABASE_URL` and `SESSION_SECRET` are wired automatically; `SITE_URL` falls back to `RENDER_EXTERNAL_URL`

> To seed real app data, restore a dump of the `narmstore` database into the Render Postgres instance.

### 💻 Local Development

```bash
# 1. Database
sudo apt install postgresql-16
sudo -u postgres psql -c "CREATE USER narmstore PASSWORD 'narmstore_dev';"
sudo -u postgres psql -c "CREATE DATABASE narmstore OWNER narmstore;"

# 2. Install & configure
npm install
cp .env.example .env   # set DATABASE_URL and SESSION_SECRET

# 3. Migrate & seed
npx drizzle-kit migrate
npx tsx --env-file=.env db/seed.ts

# 4. Run
npm run dev   # http://localhost:3000
```

Admin login (dev only — change immediately): `admin@narmstore.local` / `ChangeMe123!`

### 🔄 Manual F-Droid Sync

```bash
npx tsx --env-file=.env db/sync-fdroid.ts
```

Downloads a fresh F-Droid index (if older than 24h), inserts new versions as `pending`, updates changed metadata, and writes a row to `repository_sync_logs`.

### 🗄️ Database Schema (21 tables)

`apps`, `app_versions`, `app_permissions`, `app_screenshots`, `categories`, `app_categories`, `users`, `roles`, `sessions`, `favorites`, `reviews`, `download_events`, `reports`, `audit_logs`, `repositories`, `repository_sync_logs`, … — see [`db/schema.ts`](db/schema.ts) and [`db/migrations/`](db/migrations/).

### 📁 Project Structure

```
app/                # Next.js App Router (storefront, /admin, /api)
components/         # UI components (PWA, Reviews, FavoriteButton, …)
db/                 # Drizzle schema, migrations, seed, F-Droid sync
lib/                # auth, db client, Persian helpers, store queries
public/icons/       # PWA icons (generated at build by scripts/gen-icons.mjs)
scripts/            # build-time asset generators
render.yaml         # Render Blueprint (web + Postgres)
```

### 🗺️ Roadmap

- [ ] Direct APK upload / object storage
- [ ] Automated malware scanning
- [ ] Push notifications for app updates
- [ ] Public developer submission portal

---

## 🇮🇷 فارسی

<div dir="rtl" align="right">

### معرفی

**نرم‌استور** یک فروشگاه اینترنتی فارسی برای نرم‌افزارهای اندروید است؛ جایی برای معرفی، بررسی و دانلود امن برنامه‌ها با لینک مستقیم و تأیید اصالت فایل. به‌صورت **PWA** روی گوشی نصب می‌شود، صفحات بازدیدشده را آفلاین نگه می‌دارد و نسخه‌های جدید را به‌صورت خودکار از مخزن رسمی F-Droid دریافت می‌کند.

### ✨ امکانات

| بخش | توضیح |
|---|---|
| 🏠 **ویترین** | رابط کاملاً فارسی و راست‌چین، تم روشن/تاریک، طراحی موبایل‌اول |
| 🔍 **جست‌وجو** | جست‌وجوی فارسی با نرمال‌سازی (ي/ی، ك/ک، نیم‌فاصله) |
| 🗂️ **دسته‌بندی** | دسته‌بندی چندسطحی با مرتب‌سازی و صفحه‌بندی |
| 📱 **صفحه برنامه** | نسخه‌ها، حجم، حداقل اندروید، نام بسته، مجوز، SHA-256، دسترسی‌ها، اسکرین‌شات، تغییرات نسخه، برنامه‌های مشابه |
| ⬇️ **دانلود واقعی** | ثبت رویداد دانلود با حفظ حریم خصوصی (جلوگیری از شمارش تکراری در ۲۴ ساعت با هش روزانه IP — بدون ذخیره IP خام) و هدایت به APK واقعی |
| 👥 **حساب کاربری** | ثبت‌نام/ورود، علاقه‌مندی‌ها (❤️)، امتیاز و نظر با تأیید مدیر |
| ⭐ **نظرات** | هر کاربر یک نظر برای هر برنامه، چرخه «در انتظار → تأییدشده»، نمایش میانگین امتیاز |
| 🔄 **همگام‌سازی خودکار** | جاب روزانه ایندکس F-Droid را می‌خواند و نسخه‌های جدید را «در انتظار بررسی» ثبت می‌کند — هیچ‌چیز بدون تأیید مدیر منتشر نمی‌شود |
| 📲 **PWA** | نصب روی اندروید، کش آفلاین، بنر پیشنهاد نصب |
| 🛠️ **پنل مدیریت** | داشبورد، مدیریت برنامه‌ها و نسخه‌ها (`pending → active / disabled / rejected`)، دسته‌بندی‌ها، گزارش‌ها، مدیریت نظرات، لاگ حسابرسی |
| 🔐 **امنیت** | هش رمز با scrypt، نشست امضاشده با HMAC، محدودسازی درخواست، اعتبارسنجی Zod |
| 🌐 **سئو** | متادیتا، canonical، Open Graph، نقشه سایت پویا، robots.txt |

### 🧱 تکنولوژی‌ها

- **فریم‌ورک:** Next.js 16 + TypeScript
- **رابط کاربری:** Tailwind CSS 4، فونت وزیرمتن، راست‌چین
- **دیتابیس:** PostgreSQL 16 + Drizzle ORM (۲۱ جدول)
- **اعتبارسنجی:** Zod
- **احراز هویت:** scrypt + نشست امضاشده HMAC
- **منبع داده:** ایندکس رسمی F-Droid — فقط داده واقعی، بدون آمار جعلی

### 🚀 استقرار روی Render (رایگان)

فایل `render.yaml` همه‌چیز را یکجا می‌سازد (وب‌سرویس + PostgreSQL):

۱. در render.com با GitHub ثبت‌نام کنید
۲. **New → Blueprint** و این ریپو را انتخاب کنید
۳. بیلد خودکار اجرا می‌شود: ساخت آیکون‌ها ← نصب پکیج‌ها ← اجرای مایگریشن ← بیلد Next.js

### 💻 اجرای محلی

```bash
npm install
cp .env.example .env   # مقادیر DATABASE_URL و SESSION_SECRET را تنظیم کنید
npx drizzle-kit migrate
npx tsx --env-file=.env db/seed.ts
npm run dev   # http://localhost:3000
```

ورود مدیر (فقط توسعه — فوراً عوض کنید): `admin@narmstore.local` / `ChangeMe123!`

### 📄 مجوز

MIT — آزاد برای استفاده شخصی و تجاری.

</div>

---

<div align="center">

ساخته‌شده با ❤️ برای جامعه فارسی‌زبان اندروید

</div>
