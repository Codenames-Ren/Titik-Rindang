// components/Features.tsx
'use client';

import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const Features = () => {
  const features: Feature[] = [
    { 
      icon: '🌱', 
      title: 'Organik 100%', 
      description: 'Biji kopi organik pilihan terbaik' 
    },
    { 
      icon: '⚡', 
      title: 'Fresh Roasted', 
      description: 'Disangrai segar setiap hari' 
    },
    { 
      icon: '🏆', 
      title: 'Premium Quality', 
      description: 'Kualitas terjamin dan bersertifikat' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="text-center bg-green-50 p-6 rounded-xl hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;