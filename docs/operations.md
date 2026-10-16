# عملیات نرم‌استور · Operations

یادداشت‌های داخلی برای نگهداری سایت. اطلاعات حساس (رمزها) را در فایل `.env` یا تنظیمات Render نگه دار، نه اینجا.

## اسکریپت‌های مفید · Handy scripts

```bash
npx tsx --env-file=.env db/sync-fdroid.ts   # همگام‌سازی دستی F-Droid
node scripts/backup-cloud-db.mjs            # بکاپ دیتابیس ابری (JSON، ۷ نسخه‌ی آخر)
node scripts/restore-cloud-db.mjs           # بازیابی از بکاپ
node scripts/pg-tunnel.mjs                  # تونل امن به دیتابیس ابری
```

## تست · Tests

```bash
npm test            # تست استاتیک + tsc (قبل از دیپلوی خودکار اجرا می‌شود)
npm run test:smoke   # تست زنده علیه سایت واقعی
```

## پایش خطا · Error monitoring

- پنل ادمین: `/admin/errors` — بنر قرمز در داشبورد وقتی خطای باز وجود دارد
- Sentry (اختیاری): متغیرهای `SENTRY_DSN` و `NEXT_PUBLIC_SENTRY_DSN` را در Render تنظیم کن

## کرون‌ها · Cron jobs

| نام | زمان | کار |
|---|---|---|
| `narmstore-fdroid-sync` | روزانه ~04:41 تهران | همگام‌سازی F-Droid + بکاپ دیتابیس |
| `narmstore-report-watch` | هر ۶ ساعت | بررسی گزارش‌های باز کاربران |
