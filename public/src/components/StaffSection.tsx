'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import {
  Coffee,
  Table2,
  Menu,
  BarChart3,
  X,
  LogOut,
  Settings,
  ClipboardList,
  Loader2,
  FileText,
  Plus,
} from 'lucide-react';

// ===== Type definition =====
interface MenuItem {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
  price: number;
}

interface TableItem {
  id?: string | number;
  ID?: string | number;
  table_no?: string | number;
  status: string;
}


interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string;
  table_id: number;
  table?: { table_no: number }; // optional relasi table
  reservation_date: string;
  table_fee: number;
  status: string;
}


interface Order {
  id: number;
  table_id: number;
  customer: string; // 🧩 tambahkan ini
  total_amount: number;
  status: string;
  payment_method?: string;
}

export default function StaffSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'menu' | 'reservation' | 'order'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // ===== State =====
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTableId, setNewTableId] = useState('');

  // ===== Fetch data on load =====
  useEffect(() => {
    fetchAllData();
  }, []);

    const fetchAllData = async () => {
  setLoading(true);
  try {
    const headersWithAuth: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const [menuRes, tableRes, reservRes, orderRes] = await Promise.all([
      fetch("http://localhost:8080/menu/"),
      fetch("http://localhost:8080/table/"),
      fetch("http://localhost:8080/reservation/", { headers: headersWithAuth }),
      fetch("http://localhost:8080/order/", { headers: headersWithAuth }),
    ]);

    const [menuJson, tableJson, reservJson, orderJson] = await Promise.all([
      menuRes.json(),
      tableRes.json(),
      reservRes.json(),
      orderRes.json(),
    ]);

    const menuData = Array.isArray(menuJson) ? menuJson : menuJson.data || [];
    const tableData = Array.isArray(tableJson) ? tableJson : tableJson.data || [];
    const reservData = Array.isArray(reservJson) ? reservJson : reservJson.data || [];
    const orderData = Array.isArray(orderJson) ? orderJson : orderJson.data || [];

    // ========================
    // ✅ MENU (read-only)
    // ========================
    setMenus(
      menuData.map((m: any) => ({
        id: m.ID || m.id,
        name: m.Name || m.name || "",
        tagline: m.Tagline || m.tagline || "",
        image_url: m.ImageURL || m.image_url || "",
        price: Number(m.Price || m.price || 0),
      }))
    );

    // ========================
    // ✅ TABLE (CRUD)
    // ========================
    setTables(
      tableData.map((t: any) => ({
        id: t.ID || t.id,
        table_no: t.TableNo || t.table_no,
        status: t.Status || t.status || "available",
      }))
    );

    // ========================
    // ✅ RESERVATION (read-only)
    // ========================
    setReservations(
      reservData.map((r: any) => ({
        id: r.ID || r.id,
        name: r.Name || r.name || "",
        phone: r.Phone || r.phone || "",
        email: r.Email || r.email || "",
        table_id: r.TableID || r.table_id,
        reservation_date: r.ReservationDate || r.reservation_date,
        table_fee: Number(r.TableFee || r.table_fee || 0),
        status: r.Status || r.status || "",
      }))
    );

    // ========================
    // ✅ ORDER (read-only)
    // ========================
    setOrders(
      orderData.map((o: any) => ({
        id: o.ID || o.id,
        table_id: o.TableID || o.table_id,
        customer: o.Customer || o.customer || "",
        total_amount: Number(o.Total || o.total || 0),
        payment_method: o.PaymentMethod || o.payment_method || "",
        status: o.Status || o.status || "",
      }))
    );
  } catch (err) {
    console.error("❌ Gagal fetch data:", err);
  } finally {
    setLoading(false);
  }
};


  // ===== Add Table =====
  const addTable = async () => {
    if (!newTableId.trim()) return alert('Masukkan nomor meja (contoh: 1)');
    if (!token) return alert('❌ Anda belum login sebagai staff.');

    const tableNumber = parseInt(newTableId, 10);
    if (isNaN(tableNumber)) return alert('❌ Nomor meja harus angka.');

    try {
      const res = await fetch('http://localhost:8080/table/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ table_no: tableNumber, status: 'available' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menambah meja.');

      setTables([...tables, data.data]);
      setNewTableId('');
      alert('✅ Meja berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal tambah meja:', err);
      alert('❌ Gagal menambah meja.');
    }
  };

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('✅ Logout berhasil!');
    router.push('/');
  };

  // ===== Helper for status color =====
  const getStatusColor = (status: string) =>
    status === 'available'
      ? 'bg-emerald-500'
      : status === 'booked'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  // ===== Sidebar Menu =====
  const menuNav = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'table', label: 'Table Management', icon: Table2 },
    { id: 'menu', label: 'Menu', icon: Coffee },
    { id: 'reservation', label: 'Reservation', icon: ClipboardList },
    { id: 'order', label: 'Order', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Coffee size={28} />
              <div>
                <h1 className="text-lg font-bold">Staff Panel</h1>
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

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-700 transition-all">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-red-600 transition-all"
          >
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuNav.find((m) => m.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <p className="text-gray-500 mt-1">Kelola data operasional harian</p>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <Loader2 className="animate-spin mb-3" size={32} />
              Loading data...
            </div>
          ) : (
            <>
              {/* ===== DASHBOARD ===== */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <p>Total Menu</p>
                    <h3 className="text-4xl font-bold">{menus.length}</h3>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                    <p>Available Tables</p>
                    <h3 className="text-4xl font-bold">
                      {tables.filter((t) => t.status === 'available').length}
                    </h3>
                  </div>
                  <div className="bg-amber-500 text-white rounded-2xl p-6 shadow-lg">
                    <p>Booked Tables</p>
                    <h3 className="text-4xl font-bold">
                      {tables.filter((t) => t.status === 'booked').length}
                    </h3>
                  </div>
                </div>
              )}

              {/* ===== TABLE MANAGEMENT ===== */}
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
                        <Plus size={18} className="inline mr-1" /> Tambah
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tables.map((table) => (
                    <div
                        key={table.id || table.ID || table.table_no || Math.random()}
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                    >
                        <h4 className="text-xl font-bold text-gray-800 mb-3">Meja {table.id || table.ID || table.table_no}</h4>
                        <div
                        className={`${getStatusColor(table.status)} text-white text-center py-2 rounded-xl font-semibold`}
                        >
                        {table.status}
                        </div>
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== MENU ===== */}
              {activeTab === 'menu' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menus.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                    >
                      <img
                        src={item.image_url || '/noimage.png'}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-gray-500 text-sm">{item.tagline}</p>
                        <p className="text-blue-700 font-semibold mt-2">
                          Rp {(item.price ?? 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== RESERVATION ===== */}
              {activeTab === 'reservation' && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Daftar Reservasi</h3>
                  {reservations.length === 0 ? (
                    <p className="text-gray-500">Belum ada reservasi.</p>
                  ) : (
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">Nama</th>
                            <th className="p-3 border">Telepon</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Meja</th>
                            <th className="p-3 border">Tanggal Reservasi</th>
                            <th className="p-3 border">Biaya Meja</th>
                            <th className="p-3 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((r, i) => (
                            <tr key={r.id || i} className="border-t hover:bg-gray-50">
                                <td className="p-3 border">{r.name}</td>
                                <td className="p-3 border">{r.phone}</td>
                                <td className="p-3 border">{r.email || '-'}</td>
                                <td className="p-3 border">
                                {r.table?.table_no || r.table_id || '-'}
                                </td>
                                <td className="p-3 border">
                                {new Date(r.reservation_date).toLocaleString('id-ID')}
                                </td>
                                <td className="p-3 border text-right">
                                Rp {(r.table_fee ?? 0).toLocaleString('id-ID')}
                                </td>
                                <td
                                className={`p-3 border font-semibold ${
                                    r.status === 'Paid'
                                    ? 'text-emerald-600'
                                    : r.status === 'Unpaid'
                                    ? 'text-amber-600'
                                    : 'text-rose-600'
                                }`}
                                >
                                {r.status}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ===== ORDER ===== */}
              {activeTab === 'order' && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Daftar Order</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-500">Belum ada order.</p>
                  ) : (
                    <table className="w-full border">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-3 border">ID</th>
                          <th className="p-3 border">Meja</th>
                          <th className="p-3 border">Customer</th>
                          <th className="p-3 border">Total</th>
                          <th className="p-3 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} className="border-t">
                            <td className="p-3 border">{o.id}</td>
                            <td className="p-3 border">{o.table_id}</td>
                            <td className="p-3 border">{o.customer}</td>
                            <td className="p-3 border">
                              Rp {(o.total_amount ?? 0).toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 border capitalize">{o.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
