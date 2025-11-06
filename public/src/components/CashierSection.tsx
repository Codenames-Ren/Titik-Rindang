'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Table2, CheckCircle2, LogOut } from 'lucide-react';

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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);


  // ===== Fetch data reservation & table =====
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8080/reservation', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.error('Error fetch reservation:', err));

    fetch('http://localhost:8080/table', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error('Error fetch table:', err));
  }, [token]);

  // ===== Konfirmasi pembayaran =====
  const confirmPayment = async (id: string) => {
    if (!confirm('Konfirmasi pembayaran untuk reservasi ini?')) return;

    try {
      const res = await fetch(`http://localhost:8080/reservation/confirm/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal konfirmasi pembayaran');
      alert('✅ Pembayaran berhasil dikonfirmasi!');

      // refresh list
      const updated = reservations.map((r: any) =>
        r.id === id ? { ...r, status: 'paid' } : r
      );
      setReservations(updated);
    } catch (err) {
      console.error(err);
      alert('❌ Terjadi kesalahan saat konfirmasi.');
    }
  };

  // ===== Update status meja =====
  const updateTableStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/table/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Gagal update status meja');

      const updated = tables.map((t: any) =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      setTables(updated);
      alert('✅ Status meja berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('❌ Terjadi kesalahan saat update meja.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
          <CreditCard /> Cashier Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <LogOut className="inline mr-2" size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* === Reservation Payment === */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Reservasi Belum Dibayar
          </h2>
          {reservations.length === 0 ? (
            <p className="text-gray-500">Tidak ada reservasi.</p>
          ) : (
            <ul className="space-y-4">
              {reservations
                .filter((r: any) => r.status === 'unpaid')
                .map((r: any) => (
                  <li
                    key={r.id}
                    className="border rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-2"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {r.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {r.date} • {r.guests} tamu
                      </p>
                    </div>
                    <button
                      onClick={() => confirmPayment(r.id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Konfirmasi Pembayaran
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* === Table Management === */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Status Meja
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tables.map((t: any) => (
              <div
                key={t.id}
                className="p-4 border rounded-xl text-center hover:shadow transition"
              >
                <p className="font-bold text-gray-800">Meja {t.id}</p>
                <p
                  className={`text-sm font-medium mb-2 ${
                    t.status === 'available'
                      ? 'text-green-600'
                      : t.status === 'booked'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {t.status}
                </p>

                <select
                  value={t.status}
                  onChange={(e) => updateTableStatus(t.id, e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="available">Tersedia</option>
                  <option value="booked">Dipesan</option>
                  <option value="in_used">Digunakan</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
