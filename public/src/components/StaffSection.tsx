'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Table2, LogOut } from 'lucide-react';

export default function StaffSection() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  // ===== Ambil Data Reservation & Table =====
  useEffect(() => {
    if (!token) return;

    // Ambil reservasi (GET /reservation)
    fetch('http://localhost:8080/reservation', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.error(err));

    // Ambil tabel (GET /table)
    fetch('http://localhost:8080/table', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
          <ClipboardList /> Staff Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <LogOut className="inline mr-2" size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* === Reservation Data === */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Reservasi</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-500">Belum ada data reservasi.</p>
          ) : (
            <ul className="space-y-3">
              {reservations.map((r: any) => (
                <li
                  key={r.id}
                  className="p-4 border rounded-xl hover:bg-gray-50 transition"
                >
                  <p className="font-semibold text-gray-800">{r.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {r.date} • {r.guests} tamu
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      r.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    Status: {r.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* === Table Data === */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Meja</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tables.map((t: any) => (
              <div
                key={t.id}
                className="p-4 border rounded-xl text-center hover:shadow transition"
              >
                <p className="font-bold text-gray-800">Meja {t.id}</p>
                <p
                  className={`text-sm font-medium ${
                    t.status === 'available'
                      ? 'text-green-600'
                      : t.status === 'booked'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {t.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
