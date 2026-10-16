"use client";

import { useEffect } from "react";

// پلتفرم کالکشن را در localStorage ذخیره می‌کند تا نوبار پایین درست نمایش داده شود
export default function CollectionPlatformSync({ platform }: { platform: string }) {
  useEffect(() => {
    try {
      if (platform === "windows" || platform === "linux") {
        localStorage.setItem("narm-platform", platform);
      } else {
        localStorage.removeItem("narm-platform");
      }
    } catch {}
  }, [platform]);
  return null;
}
