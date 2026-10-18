"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatBytes, formatDate, toFaDigits } from "@/lib/fa";

type Version = {
  id: string; versionName: string; versionCode: number; fileUrl: string;
  fileSize: number | null; sha256: string | null; status: string;
  isCurrent: boolean; createdAt: string; minSdk: number | null;
};

const STATUS_FA: Record<string, string> = {
  pending: "⏳ در انتظار بررسی", active: "✅ فعال", disabled: "🚫 غیرفعال", rejected: "❌ ردشده",
};

export default function EditApp() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<any>({});
  const [versions, setVersions] = useState<Version[]>([]);
  const [cats, setCats] = useState<{ id: string; nameFa: string }[]>([]);
  const [catIds, setCatIds] = useState<string[]>([]);
  const [newVer, setNewVer] = useState({ versionName: "", versionCode: "", fileUrl: "", fileSize: "", sha256: "", minSdk: "", changelog: "" });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/apps/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([a, c]) => {
      if (a.app) {
        setForm(a.app);
        setVersions(a.versions || []);
        setCatIds(a.categoryIds || []);
      }
      setCats((c.categories || []).map((x: any) => ({ id: x.id, nameFa: `${x.parentId ? "↳ " : ""}${x.nameFa}` })));
      setLoading(false);
    });
  }, [id]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg("");
    const r = await fetch(`/api/admin/apps/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, categoryIds: catIds }),
    });
    const j = await r.json();
    setMsg(r.ok ? "✅ ذخیره شد" : `❌ ${j.error || "خطا"}`);
    setSaving(false);
  };

  const addVersion = async () => {
    setMsg("");
    const r = await fetch(`/api/admin/apps/${id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        versionName: newVer.versionName,
        versionCode: Number(newVer.versionCode),
        fileUrl: newVer.fileUrl,
        fileSize: newVer.fileSize ? Number(newVer.fileSize) : null,
        sha256: newVer.sha256 || null,
        minSdk: newVer.minSdk ? Number(newVer.minSdk) : null,
        changelog: newVer.changelog || null,
      }),
    });
    const j = await r.json();
    if (r.ok) {
      setMsg("✅ نسخه اضافه شد (وضعیت: در انتظار بررسی)");
      setNewVer({ versionName: "", versionCode: "", fileUrl: "", fileSize: "", sha256: "", minSdk: "", changelog: "" });
      const d = await fetch(`/api/admin/apps/${id}`).then((x) => x.json());
      setVersions(d.versions || []);
    } else setMsg(`❌ ${j.error || "خطا"}`);
  };

  const verAction = async (vid: string, body: any) => {
    const r = await fetch(`/api/admin/versions/${vid}`, {
      method: body._delete ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: body._delete ? undefined : JSON.stringify(body),
    });
    if (r.ok) {
      const d = await fetch(`/api/admin/apps/${id}`).then((x) => x.json());
      setVersions(d.versions || []);
    }
  };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface border border-border rounded-3xl animate-pulse" />)}</div>;

  const input = "w-full h-11 rounded-xl bg-surface-2 border border-border px-4 text-sm focus:outline-none focus:border-primary";

  return (
    <div className="animate-fade-up max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/apps" className="text-primary hover:underline text-sm">→ بازگشت</Link>
        <h1 className="text-2xl font-extrabold">ویرایش: {form.nameFa}</h1>
      </div>

      {msg && <p className="mb-4 text-sm bg-surface border border-border rounded-xl p-3">{msg}</p>}

      <section className="bg-surface border border-border rounded-3xl p-6 mb-6">
        <h2 className="font-extrabold mb-4">اطلاعات اصلی</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-bold mb-1.5">نام فارسی</label>
            <input className={input} value={form.nameFa || ""} onChange={(e) => set("nameFa", e.target.value)} /></div>
          <div><label className="block text-xs font-bold mb-1.5">نام انگلیسی</label>
            <input className={input} dir="ltr" value={form.nameEn || ""} onChange={(e) => set("nameEn", e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-bold mb-1.5">توضیح کوتاه</label>
            <input className={input} value={form.shortDesc || ""} onChange={(e) => set("shortDesc", e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-bold mb-1.5">معرفی کامل</label>
            <textarea className={input + " h-32 py-3"} value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
          <div><label className="block text-xs font-bold mb-1.5">آدرس آیکون</label>
            <input className={input} dir="ltr" value={form.iconUrl || ""} onChange={(e) => set("iconUrl", e.target.value)} /></div>
          <div><label className="block text-xs font-bold mb-1.5">مجوز</label>
            <input className={input} dir="ltr" value={form.license || ""} onChange={(e) => set("license", e.target.value)} /></div>
          <div><label className="block text-xs font-bold mb-1.5">منبع رسمی</label>
            <input className={input} dir="ltr" value={form.sourceUrl || ""} onChange={(e) => set("sourceUrl", e.target.value)} /></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 text-sm">
            {[["isPublished", "منتشرشده"], ["featured", "منتخب"], ["editorChoice", "منتخب سردبیر"], ["isOpenSource", "متن‌باز"]].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} className="toggle toggle-primary toggle-sm" />{l}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-bold mb-1.5">دسته‌بندی‌ها</label>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c.id} type="button"
                onClick={() => setCatIds((p) => p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id])}
                className={`btn btn-xs rounded-full ${catIds.includes(c.id) ? "btn-primary" : "btn-ghost"}`}>
                {c.nameFa}
              </button>
            ))}
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="btn btn-primary mt-6">
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </section>

      <section className="bg-surface border border-border rounded-3xl p-6 mb-6">
        <h2 className="font-extrabold mb-4">نسخه‌ها ({toFaDigits(versions.length)})</h2>
        <ul className="space-y-3 mb-6">
          {versions.map((v) => (
            <li key={v.id} className="border border-border rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <p className="font-bold"><span dir="ltr">v{v.versionName}</span>
                    <span className="text-xs text-muted font-normal ms-2" dir="ltr">({v.versionCode})</span>
                    {v.isCurrent && <span className="text-xs bg-primary-soft text-primary rounded-full px-2 py-0.5 ms-2">جاری</span>}
                  </p>
                  <p className="text-xs text-muted mt-1">{STATUS_FA[v.status]} • {formatBytes(v.fileSize)} • {formatDate(v.createdAt)}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  {v.status !== "active" && (
                    <button onClick={() => verAction(v.id, { status: "active" })}
                      className="btn btn-primary btn-sm">تأیید و انتشار</button>
                  )}
                  {v.status === "active" && !v.isCurrent && (
                    <button onClick={() => verAction(v.id, { isCurrent: true })}
                      className="btn btn-ghost btn-sm">جاری کن</button>
                  )}
                  {v.status === "pending" && (
                    <button onClick={() => verAction(v.id, { status: "rejected" })}
                      className="btn btn-error btn-sm">رد</button>
                  )}
                  {v.status === "active" && (
                    <button onClick={() => verAction(v.id, { _delete: true })}
                      className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border hover:border-danger text-danger">غیرفعال</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="font-bold mb-3">＋ افزودن نسخه جدید</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={input} dir="ltr" placeholder="versionName مثل 3.6.5" value={newVer.versionName}
            onChange={(e) => setNewVer({ ...newVer, versionName: e.target.value })} />
          <input className={input} dir="ltr" placeholder="versionCode (عدد)" value={newVer.versionCode}
            onChange={(e) => setNewVer({ ...newVer, versionCode: e.target.value })} />
          <input className={input + " sm:col-span-2"} dir="ltr" placeholder="آدرس مستقیم فایل APK" value={newVer.fileUrl}
            onChange={(e) => setNewVer({ ...newVer, fileUrl: e.target.value })} />
          <input className={input} dir="ltr" placeholder="حجم (بایت)" value={newVer.fileSize}
            onChange={(e) => setNewVer({ ...newVer, fileSize: e.target.value })} />
          <input className={input} dir="ltr" placeholder="SHA-256 (۶۴ کاراکتر)" value={newVer.sha256}
            onChange={(e) => setNewVer({ ...newVer, sha256: e.target.value })} />
          <input className={input} dir="ltr" placeholder="minSdk" value={newVer.minSdk}
            onChange={(e) => setNewVer({ ...newVer, minSdk: e.target.value })} />
          <textarea className={input + " sm:col-span-2 h-20 py-2"} placeholder="تغییرات نسخه" value={newVer.changelog}
            onChange={(e) => setNewVer({ ...newVer, changelog: e.target.value })} />
        </div>
        <button onClick={addVersion} className="btn btn-primary mt-4">
          ثبت نسخه (در انتظار بررسی)
        </button>
      </section>
    </div>
  );
}
