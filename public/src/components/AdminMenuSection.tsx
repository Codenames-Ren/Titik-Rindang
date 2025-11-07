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
    console.log("🔍 Fetching menus from:", `${API_URL}/menu/`);
    fetch(`${API_URL}/menu/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw menu data from backend:", data);
        setMenus(data);
      })
      .catch((err) => console.error("❌ Error fetching menus:", err));
  }, [API_URL]);

  // ===== Improved Image URL Resolver with Debugging =====
  const resolveImageURL = (url: string): string => {
    console.group("🖼️ Resolving Image URL");
    console.log("Original URL:", url);

    if (!url) {
      console.log("⚠️ Empty URL provided");
      console.groupEnd();
      return "";
    }

    // ✅ Already absolute URL with correct port
    if (
      url.startsWith("http://localhost:8080") ||
      url.startsWith("http://127.0.0.1:8080")
    ) {
      console.log("✅ Already correct absolute URL");
      console.groupEnd();
      return url;
    }

    // ✅ If URL points to wrong port (3000), redirect to 8080
    if (
      url.startsWith("http://localhost:3000") ||
      url.startsWith("http://127.0.0.1:3000")
    ) {
      const fixed = url.replace(
        /http:\/\/(localhost|127\.0\.0\.1):3000/,
        API_URL
      );
      console.log("🔄 Redirected from port 3000 to 8080:", fixed);
      console.groupEnd();
      return fixed;
    }

    // ✅ Handle absolute URLs with different domains
    if (url.startsWith("http://") || url.startsWith("https://")) {
      console.log("🌐 External absolute URL, using as-is");
      console.groupEnd();
      return url;
    }

    // ✅ Clean up relative paths
    let cleanPath = url
      .replace(/^\/+/, "") // Remove leading slashes
      .replace(/^src\//, "") // Remove "src/" prefix if any
      .trim();

    console.log("🧹 Cleaned path:", cleanPath);

    // ✅ Ensure path starts with "uploads/menu/"
    if (!cleanPath.startsWith("uploads/")) {
      // Handle case where path might be just "menu/filename.jpg"
      if (cleanPath.startsWith("menu/")) {
        cleanPath = `uploads/${cleanPath}`;
      } else {
        // Assume it's just filename
        cleanPath = `uploads/menu/${cleanPath}`;
      }
      console.log("📁 Added uploads/menu/ prefix:", cleanPath);
    }

    // 🔥 Construct full URL
    const fullURL = `${API_URL}/${cleanPath}`;
    console.log("✨ Final resolved URL:", fullURL);
    console.groupEnd();

    return fullURL;
  };

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

    console.log("📤 Submitting menu payload:", payload);

    try {
      const url = editingMenu
        ? `${API_URL}/menu/${editingMenu.id}`
        : `${API_URL}/menu/`;
      const method = editingMenu ? "PUT" : "POST";

      console.log(`🚀 ${method} request to:`, url);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response from backend:", data);

      if (!res.ok) throw new Error(data.error || "Gagal menyimpan menu.");

      alert(`✅ Menu berhasil ${editingMenu ? "diperbarui" : "ditambahkan"}!`);
      setName("");
      setTagline("");
      setImageURL("");
      setPrice("");
      setEditingMenu(null);

      // Refresh data
      console.log("🔄 Refreshing menu list...");
      const updatedMenus = await fetch(`${API_URL}/menu/`).then((r) =>
        r.json()
      );
      console.log("📦 Updated menu list:", updatedMenus);
      setMenus(updatedMenus);
    } catch (err) {
      console.error("❌ Error saving menu:", err);
      alert("❌ Gagal menyimpan menu. Cek console log.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Delete Menu =====
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;
    console.log("🗑️ Deleting menu with ID:", id);
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus menu");
      setMenus(menus.filter((m) => m.id !== id));
      console.log("✅ Menu deleted successfully");
      alert("✅ Menu berhasil dihapus!");
    } catch (err) {
      console.error("❌ Error deleting menu:", err);
      alert("❌ Gagal menghapus menu.");
    }
  };

  // ===== Handle Edit =====
  const handleEdit = (menu: Menu) => {
    console.log("✏️ Editing menu:", menu);
    setEditingMenu(menu);
    setName(menu.name);
    setTagline(menu.tagline);
    setImageURL(menu.image_url);
    setPrice(menu.price.toString());
  };

  const handleCancel = () => {
    console.log("❌ Cancelled editing");
    setEditingMenu(null);
    setName("");
    setTagline("");
    setImageURL("");
    setPrice("");
  };

  console.log("🌐 API_URL:", API_URL);
  console.log("🔑 Token exists:", !!token);

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
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">
                  Preview URL: {resolveImageURL(imageURL)}
                </p>
                <img
                  src={resolveImageURL(imageURL)}
                  alt="Preview"
                  className="w-full max-w-sm h-40 object-cover rounded-lg border"
                  onError={(e) => {
                    console.error(
                      "❌ Failed to load preview image:",
                      resolveImageURL(imageURL)
                    );
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160'%3E%3Crect fill='%23ddd' width='400' height='160'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-size='16'%3EImage not found%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
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
              <div className="relative">
                <img
                  src={resolveImageURL(menu.image_url)}
                  alt={menu.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    console.error(
                      `❌ Failed to load image for menu "${menu.name}":`,
                      resolveImageURL(menu.image_url)
                    );
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160'%3E%3Crect fill='%23f3f4f6' width='400' height='160'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                  onLoad={() => {
                    console.log(
                      `✅ Successfully loaded image for menu "${menu.name}"`
                    );
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                  {resolveImageURL(menu.image_url)}
                </div>
              </div>
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
