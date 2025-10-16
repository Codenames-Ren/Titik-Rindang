'use client';

import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';

const OpeningHoursSection = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-4">
            Jam Operasional
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Waktu Buka Titik Rindang
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Kami siap menyajikan kopi, makanan, dan minuman favoritmu setiap hari — 
            baik untuk memulai pagi dengan semangat, atau menutup malam dengan kehangatan.
          </p>
        </div>

        {/* Schedule Cards */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Weekdays */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center mb-6 text-green-800">
              <CalendarDays className="w-8 h-8 mr-2" />
              <h3 className="text-2xl font-bold">Senin - Jumat</h3>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-6 h-6 text-green-700" />
              <p className="text-xl font-semibold text-gray-800">08:00 - 22:00</p>
            </div>
          </div>

          {/* Weekend */}
          <div className="bg-green-800 rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-center justify-center mb-6">
              <CalendarDays className="w-8 h-8 mr-2 text-white" />
              <h3 className="text-2xl font-bold">Sabtu - Minggu</h3>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-6 h-6 text-green-100" />
              <p className="text-xl font-semibold">08:00 - 24:00</p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
          <p>
            Kami percaya setiap waktu adalah momen yang tepat untuk menikmati secangkir kopi atau hidangan lezat.  
            Datanglah kapan pun kamu ingin — kami akan selalu menyambutmu dengan hangat di <strong>Titik Rindang</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OpeningHoursSection;
