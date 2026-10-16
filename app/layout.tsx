import type { Metadata, Viewport } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SWRegister, InstallButton } from "@/components/PWA";
import { siteUrl } from "@/lib/site-url";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["arabic", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "نرم‌استور | فروشگاه فارسی نرم‌افزار اندروید", template: "%s | نرم‌استور" },
  description: "نرم‌استور — فروشگاه فارسی نرم‌افزار برای اندروید، ویندوز و لینوکس؛ معرفی و دانلود امن با لینک مستقیم",
  metadataBase: new URL(siteUrl()),
  openGraph: { locale: "fa_IR", type: "website", siteName: "نرم‌استور" },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: "نرم‌استور", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1318" },
  ],
};

// فروشگاه دیتامحور است: رندر سمت سرور برای هر درخواست (بدون prerender استاتیک)
export const instant = false;

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('narm-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${vazir.variable} ${lalezar.variable} min-h-full flex flex-col`}>
        <SWRegister />
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        <Footer />
        <InstallButton />
      </body>
    </html>
  );
}
