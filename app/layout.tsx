import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SWRegister, InstallButton } from "@/components/PWA";
import ErrorReporter from "@/components/ErrorReporter";
import { siteUrl } from "@/lib/site-url";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: { default: "Vesper | فروشگاه فارسی نرم‌افزار اندروید", template: "%s | Vesper" },
  description: "Vesper — فروشگاه فارسی نرم‌افزار برای اندروید، ویندوز و لینوکس؛ معرفی و دانلود امن با لینک مستقیم",
  metadataBase: new URL(siteUrl()),
  openGraph: { locale: "fa_IR", type: "website", siteName: "Vesper" },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: "Vesper", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4effb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1428" },
  ],
};

// فروشگاه دیتامحور است: رندر سمت سرور برای هر درخواست (بدون prerender استاتیک)
export const instant = false;

// تم پیش‌فرض: تیره‌ی بنفش-هلویی
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('narm-theme');if(t!=='light'&&t!=='dark'&&t!=='warm'&&t!=='amoled'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${vazir.variable} min-h-full flex flex-col`}>
        <SWRegister />
        <ErrorReporter />
        <div className="bg-glows" aria-hidden="true"><span className="g1" /><span className="g2" /><span className="g3" /></div>
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-[1]">{children}</main>
        <Footer />
        <InstallButton />
      </body>
    </html>
  );
}
