"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import emailjs from "emailjs-com";

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  color: string;
}

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // ✅ Smooth Intersection animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // ✅ EmailJS init
  useEffect(() => {
    emailjs.init("R9C7eeOn55ffpsLR2");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await emailjs.send("service_c4pywsa", "template_qtctrhg", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        reply_to: formData.email,
      });

      console.log("✅ EmailJS Success:", result.text);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: any) {
      alert(`Gagal mengirim pesan: ${error.text || JSON.stringify(error)}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      details: ["+62 812-3456-7890", "+62 857-9876-5432"],
      color: "text-green-800",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["rindangtitik@gmail.com"],
      color: "text-green-800",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      details: [
        "Jl. Rindang Hijau No. 123",
        "Puncak Pass, Kab. Bogor, Jawa Barat",
      ],
      color: "text-green-800",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Jam Buka",
      details: [
        "Senin - Jumat: 08.00 - 22.00",
        "Sabtu - Minggu: 08.00 - 24.00",
      ],
      color: "text-green-800",
    },
  ];

  const socialMedia = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "@rindangcoffee",
      followers: "10K Followers",
      color: "from-purple-600 to-pink-500",
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Rindang Coffee",
      followers: "8K Likes",
      color: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Header Smooth */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-block mb-4">
            <br />
            <br />
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

        {/* ✅ Main Content Smooth */}
        <div
          className={`grid lg:grid-cols-2 gap-12 mb-16 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* ✅ Contact Form smooth */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kirim Pesan</h3>
            </div>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-800 rounded-2xl p-8 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Terima Kasih!
                </h4>
                <p className="text-gray-600">
                  Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Fields */}
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-gray-500 border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-gray-500 border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-gray-500 border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="+62 8xx-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border text-gray-500 border-gray-200 focus:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Kirim Pesan</span>
                </button>
              </form>
            )}
          </div>

          {/* ✅ Contact Info Smooth */}
          <div
            className={`space-y-6 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        {info.title}
                      </h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 text-lg mb-4">
                Follow Kami
              </h4>
              <div className="space-y-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                      >
                        {social.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {social.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {social.followers}
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Map Smooth */}
        <div
          className={`bg-white border border-gray-100 rounded-3xl p-6 shadow-lg mb-16 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center mt-4">
              Lokasi Kami
            </h4>
            <div className="w-full h-96 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24146.775727256474!2d106.99804713601097!3d-6.702786219188843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b41da3000801%3A0xf076753f09646828!2sPuncak!5e1!3m2!1sen!2sid!4v1762496903405!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* ✅ CTA Smooth */}
        <div
          className={`bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-8 lg:p-12 text-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-gradient-to-br from-white to-green-50 rounded-2xl flex items-center justify-center shadow-2xl">
                <FontAwesomeIcon
                  icon={faMugHot}
                  className="text-green-800 text-4xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-50" />
              </div>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Kunjungi Kami Hari Ini!
            </h3>
            <p className="text-green-100 text-lg mb-6">
              Nikmati pengalaman minum kopi yang tak terlupakan di bawah naungan
              pohon rindang
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/reservation"
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Reservasi Sekarang
              </a>

              <a
                href="https://maps.app.goo.gl/gMrneHYa329Y7vM16"
                target="_blank"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-200"
              >
                Lihat Lokasi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
