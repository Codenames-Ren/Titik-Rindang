'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  badge?: string;
  image: string;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: string;
}

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('coffee');
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
        image: "/images/Carousel1.jpg"
      },
      { 
        name: "Cappuccino", 
        price: "25.000", 
        description: "Espresso dengan foam susu lembut dan halus",
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop"
      },
      { 
        name: "Vietnam Drip", 
        price: "22.000", 
        description: "Kopi Vietnam tradisional dengan susu kental manis",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
      },
      { 
        name: "Kopi Susu Rindang", 
        price: "20.000", 
        description: "Signature coffee dengan susu segar pilihan",
        badge: "Signature",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop"
      },
      { 
        name: "Cold Brew", 
        price: "28.000", 
        description: "Kopi dingin diseduh 12 jam untuk rasa smooth",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop"
      },
      { 
        name: "Affogato", 
        price: "32.000", 
        description: "Espresso panas dituang ke atas es krim vanilla",
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop"
      },
      { 
        name: "Caramel Macchiato", 
        price: "30.000", 
        description: "Espresso dengan susu dan saus karamel",
        image: "https://images.unsplash.com/photo-1599750560706-80293f469027?w=400&h=300&fit=crop"
      },
      { 
        name: "Flat White", 
        price: "27.000", 
        description: "Espresso dengan microfoam susu yang creamy",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop"
      }
    ],
    food: [
      { 
        name: "Croissant Butter", 
        price: "18.000", 
        description: "Croissant renyah dengan butter premium",
        badge: "Fresh Daily",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop"
      },
      { 
        name: "Banana Cake", 
        price: "22.000", 
        description: "Kue pisang homemade dengan kacang walnut",
        badge: "Homemade",
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop"
      },
      { 
        name: "Sandwich Club", 
        price: "35.000", 
        description: "Sandwich lapis tiga dengan isian lengkap",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop"
      },
      { 
        name: "Pasta Carbonara", 
        price: "38.000", 
        description: "Pasta fettuccine dengan saus carbonara Italia",
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop"
      },
      { 
        name: "Nasi Goreng Rindang", 
        price: "32.000", 
        description: "Nasi goreng spesial dengan telur mata sapi",
        badge: "Signature",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
      },
      { 
        name: "French Fries", 
        price: "20.000", 
        description: "Kentang goreng crispy dengan saus pilihan",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"
      },
      { 
        name: "Beef Burger", 
        price: "42.000", 
        description: "Burger daging sapi premium dengan keju leleh",
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
      },
      { 
        name: "Caesar Salad", 
        price: "35.000", 
        description: "Salad segar dengan dressing caesar dan crouton",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
      }
    ],
    nonCoffee: [
      { 
        name: "Matcha Latte", 
        price: "28.000", 
        description: "Matcha premium Jepang dengan susu segar",
        badge: "Premium",
        image: "/images/Matcha.jpg"
      },
      { 
        name: "Hot Chocolate", 
        price: "25.000", 
        description: "Cokelat panas creamy dengan marshmallow",
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop"
      },
      { 
        name: "Thai Tea", 
        price: "22.000", 
        description: "Teh Thailand original dengan susu evaporasi",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1623508589276-68d3ad709854?w=400&h=300&fit=crop"
      },
      { 
        name: "Fresh Orange Juice", 
        price: "20.000", 
        description: "Jus jeruk segar tanpa gula tambahan",
        badge: "Healthy",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop"
      },
      { 
        name: "Lemon Tea", 
        price: "18.000", 
        description: "Teh lemon segar dengan madu",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
      },
      { 
        name: "Milk Tea", 
        price: "24.000", 
        description: "Teh susu klasik dengan boba",
        image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop"
      },
      { 
        name: "Strawberry Smoothie", 
        price: "28.000", 
        description: "Smoothie stroberi segar dengan yogurt",
        badge: "Signature",
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop"
      },
      { 
        name: "Mojito Non-Alcohol", 
        price: "25.000", 
        description: "Minuman segar dengan mint dan lime",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop"
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
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className={`inline-block mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          ><br />
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Menu Kami
            </span>
          </div>
          <h2 
            className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Hidangan & Minuman Pilihan
          </h2>
          <p 
            className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Nikmati berbagai pilihan menu berkualitas tinggi dengan bahan organik pilihan terbaik
          </p>
        </div>

        {/* Category Tabs */}
        <div 
          className={`flex justify-center gap-4 mb-12 flex-wrap transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center space-x-2 ${
                activeCategory === category.id
                  ? 'bg-green-800 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:scale-105'
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
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-3 right-3">
                    <span className={`${getBadgeColor(item.badge)} text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1 shadow-lg`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-green-800">
                      Rp {item.price}
                    </span>
                  </div>
                  <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div 
          className={`mt-16 bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm transition-all duration-700 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 group">
              <Coffee className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">100% Organik</div>
              <div className="text-gray-600">Bahan berkualitas premium</div>
            </div>
            <div className="space-y-3 group">
              <UtensilsCrossed className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">Fresh Daily</div>
              <div className="text-gray-600">Dibuat segar setiap hari</div>
            </div>
            <div className="space-y-3 group">
              <Sparkles className="w-12 h-12 text-green-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-gray-900">50+ Menu</div>
              <div className="text-gray-600">Pilihan beragam untuk Anda</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;