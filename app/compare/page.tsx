import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";
import { Scale } from "lucide-react";

export const metadata: Metadata = { title: "مقایسه برنامه‌ها", description: "مقایسه‌ی کنار هم برنامه‌ها در نرم‌استور" };

export default function ComparePage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
        <Scale className="w-6 h-6 text-primary" aria-hidden="true" /> مقایسه برنامه‌ها
      </h1>
      <CompareClient />
    </div>
  );
}
