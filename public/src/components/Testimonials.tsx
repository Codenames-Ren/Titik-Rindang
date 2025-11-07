"use client";

import React, { useState, useEffect, useRef } from "react";
import { Leaf, Star } from "lucide-react";

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Rani Putri",
      role: "Freelancer",
      image: "https://i.pravatar.cc/150?img=5",
      text: "Tempatnya sangat sejuk dan nyaman. Suasana rindang dengan pepohonan membuat saya betah berlama-lama. Kopinya juga enak!",
      rating: 5,
    },
    {
      name: "Budi Santoso",
      role: "Mahasiswa",
      image: "https://i.pravatar.cc/150?img=12",
      text: "Coffee shop terbaik untuk ngerjain tugas. Wifi cepat, suasana tenang, dan kopinya mantap. Harga juga ramah di kantong.",
      rating: 5,
    },
    {
      name: "Siti Aminah",
      role: "Entrepreneur",
      image: "https://i.pravatar.cc/150?img=9",
      text: "Saya sering meeting klien di sini. Atmosfernya profesional tapi tetap santai. Pastry-nya juga fresh dan enak!",
      rating: 5,
    },
    {
      name: "Ahmad Rizki",
      role: "Designer",
      image: "https://i.pravatar.cc/150?img=15",
      text: "Suasana yang rindang dan sejuk benar-benar membantu kreativitas saya. Tempat favorit untuk mencari inspirasi sambil menikmati kopi.",
      rating: 5,
    },
    {
      name: "Dina Marlina",
      role: "Content Creator",
      image: "https://i.pravatar.cc/150?img=27",
      text: "Instagramable banget! Bukan cuma tempatnya yang aesthetic, tapi kopinya juga berkualitas. Pelayanannya ramah dan cepat.",
      rating: 5,
    },
    {
      name: "Eko Prasetyo",
      role: "Writer",
      image: "https://i.pravatar.cc/150?img=33",
      text: "Tempat yang sempurna untuk menulis. Suasana teduh di bawah pohon-pohon rindang membuat pikiran jadi lebih jernih. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-green-50 to-amber-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-16 mt-7 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="text-green-600" size={36} />
            <h2 className="text-5xl font-bold text-green-900">
              Testimoni Pelanggan
            </h2>
            <Leaf className="text-green-600" size={36} />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Apa kata mereka tentang Rindang Coffee - tempat berkumpul di bawah
            naungan pohon rindang
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 border-green-100 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } hover:shadow-2xl hover:-translate-y-2`}
              style={{ transitionDelay: `${300 + index * 120}ms` }}
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-green-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1">
                    <Leaf className="text-white" size={12} />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="fill-amber-400 text-amber-400"
                    size={20}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-green-100">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Leaf size={16} />
                  <span className="font-medium">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-[900ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-block bg-white px-8 py-4 rounded-full shadow-lg">
            <p className="text-gray-700">
              <span className="font-bold text-green-700">500+</span> pelanggan
              puas dengan layanan kami
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
