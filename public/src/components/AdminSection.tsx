'use client';
import React, { useState } from 'react';
import { Coffee, Plus, Trash2, Users, Table2, Edit, Image, Menu, X, LogOut, Settings, BarChart3 } from 'lucide-react';

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

interface TableItem {
  id: string;
  status: TableStatus;
}

export default function AdminSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'user' | 'table'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===== MENU MANAGEMENT =====
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', image: '' });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (editingItem) {
        setEditingItem({ ...editingItem, image: reader.result as string });
      } else {
        setNewItem({ ...newItem, image: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category)
      return alert('Lengkapi semua field!');
    const updated = [...menuItems, { id: Date.now(), ...newItem }];
    setMenuItems(updated);
    setNewItem({ name: '', price: '', category: '', image: '' });
  };

  const updateMenuItem = () => {
    if (!editingItem) return;
    const updated = menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setMenuItems(updated);
    setEditingItem(null);
  };

  const deleteMenuItem = (id: number) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      setMenuItems(menuItems.filter((i) => i.id !== id));
    }
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
  const DEFAULT_TABLES: TableItem[] = [
    { id: 'I1', status: 'available' },
    { id: 'I2', status: 'booked' },
    { id: 'I3', status: 'in_used' },
    { id: 'O1', status: 'available' },
    { id: 'O2', status: 'booked' },
  ];

  const [tables, setTables] = useState<TableItem[]>(DEFAULT_TABLES);

  const updateTableStatus = (id: string, newStatus: TableStatus) => {
    const updated = tables.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTables(updated);
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'booked': return 'bg-amber-500';
      case 'in_used': return 'bg-rose-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'booked': return 'Dipesan';
      case 'in_used': return 'Digunakan';
      default: return 'Unknown';
    }
  };

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
                      <h3 className="text-4xl font-bold mt-2">{menuItems.length}</h3>
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
                      ? setEditingItem({...editingItem, price: e.target.value})
                      : setNewItem({ ...newItem, price: e.target.value })}
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Kategori (contoh: Minuman)"
                    value={editingItem ? editingItem.category : newItem.category}
                    onChange={(e) => editingItem
                      ? setEditingItem({...editingItem, category: e.target.value})
                      : setNewItem({ ...newItem, category: e.target.value })}
                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                    <Image className="mr-2" size={18} /> Upload Gambar
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {(newItem.image || editingItem?.image) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={editingItem ? editingItem.image : newItem.image}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-xl border-4 border-gray-200"
                    />
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={editingItem ? updateMenuItem : addMenuItem}
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
                {menuItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Belum ada menu. Tambahkan menu pertama Anda!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {menuItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                        {item.image ? (
                          <img
                            src={item.image}
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
                          <p className="text-emerald-600 font-semibold text-xl mt-1">Rp {item.price}</p>
                          <p className="text-gray-500 text-sm mt-1">{item.category}</p>
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
                    {users.map((user, index) => (
                      <tr key={user.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-emerald-50 transition-colors`}>
                        <td className="p-4 text-gray-700">{user.id}</td>
                        <td className="p-4 text-gray-800 font-medium">{user.username}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {user.role !== 'Admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
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
            </div>
          )}

          {/* ===== TABLE STATUS ===== */}
          {activeTab === 'table' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-800">Meja {table.id}</span>
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(table.status)} animate-pulse`}></div>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`${getStatusColor(table.status)} text-white text-center py-3 rounded-xl font-semibold`}>
                        {getStatusText(table.status)}
                      </div>
                    </div>

                    <select
                      value={table.status}
                      onChange={(e) => updateTableStatus(table.id, e.target.value as TableStatus)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-medium text-gray-700"
                    >
                      <option value="available">✅ Tersedia</option>
                      <option value="booked">📅 Dipesan</option>
                      <option value="in_used">🍽️ Sedang Dipakai</option>
                    </select>
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