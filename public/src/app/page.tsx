// app/page.tsx
import Features from '@/components/Features';
import Carousel from '@/components/Carousel';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import MenuSection from '@/components/MenuSection';
import ReservationSection from '@/components/ReservationSection';

import { Contact } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Carousel />
      <Features />
      <AboutSection />
      <MenuSection />
      <Testimonials />
      <ReservationSection />
    </div>
  );
}