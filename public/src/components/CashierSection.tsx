'use client';
import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Table2,
  BarChart3,
  Menu,
  ClipboardList,
  X,
  Settings,
  LogOut,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Reservation {
  id: string;
  customer_name: string;
  date: string;
  guests: number;
  status: string;
}

interface Table {
  id: string;
  status: string;
}

export default function CashierSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservation' | 'table' | 'order'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res1, res2] = await Promise.all([
          fetch('http://localhost:8080/reservation/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8080/table/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!res1.ok || !res2.ok) throw new Error('Gagal memuat data.');

        const data1 = await res1.json();
        const data2 = await res2.json();

        const reservationsRaw = Array.isArray(data1)
          ? data1
          : Array.isArray(data1.data)
          ? data1.data
          : [];

        const tablesRaw = Array.isArray(data2)
          ? data2
          : Array.isArray(data2.data)
          ? data2.data
          : [];

        setReservations(reservationsRaw);
        setTables(
          tablesRaw.map((t: any) => ({
            id: t.ID || t.id,
            status: t.Status || t.status || 'available',
          }))
        );
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // ===== CONFIRM PAYMENT =====
  const confirmPayment = async (id: string) => {
    if (!confirm('Konfirmasi pembayaran reservasi ini?')) return;
    try {
      const res = await fetch(`http://localhost:8080/reservation/confirm/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal konfirmasi pembayaran.');
      alert('✅ Pembayaran berhasil dikonfirmasi.');
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'paid' } : r))
      );
    } catch (err) {
      alert('❌ Gagal konfirmasi pembayaran.');
    }
  };

  // ===== UPDATE TABLE STATUS =====
  const updateTableStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/table/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Gagal update meja.');
      setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      alert('✅ Status meja diperbarui.');
    } catch (err) {
      alert('❌ Gagal update meja.');
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // ===== SIDEBAR NAV =====
  const menuNav = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reservation', label: 'Reservation', icon: ClipboardList },
    { id: 'table', label: 'Table Status', icon: Table2 },
    { id: 'order', label: 'Order', icon: Menu },
  ];

  const getBadgeColor = (status: string) =>
    status === 'available'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'booked'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  // ===== UI =====
  return (
    <div className="flex h-screen bg-gray-50">
      {/* === SIDEBAR === */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-amber-600 to-amber-800 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        <div className="p-6 flex items-center justify-between border-b border-amber-500">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <CreditCard size={32} />
              <div>
                <h1 className="text-xl font-bold">Cashier Panel</h1>
                <p className="text-xs text-amber-200">Transaction Center</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-amber-700 rounded-lg"
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
                    ? 'bg-white text-amber-800 shadow-lg'
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
              >
                <Icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-amber-700 transition-all">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-red-600 transition-all"
          >
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuNav.find((m) => m.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <p className="text-gray-500 mt-1">Kelola transaksi dan meja pelanggan</p>
        </header>

        <div className="p-8">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-amber-100 text-sm">Unpaid Reservations</p>
                <h3 className="text-4xl font-bold mt-2">
                  {reservations.filter((r) => r.status === 'unpaid').length}
                </h3>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-emerald-100 text-sm">Available Tables</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tables.filter((t) => t.status === 'available').length}
                </h3>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-rose-100 text-sm">In Use</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tables.filter((t) => t.status === 'in_used').length}
                </h3>
              </div>
            </div>
          )}

          {/* RESERVATION MANAGEMENT */}
          {activeTab === 'reservation' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-amber-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-amber-600" /> Reservasi Belum Dibayar
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-12 text-gray-500">
                  <Loader2 size={32} className="animate-spin mb-3" />
                  Memuat data...
                </div>
              ) : reservations.length === 0 ? (
                <p className="text-gray-500">Belum ada reservasi.</p>
              ) : (
                <ul className="space-y-4">
                  {reservations
                    .filter((r) => r.status === 'unpaid')
                    .map((r) => (
                      <li
                        key={r.id}
                        className="border rounded-xl p-4 bg-amber-50 hover:bg-amber-100 transition-all flex flex-col md:flex-row justify-between md:items-center gap-2"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{r.customer_name}</p>
                          <p className="text-sm text-gray-500">
                            {r.date} • {r.guests} tamu
                          </p>
                        </div>
                        <button
                          onClick={() => confirmPayment(r.id)}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 transition-all"
                        >
                          <CheckCircle2 size={18} /> Konfirmasi
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* TABLE MANAGEMENT */}
          {activeTab === 'table' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-amber-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Table2 className="text-amber-600" /> Status Meja
              </h2>

              {tables.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  Belum ada data meja.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tables.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 border rounded-xl text-center hover:shadow-lg transition-all"
                    >
                      <p className="font-bold text-gray-800 text-lg mb-2">
                        Meja {t.id}
                      </p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadgeColor(
                          t.status
                        )}`}
                      >
                        {t.status === 'available'
                          ? 'Tersedia'
                          : t.status === 'booked'
                          ? 'Dipesan'
                          : 'Digunakan'}
                      </span>

                      <select
                        value={t.status}
                        onChange={(e) => updateTableStatus(t.id, e.target.value)}
                        className="mt-3 border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="available">Tersedia</option>
                        <option value="booked">Dipesan</option>
                        <option value="in_used">Digunakan</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDER (placeholder) */}
          {activeTab === 'order' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
              <Menu size={48} className="mx-auto mb-4 text-amber-500" />
              <p>🧾 Halaman <b>Order</b> untuk cashier akan ditambahkan nanti.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
