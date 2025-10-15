'use client';

import React, { useState } from 'react';
import { Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  badge?: string;
  emoji: string;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: string;
}

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('coffee');

  const categories: MenuCategory[] = [
    { id: 'coffee', label: 'Kopi', icon: '☕' },
    { id: 'food', label: 'Makanan', icon: '🍽️' },
    { id: 'nonCoffee', label: 'Non-Kopi', icon: '🍹' }
  ];

  const menuItems: Record<string, MenuItem[]> = {
    coffee: [
      { 
        name: "Espresso", 
        price: "15.000", 
        description: "Single shot espresso Italia yang kuat dan aromatik",
        badge: "Classic",
        emoji: "☕"
      },
      { 
        name: "Cappuccino", 
        price: "25.000", 
        description: "Espresso dengan foam susu lembut dan halus",
        badge: "Popular",
        emoji: "☕"
      },
      { 
        name: "Vietnam Drip", 
        price: "22.000", 
        description: "Kopi Vietnam tradisional dengan susu kental manis",
        emoji: "☕"
      },
      { 
        name: "Kopi Susu Rindang", 
        price: "20.000", 
        description: "Signature coffee dengan susu segar pilihan",
        badge: "Signature",
        emoji: "☕"
      },
      { 
        name: "Cold Brew", 
        price: "28.000", 
        description: "Kopi dingin diseduh 12 jam untuk rasa smooth",
        badge: "Best Seller",
        emoji: "🧊"
      },
      { 
        name: "Affogato", 
        price: "32.000", 
        description: "Espresso panas dituang ke atas es krim vanilla",
        badge: "Premium",
        emoji: "🍨"
      },
      { 
        name: "Caramel Macchiato", 
        price: "30.000", 
        description: "Espresso dengan susu dan saus karamel",
        emoji: "☕"
      },
      { 
        name: "Flat White", 
        price: "27.000", 
        description: "Espresso dengan microfoam susu yang creamy",
        emoji: "☕"
      }
    ],
    food: [
      { 
        name: "Croissant Butter", 
        price: "18.000", 
        description: "Croissant renyah dengan butter premium",
        badge: "Fresh Daily",
        emoji: "🥐"
      },
      { 
        name: "Banana Cake", 
        price: "22.000", 
        description: "Kue pisang homemade dengan kacang walnut",
        badge: "Homemade",
        emoji: "🍰"
      },
      { 
        name: "Sandwich Club", 
        price: "35.000", 
        description: "Sandwich lapis tiga dengan isian lengkap",
        badge: "Best Seller",
        emoji: "🥪"
      },
      { 
        name: "Pasta Carbonara", 
        price: "38.000", 
        description: "Pasta fettuccine dengan saus carbonara Italia",
        badge: "Popular",
        emoji: "🍝"
      },
      { 
        name: "Nasi Goreng Rindang", 
        price: "32.000", 
        description: "Nasi goreng spesial dengan telat mata sapi",
        badge: "Signature",
        emoji: "🍚"
      },
      { 
        name: "French Fries", 
        price: "20.000", 
        description: "Kentang goreng crispy dengan saus pilihan",
        emoji: "🍟"
      },
      { 
        name: "Beef Burger", 
        price: "42.000", 
        description: "Burger daging sapi premium dengan keju leleh",
        badge: "Premium",
        emoji: "🍔"
      },
      { 
        name: "Caesar Salad", 
        price: "35.000", 
        description: "Salad segar dengan dressing caesar dan crouton",
        emoji: "🥗"
      }
    ],
    nonCoffee: [
      { 
        name: "Matcha Latte", 
        price: "28.000", 
        description: "Matcha premium Jepang dengan susu segar",
        badge: "Premium",
        emoji: "🍵"
      },
      { 
        name: "Hot Chocolate", 
        price: "25.000", 
        description: "Cokelat panas creamy dengan marshmallow",
        badge: "Popular",
        emoji: "🍫"
      },
      { 
        name: "Thai Tea", 
        price: "22.000", 
        description: "Teh Thailand original dengan susu evaporasi",
        badge: "Best Seller",
        emoji: "🧋"
      },
      { 
        name: "Fresh Orange Juice", 
        price: "20.000", 
        description: "Jus jeruk segar tanpa gula tambahan",
        badge: "Healthy",
        emoji: "🍊"
      },
      { 
        name: "Lemon Tea", 
        price: "18.000", 
        description: "Teh lemon segar dengan madu",
        emoji: "🍋"
      },
      { 
        name: "Milk Tea", 
        price: "24.000", 
        description: "Teh susu klasik dengan boba",
        emoji: "🥛"
      },
      { 
        name: "Strawberry Smoothie", 
        price: "28.000", 
        description: "Smoothie stroberi segar dengan yogurt",
        badge: "Signature",
        emoji: "🍓"
      },
      { 
        name: "Mojito Non-Alcohol", 
        price: "25.000", 
        description: "Minuman segar dengan mint dan lime",
        emoji: "🍹"
      }
    ]
  };

  const getBadgeColor = (badge?: string) => {
    const colors: Record<string, string> = {
      'Signature': 'bg-green-800 text-white',
      'Best Seller': 'bg-amber-500 text-white',
      'Popular': 'bg-red-500 text-white',
      'Premium': 'bg-purple-600 text-white',
      'Classic': 'bg-gray-700 text-white',
      'Fresh Daily': 'bg-blue-500 text-white',
      'Homemade': 'bg-orange-500 text-white',
      'Healthy': 'bg-green-500 text-white'
    };
    return badge ? colors[badge] || 'bg-gray-500 text-white' : '';
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Menu Kami
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Hidangan & Minuman Pilihan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nikmati berbagai pilihan menu berkualitas tinggi dengan bahan organik pilihan terbaik
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center space-x-2 ${
                activeCategory === category.id
                  ? 'bg-green-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems[activeCategory].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`${getBadgeColor(item.badge)} text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </span>
                </div>
              )}

              {/* Emoji Icon */}
              <div className="text-5xl mb-4">{item.emoji}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 pr-16">
                {item.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed min-h-[40px]">
                {item.description}
              </p>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-green-800">
                    Rp {item.price}
                  </span>
                </div>
                <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg">
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Coffee className="w-12 h-12 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100% Organik</div>
              <div className="text-green-100">Bahan berkualitas premium</div>
            </div>
            <div className="space-y-2">
              <UtensilsCrossed className="w-12 h-12 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Fresh Daily</div>
              <div className="text-green-100">Dibuat segar setiap hari</div>
            </div>
            <div className="space-y-2">
              <Sparkles className="w-12 h-12 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+ Menu</div>
              <div className="text-green-100">Pilihan beragam untuk Anda</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;