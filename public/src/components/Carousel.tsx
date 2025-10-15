// components/Carousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
}

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData: CarouselItem[] = [
    {
      id: 1,
      title: "Kopi Organik Pilihan Terbaik",
      subtitle: "Titik Rindang Coffee",
      description: "Nikmati kesegaran kopi organik berkualitas premium dengan cita rasa yang kaya dan aroma yang memikat",
      price: "Rp 89.000",
      originalPrice: "Rp 125.000",
      image: "☕"
    },
    {
      id: 2,
      title: "Arabica Premium Blend",
      subtitle: "Signature Collection",
      description: "Perpaduan sempurna biji arabica pilihan dari perkebunan terbaik Indonesia",
      price: "Rp 95.000",
      originalPrice: "Rp 130.000",
      image: "🌿"
    },
    {
      id: 3,
      title: "Cold Brew Special",
      subtitle: "Refreshing Taste",
      description: "Sensasi dingin yang menyegarkan dengan rasa kopi yang tetap kuat dan nikmat",
      price: "Rp 75.000",
      originalPrice: "Rp 100.000",
      image: "🥤"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
                {carouselData[currentSlide].subtitle}
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {carouselData[currentSlide].title}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {carouselData[currentSlide].description}
            </p>
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-800">
                {carouselData[currentSlide].price}
              </span>
              <span className="text-xl text-gray-400 line-through">
                {carouselData[currentSlide].originalPrice}
              </span>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                Pesan Sekarang
              </button>
              <button className="border-2 border-green-800 text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-800 hover:text-white transition-all duration-200">
                Lihat Menu
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="text-9xl text-center mb-4">
                  {carouselData[currentSlide].image}
                </div>
                <div className="absolute top-0 right-0 bg-green-800 text-white px-4 py-2 rounded-bl-3xl rounded-tr-3xl font-semibold">
                  PROMO
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-green-300 rounded-full opacity-30 blur-3xl"></div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center space-x-6 mt-12">
          <button
            onClick={prevSlide}
            className="bg-white text-green-800 p-3 rounded-full shadow-lg hover:bg-green-800 hover:text-white transition-all duration-200"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-green-800' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="bg-white text-green-800 p-3 rounded-full shadow-lg hover:bg-green-800 hover:text-white transition-all duration-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;