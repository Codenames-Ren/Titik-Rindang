"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Coffee,
  UtensilsCrossed,
  Sparkles,
  ShoppingCart,
  X,
  Check,
  MapPin,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export interface APIMenu {
  id?: number;
  ID?: number;
  name?: string;
  Name?: string;
  price?: number;
  Price?: number;
  tagline?: string;
  Tagline?: string;
  image_url?: string;
  ImageURL?: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: string; // formatted like "25.000"
  description: string;
  image: string;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  category: string;
  menu_id: number;
}

type TableStatus = "free" | "occupied" | "reserved" | "disabled";

interface TableMarker {
  id: string; // front-end marker id like 'I6-1'
  label: string;
  seats: number;
  area: "Indoor" | "Outdoor";
  coords: [number, number, number];
}

interface BackendTable {
  id: number;
  table_no: number; // corresponds to TableNo in backend
  status: string; // available, booked, in_use
}

const IMAGE_SRC = "/images/DenahMeja.png";
const STORAGE_KEY = "table-map-statuses-v1";

const DEFAULT_TABLES: TableMarker[] = [
  {
    id: "I6-1",
    label: "Meja Indoor (6 kursi) - 1",
    seats: 6,
    area: "Indoor",
    coords: [180, 158, 35],
  },
  {
    id: "I6-2",
    label: "Meja Indoor (6 kursi) - 2",
    seats: 6,
    area: "Indoor",
    coords: [180, 295, 35],
  },
  {
    id: "I6-3",
    label: "Meja Indoor (6 kursi) - 3",
    seats: 6,
    area: "Indoor",
    coords: [180, 428, 35],
  },
  {
    id: "I4-1",
    label: "Meja Indoor (4 kursi) - 1",
    seats: 4,
    area: "Indoor",
    coords: [536, 457, 23],
  },
  {
    id: "I4-2",
    label: "Meja Indoor (4 kursi) - 2",
    seats: 4,
    area: "Indoor",
    coords: [680, 455, 23],
  },
  {
    id: "I2-1",
    label: "Meja Indoor (2 kursi) - 1",
    seats: 2,
    area: "Indoor",
    coords: [838, 242, 19],
  },
  {
    id: "I2-2",
    label: "Meja Indoor (2 kursi) - 2",
    seats: 2,
    area: "Indoor",
    coords: [838, 318, 19],
  },
  {
    id: "I2-3",
    label: "Meja Indoor (2 kursi) - 3",
    seats: 2,
    area: "Indoor",
    coords: [838, 393, 19],
  },
  {
    id: "I2-4",
    label: "Meja Indoor (2 kursi) - 4",
    seats: 2,
    area: "Indoor",
    coords: [836, 468, 19],
  },
  {
    id: "I7-1",
    label: "Meja Indoor (7 kursi)",
    seats: 7,
    area: "Indoor",
    coords: [837, 136, 28],
  },
  {
    id: "O4-1",
    label: "Meja Outdoor (4 kursi) - 1",
    seats: 4,
    area: "Outdoor",
    coords: [210, 588, 24],
  },
  {
    id: "O4-2",
    label: "Meja Outdoor (4 kursi) - 2",
    seats: 4,
    area: "Outdoor",
    coords: [511, 590, 24],
  },
  {
    id: "O4-3",
    label: "Meja Outdoor (4 kursi) - 3",
    seats: 4,
    area: "Outdoor",
    coords: [671, 592, 24],
  },
  {
    id: "O4-4",
    label: "Meja Outdoor (4 kursi) - 4",
    seats: 4,
    area: "Outdoor",
    coords: [842, 588, 24],
  },
];

const statusColor = (s: TableStatus) => {
  switch (s) {
    case "occupied":
      return "#f87171";
    case "reserved":
      return "#fbbf24";
    case "free":
      return "#34d399";
    default:
      return "#9ca3af";
  }
};

const MenuSection: React.FC = () => {
  // UI / local states
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showTableSelection, setShowTableSelection] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableMarker | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "E-Wallet" | "">(
    ""
  );
  const [naturalSize, setNaturalSize] = useState({ w: 920, h: 650 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tableStatuses, setTableStatuses] = useState<
    Record<string, TableStatus>
  >({});
  const [backendTables, setBackendTables] = useState<BackendTable[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>("");

  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // categories (UI only)
  const categories: MenuCategory[] = [
    { id: "all", label: "Semua", icon: "☕" },
    { id: "coffee", label: "Kopi", icon: "☕" },
    { id: "food", label: "Makanan", icon: "🍽️" },
    { id: "nonCoffee", label: "Non-Kopi", icon: "🥤" },
  ];

  // ---------- Utility / mapping functions ----------

  // Map backend table.status => front TableStatus
  const mapBackendStatusToFrontend = (status: string): TableStatus => {
    switch (status) {
      case "available":
        return "free";
      case "booked":
        return "reserved";
      case "in_use":
        return "occupied";
      default:
        return "disabled"; // fallback aman
    }
  };

  // Try to match backend table_no to DEFAULT_TABLES by numeric suffix.
  const findMarkerIdForTableNo = (tableNo: number): string | null => {
    const map: Record<number, string> = {
      1: "I6-1",
      2: "I6-2",
      3: "I6-3",
      4: "I4-1",
      5: "I4-2",
      6: "I2-1",
      7: "I2-2",
      8: "I2-3",
      9: "I2-4",
      10: "I7-1",
      11: "O4-1",
      12: "O4-2",
      13: "O4-3",
      14: "O4-4",
    };

    return map[tableNo] ?? null;
  };

  // ---------- Fetch menu & tables ----------

  useEffect(() => {
    // observer for entrance animation
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current as Element);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // load menus
    const loadMenus = async () => {
      setIsLoadingMenu(true);
      try {
        const res = await fetch(`${API_BASE}/menu/`);
        const json = await res.json();

        // backend returns { status, message, data }
        const raw: APIMenu[] = json?.data ?? [];

        const mapped: MenuItem[] = raw.map((m) => {
          const rawPath =
            (m as any).image_url ??
            (m as any).ImageURL ??
            (m as any).image ??
            (m as any).Image ??
            "";

          // 🧹 Bersihkan path supaya gak dobel "/src/uploads/menu/" atau "/uploads/menu/"
          const clean = rawPath
            .replace(/^\/?src\/uploads\/menu\//, "")
            .replace(/^\/?uploads\/menu\//, "")
            .trim();

          // 🔗 Bangun URL final
          const finalImage = clean.includes("/uploads/")
            ? `${API_BASE}/${clean.replace(/^\/+/, "")}`
            : `${API_BASE}/uploads/menu/${clean}`;

          return {
            id: (m as any).id ?? (m as any).ID ?? 0,
            name: (m as any).name ?? (m as any).Name ?? "",
            price: Math.round(
              (m as any).price || (m as any).Price || 0
            ).toLocaleString("id-ID"),
            description: (m as any).tagline ?? (m as any).Tagline ?? "",
            image: finalImage,
          };
        });

        setMenuItems(mapped);
      } catch (e) {
        console.error("failed fetch /menu", e);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    const loadTables = async () => {
      setIsLoadingTables(true);
      try {
        const res = await fetch(`${API_BASE}/table/`);
        const json = await res.json();

        const raw: BackendTable[] = json?.data ?? [];
        setBackendTables(raw);

        if (!Array.isArray(raw) || raw.length === 0) {
          console.warn("⚠️ Tidak ada data meja dari backend.");
          setTableStatuses({});
          return;
        }

        // Default semua meja disabled dulu
        const initial: Record<string, TableStatus> = {};
        DEFAULT_TABLES.forEach(
          (t) => (initial[t.id] = "disabled" as TableStatus)
        );

        for (const tb of raw) {
          const tableNo = (tb as any).table_no ?? (tb as any).TableNo ?? null;
          const status = (tb as any).status ?? (tb as any).Status ?? "unknown";

          if (!tableNo) continue;

          const markerId = findMarkerIdForTableNo(Number(tableNo));
          if (markerId) {
            const mapped = mapBackendStatusToFrontend(status);
            initial[markerId] = mapped;
          }
        }

        setTableStatuses(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } catch (e) {
        console.error("failed fetch /table", e);
      } finally {
        setIsLoadingTables(false);
      }
    };

    loadMenus();
    loadTables();
  }, []);

  // load persisted statuses if available (but prefer backend)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, TableStatus>;
        // only set if we don't have backend data loaded yet
        if (Object.keys(tableStatuses).length === 0) setTableStatuses(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Image natural size handling ----------
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      setNaturalSize({
        w: img.naturalWidth || 920,
        h: img.naturalHeight || 650,
      });
      setImageLoaded(true);
    };
    if (img.complete) onLoad();
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [showTableSelection]);

  useEffect(() => {
    if (!showTableSelection) return;
    const handleResize = () => {
      setImageLoaded(false);
      setTimeout(() => setImageLoaded(true), 50);
    };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener("resize", handleResize);
  }, [showTableSelection]);

  // ---------- Cart handlers ----------
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menu_id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { ...item, menu_id: item.id, quantity: 1, category: "all" },
      ];
    });
  };

  const removeFromCart = (menuId: number) => {
    setCart((prev) => prev.filter((i) => i.menu_id !== menuId));
  };

  const updateQuantity = (menuId: number, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((i) => {
            if (i.menu_id === menuId) {
              const newQty = Math.max(0, i.quantity + delta);
              return newQty === 0 ? null : { ...i, quantity: newQty };
            }
            return i;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const priceInt = parseInt(String(item.price).replace(/\./g, ""), 10) || 0;
      return sum + priceInt * item.quantity;
    }, 0);
  };

  const getTotalItems = () => cart.reduce((s, it) => s + it.quantity, 0);

  // ---------- Denah helpers ----------
  const getScale = () => {
    const img = imgRef.current;
    if (!img || !naturalSize.w) return 1;
    const rect = img.getBoundingClientRect();
    return rect.width / naturalSize.w;
  };

  // map click to marker selection (keeps original coordinate logic)
  const tableAtPos = (e: React.MouseEvent) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const scale = getScale();

    for (const t of DEFAULT_TABLES) {
      const [cx, cy, r] = t.coords;
      const dx = clickX / scale - cx;
      const dy = clickY / scale - cy;
      if (dx * dx + dy * dy <= r * r) {
        const s = tableStatuses[t.id] || "free";
        if (s === "free") {
          setSelectedTable(t);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Meja Tidak Tersedia",
            text:
              s === "occupied"
                ? "Meja ini sedang terisi. Silakan pilih meja lain."
                : "Meja ini sudah dipesan. Silakan pilih meja lain.",
            confirmButtonColor: "#166534",
          });
        }
        return;
      }
    }
  };

  // ---------- Booking / Order flow ----------
  const proceedToTableSelection = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Keranjang Kosong",
        text: "Silakan pilih menu terlebih dahulu.",
        confirmButtonColor: "#166534",
      });

      return;
    }
    setShowCart(false);
    setShowTableSelection(true);
  };

  // when user finalizes table & customer name -> open payment modal
  const openPaymentModal = () => {
    if (!selectedTable) {
      Swal.fire({
        icon: "warning",
        title: "Belum Memilih Meja",
        text: "Silakan pilih meja terlebih dahulu sebelum melanjutkan.",
        confirmButtonColor: "#166534",
      });

      return;
    }
    if (!customerName || customerName.trim().length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Nama Belum Diisi",
        text: "Mohon isi nama customer terlebih dahulu.",
        confirmButtonColor: "#166534",
      });

      return;
    }
    setShowPaymentModal(true);
  };

  // POST /order
  const handleCreateOrder = async () => {
    if (!selectedTable) {
      alert("Pilih meja dulu");
      return;
    }
    // find backend table id for selectedTable (by comparing suffix -> table_no)
    const suffixParts = selectedTable.id.split("-");
    const suffixStr = suffixParts[suffixParts.length - 1];
    const maybeTableNo = parseInt(suffixStr, 10);

    // find backend table entry
    let backendTableId: number | null = null;
    if (!isNaN(maybeTableNo)) {
      const backendMatch = backendTables.find((b) => {
        const backendNo = (b as any).table_no ?? (b as any).TableNo;
        return backendNo === maybeTableNo;
      });

      if (backendMatch) {
        backendTableId =
          (backendMatch as any).id ?? (backendMatch as any).ID ?? null;
      }
    }
    // if not found, fallback: try to find any backend table with same status? (we won't; better require backend table)
    if (backendTableId === null) {
      // best-effort: find a backend table that is 'available' and hasn't been mapped yet
      const availableCandidate = backendTables.find(
        (b) => b.status === "available"
      );
      if (availableCandidate) backendTableId = availableCandidate.id;
    }
    if (backendTableId === null) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menemukan Meja",
        text: "ID meja di server tidak ditemukan. Pastikan data meja di backend sudah sinkron.",
        confirmButtonColor: "#166534",
      });

      return;
    }

    // build items payload
    const itemsPayload = cart.map((i) => ({
      menu_id: i.menu_id,
      qty: i.quantity,
    }));

    try {
      const res = await fetch(`${API_BASE}/order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id: backendTableId,
          customer: customerName,
          items: itemsPayload,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        throw new Error(j?.message || j?.data || JSON.stringify(j));
      }
      const created = j?.data;
      setCurrentOrderId(created?.id ?? created?.ID ?? null);

      // After creating order, show confirmation modal that includes "Konfirmasi Pembayaran" button
      setShowPaymentModal(false);
      setShowTableSelection(false);
      setShowConfirmation(true);

      // update local tableStatuses: set selected marker -> occupied (in_use)
      const newStatuses = {
        ...tableStatuses,
        [selectedTable.id]: "occupied" as TableStatus,
      };
      setTableStatuses(newStatuses);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
      } catch {}

      // keep confirmation open and then clear cart after a while? we'll keep until user clicks confirm payment
    } catch (err: any) {
      console.error("create order failed", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Pesanan",
        text: err.message || "Terjadi kesalahan saat membuat pesanan.",
        confirmButtonColor: "#166534",
      });
    }
  };

  // PUT /order/:id/confirm with { payment_method }
  const handleConfirmPayment = async () => {
    if (!currentOrderId) {
      Swal.fire({
        icon: "error",
        title: "Tidak Ada Pesanan",
        text: "Tidak ada pesanan yang bisa dikonfirmasi.",
        confirmButtonColor: "#166534",
      });

      return;
    }
    if (!paymentMethod) {
      Swal.fire({
        icon: "warning",
        title: "Metode Pembayaran Belum Dipilih",
        text: "Silakan pilih metode pembayaran terlebih dahulu.",
        confirmButtonColor: "#166534",
      });

      return;
    }
    try {
      const res = await fetch(`${API_BASE}/order/${currentOrderId}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.message || JSON.stringify(j));
      // success -> close modals, clear cart, clear current order
      setShowConfirmation(false);
      setCurrentOrderId(null);
      setCart([]);
      setSelectedTable(null);
      setPaymentMethod("");
      Swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil",
        text: "Pesanan telah dibayar. Terima kasih!",
        confirmButtonColor: "#166534",
      });

      // Optionally re-fetch tables from backend to get true statuses
      await refreshTablesFromBackend();
    } catch (err: any) {
      console.error("confirm payment failed", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Konfirmasi Pembayaran",
        text: err.message || "Terjadi kesalahan saat konfirmasi pembayaran.",
        confirmButtonColor: "#166534",
      });
    }
  };

  // Delete / cancel order (not used in normal flow but keep helper)
  const handleCancelOrder = async (orderId: number) => {
    try {
      const res = await fetch(`${API_BASE}/order/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("delete failed");
      // on cancel, refresh tables
      await refreshTablesFromBackend();
    } catch (e) {
      console.error(e);
    }
  };

  const refreshTablesFromBackend = async () => {
    try {
      const res = await fetch(`${API_BASE}/table/`);
      const json = await res.json();
      const raw: BackendTable[] = json?.data ?? [];
      setBackendTables(raw);
      const initial: Record<string, TableStatus> = {};
      DEFAULT_TABLES.forEach((t) => (initial[t.id] = "free"));
      for (const tb of raw) {
        const mapped = mapBackendStatusToFrontend(tb.status);
        const markerId = findMarkerIdForTableNo(tb.table_no);
        if (markerId) initial[markerId] = mapped;
      }
      setTableStatuses(initial);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } catch {}
    } catch (e) {
      console.error("refresh tables failed", e);
    }
  };

  // ---------- derived values ----------
  const availableTables = DEFAULT_TABLES.filter(
    (t) => tableStatuses[t.id] === "free"
  );

  // ---------- render ----------
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24"
    >
      <style>{`
        /* small inline animations kept from original */
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bounceIn { 0% { transform: scale(0) } 50% { transform: scale(1.1) } 100% { transform: scale(1) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out }
        .animate-bounceIn { animation: bounceIn 0.6s ease-out }
        .animate-slideUp { animation: slideUp 0.6s ease-out }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-12">
          <div
            className={`inline-block mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <br />
            <br />
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Menu Kami
            </span>
          </div>
          <h2
            className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Hidangan & Minuman Pilihan
          </h2>
          <p
            className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Nikmati berbagai pilihan menu — pilih, pesan, dan nikmati di tempat.
          </p>
        </div>

        {/* category tabs */}
        <div
          className={`flex justify-center gap-4 mb-12 flex-wrap transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold inline-flex items-center space-x-2 ${
                activeCategory === cat.id
                  ? "bg-green-800 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* menu grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoadingMenu ? (
            <div className="col-span-full text-center py-10">
              Loading menu...
            </div>
          ) : menuItems.length === 0 ? (
            <div className="col-span-full text-center py-10">
              Tidak ada menu.
            </div>
          ) : (
            menuItems.map((item, idx) => (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + idx * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-green-800">
                        Rp {item.price}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* bottom hero */}
        <div
          className={`mt-4 bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 group">
              <Coffee className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">
                100% Organik
              </div>
              <div className="text-gray-600">Bahan berkualitas premium</div>
            </div>
            <div className="space-y-3 group">
              <UtensilsCrossed className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">
                Fresh Daily
              </div>
              <div className="text-gray-600">Dibuat segar setiap hari</div>
            </div>
            <div className="space-y-3 group">
              <Sparkles className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">50+ Menu</div>
              <div className="text-gray-600">Pilihan beragam untuk Anda</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-7 right-7 bg-green-800 text-white p-4 rounded-full shadow-2xl hover:bg-green-900 transition-all duration-300 hover:scale-110 z-40"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowCart(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl z-10 animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Keranjang Pesanan
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {cart.map((item) => (
                <div
                  key={item.menu_id}
                  className="flex items-center gap-4 py-4 border-b text-black border-gray-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Rp {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.menu_id, -1)}
                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menu_id, 1)}
                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.menu_id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-green-800">
                  Rp {getTotalPrice().toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={proceedToTableSelection}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Pilih Meja & Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Selection Modal */}
      {showTableSelection && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
              onClick={() => setShowTableSelection(false)}
            />
            <div className="relative bg-white rounded-2xl max-w-6xl w-full shadow-2xl z-10 max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="sticky top-0 bg-gradient-to-r from-green-800 to-green-700 text-white p-6 flex items-center justify-between z-20 shadow-lg">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6" /> Pilih Meja Anda
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    Klik meja yang tersedia (hijau) pada denah
                  </p>
                </div>
                <button
                  onClick={() => setShowTableSelection(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Map */}
                  <div className="lg:col-span-2" ref={containerRef}>
                    <div className="relative">
                      <img
                        ref={imgRef}
                        src={IMAGE_SRC}
                        alt="Denah Meja"
                        className="w-full rounded-xl border-2 border-gray-200 shadow-md"
                        onClick={tableAtPos}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          display: "block",
                        }}
                      />

                      {/* Markers */}
                      {imageLoaded &&
                        DEFAULT_TABLES.map((t) => {
                          const [cx, cy, r] = t.coords;
                          const scale = getScale();
                          const left = cx * scale;
                          const top = cy * scale;
                          const size = r * 2 * scale;
                          const s = tableStatuses[t.id] || "free";
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if ((tableStatuses[t.id] || "free") === "free")
                                  setSelectedTable(t);
                                else
                                  Swal.fire({
                                    icon: "error",
                                    title: "Tidak Bisa Dipilih",
                                    text:
                                      s === "occupied"
                                        ? "Meja ini sedang terisi."
                                        : "Meja ini sudah dipesan.",
                                    confirmButtonColor: "#166534",
                                  });
                              }}
                              title={`${t.label} – ${t.seats} kursi – ${t.area}`}
                              className="absolute transition-all duration-300 hover:scale-110"
                              style={{
                                left: `${left}px`,
                                top: `${top}px`,
                                width: `${size}px`,
                                height: `${size}px`,
                                transform: "translate(-50%, -50%)",
                                borderRadius: "9999px",
                                border:
                                  selectedTable?.id === t.id
                                    ? "4px solid #166534"
                                    : "3px solid rgba(255,255,255,0.9)",
                                boxShadow:
                                  selectedTable?.id === t.id
                                    ? "0 0 0 4px rgba(22, 101, 52, 0.3), 0 8px 24px rgba(0,0,0,0.2)"
                                    : "0 6px 18px rgba(0,0,0,0.12)",
                                backgroundColor: statusColor(s),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                cursor:
                                  s === "free" ? "pointer" : "not-allowed",
                                opacity: s === "free" ? 1 : 0.6,
                              }}
                            >
                              <span className="text-xs font-semibold text-white drop-shadow-sm select-none">
                                {t.seats}
                              </span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-green-800" /> Legenda
                        Status Meja
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              background: statusColor("free"),
                              borderRadius: 8,
                            }}
                          />
                          <div>
                            <div className="text-xs font-medium">Tersedia</div>
                            <div className="text-xs text-gray-500">
                              {
                                Object.values(tableStatuses).filter(
                                  (s) => s === "free"
                                ).length
                              }{" "}
                              meja
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              background: statusColor("reserved"),
                              borderRadius: 8,
                            }}
                          />
                          <div>
                            <div className="text-xs font-medium">Dipesan</div>
                            <div className="text-xs text-gray-500">
                              {
                                Object.values(tableStatuses).filter(
                                  (s) => s === "reserved"
                                ).length
                              }{" "}
                              meja
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              background: statusColor("occupied"),
                              borderRadius: 8,
                            }}
                          />
                          <div>
                            <div className="text-xs font-medium">Terisi</div>
                            <div className="text-xs text-gray-500">
                              {
                                Object.values(tableStatuses).filter(
                                  (s) => s === "occupied"
                                ).length
                              }{" "}
                              meja
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="space-y-4">
                    {/* Selected Table */}
                    {selectedTable ? (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-600 rounded-xl p-4 shadow-lg animate-bounceIn">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-800 p-2 rounded-lg">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold text-green-900">
                              Meja Dipilih
                            </h4>
                          </div>
                          <Check className="w-6 h-6 text-green-800 bg-white rounded-full p-1" />
                        </div>
                        <div className="space-y-2 bg-white/80 rounded-lg p-3">
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold text-green-900">
                              {selectedTable.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-green-700" />
                              <span className="font-medium">
                                {selectedTable.seats} kursi
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-green-700" />
                              <span className="font-medium">
                                {selectedTable.area}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          Belum ada meja dipilih
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Klik meja hijau pada denah
                        </p>
                      </div>
                    )}

                    {/* Customer name input */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Isi Data Customer
                      </h4>
                      <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full p-3 text-gray-700 rounded-lg border border-gray-200"
                      />
                    </div>

                    {/* Order summary */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Ringkasan Pesanan
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cart.map((item) => (
                          <div
                            key={item.menu_id}
                            className="flex justify-between text-sm py-2 border-b border-gray-100"
                          >
                            <span className="text-gray-600">
                              {item.name}{" "}
                              <span className="text-gray-400">
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="font-medium text-gray-900">
                              Rp{" "}
                              {(
                                parseInt(
                                  String(item.price).replace(/\./g, ""),
                                  10
                                ) * item.quantity
                              ).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-2 border-green-200 mt-3 pt-3 bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            Total Pembayaran
                          </span>
                          <span className="text-xl font-bold text-green-800">
                            Rp {getTotalPrice().toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Available list */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-800" /> Meja
                          Tersedia
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                          {availableTables.length}
                        </span>
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableTables.length > 0 ? (
                          availableTables.map((table) => (
                            <button
                              key={table.id}
                              onClick={() => setSelectedTable(table)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                selectedTable?.id === table.id
                                  ? "border-green-800 bg-green-50 shadow-md"
                                  : "border-gray-200 hover:border-green-400 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {table.label}
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <span>{table.seats} kursi</span>
                                    <span>•</span>
                                    <span>{table.area}</span>
                                  </div>
                                </div>
                                {selectedTable?.id === table.id && (
                                  <Check className="w-5 h-5 text-green-800 bg-green-100 rounded-full p-1" />
                                )}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            Tidak ada meja tersedia
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={openPaymentModal}
                        disabled={!selectedTable || cart.length === 0}
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-200 ${
                          selectedTable && cart.length > 0
                            ? "bg-gradient-to-r from-green-800 to-green-700 text-white hover:from-green-900 hover:to-green-800 hover:shadow-lg hover:scale-[1.02]"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Lanjut Pembayaran
                      </button>

                      <button
                        onClick={() => {
                          setShowTableSelection(false);
                          setShowCart(true);
                        }}
                        className="w-full py-3 rounded-xl bg-red-500 text-white border border-gray-200 hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                      >
                        Kembali ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10 animate-slideUp">
            <h3 className="text-lg font-bold mb-3 text-black">
              Pilih Metode Pembayaran
            </h3>
            <div className="space-y-3">
              <label
                className={`w-full p-3 border rounded-lg flex items-center text-black justify-between cursor-pointer ${
                  paymentMethod === "Cash" ? "border-green-700 bg-green-50" : ""
                }`}
              >
                <div>
                  <div className="font-semibold text-black">Cash</div>
                  <div className="text-xs text-gray-500">
                    Bayar tunai di kasir
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Cash"}
                  onChange={() => setPaymentMethod("Cash")}
                />
              </label>
              <label
                className={`w-full p-3 border rounded-lg flex items-center justify-between cursor-pointer text-black ${
                  paymentMethod === "E-Wallet"
                    ? "border-green-700 bg-green-50"
                    : ""
                }`}
              >
                <div>
                  <div className="font-semibold">E-Wallet</div>
                  <div className="text-xs text-gray-500">
                    Transfer/scan QR (dummy)
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "E-Wallet"}
                  onChange={() => setPaymentMethod("E-Wallet")}
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-xl bg-red-700 text-white border border-gray-300 hover:bg-red-800"
              >
                Batal
              </button>
              <button
                onClick={handleCreateOrder}
                className="flex-1 py-3 rounded-xl bg-green-800 text-white border-gray-300 hover:bg-green-900"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal (after create order) */}
      {showConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10 animate-slideUp text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Pesanan Dibuat
            </h3>
            <p className="text-gray-600 mb-4">
              Pesanan Anda sudah tersimpan. Silakan lakukan pembayaran sesuai
              metode pembayaran yang anda pilih. Terima kasih sudah memesan.
            </p>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Total</strong>
              </div>
              <div className="text-2xl font-bold text-green-800">
                Rp {getTotalPrice().toLocaleString("id-ID")}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentOrderId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-800 border border-gray-200"
              >
                Tutup
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 rounded-xl bg-green-800 hover:bg-green-900 text-white"
              >
                Konfirmasi dan Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
