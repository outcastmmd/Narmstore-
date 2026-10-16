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
      <button disabled className="text-xs font-bold bg-surface-2 text-muted rounded-full px-3 py-1.5 opacity-60">
        ...
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={following ? "لغو دنبال کردن" : "دنبال کن تا از نسخه جدید باخبر شی"}
      className={`pressable text-xs font-bold rounded-full px-3 py-1.5 border transition inline-flex items-center gap-1.5 ${
        following
          ? "bg-primary text-primary-fg border-primary"
          : "bg-surface border-border text-muted hover:text-foreground hover:border-primary/50"
      } ${loading ? "opacity-60" : ""}`}
    >
      {following ? <><Bell className="w-3.5 h-3.5" aria-hidden="true" /> دنبال می‌کنی</> : <><BellOff className="w-3.5 h-3.5" aria-hidden="true" /> دنبال کن</>}
    </button>
  );
}
