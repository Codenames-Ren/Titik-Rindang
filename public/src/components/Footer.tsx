// components/Footer.tsx
'use client';

import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  const footerSections: FooterSection[] = [
    {
      title: "About Company",
      links: [
        { label: "About Erna", href: "#" },
        { label: "Affiliate Program", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Awards & Ranking", href: "#" },
        { label: "Erna Careers", href: "#" },
        { label: "Newsroom", href: "#" },
        { label: "Erna Insider", href: "#" },
        { label: "Hours & Locations", href: "#" }
      ]
    },
    {
      title: "Customer Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Track an Order", href: "#" },
        { label: "Return an Item", href: "#" },
        { label: "Gift Card", href: "#" },
        { label: "Report Abuse", href: "#" },
        { label: "Submit and Dispute", href: "#" },
        { label: "Policies & Rules", href: "#" },
        { label: "Redeem Voucher", href: "#" }
      ]
    },
    {
      title: "My Account",
      links: [
        { label: "Login/Register", href: "#" },
        { label: "Browsing History", href: "#" },
        { label: "Order History", href: "#" },
        { label: "Return History", href: "#" },
        { label: "Address Book", href: "#" },
        { label: "Wish Lists", href: "#" },
        { label: "Subscription Orders", href: "#" },
        { label: "Email Notifications", href: "#" }
      ]
    },
    {
      title: "Tools & Resources",
      links: [
        { label: "Become a Supplier", href: "#" },
        { label: "Sell on Erna", href: "#" },
        { label: "Become an Affiliate", href: "#" },
        { label: "Erna Creators", href: "#" },
        { label: "Shop by Brand", href: "#" },
        { label: "Mobile App", href: "#" },
        { label: "Build Showcase", href: "#" },
        { label: "Rules & Policy", href: "#" }
      ]
    }
  ];

  const paymentMethods = [
    { name: 'PayPal', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'Visa', icon: '💳' },
    { name: 'Maestro', icon: '💳' },
    { name: 'American Express', icon: '💳' }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", color: "hover:bg-blue-600" },
    { icon: <Twitter size={20} />, href: "#", color: "hover:bg-sky-500" },
    { icon: <Instagram size={20} />, href: "#", color: "hover:bg-pink-600" },
    { icon: <Linkedin size={20} />, href: "#", color: "hover:bg-blue-700" },
    { icon: <Youtube size={20} />, href: "#", color: "hover:bg-red-600" }
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">Titik Rindang</h3>
                <p className="text-xs text-gray-600">Easy Picking Any Items</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Kami adalah coffee shop yang menyediakan tim informatif untuk pengalaman kopi terbaik Anda.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Got Questions? 24/7 Hotline</p>
                  <a href="tel:+00123456789" className="text-green-800 font-bold text-lg hover:text-green-900">
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
                    Jakarta, Indonesia
                  </p>
                </div>
              </div>
            </div>

            {/* App Download */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">GET IT ON</p>
              <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl">📱</div>
                <div>
                  <p className="text-xs text-gray-600">Download on</p>
                  <p className="text-sm font-bold text-gray-900">Google Play</p>
                </div>
                <div className="ml-auto">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                    QR
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200 shadow-md ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-800 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              Titik Rindang © 2025 <span className="font-semibold">ERNA</span>. All Rights Reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-semibold">We Are Accepting</span>
              <div className="flex space-x-2">
                <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                  <span className="text-xs font-bold text-blue-600">PayPal</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                  <span className="text-xs font-bold text-orange-500">Mastercard</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                  <span className="text-xs font-bold text-blue-700">Visa</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                  <span className="text-xs font-bold text-red-600">Maestro</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                  <span className="text-xs font-bold text-blue-500">Amex</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-900 transition-all duration-200 hover:scale-110"
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