"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Coffee,
  Plus,
  Trash2,
  Users,
  Table2,
  Edit,
  Image,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";
function UserRegisterForm({
  token,
  fetchUsers,
  editingUser,
  setEditingUser,
}: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || "");
      setEmail(editingUser.email || "");
      setPassword("");
      setRole(editingUser.role || "staff");
    } else {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("staff");
    }
  }, [editingUser]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return;

    const body = {
      username,
      email: email || undefined,
      password: password || undefined,
      role,
    };

    try {
      let res;
      if (editingUser) {
        // UPDATE user
        res = await fetch(
          `http://localhost:8080/admin/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          }
        );
      } else {
        // CREATE user
        res = await fetch("http://localhost:8080/admin/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        fetchUsers();
        setEditingUser(null);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("staff");

        // ✅ Alert konfirmasi sukses
        alert(
          editingUser
            ? "✅ User berhasil diperbarui!"
            : "✅ User baru berhasil ditambahkan!"
        );
      } else {
        const errText = await res.text();
        console.error("❌ Gagal simpan user:", errText);
        alert("❌ Gagal menyimpan user. Coba lagi.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Terjadi kesalahan server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      {/* 🔹 Username */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-emerald-500 outline-none"
        required
      />

      {/* 🔹 Email */}
      <input
        type="email"
        placeholder="Email (opsional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-emerald-500 outline-none"
      />

      {/* 🔹 Password */}
      <input
        type="password"
        placeholder={editingUser ? "Password baru (opsional)" : "Password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-emerald-500 outline-none"
        required={!editingUser}
      />

      {/* 🔹 Role */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-emerald-500 outline-none"
      >
        <option value="staff">Staff</option>
        <option value="cashier">Cashier</option>
      </select>

      {/* 🔹 Tombol aksi */}
      <div className="flex gap-2">
        {editingUser && (
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
        >
          {editingUser ? "Simpan" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

type TableStatus = "available" | "booked" | "in_used";

interface MenuItem {
  id: number;
  name: string;
  tagline?: string;
  imageURL: string | File;
  preview?: string;
  price: number;
}

interface User {
  id: string;
  username: string;
  role: string;
}

interface TableItem {
  id: string;
  status: TableStatus;
}

export default function AdminSection() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "menu" | "user" | "table"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===== MENU MANAGEMENT =====
  const [menus, setMenus] = useState<MenuItem[]>([]);

  interface NewMenuItem {
    name: string;
    tagline: string;
    price: string;
    category?: string;
    imageURL: string | File;
    preview?: string; // ✅ fix error TS(2353), TS(2339)
  }

  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: "",
    tagline: "",
    price: "",
    category: "",
    imageURL: "",
    preview: "", // 🧩 tambahkan ini
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/menu/")
      .then((res) => res.json())
      .then((data) => {
        // Debug dulu
        console.log("📦 Data dari backend:", data);

        const rawMenus = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        // 🧩 Normalisasi field agar sesuai dengan frontend
        const formatted = rawMenus.map((item: any) => ({
          id: item.ID,
          name: item.Name,
          tagline: item.Tagline,
          imageURL: item.ImageURL || "",
          price: item.Price || 0,
        }));

        setMenus(formatted);
      })
      .catch((err) => console.error("❌ Gagal fetch menu:", err));
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token
    alert("✅ Logout berhasil!");
    router.push("/"); // redirect ke homepage
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file); // Buat URL preview lokal

    // Jika sedang mengedit item
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        imageURL: file,
        preview: previewURL, // update preview saat edit
      });
    } else {
      setNewItem({
        ...newItem,
        imageURL: file,
        preview: previewURL, // update preview saat tambah baru
      });
    }
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.imageURL) {
      alert("Lengkapi semua field termasuk gambar!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Kamu belum login sebagai admin.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("tagline", newItem.tagline || "");
      formData.append("price", newItem.price.toString());
      formData.append("image", newItem.imageURL); // Gambar yang diupload

      const res = await fetch("http://localhost:8080/menu/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan menu.");
      }

      alert("✅ Menu berhasil ditambahkan!");

      // Update state dengan gambar dari backend
      const newMenu = {
        id: data.data?.ID,
        name: data.data?.Name,
        tagline: data.data?.Tagline,
        imageURL: data.data?.ImageURL || "", // Gambar dari backend
        price: data.data?.Price || parseFloat(newItem.price),
      };

      setMenus((prev) => [...prev, newMenu]);
      setNewItem({
        name: "",
        tagline: "",
        price: "",
        category: "",
        imageURL: "",
        preview: "", // Reset preview setelah menu ditambahkan
      });
    } catch (err) {
      console.error("❌ Gagal menambahkan menu:", err);
      alert("❌ Gagal menambahkan menu.");
    }
  };

  const updateMenuItem = async (id: number, updatedMenu: any) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedMenu.name);
      formData.append("tagline", updatedMenu.tagline);
      formData.append("price", updatedMenu.price.toString());
      if (updatedMenu.imageURL instanceof File) {
        formData.append("image", updatedMenu.imageURL);
      }

      const res = await fetch(`http://localhost:8080/menu/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update menu.");

      setMenus((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                name: data.data?.Name || updatedMenu.name,
                tagline: data.data?.Tagline || updatedMenu.tagline,
                imageURL: data.data?.ImageURL || m.imageURL,
                price: data.data?.Price || updatedMenu.price,
              }
            : m
        )
      );

      alert("✅ Menu berhasil diupdate!");
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Gagal update menu:", err);
      alert("Gagal update menu.");
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      const res = await fetch(`http://localhost:8080/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal hapus menu");
      alert("✅ Menu berhasil dihapus!");
      setMenus(menus.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Gagal hapus menu.");
    }
  };

  // ===== USER MANAGEMENT =====
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      console.log("📦 Data user dari backend:", data);

      const rawUsers = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.users)
        ? data.users
        : [];

      const formatted = rawUsers.map((u: any) => ({
        id: u.ID || u.id,
        username: u.Username || u.username,
        role: u.Role || u.role,
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("❌ Gagal fetch user:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 🔹 Fetch pertama kali saat token tersedia
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // 🔹 Refresh otomatis kalau ada user baru
  useEffect(() => {
    const refreshUsers = () => fetchUsers();

    window.addEventListener("userAdded", refreshUsers);
    return () => window.removeEventListener("userAdded", refreshUsers);
  }, [token]);

  const deleteUser = async (id: string | number) => {
    if (!confirm("🗑️ Yakin ingin menghapus user ini?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Token tidak ditemukan. Silakan login ulang sebagai admin.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal menghapus user dari backend.");
      }

      // Hapus di frontend state
      setUsers((prev) => prev.filter((u) => u.id.toString() !== id.toString()));

      alert("✅ User berhasil dihapus!");
    } catch (err) {
      console.error("❌ Error delete user:", err);
      alert("❌ Gagal menghapus user. Coba lagi.");
    }
  };

  // ===== EDIT USER =====
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateUser = async (id: string) => {
    if (!token) return alert("❌ Anda belum login sebagai admin.");
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update user.");

      alert("✅ User berhasil diperbarui!");
      setEditingUser(null);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, username: editForm.username, role: editForm.role }
            : u
        )
      );
    } catch (err) {
      console.error("❌ Error update user:", err);
      alert("Gagal memperbarui user.");
    }
  };

  // ===== TABLE MANAGEMENT (ADMIN ONLY) =====
  type TableStatus = "available" | "booked" | "in_used";

  interface TableItem {
    id: string;
    status: TableStatus;
  }

  const [tables, setTables] = useState<TableItem[]>([]);
  const [newTableId, setNewTableId] = useState("");

  // 🔹 GET (Public)
  useEffect(() => {
    fetch("http://localhost:8080/table/")
      .then((res) => res.json())
      .then((data) => {
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setTables(
          raw.map((t: any) => ({
            id: t.ID || t.id,
            status: t.Status || t.status || "available",
          }))
        );
      })
      .catch((err) => console.error("❌ Gagal fetch meja:", err));
  }, []);

  // 🔹 POST (Admin)
  const addTable = async () => {
    if (!newTableId.trim()) return alert("Masukkan nomor meja (contoh: 1)");
    if (!token) return alert("❌ Anda belum login sebagai admin.");

    const tableNumber = parseInt(newTableId, 10);
    if (isNaN(tableNumber)) {
      alert("❌ Nomor meja harus berupa angka, contoh: 1");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/table/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table_no: tableNumber, // ✅ sesuai dengan backend
          status: "available",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambah meja");

      setTables((prev) => [
        ...prev,
        {
          id: data.data.ID || tableNumber.toString(),
          status: data.data.Status,
        },
      ]);
      setNewTableId("");
      alert("✅ Meja berhasil ditambahkan!");
    } catch (err) {
      console.error("❌ Error add table:", err);
      alert("Gagal menambah meja.");
    }
  };

  // 🔹 DELETE (Admin)
  const deleteTable = async (id: string) => {
    if (!confirm(`🗑️ Yakin ingin menghapus meja ${id}?`)) return;
    if (!token) return alert("❌ Anda belum login sebagai admin.");

    try {
      const res = await fetch(`http://localhost:8080/table/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus meja");

      setTables((prev) => prev.filter((t) => t.id !== id));
      alert("✅ Meja berhasil dihapus!");
    } catch (err) {
      console.error("❌ Gagal hapus meja:", err);
      alert("Gagal menghapus meja.");
    }
  };

  const getStatusColor = (status: TableStatus) =>
    status === "available"
      ? "bg-emerald-500"
      : status === "booked"
      ? "bg-amber-500"
      : "bg-rose-500";

  const getStatusText = (status: TableStatus) =>
    status === "available"
      ? "Tersedia"
      : status === "booked"
      ? "Dipesan"
      : "Digunakan";

  const menuNav = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "menu", label: "Menu Management", icon: Coffee },
    { id: "user", label: "User Management", icon: Users },
    { id: "table", label: "Table Status", icon: Table2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Coffee size={32} />
              <div>
                <h1 className="text-xl font-bold">CafeAdmin</h1>
                <p className="text-xs text-emerald-200">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-700 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-white text-emerald-800 shadow-lg"
                    : "text-emerald-100 hover:bg-emerald-700"
                }`}
              >
                <Icon size={22} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-emerald-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100 hover:bg-emerald-700 transition-all">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100 hover:bg-red-600 transition-all"
          >
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuNav.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola dan monitor sistem kafe Anda
          </p>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* ===== DASHBOARD ===== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Menu</p>
                      <h3 className="text-4xl font-bold mt-2">
                        {menus.length}
                      </h3>
                    </div>
                    <Coffee size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Users</p>
                      <h3 className="text-4xl font-bold mt-2">
                        {users.length}
                      </h3>
                    </div>
                    <Users size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">
                        Available Tables
                      </p>
                      <h3 className="text-4xl font-bold mt-2">
                        {tables.filter((t) => t.status === "available").length}
                      </h3>
                    </div>
                    <Table2 size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-100 text-sm">In Use</p>
                      <h3 className="text-4xl font-bold mt-2">
                        {tables.filter((t) => t.status === "in_used").length}
                      </h3>
                    </div>
                    <Table2 size={40} className="opacity-80" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Table Status Overview
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600">
                      {tables.filter((t) => t.status === "available").length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Tersedia</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-600">
                      {tables.filter((t) => t.status === "booked").length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Dipesan</p>
                  </div>
                  <div className="text-center p-4 bg-rose-50 rounded-xl">
                    <div className="text-3xl font-bold text-rose-600">
                      {tables.filter((t) => t.status === "in_used").length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Digunakan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== MENU MANAGEMENT ===== */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama menu"
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({
                            ...editingItem,
                            name: e.target.value,
                          })
                        : setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Harga (contoh: 25000)"
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({
                            ...editingItem,
                            price: parseFloat(e.target.value),
                          })
                        : setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <select
                    value={editingItem ? editingItem.tagline : newItem.tagline}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({
                            ...editingItem,
                            tagline: e.target.value,
                          })
                        : setNewItem({ ...newItem, tagline: e.target.value })
                    }
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Kopi">Kopi</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Makanan">Makanan</option>
                  </select>
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                    <Image className="mr-2" size={18} /> Upload Gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview gambar */}
                {(newItem.preview ||
                  editingItem?.preview ||
                  newItem.imageURL ||
                  editingItem?.imageURL) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={
                        editingItem?.preview ||
                        newItem.preview ||
                        (editingItem?.imageURL &&
                        typeof editingItem.imageURL === "string"
                          ? `http://localhost:8080${editingItem.imageURL}`
                          : editingItem?.imageURL) || // ✅ SUDAH DIPERBAIKI
                        newItem.imageURL ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-xl border-4 border-gray-200"
                    />
                  </div>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (editingItem) {
                        updateMenuItem(editingItem.id, editingItem); // ✅ panggil dengan argumen
                      } else {
                        addMenuItem(); // ✅ panggil fungsi tambah menu
                      }
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg"
                  >
                    <Plus size={18} />{" "}
                    {editingItem ? "Update Menu" : "Tambah Menu"}
                  </button>

                  {editingItem && (
                    <button
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Daftar Menu
                </h3>
                {menus.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Belum ada menu. Tambahkan menu pertama Anda!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {menus.map((item) => (
                      <div
                        key={
                          item.id
                            ? `menu-${item.id}`
                            : `temp-${item.name}-${Math.random()}`
                        }
                        className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                      >
                        <img
                          src={`http://localhost:8080${item.imageURL}`} // Ambil imageURL dari backend dan pastikan ditambahkan dengan URL frontend
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150?text=No+Image"; // fallback image
                          }}
                        />

                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 text-lg">
                            {item.name}
                          </h4>
                          <p className="text-gray-500 text-sm mt-1">
                            {item.tagline}
                          </p>
                          <p className="text-emerald-700 font-semibold text-lg mt-2">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                            >
                              <Trash2 size={16} /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== USER MANAGEMENT ===== */}
          {activeTab === "user" && (
            <div className="space-y-6">
              {/* === FORM TAMBAH USER === */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingUser ? "Edit User" : "Tambah User Baru"}
                </h3>

                <UserRegisterForm
                  key={editingUser ? `edit-${editingUser.id}` : "new"}
                  token={token}
                  fetchUsers={fetchUsers}
                  editingUser={editingUser}
                  setEditingUser={setEditingUser}
                />
              </div>

              {/* === TABEL USER === */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold">ID</th>
                        <th className="p-4 text-left font-semibold">
                          Username
                        </th>
                        <th className="p-4 text-left font-semibold">Role</th>
                        <th className="p-4 text-center font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-gray-500"
                          >
                            🔄 Memuat data user...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-gray-500"
                          >
                            Belum ada user terdaftar.
                          </td>
                        </tr>
                      ) : (
                        users.map((user, index) => (
                          <tr
                            key={user.id}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-emerald-50 transition-colors`}
                          >
                            <td className="p-4 text-gray-700">{user.id}</td>
                            <td className="p-4 text-gray-800 font-medium">
                              {user.username}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : user.role === "staff"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-center flex items-center justify-center gap-2">
                              {user.role !== "admin" && (
                                <>
                                  <button
                                    onClick={() => {
                                      // 🟢 Set form ke mode edit (tanpa popup)
                                      setEditingUser(user);
                                      setEditForm({
                                        username: user.username,
                                        email: "",
                                        password: "",
                                        role: user.role,
                                      });

                                      // Opsional: scroll ke atas biar admin langsung lihat form edit
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all"
                                  >
                                    <Edit size={18} />
                                  </button>

                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== TABLE STATUS ===== */}
          {activeTab === "table" && (
            <div className="space-y-6">
              {/* Tambah Meja Baru */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Tambah Meja Baru
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Contoh: 1"
                    value={newTableId}
                    onChange={(e) => setNewTableId(e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 flex-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    onClick={addTable}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Daftar Meja */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-800">
                        Meja {table.id}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(
                          table.status
                        )} animate-pulse`}
                      />
                    </div>

                    <div
                      className={`${getStatusColor(
                        table.status
                      )} text-white text-center py-3 rounded-xl font-semibold mb-4`}
                    >
                      {getStatusText(table.status)}
                    </div>

                    <button
                      onClick={() => deleteTable(table.id)}
                      className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
