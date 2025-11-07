'use client';

import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const quickLinks = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Menu", href: "/menu" },
    { label: "Kontak", href: "/contact" },
    { label: "Testimonials", href: "/testimonials" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="relative w-11 h-11 bg-gradient-to-br from-green-800 to-green-600 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
                <FontAwesomeIcon icon={faMugHot} className="text-white text-2xl" />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-green-800">Titik Rindang</h3>
                <p className="text-sm italic text-gray-600">Premium Coffee Experience</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Coffee shop yang menyediakan pengalaman kopi terbaik untuk Anda.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-green-800 hover:bg-green-50 transition-all duration-200 shadow-sm"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Link Cepat
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-800 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+00123456789" className="text-sm text-gray-600 hover:text-green-800">
                    +00 123 456 789
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:info@titikrindang.com" className="text-sm text-gray-600 hover:text-green-800">
                    info@titikrindang.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">
                    Jl. Kopi Rindang No. 123<br />
                    Kab. Bogor, Jawa Barat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2025 Titik Rindang. All Rights Reserved.
            </p>
            
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-600 hover:text-green-800">Privacy Policy</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-gray-600 hover:text-green-800">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-900 transition-all duration-200 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;