'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Leaf, UtensilsCrossed, CupSoda, HeartHandshake, Award } from 'lucide-react';

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const values: ValueCard[] = [
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Kopi Pilihan",
      description: "Biji terbaik diseduh dengan teknik profesional untuk rasa sempurna."
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Makanan Lezat",
      description: "Pastry dan hidangan ringan yang dibuat segar setiap hari."
    },
    {
      icon: <CupSoda className="w-6 h-6" />,
      title: "Non-Kopi",
      description: "Teh premium, jus buah segar, dan minuman signature."
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Suasana Bersahabat",
      description: "Tempat nyaman untuk bekerja, belajar, dan berbagi cerita."
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Bahan Alami",
      description: "Bahan organik tanpa pengawet untuk kesehatan Anda."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Kualitas Premium",
      description: "Hanya yang terbaik yang sampai di meja pelanggan."
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-gray-50 py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6">
          <div 
            className={`inline-block transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          ><br /><br />
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Tentang Kami
            </span>
          </div>

          <h2 
            className={`text-3xl lg:text-5xl font-bold text-gray-900 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Lebih dari Sekadar Coffee Shop
          </h2>

          <p 
            className={`text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Tempat di mana kopi, makanan, dan kebersamaan berpadu. Setiap cangkir kopi dan hidangan memiliki cerita tersendiri.
          </p>

          {/* Simple Image Representation */}
          <div 
            className={`flex items-center justify-center gap-6 pt-6 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="text-5xl animate-float">☕</div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
            <div className="text-5xl animate-float-delay">🥐</div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
            <div className="text-5xl animate-float">🍃</div>
          </div>
        </div>

        {/* Value Cards - Minimalist Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 ">
          {values.map((value, index) => (
            <div 
              key={index}
              className={`group transition-all  duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="relative ">
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-green-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                
                <div className="p-6 space-y-3">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-100 text-green-700 group-hover:border-green-200 group-hover:scale-110 transition-all duration-300">
                    {value.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 ">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - Minimalist */}
        <div 
          className={`transition-all duration-700 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-2 group">
                <div className="text-3xl lg:text-4xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-300">1000+</div>
                <div className="text-gray-600 text-sm">Pelanggan Bahagia</div>
              </div>
              <div className="text-center space-y-2 group">
                <div className="text-3xl lg:text-4xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-300">70+</div>
                <div className="text-gray-600 text-sm">Menu Tersedia</div>
              </div>
              <div className="text-center space-y-2 group">
                <div className="text-3xl lg:text-4xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-300">30+</div>
                <div className="text-gray-600 text-sm">Pilihan Makanan</div>
              </div>
              <div className="text-center space-y-2 group">
                <div className="text-3xl lg:text-4xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-300">10+</div>
                <div className="text-gray-600 text-sm">Tahun Berpengalaman</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div 
          className={`text-center mt-12 transition-all duration-700 delay-1100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a 
            href="/menu"
            className="inline-flex items-center space-x-2 bg-green-800 text-white px-8 py-3 rounded-full font-medium hover:bg-green-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Jelajahi Menu</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;