"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/fa";

type Review = {
  id: string; rating: number; text: string | null; status: string;
  createdAt: string; userName: string | null; appName: string; appSlug: string;
};

const STATUS_FA: Record<string, string> = { pending: "در انتظار", approved: "تأییدشده", rejected: "ردشده" };

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("pending");

  const load = () => fetch("/api/admin/reviews").then((r) => r.json()).then((j) => setReviews(j.reviews || []));
  useEffect(() => { load(); }, []);

  const act = async (id: string, method: string, body?: any) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method, headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    load();
  };

  const list = reviews.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="animate-fade-up max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-6">نظرات کاربران</h1>
      <div className="flex gap-2 mb-6">
        {[["pending", "در انتظار"], ["approved", "تأییدشده"], ["rejected", "ردشده"], ["all", "همه"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`text-sm px-4 py-2 rounded-xl border transition ${filter === k
              ? "bg-primary text-primary-fg border-primary font-bold" : "bg-surface border-border"}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="bg-surface border border-border rounded-3xl p-5">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <p className="font-bold text-sm">
                <Link href={`/app/${r.appSlug}`} className="text-primary hover:underline">{r.appName}</Link>
                <span className="text-muted font-normal ms-2">{"⭐".repeat(r.rating)} — {r.userName} [{STATUS_FA[r.status]}]</span>
              </p>
              <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
            </div>
            {r.text && <p className="text-sm leading-7 mb-3">{r.text}</p>}
            <div className="flex gap-2 text-xs">
              {r.status !== "approved" && (
                <button onClick={() => act(r.id, "PATCH", { status: "approved" })}
                  className="px-3 py-1.5 rounded-lg bg-primary-soft text-primary font-bold">تأیید</button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => act(r.id, "PATCH", { status: "rejected" })}
                  className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border">رد</button>
              )}
              <button onClick={() => { if (confirm("حذف شود؟")) act(r.id, "DELETE"); }}
                className="px-3 py-1.5 rounded-lg text-danger hover:underline">حذف</button>
            </div>
          </div>
        ))}
        {!list.length && <p className="text-center text-muted text-sm bg-surface border border-border rounded-3xl p-10">نظری وجود ندارد.</p>}
      </div>
    </div>
  );
}
