# نرم‌استور | NarmStore

فروشگاه فارسی نرم‌افزار اندروید — معرفی، بررسی و دانلود امن برنامه‌ها با لینک مستقیم و تأیید اصالت فایل.

## پشته فنی

| لایه | فناوری |
|---|---|
| Frontend/Backend | Next.js 16 + TypeScript (App Router) |
| UI | Tailwind CSS 4، کاملاً فارسی و RTL، تم روشن/تاریک |
| Database | PostgreSQL 16 + Drizzle ORM |
| Validation | Zod (سمت سرور) |
| Auth (ادمین) | نشست HMAC-signed با scrypt |

## پیش‌نیازها

- Node.js 20+
- PostgreSQL 14+ (دیتابیس `narmstore` + کاربر با دسترسی کامل)

## راه‌اندازی سریع

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. تنظیم متغیرهای محیطی
cp .env.example .env
# سپس DATABASE_URL و SESSION_SECRET را ویرایش کنید

# ۳. اجرای migration
npx drizzle-kit migrate

# ۴. دانلود ایندکس F-Droid (۶۵ مگابایت، یک‌بار)
mkdir -p data
curl -L -o data/index-v2.json https://f-droid.org/repo/index-v2.json

# ۵. seed دیتابیس (دسته‌بندی‌ها، نقش‌ها، ~۳۳ اپ واقعی، کاربر مدیر)
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="رمز-قوی" npx tsx --env-file=.env db/seed.ts

# ۶. اجرا
npm run dev        # توسعه: http://localhost:3000
npm run build && npm start   # پروداکشن
```

پنل مدیریت: `http://localhost:3000/admin`

## ساختار پروژه

```
app/                    صفحات و APIها (App Router)
  page.tsx              صفحه اصلی (بنر، دسته‌ها، محبوب‌ها، تازه‌ها، ...)
  app/[slug]/           صفحه اختصاصی نرم‌افزار + SEO
  category/[slug]/      صفحه دسته‌بندی + مرتب‌سازی + صفحه‌بندی
  search/               جست‌وجوی فارسی با فیلتر
  api/download/[id]/    دانلود واقعی (ثبت رویداد + ریدایرکت 302)
  api/reports/          ثبت گزارش کاربر (rate-limited)
  admin/                پنل مدیریت (داشبورد، اپ‌ها، نسخه‌ها، دسته‌ها، گزارش‌ها)
  sitemap.ts / robots.ts
components/             کامپوننت‌های مشترک (کارت اپ، هدر، فوتر، ...)
db/
  schema.ts             اسکیمای Drizzle (۲۱ جدول)
  migrations/           مایگریشن‌های SQL نسخه‌بندی‌شده
  seed.ts               سید با داده‌ی واقعی F-Droid
lib/
  db.ts / store.ts      دسترسی به داده
  auth.ts               نشست ادمین (scrypt + HMAC)
  fa.ts                فارسی‌سازی (اعداد، تاریخ، نرمال‌سازی جست‌وجو)
proxy.ts                گیت احراز هویت /admin (جایگزین middleware در Next 16)
```

## مدل داده

`users`, `roles`, `developers`, `categories` (چندسطحی), `tags`, `apps`, `app_versions`
(چرخه‌ی `pending → active/disabled/rejected`), `app_categories`, `app_tags`,
`app_screenshots`, `app_permissions`, `download_events` (آمار واقعی با dedup روزانه‌ی IP هش‌شده),
`reviews`, `favorites`, `reports`, `content_pages`, `news_articles`,
`repositories`, `repository_sync_logs`, `audit_logs`, `site_settings`.

## امنیت

- اعتبارسنجی همه‌ی ورودی‌ها با Zod در سمت سرور
- هش رمز با scrypt + مقایسه‌ی زمان‌ثابت؛ نشست httpOnly و امضاشده
- Rate limit لاگین ادمین (۵ تلاش / ۱۵ دقیقه) و ثبت گزارش (۱۰ / ساعت)
- آمار دانلود: فقط هش SHA-256 روزانه‌ی IP ذخیره می‌شود، IP خام هرگز
- اعتبارسنجی `sha256` (۶۴ کاراکتر هگز) و URL فایل در API ادمین
- گزارش همه‌ی عملیات مدیریتی در `audit_logs`
- `/admin` و `/api/*` از ایندکس موتور جست‌وجو منع شده‌اند

## دانلود واقعی چگونه کار می‌کند؟

`GET /api/download/[versionId]` نسخه‌ی فعال را از دیتابیس می‌خواند،
رویداد دانلود را (با حذف تکراری ۲۴ ساعته) ثبت می‌کند و با **302** به
آدرس واقعی فایل (مثلاً `https://f-droid.org/repo/....apk`) ریدایرکت می‌کند.
هیچ لینک جعلی یا فایل نمایشی وجود ندارد.

## تست‌ها

```bash
npx tsc --noEmit     # تایپ‌چک
npm run build        # بیلد پروداکشن (۲۶ روت)
```

تست دستی انجام‌شده:
- صفحات اصلی/اپ/دسته/جست‌وجو: HTTP 200 با محتوای واقعی
- دانلود: 302 به APK واقعی + ثبت ۱ رویداد برای ۳ درخواست تکراری
- لاگین ادمین: رمز اشتباه 401، رمز درست 200، بدون نشست 307 به لاگین

## محدودیت‌های شناخته‌شده (صادقانه)

- ثبت‌نام کاربر عادی هنوز UI ندارد (اسکیما آماده است)؛ دانلود برای مهمان آزاد است
- آپلود مستقیم APK به سرور پیاده نشده؛ فعلاً لینک خارجی معتبر ثبت می‌شود
- اسکن بدافزار خودکار ندارد؛ چرخه‌ی بررسی دستی (pending → تأیید) فعال است
- همگام‌سازی خودکار دوره‌ای با F-Droid زمان‌بندی نشده (seed اولیه دستی است)
- امتیاز/نظر کاربران در UI عمومی فعال نیست (جدول و API آماده‌ی توسعه است)
