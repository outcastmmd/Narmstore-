"use client";
import { useEffect, useState } from "react";

type Cat = {
  id: string; slug: string; nameFa: string; nameEn: string | null;
  icon: string | null; parentId: string | null; sortOrder: number; isActive: boolean;
};

export default function CategoriesAdmin() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [nameFa, setNameFa] = useState("");
  const [icon, setIcon] = useState("");
  const [parentId, setParentId] = useState("");

  const load = () => fetch("/api/admin/categories").then((r) => r.json()).then((j) => {
    setCats(j.categories || []); setLoading(false);
  });
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!nameFa.trim()) return;
    setMsg("");
    const r = await fetch("/api/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameFa: nameFa.trim(), icon: icon.trim() || null, parentId: parentId || null }),
    });
    const j = await r.json();
    if (r.ok) { setNameFa(""); setIcon(""); setParentId(""); load(); }
    else setMsg(`❌ ${j.error || "خطا"}`);
  };

  const toggle = async (c: Cat) => {
    await fetch("/api/admin/categories", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
    });
    load();
  };

  const remove = async (c: Cat) => {
    if (!confirm(`«${c.nameFa}» حذف شود؟`)) return;
    const r = await fetch("/api/admin/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id }),
    });
    const j = await r.json();
    setMsg(j.soft ? `ℹ️ ${j.message}` : "");
    load();
  };

  const input = "h-11 rounded-xl bg-surface border border-border px-4 text-sm focus:outline-none focus:border-primary";

  return (
    <div className="animate-fade-up max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-6">دسته‌بندی‌ها</h1>
      {msg && <p className="mb-4 text-sm bg-surface border border-border rounded-xl p-3">{msg}</p>}

      <div className="bg-surface border border-border rounded-3xl p-6 mb-6">
        <h2 className="font-bold mb-3">＋ دسته جدید</h2>
        <div className="flex flex-wrap gap-3">
          <input className={input + " flex-1 min-w-40"} placeholder="نام فارسی" value={nameFa} onChange={(e) => setNameFa(e.target.value)} />
          <input className={input + " w-24"} placeholder="آیکون 🎁" value={icon} onChange={(e) => setIcon(e.target.value)} />
          <select className="select select-bordered" value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">بدون والد (ریشه)</option>
            {cats.filter((c) => !c.parentId).map((c) => <option key={c.id} value={c.id}>{c.nameFa}</option>)}
          </select>
          <button onClick={create} className="btn btn-primary">ثبت</button>
        </div>
      </div>

      {loading ? <div className="h-40 bg-surface border border-border rounded-3xl animate-pulse" /> : (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <ul className="divide-y divide-border">
            {cats.map((c) => (
              <li key={c.id} className={`flex items-center gap-3 p-4 ${!c.isActive ? "opacity-50" : ""}`}>
                <span className="text-2xl" aria-hidden="true">{c.icon || "📦"}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{c.parentId ? "↳ " : ""}{c.nameFa}</p>
                  <p className="text-xs text-muted" dir="ltr" style={{ textAlign: "right" }}>{c.slug}</p>
                </div>
                <button onClick={() => toggle(c)} className="btn btn-ghost btn-xs">
                  {c.isActive ? "غیرفعال" : "فعال"}
                </button>
                <button onClick={() => remove(c)} className="btn btn-error btn-xs">حذف</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
