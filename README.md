<div align="center">

```
███╗   ██╗ █████╗ ██████╗ ███╗   ███╗
████╗  ██║██╔══██╗██╔══██╗████╗ ████║
██╔██╗ ██║███████║██████╔╝██╔████╔██║
██║╚██╗██║██╔══██║██╔══██╗██║╚██╔╝██║
██║ ╚████║██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

# نـرم‌استـور

**فروشگاه فارسی نرم‌افزار — اندروید، ویندوز، لینوکس**

> *"نرم‌افزار خوب، به زبان خودت."*

یه پروژه‌ی شخصیه که از یه ایده‌ی ساده شروع شد: چرا یه فروشگاه نرم‌افزار فارسی نداشته باشیم که واقعاً به فارسی حرف بزنه؟

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**🌐 [narmstore.onrender.com](https://narmstore.onrender.com)**

</div>

---

## درباره · About

نرم‌استور یک فروشگاه تمیز و فارسی برای نرم‌افزارهای اندروید، ویندوز و لینوکس است — بدون تبلیغ، بدون آمار جعلی، و با تأکید بر اعتماد: هش SHA-256 هر فایل، لینک منبع رسمی، و گزارش مشکل در خود صفحه‌ی برنامه.

A clean, Persian software store for Android, Windows and Linux — no ads, no fake stats, and trust-first: SHA-256 hash per file, official source links, and in-page issue reporting.

---

## امکانات · Features

- 🏠 ویترین کاملاً فارسی و راست‌چین · Full Persian RTL storefront
- 🤖🪟🐧 سوییچر پلتفرم (اندروید / ویندوز / لینوکس) · Platform switcher
- 🔐 هش SHA-256 با دکمه‌ی کپی · SHA-256 hash with copy button
- 🐙 کارت گیت‌هاب با تعداد استار · GitHub card with stars
- ⭐ علاقه‌مندی، دنبال‌کردن، امتیاز و نظر · Favorites, follows, ratings & reviews
- 🔔 اعلان انتشار نسخه‌ی جدید · New-version notifications
- 📦 دراور نسخه‌های قبلی · Previous-versions drawer
- 🔍 جست‌وجوی فارسی با نرمال‌سازی · Persian search with normalization
- 🌙 تم روشن / تیره / نئونی · Light / dark / neon themes
- 📲 PWA با پشتیبانی آفلاین · Offline-ready PWA
- 🔄 همگام‌سازی روزانه‌ی F-Droid + بکاپ خودکار · Daily F-Droid sync + auto backup
- 🛡️ امنیت: scrypt، نشست HMAC، محدودسازی نرخ، اعتبارسنجی Zod · Security: scrypt, HMAC sessions, rate limiting, Zod

---

## تکنولوژی‌ها · Tech stack

**Next.js 16** + TypeScript · **Tailwind CSS 4** · **PostgreSQL 16** + Drizzle ORM · Zod · فونت‌های Vazirmatn و Lalezar · Lucide icons

---

## اجرا · Getting started

```bash
npm install
cp .env.example .env        # DATABASE_URL و SESSION_SECRET را تنظیم کن
npx drizzle-kit migrate
npx tsx --env-file=.env db/seed.ts
npm run dev                 # http://localhost:3000
```

جزئیات کامل استقرار در [`docs/render-exit-plan.md`](docs/render-exit-plan.md).

---

## مجوز · License

MIT

---

<div align="center">

ساخته‌شده با دقت و بدون عجله، برای جامعه‌ی فارسی‌زبان
<br>
*Built carefully and without rushing, for the Persian-speaking community.*

</div>
