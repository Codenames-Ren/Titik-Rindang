'use client';
import React, { useState } from 'react';
import { Coffee, Plus, Trash2, Users, Table2, Edit, Image as ImageIcon } from 'lucide-react';

type TableStatus = 'available' | 'booked' | 'in_used';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface Table {
  id: string;
  status: TableStatus;
}

export default function AdminSection() {
  const [tab, setTab] = useState<'menu' | 'user' | 'table'>('menu');

  // ===== MENU MANAGEMENT =====
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('admin-menus');
    return saved ? JSON.parse(saved) : [];
  });

  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', image: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewItem({ ...newItem, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category)
      return alert('Lengkapi semua field!');
    const updated = [...menuItems, { id: Date.now(), ...newItem }];
    setMenuItems(updated);
    localStorage.setItem('admin-menus', JSON.stringify(updated));
    setNewItem({ name: '', price: '', category: '', image: '' });
  };

  const deleteMenuItem = (id: number) => {
    const updated = menuItems.filter((i) => i.id !== id);
    setMenuItems(updated);
    localStorage.setItem('admin-menus', JSON.stringify(updated));
  };

  // ===== USER MANAGEMENT =====
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'customer01', role: 'User' },
    { id: 3, username: 'customer02', role: 'User' },
  ]);

  const deleteUser = (id: number) => {
    if (confirm('Yakin ingin hapus user ini?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // ===== TABLE MANAGEMENT =====
  const DEFAULT_TABLES: Table[] = [
    { id: 'I1', status: 'available' },
    { id: 'I2', status: 'booked' },
    { id: 'I3', status: 'in_used' },
    { id: 'O1', status: 'available' },
    { id: 'O2', status: 'booked' },
  ];

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('admin-tables');
    return saved ? JSON.parse(saved) : DEFAULT_TABLES;
  });

  const updateTableStatus = (id: string, newStatus: TableStatus) => {
    const updated = tables.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTables(updated);
    localStorage.setItem('admin-tables', JSON.stringify(updated));
  };

  const getColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'booked':
        return 'bg-yellow-400';
      case 'in_used':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl w-full mt-25">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Coffee className="text-green-800" size={30} />
          <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              tab === 'menu'
                ? 'bg-green-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
            onClick={() => setTab('menu')}
          >
            🍽️ Menu
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              tab === 'user'
                ? 'bg-green-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
            onClick={() => setTab('user')}
          >
            👤 User
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              tab === 'table'
                ? 'bg-green-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
            onClick={() => setTab('table')}
          >
            🪑 Meja
          </button>
        </div>

        {/* ===== MENU MANAGEMENT ===== */}
        {tab === 'menu' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
              <Edit size={20} /> Kelola Menu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-gray-700">
              <input
                type="text"
                placeholder="Nama menu"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Harga"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Kategori"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="border rounded-lg p-2"
              />
              <label className="border rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-green-50">
                <ImageIcon className="mr-2" size={18} /> Upload Gambar
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Preview Gambar */}
            {newItem.image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Preview Gambar:</p>
                <img
                  src={newItem.image}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <button
              onClick={addMenuItem}
              className="bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-900"
            >
              <Plus size={18} /> Tambah Menu
            </button>

            <div className="mt-6">
              {menuItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada menu.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl shadow-sm p-3 flex flex-col items-center bg-white"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-md mb-2"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <h3 className="font-semibold text-green-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Rp {item.price}</p>
                      <p className="text-gray-500 text-xs italic">{item.category}</p>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== USER MANAGEMENT ===== */}
        {tab === 'user' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
              <Users size={20} /> Manajemen User
            </h2>
            <table className="w-full text-sm border text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.role}</td>
                    <td className="border p-2 text-center">
                      {user.role !== 'Admin' && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== TABLE STATUS ===== */}
        {tab === 'table' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
              <Table2 size={20} /> Status Meja
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className="bg-gray-50 p-4 rounded-xl border flex flex-col items-center shadow-sm text-gray-700"
                >
                  <span className="font-semibold text-gray-700 mb-2">Meja {t.id}</span>
                  <div className={`w-6 h-6 rounded-full ${getColor(t.status)} mb-3`}></div>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateTableStatus(t.id, e.target.value as TableStatus)
                    }
                    className="border rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="available">Tersedia</option>
                    <option value="booked">Dipesan</option>
                    <option value="in_used">Sedang Dipakai</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
