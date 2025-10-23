'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarClock, UtensilsCrossed } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta1: string;
  cta2: string;
  image: string;
}

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData: CarouselItem[] = [
    {
      id: 1,
      title: "Reservasi Mudah, Tanpa Antre",
      subtitle: "Nikmati Kenyamanan di Titik Rindang",
      description:
        "Pesan meja favoritmu dari rumah dan nikmati pengalaman ngopi dengan suasana rindang tanpa perlu menunggu.",
      cta1: "Reservasi Sekarang",
      cta2: "Lihat Menu",
      image: "/images/Carousel.jpg",
    },
    {
      id: 2,
      title: "Menu Lezat untuk Setiap Suasana",
      subtitle: "Kopi, Makanan & Non-Kopi",
      description:
        "Dari espresso klasik hingga matcha latte, dari croissant hingga nasi goreng rindang — semua tersedia untukmu.",
      cta1: "Ayo Reservasi!",
      cta2: "Jelajahi Menu",
      image: "/images/Carousel1.jpg",
    },
    {
      id: 3,
      title: "Tempat Cozy untuk Semua Momen",
      subtitle: "Siang Santai, Malam Hangat",
      description:
        "Habiskan waktu bersama teman, kerja santai, atau sekadar melepas penat di ruang hijau favoritmu.",
      cta1: "Buat Reservasi",
      cta2: "Mulai Memesan",
      image: "/images/Carousel2.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        key={currentSlide}
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${carouselData[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-green-900/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          {/* Text Section */}
          <div key={`content-${currentSlide}`} className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-green-300 text-sm font-semibold tracking-wider uppercase bg-green-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                {carouselData[currentSlide].subtitle}
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
              {carouselData[currentSlide].title}
            </h2>

            <p className="text-gray-100 text-lg lg:text-xl leading-relaxed drop-shadow-lg max-w-2xl">
              {carouselData[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/reservation"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center space-x-2 hover:scale-105 transform"
              >
                <CalendarClock className="w-5 h-5" />
                <span>{carouselData[currentSlide].cta1}</span>
              </a>

              <a
                href="/menu"
                className="border-2 border-white/80 backdrop-blur-sm bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-200 inline-flex items-center space-x-2 hover:scale-105 transform"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>{carouselData[currentSlide].cta2}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center justify-center space-x-6 bg-black/30 backdrop-blur-md px-6 py-4 rounded-full">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white hover:text-green-800 transition-all duration-200 hover:scale-110 transform"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white hover:text-green-800 transition-all duration-200 hover:scale-110 transform"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Carousel;