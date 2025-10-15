'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, CreditCard, CheckCircle, Coffee } from 'lucide-react';

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequest: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
  ];

  const reservationFee = 50000; // Biaya reservasi per orang

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
        setCurrentStep(3);
      } else {
        alert('Mohon pilih tanggal, waktu, dan jumlah tamu');
      }
    }
  };

  const handlePayment = () => {
    // Simulasi pembayaran
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const totalAmount = reservationFee * parseInt(formData.guests || '1');

  if (isSubmitted) {
    return (
      <section className="bg-gradient-to-br from-green-50 to-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Reservasi Berhasil!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Terima kasih {formData.name}! Reservasi Anda telah dikonfirmasi.
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
                  <span className="font-semibold text-gray-900">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Tamu:</span>
                  <span className="font-semibold text-gray-900">{formData.guests} orang</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-3 mt-3">
                  <span className="text-gray-900 font-bold">Total Dibayar:</span>
                  <span className="font-bold text-green-700">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 mb-6">
              Konfirmasi reservasi telah dikirim ke email Anda. Kami tunggu kedatangan Anda!
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  date: '',
                  time: '',
                  guests: '2',
                  specialRequest: ''
                });
              }}
              className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200"
            >
              Buat Reservasi Baru
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Reservasi Meja
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pesan Tempat Anda
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nikmati pengalaman kopi terbaik dengan reservasi meja. Full payment diperlukan untuk konfirmasi.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step 
                      ? 'bg-green-800 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-3 font-semibold ${
                    currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Data Diri' : step === 2 ? 'Pilih Waktu' : 'Pembayaran'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-green-800' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            
            {/* Step 1: Data Diri */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-green-800 text-white py-4 rounded-xl font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Lanjut ke Pemilihan Waktu
                </button>
              </div>
            )}

            {/* Step 2: Pilih Waktu */}
            {currentStep === 2 && (
              <div className="space-y-6">
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
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
                  />
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
                  >
                    <option value="">Pilih waktu</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} WIB
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Orang
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Permintaan Khusus (Opsional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-800 focus:outline-none transition-colors resize-none"
                    placeholder="Contoh: Meja dekat jendela, ulang tahun, dll."
                  />
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
                    className="flex-1 bg-green-800 text-white py-4 rounded-xl font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pembayaran */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-7 h-7 mr-3 text-green-800" />
                  Pembayaran Full
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
                      <span className="font-semibold text-gray-900">{formData.date} - {formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah Tamu:</span>
                      <span className="font-semibold text-gray-900">{formData.guests} orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biaya per Orang:</span>
                      <span className="font-semibold text-gray-900">Rp {reservationFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t-2 border-green-200 pt-3 mt-3 flex justify-between">
                      <span className="text-gray-900 font-bold text-lg">Total Pembayaran:</span>
                      <span className="font-bold text-green-700 text-xl">Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Coffee className="w-5 h-5 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">Kebijakan Pembayaran</p>
                      <p className="text-sm text-yellow-800">
                        Pembayaran penuh diperlukan untuk mengkonfirmasi reservasi. 
                        Pembayaran tidak dapat dikembalikan jika dibatalkan kurang dari 24 jam sebelum jadwal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Metode Pembayaran</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-800 transition-colors">
                      <input type="radio" name="payment" className="mr-3" defaultChecked />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Transfer Bank</span>
                        <p className="text-sm text-gray-600">BCA / Mandiri / BNI</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-800 transition-colors">
                      <input type="radio" name="payment" className="mr-3" />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">E-Wallet</span>
                        <p className="text-sm text-gray-600">GoPay / OVO / Dana</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-800 transition-colors">
                      <input type="radio" name="payment" className="mr-3" />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Kartu Kredit/Debit</span>
                        <p className="text-sm text-gray-600">Visa / Mastercard</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-green-800 text-white py-4 rounded-xl font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
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
    </section>
  );
};

export default ReservationSection;