'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Menu, X, LogOut } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons'; // ✅ gunakan ini

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isWhitePage = pathname !== '/';
  const isAdminPage = pathname === '/admin';

  useEffect(() => {
    if (pathname === '/') {
      setIsScrolled(false);
      const handleScroll = () => {
        if (window.scrollY >= 550) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [pathname]);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservation', href: '/reservation' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar dari halaman admin?')) {
      router.push('/');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isWhitePage || isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* === LOGO with FontAwesome === */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md ${
                isWhitePage || isScrolled
                  ? 'bg-gradient-to-br from-green-800 to-green-600'
                  : 'bg-green-700/90'
              }`}
            >
              <FontAwesomeIcon icon={faMugHot} className="text-white text-2xl" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <div>
              <h1
                className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                  isWhitePage || isScrolled ? 'text-green-800' : 'text-white'
                }`}
              >
                Titik Rindang
              </h1>
              <p
                className={`text-sm italic transition-colors duration-300 ${
                  isWhitePage || isScrolled
                    ? 'text-gray-600'
                    : 'text-gray-200/90'
                }`}
              >
                Premium Coffee Experience
              </p>
            </div>
          </Link>

          {/* === Navigation & Icons tetap sama === */}
          {!isAdminPage && (
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors duration-200 font-medium ${
                      isWhitePage || isScrolled
                        ? isActive
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
          )}

          <div className="flex items-center space-x-4">
            {isAdminPage ? (
              <button
                onClick={handleLogout}
                className={`transition-colors ${
                  isWhitePage || isScrolled
                    ? 'text-green-800 hover:text-green-600'
                    : 'text-white hover:text-green-300'
                }`}
              >
                <LogOut size={24} />
              </button>
            ) : (
              <Link
                href="/login"
                className={`transition-colors ${
                  isWhitePage || isScrolled
                    ? 'text-green-800 hover:text-green-600'
                    : 'text-white hover:text-green-300'
                }`}
              >
                <User size={24} />
              </Link>
            )}

            <button
              className={`md:hidden transition-colors ${
                isWhitePage || isScrolled ? 'text-green-800' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {!isAdminPage && isMenuOpen && (
          <nav
            className={`md:hidden pb-4 space-y-2 rounded-lg mt-2 transition-all ${
              isWhitePage || isScrolled
                ? 'bg-green-100'
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
                    isWhitePage || isScrolled
                      ? isActive
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
