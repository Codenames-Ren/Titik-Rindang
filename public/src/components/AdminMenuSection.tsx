"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Coffee, Trash2, Edit3 } from "lucide-react";

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
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===== Fetch menu list =====
  useEffect(() => {
    fetch(`${API_URL}/menu/`)
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  // ===== Add or Update Menu =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Kamu belum login sebagai admin.");
    setIsLoading(true);

    const payload = {
      Name: name,
      Tagline: tagline,
      ImageURL: imageURL,
      Price: parseFloat(price),
    };

    try {
      const url = editingMenu
        ? `${API_URL}/menu/${editingMenu.id}`
        : `${API_URL}/menu/`;
      const method = editingMenu ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan menu.");

      alert(`✅ Menu berhasil ${editingMenu ? "diperbarui" : "ditambahkan"}!`);
      setName("");
      setTagline("");
      setImageURL("");
      setPrice("");
      setEditingMenu(null);

      // Refresh data
      const updatedMenus = await fetch(`${API_URL}/menu/`).then((r) =>
        r.json()
      );
      setMenus(updatedMenus);
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan menu. Cek console log.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Delete Menu =====
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus menu");
      setMenus(menus.filter((m) => m.id !== id));
      alert("✅ Menu berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghapus menu.");
    }
  };

  // ===== Handle Edit =====
  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setName(menu.name);
    setTagline(menu.tagline);
    setImageURL(menu.image_url);
    setPrice(menu.price.toString());
  };

  const handleCancel = () => {
    setEditingMenu(null);
    setName("");
    setTagline("");
    setImageURL("");
    setPrice("");
  };

  const resolveImageURL = (url: string): string => {
    if (!url) return "";

    if (url.startsWith("http")) return url;

    // bersihkan path agar gak dobel prefix aneh
    const clean = url
      .replace(/^\/?src\/uploads\/menu\//, "")
      .replace(/^\/?uploads\/menu\//, "")
      .replace(/^\/?menu\//, "")
      .trim();

    // hasil akhir selalu bentuk: http://localhost:8080/uploads/menu/namafile.png
    return `${API_URL}/uploads/menu/${clean}`;
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

      {/* === Add / Edit Menu Form === */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle /> {editingMenu ? "Edit Menu" : "Tambah Menu Baru"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Nama Menu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              URL Gambar
            </label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            {imageURL && (
              <img
                src={resolveImageURL(imageURL)}
                alt="Preview"
                className="mt-3 w-full max-w-sm h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex flex-col md:col-span-2 md:w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Harga (Rp)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="flex gap-4 mt-4 md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition disabled:bg-green-400"
            >
              {isLoading
                ? "Loading..."
                : editingMenu
                ? "Simpan Perubahan"
                : "Tambah Menu"}
            </button>

            {editingMenu && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
            )}
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
                src={resolveImageURL(menu.image_url)}
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

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(menu)}
                  className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="text-red-600 flex items-center gap-1 text-sm hover:underline"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
