import React from "react";
import Login from "@/components/Login";

export const metadata = {
  title: "Login Pengelola - Titik Rindang",
  description: "Pelajari lebih lanjut tentang Titik Rindang dan kualitas kopi kami.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Login />
    </main>
  );
}
