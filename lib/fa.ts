// ابزارهای فارسی‌سازی: اعداد، تاریخ، نرمال‌سازی جست‌وجو

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** نرمال‌سازی متن فارسی برای جست‌وجو: ی/ک عربی، نیم‌فاصله، تشدید */
export function normalizeFa(text: string): string {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[\u064B-\u0652]/g, "") // اعراب
    .replace(/\u200C/g, " ") // نیم‌فاصله → فاصله
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "نامشخص";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  let v = bytes, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  const rounded = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${toFaDigits(rounded)} ${units[i]}`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "نامشخص";
  const date = typeof d === "string" ? new Date(d) : d;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function timeAgo(d: Date | string | null | undefined): string {
  if (!d) return "نامشخص";
  const date = typeof d === "string" ? new Date(d) : d;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "لحظاتی پیش";
  if (mins < 60) return `${toFaDigits(mins)} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${toFaDigits(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toFaDigits(days)} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${toFaDigits(months)} ماه پیش`;
  return `${toFaDigits(Math.floor(months / 12))} سال پیش`;
}

/** نام بسته را به slug تمیز تبدیل می‌کند */
export function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
