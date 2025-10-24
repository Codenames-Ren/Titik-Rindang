'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Data login admin (bisa kamu ubah sesuai kebutuhan)
    const adminUser = 'admin';
    const adminPass = 'admin123';

    if (username === adminUser && password === adminPass) {
      // Login sukses → redirect ke halaman admin
      router.push('/admin');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mt-20" >
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center">
            <Coffee className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Titik Rindang Admin</h1>
          <p className="text-gray-500 text-sm">Masuk ke dashboard admin</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
