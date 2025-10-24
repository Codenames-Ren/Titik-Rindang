'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, CreditCard, CheckCircle, Coffee, MapPin, X, Check, Sparkles } from 'lucide-react';

type TableStatus = 'occupied' | 'reserved' | 'free';

interface Table {
  id: string;
  label: string;
  seats: number;
  area: 'Indoor' | 'Outdoor';
  coords: [number, number, number];
}

const IMAGE_SRC = './images/DenahMeja.png';
const BARCODE_IMAGE = './images/barcode-payment.png';
const STORAGE_KEY = 'table-map-statuses-v1';
const RESERVATION_FEE = 20000;

const DEFAULT_TABLES: Table[] = [
  { id: 'I6-1', label: 'Meja Indoor (6 kursi) - 1', seats: 6, area: 'Indoor', coords: [180,158,35] },
  { id: 'I6-2', label: 'Meja Indoor (6 kursi) - 2', seats: 6, area: 'Indoor', coords: [180,295,35] },
  { id: 'I6-3', label: 'Meja Indoor (6 kursi) - 3', seats: 6, area: 'Indoor', coords: [180,428,35] },
  { id: 'I4-1', label: 'Meja Indoor (4 kursi) - 1', seats: 4, area: 'Indoor', coords: [536,457,23] },
  { id: 'I4-2', label: 'Meja Indoor (4 kursi) - 2', seats: 4, area: 'Indoor', coords: [680,455,23] },
  { id: 'I2-1', label: 'Meja Indoor (2 kursi) - 1', seats: 2, area: 'Indoor', coords: [838,242,19] },
  { id: 'I2-2', label: 'Meja Indoor (2 kursi) - 2', seats: 2, area: 'Indoor', coords: [838,318,19] },
  { id: 'I2-3', label: 'Meja Indoor (2 kursi) - 3', seats: 2, area: 'Indoor', coords: [838,393,19] },
  { id: 'I2-4', label: 'Meja Indoor (2 kursi) - 4', seats: 2, area: 'Indoor', coords: [836,468,19] },
  { id: 'I7-1', label: 'Meja Indoor (7 kursi)', seats: 7, area: 'Indoor', coords: [837,136,28] },
  { id: 'O4-1', label: 'Meja Outdoor (4 kursi) - 1', seats: 4, area: 'Outdoor', coords: [210,588,24] },
  { id: 'O4-2', label: 'Meja Outdoor (4 kursi) - 2', seats: 4, area: 'Outdoor', coords: [511,590,24] },
  { id: 'O4-3', label: 'Meja Outdoor (4 kursi) - 3', seats: 4, area: 'Outdoor', coords: [671,592,24] },
  { id: 'O4-4', label: 'Meja Outdoor (4 kursi) - 4', seats: 4, area: 'Outdoor', coords: [842,588,24] },
];

const statusColor = (s: TableStatus) => {
  switch (s) {
    case 'occupied': return '#f87171';
    case 'reserved': return '#fbbf24';
    case 'free': return '#34d399';
    default: return '#9ca3af';
  }
};

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [statuses, setStatuses] = useState<Record<string, TableStatus>>({});
  const [showTableMap, setShowTableMap] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 920, h: 650 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Generate available time slots based on current time
  const getAvailableTimeSlots = () => {
    const slots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00', 
      '18:00', '19:00', '20:00'
    ];

    // If selected date is today, filter out past time slots
    if (formData.date === new Date().toISOString().split('T')[0]) {
      const currentHour = currentDateTime.getHours();
      const currentMinute = currentDateTime.getMinutes();
      
      return slots.filter(slot => {
        const [slotHour] = slot.split(':').map(Number);
        // Only show slots that are at least 1 hour in the future
        return slotHour > currentHour || (slotHour === currentHour && currentMinute < 30);
      });
    }

    return slots;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Load table statuses from localStorage
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, TableStatus>;
        setStatuses(parsed);
      } catch {
        const initial: Record<string, TableStatus> = {};
        DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
        setStatuses(initial);
      }
    } else {
      const initial: Record<string, TableStatus> = {};
      DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
      setStatuses(initial);
    }
  }, []);

  // Image loading handler with resize support
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    const onLoad = () => {
      setNaturalSize({ w: img.naturalWidth || 920, h: img.naturalHeight || 650 });
      setImageLoaded(true);
    };
    
    if (img.complete) {
      onLoad();
    }
    
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [showTableMap]);

  // Handle window resize for responsive table markers
  useEffect(() => {
    if (!showTableMap) return;
    
    const handleResize = () => {
      // Force re-render of table positions
      setImageLoaded(false);
      setTimeout(() => setImageLoaded(true), 50);
    };
    
    window.addEventListener('resize', handleResize);
    // Initial calculation
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [showTableMap]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If date changes, reset time if it's no longer valid
    if (name === 'date' && formData.time) {
      const availableSlots = getAvailableTimeSlots();
      if (value === new Date().toISOString().split('T')[0]) {
        const [selectedHour] = formData.time.split(':').map(Number);
        const currentHour = currentDateTime.getHours();
        if (selectedHour <= currentHour) {
          setFormData(prev => ({ ...prev, [name]: value, time: '' }));
          return;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (formData.name && formData.email && formData.phone) {
        setCurrentStep(2);
      } else {
        alert('Mohon lengkapi semua data diri');
      }
    } else if (currentStep === 2) {
      if (formData.date && formData.time && formData.guests) {
        setShowTableMap(true);
      } else {
        alert('Mohon pilih tanggal, waktu, dan jumlah tamu');
      }
    }
  };

  const getScale = () => {
    const img = imgRef.current;
    if (!img || !naturalSize.w) return 1;
    const rect = img.getBoundingClientRect();
    return rect.width / naturalSize.w;
  };

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
        if (statuses[t.id] === 'free') {
          setSelectedTable(t);
        } else {
          alert(`Meja ini ${statuses[t.id] === 'occupied' ? 'sedang terisi' : 'sudah dipesan'}. Silakan pilih meja lain.`);
        }
        return;
      }
    }
  };

  const confirmTableSelection = () => {
    if (!selectedTable) {
      alert('Silakan pilih meja terlebih dahulu');
      return;
    }
    setShowTableMap(false);
    setCurrentStep(3);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedTable) return;

    const newStatuses = { ...statuses, [selectedTable.id]: 'reserved' as TableStatus };
    setStatuses(newStatuses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));

    setPaymentConfirmed(true);
    setShowPaymentModal(false);
    
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  const resetReservation = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setSelectedTable(null);
    setPaymentConfirmed(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
    });
  };

  const availableTables = DEFAULT_TABLES.filter(t => statuses[t.id] === 'free');
  const availableTimeSlots = getAvailableTimeSlots();

  if (isSubmitted) {
    return (
      <section className="bg-gradient-to-br from-green-50 to-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Reservasi Berhasil!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Terima kasih {formData.name}! Reservasi Anda telah dikonfirmasi dan pembayaran telah diterima.
            </p>
            
            <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Detail Reservasi:</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-semibold text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-semibold text-gray-900">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu:</span>
                  <span className="font-semibold text-gray-900">{formData.time} WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Tamu:</span>
                  <span className="font-semibold text-gray-900">{formData.guests} orang</span>
                </div>
                {selectedTable && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meja:</span>
                    <span className="font-semibold text-gray-900">{selectedTable.label}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-green-200 pt-3 mt-3">
                  <span className="text-gray-900 font-bold">Biaya Reservasi:</span>
                  <span className="font-bold text-green-700">Rp {RESERVATION_FEE.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 mb-6">
              Konfirmasi reservasi telah dikirim ke email Anda. Kami tunggu kedatangan Anda!
            </p>

            <button
              onClick={resetReservation}
              className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Buat Reservasi Baru
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-green-50 to-white py-16 lg:py-24">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-block mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <br /><br />
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full inline-flex items-center gap-2">
              {/* <Sparkles className="w-4 h-4" /> */}
              Reservasi Meja
            </span>
          </div>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Pesan Tempat Anda
          </h2>
          <p className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Reservasi meja dengan biaya Rp 20.000 untuk memastikan tempat Anda tersedia
          </p>
        </div>

        {/* Progress Steps */}
        <div className={`max-w-3xl mx-auto mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-green-800 text-white scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-3 font-semibold transition-all duration-300 ${
                    currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Data Diri' : step === 2 ? 'Pilih Meja' : 'Pembayaran'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step ? 'bg-green-800' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className={`max-w-3xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            
            {/* Step 1: Data Diri */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slideUp">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Pribadi</h3>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-green-800 text-white py-4 rounded-xl font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Lanjut ke Pemilihan Jadwal & Meja
                </button>
              </div>
            )}

            {/* Step 2: Pilih Waktu & Meja */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slideUp">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Pilih Jadwal Reservasi</h3>
                
                <div>
                  <label className="text-gray-700 font-semibold mb-2 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-800" />
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hanya dapat memilih tanggal hari ini atau masa depan</p>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-800" />
                    Waktu *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={!formData.date}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors ${
                      formData.time ? 'text-gray-900' : 'text-gray-400'
                    } ${!formData.date ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Pilih waktu</option>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot} className="text-gray-900">
                          {slot} WIB
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Tidak ada slot tersedia untuk hari ini</option>
                    )}
                  </select>
                  {formData.date && availableTimeSlots.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Semua slot waktu untuk hari ini sudah terlewat. Pilih tanggal lain.</p>
                  )}
                  {!formData.date && (
                    <p className="text-xs text-gray-500 mt-1">Pilih tanggal terlebih dahulu</p>
                  )}
                </div>

                <div>
                  <label className="text-gray-700 font-semibold mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-800" />
                    Jumlah Tamu *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors text-gray-900"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Orang
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!formData.date || !formData.time || availableTimeSlots.length === 0}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      formData.date && formData.time && availableTimeSlots.length > 0
                        ? 'bg-green-800 text-white hover:bg-green-900 hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Pilih Meja
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pembayaran */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slideUp">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-7 h-7 mr-3 text-green-800" />
                  Konfirmasi & Pembayaran
                </h3>

                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Ringkasan Reservasi</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-semibold text-gray-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal & Waktu:</span>
                      <span className="font-semibold text-gray-900">{formData.date} - {formData.time} WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah Tamu:</span>
                      <span className="font-semibold text-gray-900">{formData.guests} orang</span>
                    </div>
                    {selectedTable && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meja:</span>
                        <span className="font-semibold text-gray-900">{selectedTable.label}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-green-200 pt-3 mt-3 flex justify-between">
                      <span className="text-gray-900 font-bold text-lg">Biaya Reservasi:</span>
                      <span className="font-bold text-green-700 text-xl">Rp {RESERVATION_FEE.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Coffee className="w-5 h-5 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">Kebijakan Reservasi</p>
                      <p className="text-sm text-yellow-800">
                        Biaya reservasi sebesar Rp 20.000 diperlukan untuk mengkonfirmasi tempat Anda. 
                        Pembayaran tidak dapat dikembalikan jika dibatalkan kurang dari 24 jam sebelum jadwal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      setShowTableMap(true);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Ubah Meja
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-green-800 text-white py-4 rounded-xl font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Bayar Sekarang
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Table Map Modal */}
      {showTableMap && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setShowTableMap(false)} />
            <div className="relative bg-white rounded-2xl max-w-6xl w-full shadow-2xl z-10 max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="sticky top-0 bg-gradient-to-r from-green-800 to-green-700 text-white p-6 flex items-center justify-between z-20 shadow-lg">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Pilih Meja Anda
                  </h3>
                  <p className="text-green-100 text-sm mt-1">Klik meja yang tersedia (hijau) pada denah</p>
                </div>
                <button 
                  onClick={() => setShowTableMap(false)} 
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Map Section */}
                  <div className="lg:col-span-2" ref={containerRef}>
                    <div className="relative">
                      <img
                        ref={imgRef}
                        src={IMAGE_SRC}
                        alt="Denah Meja"
                        className="w-full rounded-xl border-2 border-gray-200 shadow-md"
                        onClick={tableAtPos}
                        style={{ cursor: 'pointer', userSelect: 'none', display: 'block' }}
                      />

                      {/* Table Markers - Responsive */}
                      {imageLoaded && DEFAULT_TABLES.map(t => {
                        const [cx, cy, r] = t.coords;
                        const scale = getScale();
                        const left = cx * scale;
                        const top = cy * scale;
                        const size = r * 2 * scale;
                        const s = statuses[t.id] || 'free';
                        
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (s === 'free') {
                                setSelectedTable(t);
                              } else {
                                alert(`Meja ini ${s === 'occupied' ? 'sedang terisi' : 'sudah dipesan'}. Silakan pilih meja lain.`);
                              }
                            }}
                            title={`${t.label} – ${t.seats} kursi – ${t.area}`}
                            className="absolute transition-all duration-300 hover:scale-110"
                            style={{
                              left: `${left}px`,
                              top: `${top}px`,
                              width: `${size}px`,
                              height: `${size}px`,
                              transform: 'translate(-50%, -50%)',
                              borderRadius: '9999px',
                              border: selectedTable?.id === t.id ? '4px solid #166534' : '3px solid rgba(255,255,255,0.9)',
                              boxShadow: selectedTable?.id === t.id ? '0 0 0 4px rgba(22, 101, 52, 0.3), 0 8px 24px rgba(0,0,0,0.2)' : '0 6px 18px rgba(0,0,0,0.12)',
                              backgroundColor: statusColor(s),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                              cursor: s === 'free' ? 'pointer' : 'not-allowed',
                              opacity: s === 'free' ? 1 : 0.6,
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
                        <Sparkles className="w-4 h-4 text-green-800" />
                        Legenda Status Meja
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span style={{ width: 16, height: 16, background: statusColor('free'), borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                          <div>
                            <div className="text-xs font-medium text-gray-900">Tersedia</div>
                            <div className="text-xs text-gray-500">{Object.values(statuses).filter(s => s === 'free').length} meja</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span style={{ width: 16, height: 16, background: statusColor('reserved'), borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                          <div>
                            <div className="text-xs font-medium text-gray-900">Dipesan</div>
                            <div className="text-xs text-gray-500">{Object.values(statuses).filter(s => s === 'reserved').length} meja</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <span style={{ width: 16, height: 16, background: statusColor('occupied'), borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                          <div>
                            <div className="text-xs font-medium text-gray-900">Terisi</div>
                            <div className="text-xs text-gray-500">{Object.values(statuses).filter(s => s === 'occupied').length} meja</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-4">
                    {/* Selected Table Info */}
                    {selectedTable ? (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-600 rounded-xl p-4 shadow-lg animate-bounceIn">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-800 p-2 rounded-lg">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold text-green-900">Meja Dipilih</h4>
                          </div>
                          <Check className="w-6 h-6 text-green-800 bg-white rounded-full p-1" />
                        </div>
                        <div className="space-y-2 bg-white/80 rounded-lg p-3">
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold text-green-900">{selectedTable.label}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-green-700" />
                              <span className="font-medium">{selectedTable.seats} kursi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-green-700" />
                              <span className="font-medium">{selectedTable.area}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Belum ada meja dipilih</p>
                        <p className="text-xs text-gray-400 mt-1">Klik meja hijau pada denah</p>
                      </div>
                    )}

                    {/* Reservation Summary */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-800" />
                        Detail Reservasi
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Tanggal:</span>
                          <span className="font-semibold text-gray-900">{formData.date}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Waktu:</span>
                          <span className="font-semibold text-gray-900">{formData.time} WIB</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Jumlah Tamu:</span>
                          <span className="font-semibold text-gray-900">{formData.guests} orang</span>
                        </div>
                      </div>
                      <div className="border-t-2 border-green-200 mt-3 pt-3 bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Biaya Reservasi</span>
                          <span className="text-xl font-bold text-green-800">
                            Rp {RESERVATION_FEE.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Available Tables List */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-800" />
                          Meja Tersedia
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
                                  ? 'border-green-800 bg-green-50 shadow-md'
                                  : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-gray-900">{table.label}</div>
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

                    {/* Confirm Button */}
                    <button
                      onClick={confirmTableSelection}
                      disabled={!selectedTable}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedTable
                          ? 'bg-gradient-to-r from-green-800 to-green-700 hover:from-green-900 hover:to-green-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      {selectedTable ? 'Konfirmasi Pilihan Meja' : 'Pilih Meja Terlebih Dahulu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal with Barcode - Improved Design */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-md animate-fadeIn" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-lg w-full shadow-2xl z-10 overflow-hidden my-8 animate-slideUp">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm mb-110">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  Pembayaran Reservasi
                </h3>
                <p className="text-green-100 text-sm ml-17">Scan Barcode untuk Menyelesaikan Pembayaran</p>
              </div>
            </div>

            <div className="p-8">
              {/* Barcode Section - Centered and Spacious */}
              <div className="bg-white rounded-2xl p-8 mb-6 shadow-inner border-2 border-gray-100">
                <div className="text-center">
                  <div className="inline-block bg-white p-6 rounded-2xl shadow-lg mb-4">
                    <img 
                      src={BARCODE_IMAGE} 
                      alt="Barcode Pembayaran" 
                      className="w-72 h-72 object-contain mx-auto"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-72 h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300"><svg class="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg><span class="text-gray-500 font-semibold text-lg">QR Code Payment</span><span class="text-gray-400 text-sm mt-2">Scan untuk membayar</span></div>';
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-gray-900">Scan dengan aplikasi pembayaran Anda</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {['QRIS', 'GoPay', 'OVO', 'Dana', 'ShopeePay'].map((method) => (
                        <span key={method} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Amount - Prominent */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-6 border-2 border-green-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-800 font-medium mb-1">Total Pembayaran</p>
                    <p className="text-xs text-green-600">Biaya reservasi meja</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-800">
                      Rp {RESERVATION_FEE.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions - Clear and Organized */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-400 p-2 rounded-lg mt-0.5">
                    <Sparkles className="w-5 h-5 text-yellow-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-900 mb-3">Cara Pembayaran:</p>
                    <ol className="text-sm text-yellow-800 space-y-2">
                      <li className="flex gap-2">
                        <span className="font-bold text-yellow-600">1.</span>
                        <span>Buka aplikasi e-wallet atau mobile banking</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-yellow-600">2.</span>
                        <span>Pilih menu Scan QR atau QRIS</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-yellow-600">3.</span>
                        <span>Scan barcode yang ditampilkan</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-yellow-600">4.</span>
                        <span>Konfirmasi pembayaran Rp 20.000</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-yellow-600">5.</span>
                        <span>Klik "Konfirmasi Pembayaran" di bawah</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Modern and Clear */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmPayment}
                  className="flex-1 bg-gradient-to-r from-green-800 to-green-700 hover:from-green-900 hover:to-green-800 text-white py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" />
                  Konfirmasi Pembayaran
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                Dengan melanjutkan, Anda menyetujui kebijakan pembatalan kami
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReservationSection;