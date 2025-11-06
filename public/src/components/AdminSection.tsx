'use client';
import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Trash2, Users, Table2, Edit, Image, Menu, X, LogOut, Settings, BarChart3 } from 'lucide-react';

function UserRegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage('');
  setLoading(true);

  // Ambil ulang token dari localStorage untuk pastiin nilainya up-to-date
  const token = localStorage.getItem('token');

  if (!token) {
    setMessage('❌ Token tidak ditemukan. Silakan login ulang sebagai admin.');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // kalau backend kirim pesan “invalid token”, tampilkan khusus
      if (res.status === 401) {
        throw new Error('Token tidak valid atau kadaluwarsa. Silakan login ulang.');
      }
      throw new Error(data.error || 'Gagal menambahkan user baru.');
    }

    setMessage('✅ User berhasil ditambahkan!');
    // Panggil event untuk refresh tabel user
    window.dispatchEvent(new Event("userAdded"));
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('staff');
  } catch (err: any) {
    console.error('❌ Error register:', err);
    setMessage(`❌ ${err.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="staff">Staff</option>
          <option value="cashier">Cashier</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:bg-gray-400"
      >
        {loading ? 'Menyimpan...' : 'Tambah User'}
      </button>

      {message && <p className="text-sm font-medium mt-2">{message}</p>}
    </form>
  );
}


type TableStatus = 'available' | 'booked' | 'in_used';

interface MenuItem {
  id: number;
  name: string;
  tagline?: string;
  imageURL?: string;
  price: number;
}


interface User {
  id: string; // sebelumnya number
  username: string;
  role: string;
}

interface TableItem {
  id: string;
  status: TableStatus;
}

export default function AdminSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'user' | 'table'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===== MENU MANAGEMENT =====
  const [menus, setMenus] = useState<MenuItem[]>([]);
  interface NewMenuItem {
  name: string;
  tagline: string;
  price: string;
  category?: string;
  imageURL: string | File;
}

const [newItem, setNewItem] = useState<NewMenuItem>({
  name: '',
  tagline: '',
  price: '',
  category: '',
  imageURL: '',
});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (editingItem) {
        setEditingItem({ ...editingItem, imageURL: reader.result as string });
      } else {
        setNewItem({ ...newItem, imageURL: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = async () => {
  if (!newItem.name || !newItem.price) {
    alert('Lengkapi semua field!');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Kamu belum login sebagai admin.');
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/menu/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newItem.name,
        tagline: newItem.tagline || '',
        price: parseFloat(newItem.price),
        image_url: typeof newItem.imageURL === 'string' ? newItem.imageURL : '',
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal menambahkan menu.');
    }

    alert('✅ Menu berhasil ditambahkan!');

    const updated = await res.json();

// Gunakan image base64 yang sudah dikirim jika backend tidak kembalikan imageURL
  const newMenu = {
    id: updated.data?.ID || updated.data?.id,
    name: updated.data?.Name || updated.data?.name || newItem.name,
    tagline: updated.data?.Tagline || updated.data?.tagline || newItem.tagline,
    imageURL: updated.data?.ImageURL || updated.data?.image_url || newItem.imageURL || '',
    price: updated.data?.Price || updated.data?.price || parseFloat(newItem.price),
  };


// Tambahkan ke list menu
setMenus((prev) => [...prev, newMenu]);
setNewItem({ name: '', tagline: '', price: '', imageURL: '', category: '' });

    setNewItem({ name: '', tagline: '', price: '', imageURL: '', category: '' });
  } catch (err) {
    console.error(err);
    alert('❌ Gagal menambahkan menu. Pastikan backend menerima JSON.');
  }
};




const updateMenuItem = async (id: number, updatedMenu: any) => {
  try {
    const res = await fetch(`http://localhost:8080/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: updatedMenu.name,
        tagline: updatedMenu.tagline,
        price: updatedMenu.price,
        image_url: updatedMenu.imageURL, // ✅ tambahkan ini
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Gagal update menu.');

    // ✅ update list menus tanpa ganti bentuk state
    setMenus((prevMenus) =>
      prevMenus.map((m) =>
        m.id === id
          ? {
              ...m,
              name: data.data?.Name || updatedMenu.name,
              tagline: data.data?.Tagline || updatedMenu.tagline,
              imageURL: data.data?.ImageURL || updatedMenu.imageURL,
              price: data.data?.Price || updatedMenu.price,
            }
          : m
      )
    );

    alert('✅ Menu berhasil diupdate!');
  } catch (err) {
    console.error('❌ Gagal update menu:', err);
    alert('Gagal update menu');
  }
};



  const deleteMenuItem = async (id: number) => {
  if (!confirm('Yakin ingin menghapus menu ini?')) return;

  try {
    const res = await fetch(`http://localhost:8080/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal hapus menu');
    alert('✅ Menu berhasil dihapus!');
    setMenus(menus.filter((m) => m.id !== id));
  } catch (err) {
    console.error(err);
    alert('❌ Gagal hapus menu.');
  }
};


  // ===== USER MANAGEMENT =====
  const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
      if (!token) return;

      fetch("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
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
        })
        .catch((err) => console.error("❌ Gagal fetch user:", err))
        .finally(() => setLoadingUsers(false));
    }, [token]);

    // 🟢 Tambahkan useEffect refresh di bawahnya
    useEffect(() => {
      const refreshUsers = () => {
        if (!token) return;
        fetch("http://localhost:8080/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const rawUsers = Array.isArray(data)
              ? data
              : Array.isArray(data.data)
              ? data.data
              : [];
            setUsers(
              rawUsers.map((u: any) => ({
                id: u.ID || u.id,
                username: u.Username || u.username,
                role: u.Role || u.role,
              }))
            );
          });
      };

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

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
type TableStatus = 'available' | 'booked' | 'in_used';

interface TableItem {
  id: string;
  status: TableStatus;
}

const [tables, setTables] = useState<TableItem[]>([]);
const [newTableId, setNewTableId] = useState('');

// 🔹 GET (Public)
useEffect(() => {
  fetch("http://localhost:8080/table/")
    .then((res) => res.json())
    .then((data) => {
      const raw = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      setTables(
        raw.map((t: any) => ({
          id: t.ID || t.id,
          status: t.Status || t.status || 'available',
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

    setTables((prev) => [...prev, { id: data.data.ID || tableNumber.toString(), status: data.data.Status }]);
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'menu', label: 'Menu Management', icon: Coffee },
    { id: 'user', label: 'User Management', icon: Users },
    { id: 'table', label: 'Table Status', icon: Table2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-emerald-700 rounded-lg">
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
                    ? 'bg-white text-emerald-800 shadow-lg'
                    : 'text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                <Icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100 hover:bg-red-600 transition-all">
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
            {menuNav.find(m => m.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <p className="text-gray-500 mt-1">Kelola dan monitor sistem kafe Anda</p>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Menu</p>
                      <h3 className="text-4xl font-bold mt-2">{menus.length}</h3>
                    </div>
                    <Coffee size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Users</p>
                      <h3 className="text-4xl font-bold mt-2">{users.length}</h3>
                    </div>
                    <Users size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">Available Tables</p>
                      <h3 className="text-4xl font-bold mt-2">
                        {tables.filter(t => t.status === 'available').length}
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
                        {tables.filter(t => t.status === 'in_used').length}
                      </h3>
                    </div>
                    <Table2 size={40} className="opacity-80" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Table Status Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600">
                      {tables.filter(t => t.status === 'available').length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Tersedia</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-600">
                      {tables.filter(t => t.status === 'booked').length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Dipesan</p>
                  </div>
                  <div className="text-center p-4 bg-rose-50 rounded-xl">
                    <div className="text-3xl font-bold text-rose-600">
                      {tables.filter(t => t.status === 'in_used').length}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Digunakan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== MENU MANAGEMENT ===== */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama menu"
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={(e) => editingItem 
                      ? setEditingItem({...editingItem, name: e.target.value})
                      : setNewItem({ ...newItem, name: e.target.value })}
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Harga (contoh: 25000)"
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={(e) => editingItem
                      ? setEditingItem({ ...editingItem, price: parseFloat(e.target.value)})
                      : setNewItem({ ...newItem, price: e.target.value })}
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <select
                    value={editingItem ? editingItem.tagline : newItem.tagline}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, tagline: e.target.value })
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
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {(newItem.imageURL || editingItem?.imageURL) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={editingItem ? editingItem.imageURL : newItem.imageURL}
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
                    <Plus size={18} /> {editingItem ? 'Update Menu' : 'Tambah Menu'}
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Menu</h3>
                {menus.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Belum ada menu. Tambahkan menu pertama Anda!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {menus.map((item) => (
                  <div
                    key={item.id ? `menu-${item.id}` : `temp-${item.name}-${Math.random()}`}
                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                  >
                    {item.imageURL ? (
                      <img
                        src={item.imageURL}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Coffee size={48} className="text-gray-400" />
                      </div>
                    )}

                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.tagline}</p>
                      <p className="text-emerald-700 font-semibold text-lg mt-2">
                        Rp {item.price.toLocaleString('id-ID')}
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
          {activeTab === 'user' && (
            <div className="space-y-6">
              {/* === FORM TAMBAH USER === */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah User Baru</h3>
                <UserRegisterForm />
              </div>

              {/* === TABEL USER === */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold">ID</th>
                        <th className="p-4 text-left font-semibold">Username</th>
                        <th className="p-4 text-left font-semibold">Role</th>
                        <th className="p-4 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-gray-500">
                            🔄 Memuat data user...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-gray-500">
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
                            <td className="p-4 text-gray-800 font-medium">{user.username}</td>
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
                                      setEditingUser(user);
                                      setEditForm({
                                        username: user.username,
                                        email: "",
                                        password: "",
                                        role: user.role,
                                      });
                                    }}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all"
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
              {/* === MODAL EDIT USER === */}
              {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Edit User</h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email (opsional, kosongkan jika tidak ingin ubah)"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password baru (opsional)"
                        value={editForm.password}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="staff">Staff</option>
                        <option value="cashier">Cashier</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-5 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => updateUser(editingUser.id)}
                        className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== TABLE STATUS ===== */}
            {activeTab === "table" && (
              <div className="space-y-6">
                {/* Tambah Meja Baru */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Meja Baru</h3>
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
                        <span className="text-2xl font-bold text-gray-800">Meja {table.id}</span>
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(table.status)} animate-pulse`} />
                      </div>

                      <div className={`${getStatusColor(table.status)} text-white text-center py-3 rounded-xl font-semibold mb-4`}>
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