import React from "react";
import Testimonials from "@/components/Testimonials";

export const metadata = {
  title: "Testimoni - Titik Rindang",
  description: "Pelajari lebih lanjut tentang Titik Rindang dan kualitas kopi kami.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Testimonials />
    </main>
  );
}
