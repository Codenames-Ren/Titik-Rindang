"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Table2,
  BarChart3,
  ClipboardList,
  Menu,
  FileText,
  X,
  LogOut,
  Settings,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// ===== Interface Definitions =====
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
  reservation_date: string;
  table_fee: number;
  status: string;
}

interface Order {
  id: number;
  table_id: number;
  customer: string;
  total_amount: number;
  status: string;
  payment_method?: string;
}

export default function CashierSection() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "menu" | "reservation" | "table" | "order"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // ===== STATE =====
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const [menuRes, tableRes, reservRes, orderRes] = await Promise.all([
        fetch("http://localhost:8080/menu/"),
        fetch("http://localhost:8080/table/"),
        fetch("http://localhost:8080/reservation/", { headers }),
        fetch("http://localhost:8080/order/", { headers }),
      ]);

      const [menuJson, tableJson, reservJson, orderJson] = await Promise.all([
        menuRes.json(),
        tableRes.json(),
        reservRes.json(),
        orderRes.json(),
      ]);

      const menuData = Array.isArray(menuJson) ? menuJson : menuJson.data || [];
      const tableData = Array.isArray(tableJson)
        ? tableJson
        : tableJson.data || [];
      const reservData = Array.isArray(reservJson)
        ? reservJson
        : reservJson.data || [];
      const orderData = Array.isArray(orderJson)
        ? orderJson
        : orderJson.data || [];

      // Menu
      setMenus(
        menuData.map((m: any) => ({
          id: m.ID || m.id,
          name: m.Name || m.name,
          tagline: m.Tagline || m.tagline || "",
          image_url: m.ImageURL || m.image_url,
          price: Number(m.Price || m.price || 0),
        }))
      );

      // Table
      setTables(
        tableData.map((t: any) => ({
          id: t.ID || t.id,
          table_no: t.TableNo || t.table_no,
          status: t.Status || t.status || "available",
        }))
      );

      // Reservation
      setReservations(
        reservData.map((r: any) => ({
          id: r.ID || r.id,
          name: r.Name || r.name,
          phone: r.Phone || r.phone,
          email: r.Email || r.email,
          table_id: r.TableID || r.table_id,
          reservation_date: r.ReservationDate || r.reservation_date,
          table_fee: Number(r.TableFee || r.table_fee || 0),
          status: r.Status || r.status,
        }))
      );

      // Order
      setOrders(
        orderData.map((o: any) => ({
          id: o.ID || o.id,
          table_id: o.TableID || o.table_id,
          customer: o.Customer || o.customer,
          total_amount: Number(o.Total || o.total || 0),
          payment_method: o.PaymentMethod || o.payment_method || "",
          status: o.Status || o.status,
        }))
      );
    } catch (err) {
      console.error("❌ Gagal fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== CONFIRM PAYMENT =====
  const confirmPayment = async (id: number) => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Pembayaran?",
      text: "Apakah kamu yakin ingin mengonfirmasi pembayaran reservasi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, konfirmasi",
      cancelButtonText: "Batal",
    });
    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/reservation/confirm/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal konfirmasi pembayaran");
      await Swal.fire(
        "Berhasil!",
        "Pembayaran telah dikonfirmasi ✅",
        "success"
      );

      fetchAllData();
    } catch (err) {
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat konfirmasi pembayaran ❌",
        "error"
      );
    }
  };

  // ===== UPDATE TABLE STATUS =====
  const updateTableStatus = async (
    id: string | number | undefined,
    newStatus: string
  ) => {
    if (!id) return Swal.fire("Gagal", "ID meja tidak valid ❌", "error");

    try {
      const res = await fetch(`http://localhost:8080/table/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal update meja");
      await Swal.fire(
        "Berhasil!",
        "Status meja telah diperbarui ✅",
        "success"
      );

      setTables((prev) =>
        prev.map((t) =>
          t.id === id || t.ID === id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      Swal.fire("Gagal", "Tidak bisa update status meja ❌", "error");
    }
  };

  // ===== LOGOUT =====
  const handleLogout = async () => {
    localStorage.removeItem("token");
    await Swal.fire("Logout", "Anda telah keluar ✅", "success");

    router.push("/");
  };

  // ===== Sidebar Menu =====
  const menuNav = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "menu", label: "Menu", icon: Menu },
    { id: "reservation", label: "Reservation", icon: ClipboardList },
    { id: "table", label: "Table Management", icon: Table2 },
    { id: "order", label: "Order", icon: FileText },
  ];

  // ===== Helper =====
  const getStatusColor = (status: string) =>
    status === "available"
      ? "bg-emerald-500"
      : status === "booked"
      ? "bg-amber-500"
      : "bg-rose-500";

  const viewReservationDetail = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/reservation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gagal fetch detail reservasi:", res.status, errText);
        Swal.fire(
          "Error",
          `Gagal ambil detail reservasi (${res.status}) ❌`,
          "error"
        );

        return;
      }

      const raw = await res.json();
      console.log("Reservation detail:", raw);

      // ✅ Ambil isi dari raw.data
      const d = raw.data;

      Swal.fire({
        title: "Detail Reservasi",
        html: `
    <div style="text-align:left">
      <b>Nama:</b> ${d.Name ?? "-"} <br/>
      <b>Meja:</b> ${d.Table?.TableNo ?? d.TableID ?? "-"} <br/>
      <b>Tanggal:</b> ${new Date(d.ReservationDate).toLocaleString(
        "id-ID"
      )} <br/>
      <b>Status:</b> ${d.Status ?? "-"}
    </div>
  `,
        icon: "info",
      });
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil detail reservasi ❌", "error");
    }
  };

  // ===== CANCEL RESERVATION =====
  const cancelReservation = async (id: number) => {
    const confirmResult = await Swal.fire({
      title: "Batalkan Reservasi?",
      text: "Reservasi yang dibatalkan tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Batalkan",
      cancelButtonText: "Kembali",
    });
    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/reservation/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal membatalkan reservasi");

      await Swal.fire(
        "Berhasil",
        "Reservasi berhasil dibatalkan ✅",
        "success"
      );

      fetchAllData(); // refresh data
    } catch (err) {
      Swal.fire("Error", "Tidak bisa membatalkan reservasi ❌", "error");
    }
  };

  const viewOrderDetail = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/order/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gagal fetch order detail:", res.status, errText);
        Swal.fire(
          "Gagal",
          `Gagal ambil detail order (${res.status}) ❌`,
          "error"
        );

        return;
      }

      const raw = await res.json();
      console.log("Order detail:", raw);

      // ✅ Ambil isi dari raw.data (karena nested)
      const d = raw.data;

      Swal.fire({
        title: "Detail Order",
        html: `
    <div style="text-align:left">
      <b>Customer:</b> ${d.Customer ?? "-"} <br/>
      <b>Meja:</b> ${d.Table?.TableNo ?? d.TableID ?? "-"} <br/>
      <b>Total:</b> Rp ${(d.Total ?? 0).toLocaleString("id-ID")} <br/>
      <b>Status:</b> ${d.Status ?? "-"}
    </div>
  `,
        icon: "info",
      });
    } catch (err) {
      Swal.fire("Error", "Tidak bisa ambil detail order ❌", "error");
    }
  };

  const printReceipt = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/order/${id}/receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await res.json();
      console.log("🧾 Receipt response:", raw);

      if (!res.ok || raw.status !== "success") {
        Swal.fire("Gagal", "Tidak bisa mencetak struk ❌", "error");

        return;
      }

      // ✅ Ambil path PDF dari backend
      const receiptPath = raw.receipt;
      if (!receiptPath) {
        Swal.fire("Gagal", "File struk tidak ditemukan ❌", "error");

        return;
      }

      // ✅ Buat URL penuh (pastikan bisa diakses)
      const cleanPath = receiptPath.replace(/^src\//, ""); // hapus 'src/' dari path
      const pdfUrl = cleanPath.startsWith("http")
        ? cleanPath
        : `http://localhost:8080/${cleanPath}`;

      console.log("📄 Downloading from:", pdfUrl);

      // ✅ Download file PDF
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `receipt_${id}.pdf`;
      a.target = "_blank"; // buka di tab baru juga
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat mencetak struk ❌", "error");
    }
  };

  // ===== UI =====
  return (
    <div className="flex h-screen bg-gray-50">
      {/* === SIDEBAR === */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-amber-700 to-amber-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-amber-600">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <CreditCard size={28} />
              <div>
                <h1 className="text-lg font-bold">Cashier Panel</h1>
                <p className="text-xs text-amber-200">Transaction Center</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-amber-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {menuNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-white text-amber-800 shadow-lg"
                    : "text-amber-100 hover:bg-amber-800"
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

        <div className="p-4 border-t border-amber-800 space-y-2">
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
            {menuNav.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola transaksi & meja pelanggan
          </p>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-600">
              <Loader2 className="animate-spin mb-3" size={32} />
              Loading data...
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-amber-600 text-white rounded-2xl p-6 shadow-lg">
                    <p>Total Menu</p>
                    <h3 className="text-4xl font-bold">{menus.length}</h3>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                    <p>Available Tables</p>
                    <h3 className="text-4xl font-bold">
                      {tables.filter((t) => t.status === "available").length}
                    </h3>
                  </div>
                  <div className="bg-rose-600 text-white rounded-2xl p-6 shadow-lg">
                    <p>Unpaid Reservations</p>
                    <h3 className="text-4xl font-bold">
                      {reservations.filter((r) => r.status === "unpaid").length}
                    </h3>
                  </div>
                </div>
              )}

              {/* MENU */}
              {activeTab === "menu" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menus.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border"
                    >
                      <img
                        src={
                          m.image_url
                            ? m.image_url.startsWith("http")
                              ? m.image_url
                              : `http://localhost:8080${m.image_url.replace(
                                  /^\/src/,
                                  ""
                                )}`
                            : "/default-placeholder.png"
                        }
                        alt={m.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800">{m.name}</h4>
                        <p className="text-gray-600 text-sm">{m.tagline}</p>
                        <p className="text-amber-700 font-semibold mt-2">
                          Rp {(m.price ?? 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESERVATION */}
              {activeTab === "reservation" && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl text-gray-800 font-bold mb-4">
                    Daftar Reservasi
                  </h3>

                  {reservations.length === 0 ? (
                    <p className="text-gray-600">Belum ada reservasi.</p>
                  ) : (
                    <table className="w-full border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-orange-600 text-left">
                          <th className="p-3 border">ID</th>
                          <th className="p-3 border">Nama</th>
                          <th className="p-3 border">Meja</th>
                          <th className="p-3 border">Tanggal</th>
                          <th className="p-3 border">Status</th>
                          <th className="p-3 border text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((r) => (
                          <tr
                            key={r.id}
                            className="border-t text-gray-700 hover:bg-gray-100"
                          >
                            <td className="p-3 border">{r.id}</td>
                            <td className="p-3 border">{r.name}</td>
                            <td className="p-3 border">{r.table_id}</td>
                            <td className="p-3 border">{r.reservation_date}</td>
                            <td className="p-3 border capitalize">
                              {r.status}
                            </td>
                            <td className="p-3 border text-center space-x-2">
                              <button
                                onClick={() => viewReservationDetail(r.id)}
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                              >
                                Detail
                              </button>

                              {r.status.toLowerCase() === "unpaid" && (
                                <>
                                  <button
                                    onClick={() => confirmPayment(r.id)}
                                    className="px-3 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-sm"
                                  >
                                    Konfirmasi
                                  </button>

                                  <button
                                    onClick={() => cancelReservation(r.id)}
                                    className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TABLE MANAGEMENT */}
              {activeTab === "table" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tables.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white rounded-2xl shadow p-4 border"
                    >
                      <h4 className="font-bold text-gray-700 text-lg mb-2">
                        Meja {t.table_no}
                      </h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full text-white font-semibold ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                      <select
                        value={t.status}
                        onChange={(e) =>
                          updateTableStatus(t.id, e.target.value)
                        }
                        className="mt-3 text-gray-700 border border-gray-300 rounded-lg p-2 w-full"
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="in_used">In Use</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* ORDER */}
              {activeTab === "order" && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Daftar Order
                  </h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-600">Belum ada order.</p>
                  ) : (
                    <table className="w-full border">
                      <thead>
                        <tr className="bg-orange-600 text-left">
                          <th className="p-3 border">ID</th>
                          <th className="p-3 border">Meja</th>
                          <th className="p-3 border">Customer</th>
                          <th className="p-3 border">Total</th>
                          <th className="p-3 border">Status</th>
                          <th className="p-3 border text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr
                            key={o.id}
                            className="border-t text-gray-700 hover:bg-gray-100"
                          >
                            <td className="p-3 border">{o.id}</td>
                            <td className="p-3 border">{o.table_id}</td>
                            <td className="p-3 border">{o.customer}</td>
                            <td className="p-3 border">
                              Rp {(o.total_amount ?? 0).toLocaleString("id-ID")}
                            </td>
                            <td className="p-3 border capitalize">
                              {o.status}
                            </td>
                            <td className="p-3 border text-center space-x-2">
                              <button
                                onClick={() => viewOrderDetail(o.id)}
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => printReceipt(o.id)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                              >
                                Cetak Struk
                              </button>
                            </td>
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
