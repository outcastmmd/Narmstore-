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
      className="btn btn-ghost justify-start w-full text-error">
      🚪 خروج
    </button>
  );
}
