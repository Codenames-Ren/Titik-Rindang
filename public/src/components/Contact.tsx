'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Clock, Send, MessageSquare } from 'lucide-react';

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  color: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      details: ["+62 812-3456-7890", "+62 857-9876-5432"],
      color: "text-green-800"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@rindangcoffee.com", "order@rindangcoffee.com"],
      color: "text-green-800"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      details: ["Jl. Rindang Hijau No. 123", "Jakarta Selatan, DKI Jakarta 12345"],
      color: "text-green-800"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Jam Buka",
      details: ["Senin - Jumat: 07.00 - 22.00", "Sabtu - Minggu: 08.00 - 23.00"],
      color: "text-green-800"
    }
  ];

  const socialMedia = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "@rindangcoffee",
      followers: "10K Followers",
      color: "from-purple-600 to-pink-500"
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Rindang Coffee",
      followers: "8K Likes",
      color: "from-blue-600 to-blue-700"
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4"><br />
            <span className="text-green-800 text-sm font-semibold tracking-wider uppercase bg-green-100 px-4 py-2 rounded-full">
              Hubungi Kami
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Mari Terhubung Dengan Kami
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ada pertanyaan atau ingin reservasi? Tim kami siap membantu Anda
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kirim Pesan</h3>
            </div>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-800 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Terima Kasih!</h4>
                <p className="text-gray-600">Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="+62 812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">Pesan</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Follow Kami</h4>
              <div className="space-y-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        {social.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{social.name}</div>
                        <div className="text-sm text-gray-500">{social.followers}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg mb-16">
          <div className="bg-gradient-to-br from-green-50 to-green-100 h-96 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-green-800 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Lokasi Kami</h4>
              <p className="text-gray-600">Google Maps Integration</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-8 lg:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">☕</div>
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Kunjungi Kami Hari Ini!
            </h3>
            <p className="text-green-100 text-lg mb-6">
              Nikmati pengalaman minum kopi yang tak terlupakan di bawah naungan pohon rindang
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl">
                Reservasi Sekarang
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-200">
                Lihat Lokasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;