// app/page.tsx
import Header from '@/components/header';
import Features from '@/components/features';
import Carousel from '@/components/carousel';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import MenuSection from '@/components/MenuSection';
import ReservationSection from '@/components/ReservationSection';

import { Contact } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Carousel />
      <Features />
      <AboutSection />
      <MenuSection />
      <Testimonials />
      <ReservationSection />
      <Contact />
      <Footer />
    </div>
  );
}