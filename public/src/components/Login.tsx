'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Untuk loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Panggil API backend kamu di port 8080
      // (Sesuai dengan main.go dan authRoutes.go)
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 2. Kirim username & password sebagai JSON
        // (Sesuai dengan yang diharapkan loginController.go)
        body: JSON.stringify({ username, password }),
      });

      // 3. Tangani respon dari backend
      const data = await response.json();

      if (response.ok) {
        // Jika login sukses (backend kirim status 200 OK)
        
        // 4. Simpan token di localStorage
        // (Backend kamu mengirim "token", "role", "username")
        localStorage.setItem('token', data.token);

        // 5. Cek role dari respon backend
        if (data.role === 'admin') {
          // Login sukses & role adalah admin → redirect
          router.push('/admin');
        } else {
          // Login sukses tapi bukan admin
          setError('Anda berhasil login, tetapi bukan admin.');
        }

      } else {
        // Jika login gagal (backend kirim status 401 atau lainnya)
        // Tampilkan pesan error dari backend ("Invalid username or password")
        setError(data.error || 'Username atau password salah.');
      }
    } catch (err) {
      // Tangani jika backend mati atau error jaringan
      setError('Gagal terhubung ke server. Coba lagi nanti.');
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mt-20" >
        {/* Logo (Tidak berubah) */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center">
            <Coffee className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Titik Rindang Admin</h1>
          <p className="text-gray-500 text-sm">Masuk ke dashboard admin</p>
        </div>

        {/* Form Login (Fungsi submit diubah) */}
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
              disabled={isLoading} // Tambahan: nonaktifkan saat loading
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
              disabled={isLoading} // Tambahan: nonaktifkan saat loading
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-green-400"
            disabled={isLoading} // Tambahan: nonaktifkan saat loading
          >
            {/* Ubah teks tombol saat loading */}
            {isLoading ? 'Loading...' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;