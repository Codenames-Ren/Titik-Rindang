'use client';

import React, { useEffect, useRef, useState } from 'react';

type TableStatus = 'occupied' | 'reserved' | 'free';

interface Table {
  id: string;
  label: string;           // deskripsi singkat
  seats: number;
  area: 'Indoor' | 'Outdoor';
  // coords: [x,y,r] for circle OR [x1,y1,x2,y2] for rect. We'll use circle coords here for simplicity (cx,cy,r) in image pixels
  coords: [number, number, number];
}

const IMAGE_SRC = './images/DenahMeja.png'
const STORAGE_KEY = 'table-map-statuses-v1';

const DEFAULT_TABLES: Table[] = [
  // --- Indoor (10 meja)
  // 3 meja x 6 kursi
  { id: 'I6-1', label: 'Meja Indoor (6 kursi) - 1', seats: 6, area: 'Indoor', coords: [180,148,33] },
  { id: 'I6-2', label: 'Meja Indoor (6 kursi) - 2', seats: 6, area: 'Indoor', coords: [180,280,35] },
  { id: 'I6-3', label: 'Meja Indoor (6 kursi) - 3', seats: 6, area: 'Indoor', coords: [180,408,38] },

  // 2 meja x 4 kursi
  { id: 'I4-1', label: 'Meja Indoor (4 kursi) - 1', seats: 4, area: 'Indoor', coords: [523,436,22] },
  { id: 'I4-2', label: 'Meja Indoor (4 kursi) - 2', seats: 4, area: 'Indoor', coords: [660,434,22] },

  // 4 meja x 2 kursi
  { id: 'I2-1', label: 'Meja Indoor (2 kursi) - 1', seats: 2, area: 'Indoor', coords: [811,232,19] },
  { id: 'I2-2', label: 'Meja Indoor (2 kursi) - 2', seats: 2, area: 'Indoor', coords: [811,304,19] },
  { id: 'I2-3', label: 'Meja Indoor (2 kursi) - 3', seats: 2, area: 'Indoor', coords: [811,376,19] },
  { id: 'I2-4', label: 'Meja Indoor (2 kursi) - 4', seats: 2, area: 'Indoor', coords: [809,448,19] },

  // 1 meja x 7 kursi
  { id: 'I7-1', label: 'Meja Indoor (7 kursi)', seats: 7, area: 'Indoor', coords: [810,130,26] },

  // --- Outdoor (4 meja x 4 kursi)
  { id: 'O4-1', label: 'Meja Outdoor (4 kursi) - 1', seats: 4, area: 'Outdoor', coords: [211,561,23] },
  { id: 'O4-2', label: 'Meja Outdoor (4 kursi) - 2', seats: 4, area: 'Outdoor', coords: [500,562,23] },
  { id: 'O4-3', label: 'Meja Outdoor (4 kursi) - 3', seats: 4, area: 'Outdoor', coords: [651,563,23] },
  { id: 'O4-4', label: 'Meja Outdoor (4 kursi) - 4', seats: 4, area: 'Outdoor', coords: [817,561,23] },
];

const statusColor = (s: TableStatus) => {
  switch (s) {
    case 'occupied': return '#f87171'; // merah
    case 'reserved': return '#fbbf24'; // kuning
    case 'free': return '#34d399';     // hijau
    default: return '#9ca3af';
  }
};

const TableMap: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // store statuses keyed by table id
  const [statuses, setStatuses] = useState<Record<string, TableStatus>>({});
  const [selected, setSelected] = useState<Table | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // image natural size (we assume coords are relative to this size)
  const [naturalSize, setNaturalSize] = useState({ w: 920, h: 650 }); // fallback guessed values

  useEffect(() => {
    // load saved statuses from localStorage
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, TableStatus>;
        setStatuses(parsed);
      } catch {
        setStatuses({});
      }
    } else {
      // initialize all to free
      const initial: Record<string, TableStatus> = {};
      DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
      setStatuses(initial);
    }
  }, []);

  useEffect(() => {
    // persist
    if (Object.keys(statuses).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    }
  }, [statuses]);

  useEffect(() => {
    // read image natural size when loaded
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      setNaturalSize({ w: img.naturalWidth || 920, h: img.naturalHeight || 650 });
    };
    if (img.complete) onLoad();
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, []);

  // compute displayed offsets & scale
  const getScale = () => {
    const img = imgRef.current;
    if (!img) return 1;
    return (img.width / naturalSize.w) || 1;
  };

  const tableAtPos = (e: React.MouseEvent) => {
    // get click position inside image (pixels)
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const scale = getScale();

    // check each table (coords are in natural pixels)
    for (const t of DEFAULT_TABLES) {
      const [cx, cy, r] = t.coords;
      const dx = clickX / scale - cx;
      const dy = clickY / scale - cy;
      if (dx * dx + dy * dy <= r * r) {
        // found
        setSelected(t);
        setIsModalOpen(true);
        return;
      }
    }
  };

  const setTableStatus = (tableId: string, status: TableStatus) => {
    setStatuses(prev => {
      const next = { ...prev, [tableId]: status };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setIsModalOpen(false);
  };

  const resetAll = () => {
    const initial: Record<string, TableStatus> = {};
    DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
    setStatuses(initial);
  };

  // grouped counts for legend
  const counts = DEFAULT_TABLES.reduce((acc, t) => {
    acc[t.area] = (acc[t.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Denah & Reservasi Meja</h2>
          <p className="text-gray-600 mt-2">Klik meja pada denah untuk melihat status atau memesan.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: image + overlays */}
          <div className="relative flex-1" ref={containerRef}>
            <img
              ref={imgRef}
              src={IMAGE_SRC}
              alt="Denah Meja"
              className="w-full rounded-2xl border border-gray-200 shadow-sm"
              onClick={tableAtPos}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            />

            {/* overlay markers */}
            {DEFAULT_TABLES.map(t => {
              const [cx, cy, r] = t.coords;
              const scale = getScale();
              const left = cx * scale - r * scale;
              const top = cy * scale - r * scale;
              const size = r * 2 * scale;

              const s = statuses[t.id] || 'free';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(t);
                    setIsModalOpen(true);
                  }}
                  title={`${t.label} — ${t.seats} kursi — ${t.area}`}
                  className="absolute transform -translate-x-0 -translate-y-0"
                  style={{
                    left,
                    top,
                    width: size,
                    height: size,
                    borderRadius: '9999px',
                    border: '3px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                    backgroundColor: statusColor(s),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <span className="text-xs font-semibold text-white drop-shadow-sm select-none">
                    {t.seats}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: controls / legend / list */}
          <div className="w-full lg:w-96 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Legenda & Status</h3>
                <button
                  onClick={resetAll}
                  className="text-sm px-3 py-1 rounded-full text-black bg-gray-100 hover:bg-gray-200 transition"
                >
                  Reset semua
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ width: 14, height: 14, background: statusColor('free'), borderRadius: 6 }} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Meja kosong</div>
                      <div className="text-xs text-gray-500">Hijau</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{Object.values(statuses).filter(s => s === 'free').length}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ width: 14, height: 14, background: statusColor('reserved'), borderRadius: 6 }} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Sudah dipesan</div>
                      <div className="text-xs text-gray-500">Kuning</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{Object.values(statuses).filter(s => s === 'reserved').length}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ width: 14, height: 14, background: statusColor('occupied'), borderRadius: 6 }} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Meja sedang diisi</div>
                      <div className="text-xs text-gray-500">Merah</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{Object.values(statuses).filter(s => s === 'occupied').length}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700">Ringkasan Area</h4>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Indoor</div>
                  <div>{counts['Indoor'] || 0} meja</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <div>Outdoor</div>
                  <div>{counts['Outdoor'] || 0} meja</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700">Daftar Meja</h4>
              <div className="mt-3 max-h-56 overflow-auto">
                {DEFAULT_TABLES.map(t => {
                  const s = statuses[t.id] || 'free';
                  return (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{t.label}</div>
                        <div className="text-xs text-gray-500">{t.seats} kursi — {t.area}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 12, height: 12, background: statusColor(s), borderRadius: 6 }} />
                        <button
                          onClick={() => { setSelected(t); setIsModalOpen(true); }}
                          className="text-xs px-2 py-1 rounded-full bg-green-800 text-white hover:bg-green-900 transition"
                        >
                          Kelola
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              Tip: klik meja di denah atau tombol "Kelola" untuk memesan / mengubah status.
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selected.label}</h3>
                <p className="text-sm text-gray-500">{selected.seats} kursi — {selected.area}</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-700 mb-3">Status saat ini:</div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTableStatus(selected.id, 'free')}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:shadow transition"
                >
                  <div className="text-xs text-gray-600">Kosong</div>
                </button>
                <button
                  onClick={() => setTableStatus(selected.id, 'reserved')}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:shadow transition"
                >
                  <div className="text-xs text-gray-600">Pesan</div>
                </button>
                <button
                  onClick={() => setTableStatus(selected.id, 'occupied')}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:shadow transition"
                >
                  <div className="text-xs text-gray-600">Terisi</div>
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Jika memilih "Pesan", status akan berubah menjadi kuning (reserved). Jika mau simulasikan pelanggan sudah datang, pilih "Terisi".
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl text-black bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-green-800 text-white hover:bg-green-900 transition"
                onClick={() => {
                  // quick reserve
                  setTableStatus(selected.id, 'reserved');
                }}
              >
                Pesan Meja
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TableMap;
