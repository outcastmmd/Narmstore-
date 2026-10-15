"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button onClick={logout}
      className="w-full text-start px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition">
      🚪 خروج
    </button>
  );
}
