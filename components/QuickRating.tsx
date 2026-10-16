"use client";
import { useEffect, useState } from "react";
import { toFaDigits } from "@/lib/fa";
import { Star } from "lucide-react";

// امتیازدهی سریع — فقط ستاره، بدون نیاز به نوشتن نظر
export default function QuickRating({ appId }: { appId: string }) {
  const [myRating, setMyRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/signup").then((r) => r.json()).then((j) => setLoggedIn(!!j.user)).catch(() => setLoggedIn(false));
  }, []);

  const submit = async (n: number) => {
    if (!loggedIn) { setMsg("برای امتیاز دادن وارد شوید"); return; }
    setSending(true); setMsg("");
    const r = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, rating: n }),
    });
    const j = await r.json();
    if (r.ok) { setMyRating(n); setMsg("امتیاز شما ثبت شد"); }
    else setMsg(j.error || "خطا");
    setSending(false);
  };

  if (loggedIn === false) return null;

  return (
    <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3">
      <span className="text-sm font-bold whitespace-nowrap">امتیاز شما:</span>
      <div className="flex gap-1" role="radiogroup" aria-label="امتیاز سریع">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" disabled={sending}
            onClick={() => submit(n)}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            aria-label={`${toFaDigits(n)} ستاره`}
            className="hover:scale-125 transition-transform disabled:opacity-50">
            <Star className={`w-7 h-7 ${n <= (hover || myRating) ? "text-amber-400" : "text-muted/40"}`} fill="currentColor" aria-hidden="true" />
          </button>
        ))}
      </div>
      {msg && <span className="text-xs text-muted">{msg}</span>}
    </div>
  );
}
