"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

export default function FollowButton({ appId }: { appId: string }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/follows?appId=${appId}`)
      .then((r) => r.json())
      .then((j) => setFollowing(!!j.following))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appId]);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/follows${following ? `?appId=${appId}` : ""}`, {
        method: following ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: following ? undefined : JSON.stringify({ appId }),
      });
      const j = await res.json();
      if (res.ok) setFollowing(!!j.following);
    } catch {}
    setLoading(false);
  };

  if (loading && !following) {
    return (
      <button disabled aria-label="در حال بارگذاری" className="w-12 h-12 rounded-2xl border bg-surface border-border text-muted flex items-center justify-center opacity-60 shrink-0">
        <Bell className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={following}
      title={following ? "لغو دنبال کردن" : "دنبال کن تا از نسخه جدید باخبر شی"}
      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition shrink-0 ${following
        ? "bg-primary/10 border-primary/40 text-primary"
        : "bg-surface border-border text-muted hover:border-primary/50 hover:text-primary"
        } ${loading ? "opacity-60" : ""}`}
    >
      {following ? <Bell className="w-6 h-6" aria-hidden="true" /> : <BellOff className="w-6 h-6" aria-hidden="true" />}
    </button>
  );
}
