"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewApp() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({ packageName: "", nameFa: "", nameEn: "", shortDesc: "", iconUrl: "", license: "" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const input = "w-full h-11 rounded-xl bg-surface-2 border border-border px-4 text-sm focus:outline-none focus:border-primary";

  const save = async () => {
    setMsg(""); setSaving(true);
    const r = await fetch("/api/admin/apps", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, isPublished: false }),
    });
    const j = await r.json();
    if (r.ok) router.push(`/admin/apps/${j.id}`);
    else { setMsg(`❌ ${j.error || "خطا"}`); setSaving(false); }
  };

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/apps" className="text-primary hover:underline text-sm">→ بازگشت</Link>
        <h1 className="text-2xl font-extrabold">نرم‌افزار جدید</h1>
      </div>
      {msg && <p className="mb-4 text-sm bg-surface border border-border rounded-xl p-3">{msg}</p>}
      <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
        <div><label className="block text-xs font-bold mb-1.5">نام بسته (Package Name) *</label>
          <input className={input} dir="ltr" value={f.packageName} onChange={(e) => set("packageName", e.target.value)} placeholder="com.example.app" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-bold mb-1.5">نام فارسی *</label>
            <input className={input} value={f.nameFa} onChange={(e) => set("nameFa", e.target.value)} /></div>
          <div><label className="block text-xs font-bold mb-1.5">نام انگلیسی *</label>
            <input className={input} dir="ltr" value={f.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></div>
        </div>
        <div><label className="block text-xs font-bold mb-1.5">توضیح کوتاه</label>
          <input className={input} value={f.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} /></div>
        <div><label className="block text-xs font-bold mb-1.5">آدرس آیکون</label>
          <input className={input} dir="ltr" value={f.iconUrl} onChange={(e) => set("iconUrl", e.target.value)} /></div>
        <div><label className="block text-xs font-bold mb-1.5">مجوز</label>
          <input className={input} dir="ltr" value={f.license} onChange={(e) => set("license", e.target.value)} placeholder="GPL-3.0-only" /></div>
        <button onClick={save} disabled={saving || !f.packageName || !f.nameFa || !f.nameEn}
          className="bg-primary text-primary-fg font-bold px-8 py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
          {saving ? "در حال ثبت..." : "ثبت (پیش‌نویس)"}
        </button>
        <p className="text-xs text-muted">برنامه به‌صورت پیش‌نویس ثبت می‌شود؛ بعد از افزودن نسخه و انتشار، در سایت نمایش داده می‌شود.</p>
      </div>
    </div>
  );
}
