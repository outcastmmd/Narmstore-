"use client";
import { useEffect, useState } from "react";
import { toFaDigits, timeAgo } from "@/lib/fa";

type Review = { id: string; rating: number; text: string | null; createdAt: string; userName: string | null };

function Stars({ value, onPick, size = "text-2xl" }: { value: number; onPick?: (n: number) => void; size?: string }) {
  return (
    <div className={`flex gap-1 ${size}`} role={onPick ? "radiogroup" : undefined} aria-label="امتیاز">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onPick} onClick={() => onPick?.(n)}
          aria-label={`${n} ستاره`} className={onPick ? "hover:scale-125 transition-transform" : "cursor-default"}>
          <span className={n <= value ? "" : "grayscale opacity-30"}>⭐</span>
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ appId }: { appId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const load = () => fetch(`/api/reviews?appId=${appId}`).then((r) => r.json()).then((j) => {
    setReviews(j.reviews || []); setAvg(j.average); setCount(j.count || 0);
  });
  useEffect(() => {
    load();
    fetch("/api/auth/signup").then((r) => r.json()).then((j) => setLoggedIn(!!j.user)).catch(() => setLoggedIn(false));
  }, [appId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setMsg("❌ اول امتیاز بدهید"); return; }
    setSending(true); setMsg("");
    const r = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, rating, text: text.trim() || undefined }),
    });
    const j = await r.json();
    setMsg(r.ok ? `✅ ${j.message}` : `❌ ${j.error || "خطا"}`);
    if (r.ok) { setText(""); setRating(0); }
    setSending(false);
  };

  return (
    <section className="bg-surface border border-border rounded-3xl p-6 mt-6" aria-label="نظرات کاربران">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-extrabold">نظرات و امتیازها</h2>
        {avg !== null && (
          <span className="text-sm bg-primary-soft text-primary font-bold rounded-full px-3 py-1">
            ⭐ {toFaDigits(avg)} ({toFaDigits(count)} نظر)
          </span>
        )}
      </div>

      {reviews.length ? (
        <ul className="space-y-3 mb-6">
          {reviews.map((r) => (
            <li key={r.id} className="bg-surface-2 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <Stars value={r.rating} size="text-sm" />
                <span className="text-xs text-muted">{r.userName || "کاربر"} • {timeAgo(r.createdAt)}</span>
              </div>
              {r.text && <p className="text-sm leading-7">{r.text}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted mb-6">هنوز نظری ثبت نشده — اولین نفر باشید!</p>
      )}

      {loggedIn === false ? (
        <p className="text-sm text-muted bg-surface-2 rounded-2xl p-4 text-center">
          برای ثبت نظر <a href="/login" className="text-primary font-bold hover:underline">وارد شوید</a>
        </p>
      ) : loggedIn ? (
        <form onSubmit={submit} className="border-t border-border pt-5">
          <p className="text-sm font-bold mb-2">نظر شما</p>
          <Stars value={rating} onPick={setRating} />
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={2000}
            placeholder="تجربه‌تان از این برنامه..."
            className="w-full mt-3 rounded-xl bg-surface-2 border border-border p-3 text-sm leading-7 focus:outline-none focus:border-primary" />
          {msg && <p className="text-sm mt-2">{msg}</p>}
          <button type="submit" disabled={sending}
            className="mt-3 bg-primary text-primary-fg font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
            {sending ? "در حال ثبت..." : "ثبت نظر"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
