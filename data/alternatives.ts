// نگاشت برنامه‌های proprietary به جایگزین‌های آزاد
// for: نام انگلیسی برنامه‌ای که کاربر đang می‌بیند (باید در DB باشد)
// alternatives: نام‌های انگلیسی جایگزین‌ها (باید در DB باشند، در غیر این صورت نادیده گرفته می‌شوند)

export type AlternativeItem = {
  nameEn: string;
  why: string; // فارسی: چرا این جایگزین؟ برای چه کاری بهتر است؟
};

export type AlternativeEntry = {
  for: string; // نام انگلیسی دقیق در DB
  forFa: string; // نام فارسی برای نمایش
  alternatives: AlternativeItem[];
};

export const ALTERNATIVES: AlternativeEntry[] = [
  {
    for: "Google Chrome",
    forFa: "گوگل کروم",
    alternatives: [
      { nameEn: "Firefox", why: "حریم خصوصی قوی‌تر و متن‌باز کامل" },
      { nameEn: "Brave", why: "مسدودکننده تبلیغات داخلی و سریع" },
      { nameEn: "LibreWolf", why: "نسخه سخت‌گیرانه و امن فایرفاکس" },
    ],
  },
  {
    for: "Microsoft Edge",
    forFa: "مایکروسافت اج",
    alternatives: [
      { nameEn: "Firefox", why: "حریم خصوصی قوی‌تر و متن‌باز کامل" },
      { nameEn: "Ungoogled Chromium", why: "کرومیوم بدون هیچ ارتباطی با گوگل" },
    ],
  },
  {
    for: "Opera",
    forFa: "اپرا",
    alternatives: [
      { nameEn: "Firefox", why: "حریم خصوصی قوی‌تر و متن‌باز کامل" },
      { nameEn: "Brave", why: "سریع با مسدودکننده تبلیغات داخلی" },
    ],
  },
  {
    for: "Spotify",
    forFa: "اسپاتیفای",
    alternatives: [
      { nameEn: "VLC", why: "پخش موسیقی و ویدیوی آفلاین، بدون حساب" },
      { nameEn: "Strawberry Music Player", why: "مدیریت حرفه‌ای کتابخانه موسیقی" },
    ],
  },
  {
    for: "iTunes",
    forFa: "آی‌تونز",
    alternatives: [
      { nameEn: "VLC", why: "پخش همه فرمت‌ها بدون دردسر" },
      { nameEn: "Strawberry Music Player", why: "مدیریت کتابخانه موسیقی" },
    ],
  },
  {
    for: "MPC-HC",
    forFa: "ام‌پی‌سی",
    alternatives: [
      { nameEn: "VLC", why: "پخش همه فرمت‌ها، همیشه به‌روز" },
      { nameEn: "SMPlayer", why: "رابط ساده با تنظیمات آماده" },
      { nameEn: "Celluloid", why: "مینیمال و سبک برای لینوکس" },
    ],
  },
  {
    for: "PotPlayer",
    forFa: "پات‌پلیر",
    alternatives: [
      { nameEn: "VLC", why: "پخش همه فرمت‌ها، متن‌باز واقعی" },
      { nameEn: "SMPlayer", why: "سبک با ادامه خودکار پخش" },
    ],
  },
  {
    for: "Slack",
    forFa: "اسلک",
    alternatives: [
      { nameEn: "Mattermost", why: "چت تیمی با امکان خودمیزبانی" },
      { nameEn: "Element", why: "غیرمتمرکز، امن و بدون سانسور" },
    ],
  },
  {
    for: "Discord",
    forFa: "دیسکورد",
    alternatives: [
      { nameEn: "Element", why: "کامیونیتی غیرمتمرکز بدون جمع‌آوری داده" },
      { nameEn: "Signal", why: "تماس و چت با رمزنگاری کامل" },
    ],
  },
  {
    for: "Zoom",
    forFa: "زوم",
    alternatives: [
      { nameEn: "Element", why: "تماس ویدیویی امن و غیرمتمرکز" },
      { nameEn: "Signal", why: "تماس گروهی با رمزنگاری سرتاسری" },
    ],
  },
  {
    for: "AnyDesk",
    forFa: "انی‌دسک",
    alternatives: [
      { nameEn: "RustDesk", why: "دسکتاپ راه‌دور کاملا متن‌باز و رایگان" },
    ],
  },
  {
    for: "Parsec",
    forFa: "پارسیک",
    alternatives: [
      { nameEn: "RustDesk", why: "اتصال راه‌دور سریع و متن‌باز" },
    ],
  },
  {
    for: "Bandizip",
    forFa: "بندی‌زیپ",
    alternatives: [
      { nameEn: "NanaZip", why: "فشرده‌سازی کاملا رایگان و مدرن" },
    ],
  },
  {
    for: "Internet Download Manager",
    forFa: "اینترنت دانلود منیجر",
    alternatives: [
      { nameEn: "JDownloader", why: "دانلود از همه سایت‌ها، کاملا رایگان" },
      { nameEn: "Free Download Manager", why: "ساده، سریع و بدون تبلیغ" },
    ],
  },
  {
    for: "Microsoft Visual Studio Code",
    forFa: "ویژوال استودیو کد",
    alternatives: [
      { nameEn: "Notepad++", why: "سبک و سریع برای ویرایش روزمره" },
    ],
  },
  {
    for: "Sublime Text 4",
    forFa: "سابلایم تکست",
    alternatives: [
      { nameEn: "Notepad++", why: "رایگان، سبک و پرامکانات" },
    ],
  },
  {
    for: "Sublime Merge",
    forFa: "سابلایم مرج",
    alternatives: [
      { nameEn: "Git", why: "گیت اصلی؛ قدرتمندتر از هر رابط گرافیکی" },
    ],
  },
  {
    for: "Postman",
    forFa: "پستمن",
    alternatives: [
      { nameEn: "Insomnia", why: "تست API با رابط ساده‌تر و تمیزتر" },
    ],
  },
  {
    for: "Dashlane",
    forFa: "دش‌لین",
    alternatives: [
      { nameEn: "Bitwarden", why: "مدیریت رمز ابری، امن و رایگان" },
      { nameEn: "KeePassXC", why: "کاملا آفلاین؛ امن‌ترین گزینه" },
    ],
  },
  {
    for: "Keeper® Password Manager",
    forFa: "کیپر",
    alternatives: [
      { nameEn: "Bitwarden", why: "متن‌باز با همگام‌سازی ابری رایگان" },
      { nameEn: "KeePassXC", why: "آفلاین و تحت کنترل کامل خودت" },
    ],
  },
  {
    for: "eM Client",
    forFa: "ای‌ام کلاینت",
    alternatives: [
      { nameEn: "Thunderbird", why: "ایمیل دسکتاپ کامل و قابل‌گسترش" },
      { nameEn: "FairEmail", why: "ایمیل اندروید با تمرکز بر حریم خصوصی" },
    ],
  },
  {
    for: "Mailbird",
    forFa: "میل‌برد",
    alternatives: [
      { nameEn: "Thunderbird", why: "رایگان، قدرتمند و بدون اشتراک" },
      { nameEn: "K-9 Mail", why: "سبک و سریع برای اندروید" },
    ],
  },
  {
    for: "Google Drive",
    forFa: "گوگل درایو",
    alternatives: [
      { nameEn: "Nextcloud", why: "ابر شخصی روی سرور خودت؛ حریم خصوصی کامل" },
    ],
  },
  {
    for: "Plex",
    forFa: "پلکس",
    alternatives: [
      { nameEn: "Jellyfin Server", why: "مدیاسرور کاملا رایگان، بدون قفل امکانات" },
    ],
  },
  {
    for: "Bandicam",
    forFa: "بندی‌کم",
    alternatives: [
      { nameEn: "OBS Studio", why: "ضبط و استریم حرفه‌ای، استاندارد صنعت" },
      { nameEn: "Kooha", why: "ضبط ساده صفحه برای لینوکس" },
    ],
  },
];

// جست‌وجوی نگاشت بر اساس نام انگلیسی (غیرحساس به حروف)
export function findAlternatives(nameEn: string): AlternativeEntry | null {
  const key = nameEn.trim().toLowerCase();
  return ALTERNATIVES.find((a) => a.for.toLowerCase() === key) ?? null;
}
