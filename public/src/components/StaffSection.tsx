'use client';
import React, { useEffect, useState } from 'react';
import {
  Coffee,
  Table2,
  Menu,
  BarChart3,
  Plus,
  Image,
  X,
  LogOut,
  Settings,
  ClipboardList,
} from 'lucide-react';

export default function StaffSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'menu' | 'reservation' | 'order'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menus, setMenus] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [newTableId, setNewTableId] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // ===== GET MENU (public) =====
  useEffect(() => {
    fetch('http://localhost:8080/menu/')
      .then((res) => res.json())
      .then((data) => {
        const rawMenus = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setMenus(
          rawMenus.map((m: any) => ({
            id: m.ID || m.id,
            name: m.Name || m.name,
            tagline: m.Tagline || m.tagline,
            price: m.Price || m.price,
            imageURL: m.ImageURL || m.image_url,
          }))
        );
      })
      .catch((err) => console.error('❌ Gagal fetch menu:', err));
  }, []);

  // ===== GET TABLES (public) =====
  useEffect(() => {
    fetch('http://localhost:8080/table/')
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
      .catch((err) => console.error('❌ Gagal fetch meja:', err));
  }, []);

  // ===== POST TABLE (Staff/Admin only) =====
  const addTable = async () => {
    if (!newTableId.trim()) return alert('Masukkan nomor meja (contoh: 1)');
    if (!token) return alert('❌ Anda belum login sebagai staff.');

    const tableNumber = parseInt(newTableId, 10);
    if (isNaN(tableNumber)) {
      alert('❌ Nomor meja harus berupa angka.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/table/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table_no: tableNumber,
          status: 'available',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menambah meja.');

      setTables((prev) => [
        ...prev,
        { id: data.data.ID || tableNumber.toString(), status: data.data.Status },
      ]);
      setNewTableId('');
      alert('✅ Meja berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Error add table:', err);
      alert('Gagal menambah meja.');
    }
  };

  // ====== HELPER FUNCTION ======
  const getStatusColor = (status: string) =>
    status === 'available'
      ? 'bg-emerald-500'
      : status === 'booked'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  const getStatusText = (status: string) =>
    status === 'available'
      ? 'Tersedia'
      : status === 'booked'
      ? 'Dipesan'
      : 'Digunakan';

  const menuNav = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'table', label: 'Table Management', icon: Table2 },
    { id: 'menu', label: 'Menu', icon: Coffee },
    { id: 'reservation', label: 'Reservation', icon: ClipboardList },
    { id: 'order', label: 'Order', icon: Menu },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        <div className="p-6 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Coffee size={32} />
              <div>
                <h1 className="text-xl font-bold">Staff Panel</h1>
                <p className="text-xs text-blue-200">Cafe Management</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-blue-800 shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-700 transition-all">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-red-600 transition-all">
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuNav.find((m) => m.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <p className="text-gray-500 mt-1">Kelola data operasional harian</p>
        </header>

        <div className="p-8">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-blue-100 text-sm">Total Menu</p>
                <h3 className="text-4xl font-bold mt-2">{menus.length}</h3>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-emerald-100 text-sm">Available Tables</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tables.filter((t) => t.status === 'available').length}
                </h3>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-amber-100 text-sm">Booked Tables</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tables.filter((t) => t.status === 'booked').length}
                </h3>
              </div>
            </div>
          )}

          {/* TABLE MANAGEMENT */}
          {activeTab === 'table' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Meja Baru</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Contoh: 1"
                    value={newTableId}
                    onChange={(e) => setNewTableId(e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={addTable}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-2xl font-bold text-gray-800">Meja {table.id}</h4>
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(table.status)} animate-pulse`} />
                    </div>
                    <div className={`${getStatusColor(table.status)} text-white text-center py-2 rounded-xl font-semibold`}>
                      {getStatusText(table.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU (read-only) */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Menu</h3>
                {menus.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Belum ada menu tersedia.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {menus.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        {item.imageURL ? (
                          <img
                            src={item.imageURL}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <Coffee size={40} className="text-gray-400" />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          <p className="text-gray-500 text-sm mt-1">{item.tagline}</p>
                          <p className="text-blue-700 font-semibold mt-2">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PLACEHOLDER TABS */}
          {activeTab === 'reservation' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
              <ClipboardList size={48} className="mx-auto mb-4 text-blue-400" />
              <p>📅 Halaman <b>Reservation</b> untuk staff akan ditambahkan nanti.</p>
            </div>
          )}

          {activeTab === 'order' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
              <Menu size={48} className="mx-auto mb-4 text-blue-400" />
              <p>🧾 Halaman <b>Order</b> untuk staff akan ditambahkan nanti.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
