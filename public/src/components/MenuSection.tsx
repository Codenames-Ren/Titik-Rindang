'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Coffee, UtensilsCrossed, Sparkles, ShoppingCart, X, Check, MapPin, Users } from 'lucide-react';

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

interface CartItem extends MenuItem {
  quantity: number;
  category: string;
}

type TableStatus = 'occupied' | 'reserved' | 'free';

interface Table {
  id: string;
  label: string;
  seats: number;
  area: 'Indoor' | 'Outdoor';
  coords: [number, number, number];
}

const IMAGE_SRC = './images/DenahMeja.png';
const STORAGE_KEY = 'table-map-statuses-v1';

const DEFAULT_TABLES: Table[] = [
  { id: 'I6-1', label: 'Meja Indoor (6 kursi) - 1', seats: 6, area: 'Indoor', coords: [180,148,33] },
  { id: 'I6-2', label: 'Meja Indoor (6 kursi) - 2', seats: 6, area: 'Indoor', coords: [180,280,35] },
  { id: 'I6-3', label: 'Meja Indoor (6 kursi) - 3', seats: 6, area: 'Indoor', coords: [180,408,38] },
  { id: 'I4-1', label: 'Meja Indoor (4 kursi) - 1', seats: 4, area: 'Indoor', coords: [522,436,22] },
  { id: 'I4-2', label: 'Meja Indoor (4 kursi) - 2', seats: 4, area: 'Indoor', coords: [659,434,22] },
  { id: 'I2-1', label: 'Meja Indoor (2 kursi) - 1', seats: 2, area: 'Indoor', coords: [809,232,19] },
  { id: 'I2-2', label: 'Meja Indoor (2 kursi) - 2', seats: 2, area: 'Indoor', coords: [809,304,19] },
  { id: 'I2-3', label: 'Meja Indoor (2 kursi) - 3', seats: 2, area: 'Indoor', coords: [809,376,19] },
  { id: 'I2-4', label: 'Meja Indoor (2 kursi) - 4', seats: 2, area: 'Indoor', coords: [807,448,19] },
  { id: 'I7-1', label: 'Meja Indoor (7 kursi)', seats: 7, area: 'Indoor', coords: [808,129,26] },
  { id: 'O4-1', label: 'Meja Outdoor (4 kursi) - 1', seats: 4, area: 'Outdoor', coords: [211,561,23] },
  { id: 'O4-2', label: 'Meja Outdoor (4 kursi) - 2', seats: 4, area: 'Outdoor', coords: [500,562,23] },
  { id: 'O4-3', label: 'Meja Outdoor (4 kursi) - 3', seats: 4, area: 'Outdoor', coords: [651,563,23] },
  { id: 'O4-4', label: 'Meja Outdoor (4 kursi) - 4', seats: 4, area: 'Outdoor', coords: [814,560,24] },
];

const statusColor = (s: TableStatus) => {
  switch (s) {
    case 'occupied': return '#f87171';
    case 'reserved': return '#fbbf24';
    case 'free': return '#34d399';
    default: return '#9ca3af';
  }
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [isVisible, setIsVisible] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showTableSelection, setShowTableSelection] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, TableStatus>>({});
  const [naturalSize, setNaturalSize] = useState({ w: 920, h: 650 });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sectionRef = useRef(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, TableStatus>;
        setStatuses(parsed);
      } catch {
        const initial: Record<string, TableStatus> = {};
        DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
        setStatuses(initial);
      }
    } else {
      const initial: Record<string, TableStatus> = {};
      DEFAULT_TABLES.forEach(t => initial[t.id] = 'free');
      setStatuses(initial);
    }
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      setNaturalSize({ w: img.naturalWidth || 920, h: img.naturalHeight || 650 });
      setImageLoaded(true);
      // Force a re-render after image loads to recalculate positions
      setTimeout(() => {
        setImageLoaded(prev => prev);
      }, 100);
    };
    if (img.complete) {
      onLoad();
    }
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [showTableSelection]);

  // Recalculate positions when modal opens or window resizes
  useEffect(() => {
    if (!showTableSelection) return;
    
    const handleResize = () => {
      setImageLoaded(prev => !prev);
      setTimeout(() => setImageLoaded(prev => !prev), 50);
    };
    
    window.addEventListener('resize', handleResize);
    // Trigger initial calculation
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [showTableSelection]);

  const categories: MenuCategory[] = [
    { id: 'coffee', label: 'Kopi', icon: '☕' },
    { id: 'food', label: 'Makanan', icon: '🍽️' },
    { id: 'nonCoffee', label: 'Non-Kopi', icon: '🥐' }
  ];

  const menuItems: Record<string, MenuItem[]> = {
    coffee: [
      { name: "Espresso", price: "15.000", description: "Single shot espresso Italia yang kuat dan aromatik", badge: "Classic", image: "/images/Carousel1.jpg" },
      { name: "Cappuccino", price: "25.000", description: "Espresso dengan foam susu lembut dan halus", badge: "Popular", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop" },
      { name: "Vietnam Drip", price: "22.000", description: "Kopi Vietnam tradisional dengan susu kental manis", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop" },
      { name: "Kopi Susu Rindang", price: "20.000", description: "Signature coffee dengan susu segar pilihan", badge: "Signature", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop" },
      { name: "Cold Brew", price: "28.000", description: "Kopi dingin diseduh 12 jam untuk rasa smooth", badge: "Best Seller", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop" },
      { name: "Affogato", price: "32.000", description: "Espresso panas dituang ke atas es krim vanilla", badge: "Premium", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop" },
      { name: "Caramel Macchiato", price: "30.000", description: "Espresso dengan susu dan saus karamel", image: "https://images.unsplash.com/photo-1599750560706-80293f469027?w=400&h=300&fit=crop" },
      { name: "Flat White", price: "27.000", description: "Espresso dengan microfoam susu yang creamy", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop" }
    ],
    food: [
      { name: "Croissant Butter", price: "18.000", description: "Croissant renyah dengan butter premium", badge: "Fresh Daily", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop" },
      { name: "Banana Cake", price: "22.000", description: "Kue pisang homemade dengan kacang walnut", badge: "Homemade", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop" },
      { name: "Sandwich Club", price: "35.000", description: "Sandwich lapis tiga dengan isian lengkap", badge: "Best Seller", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop" },
      { name: "Pasta Carbonara", price: "38.000", description: "Pasta fettuccine dengan saus carbonara Italia", badge: "Popular", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop" },
      { name: "Nasi Goreng Rindang", price: "32.000", description: "Nasi goreng spesial dengan telur mata sapi", badge: "Signature", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
      { name: "French Fries", price: "20.000", description: "Kentang goreng crispy dengan saus pilihan", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop" },
      { name: "Beef Burger", price: "42.000", description: "Burger daging sapi premium dengan keju leleh", badge: "Premium", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
      { name: "Caesar Salad", price: "35.000", description: "Salad segar dengan dressing caesar dan crouton", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop" }
    ],
    nonCoffee: [
      { name: "Matcha Latte", price: "28.000", description: "Matcha premium Jepang dengan susu segar", badge: "Premium", image: "/images/Matcha.jpg" },
      { name: "Hot Chocolate", price: "25.000", description: "Cokelat panas creamy dengan marshmallow", badge: "Popular", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop" },
      { name: "Thai Tea", price: "22.000", description: "Teh Thailand original dengan susu evaporasi", badge: "Best Seller", image: "https://images.unsplash.com/photo-1623508589276-68d3ad709854?w=400&h=300&fit=crop" },
      { name: "Fresh Orange Juice", price: "20.000", description: "Jus jeruk segar tanpa gula tambahan", badge: "Healthy", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop" },
      { name: "Lemon Tea", price: "18.000", description: "Teh lemon segar dengan madu", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
      { name: "Milk Tea", price: "24.000", description: "Teh susu klasik dengan boba", image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop" },
      { name: "Strawberry Smoothie", price: "28.000", description: "Smoothie stroberi segar dengan yogurt", badge: "Signature", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop" },
      { name: "Mojito Non-Alcohol", price: "25.000", description: "Minuman segar dengan mint dan lime", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop" }
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

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, category: activeCategory }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.name === itemName) {
        const newQty = Math.max(0, i.quantity + delta);
        return newQty === 0 ? null : { ...i, quantity: newQty };
      }
      return i;
    }).filter(Boolean) as CartItem[]);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (parseInt(item.price.replace(/\./g, '')) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const proceedToTableSelection = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong! Silakan pilih menu terlebih dahulu.');
      return;
    }
    setShowCart(false);
    setShowTableSelection(true);
  };

  const getScale = () => {
    const img = imgRef.current;
    if (!img || !naturalSize.w) return 1;
    const displayWidth = img.getBoundingClientRect().width;
    return displayWidth / naturalSize.w;
  };

  const tableAtPos = (e: React.MouseEvent) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const scale = getScale();

    for (const t of DEFAULT_TABLES) {
      const [cx, cy, r] = t.coords;
      const dx = clickX / scale - cx;
      const dy = clickY / scale - cy;
      if (dx * dx + dy * dy <= r * r) {
        if (statuses[t.id] === 'free') {
          setSelectedTable(t);
        } else {
          alert(`Meja ini ${statuses[t.id] === 'occupied' ? 'sedang terisi' : 'sudah dipesan'}. Silakan pilih meja lain.`);
        }
        return;
      }
    }
  };

  const confirmBooking = () => {
    if (!selectedTable) return;
    
    const newStatuses = { ...statuses, [selectedTable.id]: 'reserved' as TableStatus };
    setStatuses(newStatuses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
    
    setShowTableSelection(false);
    setShowConfirmation(true);
    
    setTimeout(() => {
      setShowConfirmation(false);
      setCart([]);
      setSelectedTable(null);
    }, 5000);
  };

  const availableTables = DEFAULT_TABLES.filter(t => statuses[t.id] === 'free');

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-block mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <br /><br /><span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Menu Kami
            </span>
          </div>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Hidangan & Minuman Pilihan
          </h2>
          <p className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Nikmati berbagai pilihan menu berkualitas tinggi dengan bahan organik pilihan terbaik
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`flex justify-center gap-4 mb-12 flex-wrap transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {item.badge && (
                  <div className="absolute top-3 right-3">
                    <span className={`${getBadgeColor(item.badge)} text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1 shadow-lg`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-green-800">
                      Rp {item.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className={`mt-16 bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-7 right-7 bg-green-800 text-white p-4 rounded-full shadow-2xl hover:bg-green-900 transition-all duration-300 hover:scale-110 z-40"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Keranjang Pesanan</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {cart.map((item) => (
                <div key={item.name} className="flex items-center gap-4 py-4 border-b text-black border-gray-100 last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Rp {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-800">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={proceedToTableSelection}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Pilih Meja & Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Selection Modal */}
      {showTableSelection && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowTableSelection(false)} />
            <div className="relative bg-white rounded-2xl max-w-6xl w-full shadow-xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pilih Meja Anda</h3>
                  <p className="text-sm text-gray-500 mt-1">Klik meja yang tersedia (hijau) pada denah</p>
                </div>
                <button onClick={() => setShowTableSelection(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Map Section */}
                  <div className="lg:col-span-2" ref={containerRef}>
                    <div className="relative">
                      <img
                        ref={imgRef}
                        src={IMAGE_SRC}
                        alt="Denah Meja"
                        className="w-full rounded-2xl border border-gray-200 shadow-sm"
                        onClick={tableAtPos}
                        onLoad={() => {
                          const img = imgRef.current;
                          if (img) {
                            setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                            setImageLoaded(true);
                          }
                        }}
                        style={{ cursor: 'pointer', userSelect: 'none', display: 'block' }}
                      />

                      {/* Table Markers */}
                      {imageLoaded && DEFAULT_TABLES.map(t => {
                        const [cx, cy, r] = t.coords;
                        const scale = getScale();
                        const left = cx * scale;
                        const top = cy * scale;
                        const size = r * 2 * scale;
                        const s = statuses[t.id] || 'free';
                        
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (s === 'free') {
                                setSelectedTable(t);
                              } else {
                                alert(`Meja ini ${s === 'occupied' ? 'sedang terisi' : 'sudah dipesan'}. Silakan pilih meja lain.`);
                              }
                            }}
                            title={`${t.label} — ${t.seats} kursi — ${t.area}`}
                            className="absolute"
                            style={{
                              left: `${left}px`,
                              top: `${top}px`,
                              width: `${size}px`,
                              height: `${size}px`,
                              transform: 'translate(-50%, -50%)',
                              borderRadius: '9999px',
                              border: selectedTable?.id === t.id ? '4px solid #166534' : '3px solid rgba(255,255,255,0.9)',
                              boxShadow: selectedTable?.id === t.id ? '0 0 0 4px rgba(22, 101, 52, 0.3)' : '0 6px 18px rgba(0,0,0,0.12)',
                              backgroundColor: statusColor(s),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                              cursor: s === 'free' ? 'pointer' : 'not-allowed',
                              opacity: s === 'free' ? 1 : 0.6,
                            }}
                          >
                            <span className="text-xs font-semibold text-white drop-shadow-sm select-none">
                              {t.seats}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda Status Meja</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <span style={{ width: 14, height: 14, background: statusColor('free'), borderRadius: 6 }} />
                          <span className="text-xs text-gray-600">Tersedia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ width: 14, height: 14, background: statusColor('reserved'), borderRadius: 6 }} />
                          <span className="text-xs text-gray-600">Dipesan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ width: 14, height: 14, background: statusColor('occupied'), borderRadius: 6 }} />
                          <span className="text-xs text-gray-600">Terisi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info & Confirmation Section */}
                  <div className="space-y-4">
                    {/* Selected Table Info */}
                    {selectedTable ? (
                      <div className="bg-green-50 border-2 border-green-800 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-800" />
                            <h4 className="font-semibold text-green-900">Meja Dipilih</h4>
                          </div>
                          <Check className="w-5 h-5 text-green-800" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{selectedTable.label}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{selectedTable.seats} kursi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{selectedTable.area}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Belum ada meja dipilih</p>
                        <p className="text-xs text-gray-400 mt-1">Klik meja hijau pada denah</p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Ringkasan Pesanan</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.name} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} <span className="text-gray-400">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-gray-900">
                              Rp {(parseInt(item.price.replace(/\./g, '')) * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-3 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-green-800">
                            Rp {getTotalPrice().toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Available Tables List */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Meja Tersedia ({availableTables.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableTables.map((table) => (
                          <button
                            key={table.id}
                            onClick={() => setSelectedTable(table)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedTable?.id === table.id
                                ? 'border-green-800 bg-green-50'
                                : 'border-gray-200 hover:border-green-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{table.label}</div>
                                <div className="text-xs text-gray-500">{table.seats} kursi • {table.area}</div>
                              </div>
                              {selectedTable?.id === table.id && (
                                <Check className="w-5 h-5 text-green-800" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={confirmBooking}
                      disabled={!selectedTable}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedTable
                          ? 'bg-green-800 hover:bg-green-900 text-white hover:shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedTable ? 'Konfirmasi Pesanan' : 'Pilih Meja Terlebih Dahulu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Success Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-xl z-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h3>
            <p className="text-gray-600 mb-4">
              Pesanan Anda telah dikonfirmasi
            </p>
            
            {selectedTable && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-700">
                  <div className="font-semibold text-green-900 mb-2">{selectedTable.label}</div>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <span>{selectedTable.seats} kursi</span>
                    <span>•</span>
                    <span>{selectedTable.area}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">Total Pembayaran</div>
              <div className="text-2xl font-bold text-green-800">
                Rp {getTotalPrice().toLocaleString('id-ID')}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Silakan menuju ke meja Anda. Pesanan akan segera diproses.
            </p>

            <button
              onClick={() => {
                setShowConfirmation(false);
                setCart([]);
                setSelectedTable(null);
              }}
              className="mt-6 w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;