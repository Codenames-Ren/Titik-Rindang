'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CashierSection from '@/components/CashierSection';

export default function CashierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return <CashierSection />;
}
