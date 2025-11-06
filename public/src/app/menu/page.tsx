import React from "react";
import MenuSection from "@/components/AdminMenuSection";
import AdminMenuSection from "@/components/AdminMenuSection";

export const metadata = {
  title: "Tentang Kami - Titik Rindang",
  description: "Pelajari lebih lanjut tentang Titik Rindang dan kualitas kopi kami.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AdminMenuSection />
    </main>
  );
}
