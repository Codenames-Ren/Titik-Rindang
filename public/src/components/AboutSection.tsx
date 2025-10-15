// components/AboutSection.tsx
'use client';

import React from 'react';
import { Users, Award, Coffee, Leaf } from 'lucide-react';

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutSection = () => {
  const values: ValueCard[] = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Active Community",
      description: "Anda dapat menghubungi kami kapan pun Anda mau"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Kopi berkualitas premium adalah yang pelanggan kami dapatkan"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Produk Organik",
      description: "Kami menggunakan 100% bahan organik alami"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Bahan Terbaik",
      description: "Hanya menggunakan bahan baku pilihan terbaik"
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image Section */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Product Image */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-8 shadow-xl">
                <div className="relative">
                  <div className="text-9xl text-center mb-4">📦</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
                </div>
              </div>
              
              {/* Coffee Cup Overlay */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border-4 border-green-800">
                <div className="text-7xl">☕</div>
              </div>

              {/* Testimonial Card */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl max-w-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Michael Smith</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      "Kopi adalah salah satu perusahaan paling sukses... hubungan pelanggan sangat baik"
                    </p>
                  </div>
                </div>
              </div>

              {/* Coffee Beans Decoration */}
              <div className="absolute bottom-0 left-0 text-6xl opacity-80">☕</div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-0 w-20 h-20">
              <svg viewBox="0 0 100 100" className="text-green-800 opacity-30">
                <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
                Tentang Kopi
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Kami peduli dengan kualitas produk kami
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Minum kopi adalah salah satu kebiasaan global terbaik yang dapat Anda habiskan setiap hari. 
              Saya dapat menghabiskan waktu lama dan menyenangkan dengan fasilitas workspace ini.
            </p>

            <div className="pt-4">
              <button className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
                <span>Pelajari Lebih Lanjut</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center text-green-800 mb-4 group-hover:bg-green-800 group-hover:text-white transition-all duration-300">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-8 lg:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-white">500+</div>
              <div className="text-green-100 text-lg">Pelanggan Setia</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-white">50+</div>
              <div className="text-green-100 text-lg">Varian Kopi</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-white">10+</div>
              <div className="text-green-100 text-lg">Tahun Pengalaman</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-white">100%</div>
              <div className="text-green-100 text-lg">Organik</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;