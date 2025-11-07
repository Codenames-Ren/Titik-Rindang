"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Coffee, Trash2 } from "lucide-react";

interface Menu {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
  price: number;
}

export default function AdminMenuSection() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===== Fetch menu list =====
  useEffect(() => {
    fetch("http://localhost:8080/menu/")
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error(err));
  }, []);

  //button add new menu
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Kamu belum login sebagai admin.");

    setIsLoading(true);

    const payload = {
      Name: name,
      Tagline: tagline,
      ImageURL: imageURL,
      Price: parseFloat(price),
    };

    console.log("Payload dikirim:", payload);

    try {
      const res = await fetch("http://localhost:8080/menu/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response backend:", data);

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan menu.");
      }

      alert("✅ Menu berhasil ditambahkan!");
      setName("");
      setTagline("");
      setImageURL("");
      setPrice("");

      const updatedMenus = await fetch("http://localhost:8080/menu/").then(
        (r) => r.json()
      );
      setMenus(updatedMenus);
    } catch (err) {
      console.error("Gagal nambah menu:", err);
      alert("❌ Gagal menambahkan menu. Cek console log.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Delete Menu (Admin only) =====
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      const res = await fetch(`http://localhost:8080/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus menu");
      setMenus(menus.filter((m) => m.id !== id));
      alert("✅ Menu berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghapus menu.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <Coffee /> Menu Management
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-green-700 underline font-medium"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {/* === Add Menu Form === */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle /> Tambah Menu Baru
        </h2>

        <form
          onSubmit={handleAddMenu}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nama Menu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              URL Gambar
            </label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Harga (Rp)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition disabled:bg-green-400"
            >
              {isLoading ? "Loading..." : "Tambah Menu"}
            </button>
          </div>
        </form>
      </div>

      {/* === Menu List === */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            {menu.image_url && (
              <img
                src={menu.image_url}
                alt={menu.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {menu.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{menu.tagline}</p>
              <p className="text-green-700 font-semibold mb-3">
                Rp {menu.price.toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(menu.id)}
                className="text-red-600 flex items-center gap-1 text-sm hover:underline"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
