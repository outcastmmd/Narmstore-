import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";

export const metadata: Metadata = { title: "مقایسه برنامه‌ها", description: "مقایسه‌ی کنار هم برنامه‌ها در نرم‌استور" };

export default function ComparePage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-6">⚖️ مقایسه برنامه‌ها</h1>
      <CompareClient />
    </div>
  );
}
