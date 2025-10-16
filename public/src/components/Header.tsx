'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Jika halaman saat ini putih (contoh: /about), header langsung solid
  const isWhitePage = pathname === '/about' || pathname === '/menu' || pathname === '/reservation' || pathname === '/testimonials' || pathname === '/contact';

  useEffect(() => {
    if (isWhitePage) {
      // Jika di halaman putih, header langsung solid tanpa scroll listener
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWhitePage]);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservation', href: '/reservation' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? isWhitePage
            ? 'bg-green-800 shadow-md' // halaman putih → hijau solid
            : 'bg-white shadow-md' // scroll di halaman lain → putih
          : 'bg-transparent backdrop-blur-md' // awalnya transparan (misal di Home)
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isScrolled
                  ? isWhitePage
                    ? 'bg-white'
                    : 'bg-green-800'
                  : 'bg-green-800/90'
              }`}
            >
              <span
                className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled && isWhitePage ? 'text-green-800' : 'text-white'
                }`}
              >
                T
              </span>
            </div>
            <div>
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled
                    ? isWhitePage
                      ? 'text-white'
                      : 'text-green-800'
                    : 'text-white'
                }`}
              >
                Titik Rindang
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isScrolled
                    ? isWhitePage
                      ? 'text-gray-200'
                      : 'text-gray-600'
                    : 'text-gray-100'
                }`}
              >
                Premium Coffee Experience
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors duration-200 font-medium ${
                    isScrolled
                      ? isWhitePage
                        ? isActive
                          ? 'text-white font-semibold border-b-2 border-white'
                          : 'text-gray-100 hover:text-white'
                        : isActive
                        ? 'text-green-800 font-semibold border-b-2 border-green-800'
                        : 'text-gray-700 hover:text-green-800'
                      : isActive
                      ? 'text-green-300 font-semibold border-b-2 border-green-300'
                      : 'text-white hover:text-green-300'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              className={`transition-colors ${
                isScrolled
                  ? isWhitePage
                    ? 'text-white hover:text-gray-200'
                    : 'text-green-800 hover:text-green-600'
                  : 'text-white hover:text-green-300'
              }`}
            >
              <User size={24} />
            </button>
            <button
              className={`md:hidden transition-colors ${
                isScrolled
                  ? isWhitePage
                    ? 'text-white'
                    : 'text-green-800'
                  : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav
            className={`md:hidden pb-4 space-y-2 rounded-lg mt-2 transition-all ${
              isScrolled
                ? isWhitePage
                  ? 'bg-green-700/90 backdrop-blur-md'
                  : 'bg-green-100'
                : 'bg-green-900/70 backdrop-blur-md'
            }`}
          >
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-4 rounded transition-colors ${
                    isScrolled
                      ? isWhitePage
                        ? isActive
                          ? 'text-white bg-green-800 font-semibold'
                          : 'text-gray-100 hover:text-white hover:bg-green-800/60'
                        : isActive
                        ? 'text-green-800 bg-green-50 font-semibold'
                        : 'text-gray-800 hover:text-green-800 hover:bg-green-50'
                      : isActive
                      ? 'text-green-300 bg-green-800/50 font-semibold'
                      : 'text-white hover:text-green-300 hover:bg-green-800/30'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
