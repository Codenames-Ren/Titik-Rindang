import React from "react";
import ReservationSection from "@/components/ReservationSection";

export const metadata = {
  title: "Tentang Kami - Titik Rindang",
  description: "Pelajari lebih lanjut tentang Titik Rindang dan kualitas kopi kami.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ReservationSection />
    </main>
  );
}
