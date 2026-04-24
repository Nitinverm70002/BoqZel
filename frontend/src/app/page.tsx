import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import AboutSection from '@/components/home/AboutSection';
import FeatureSection from '@/components/home/FeatureSection';
import ScrollSection from '@/components/home/ScrollSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryCarousel />
        <AboutSection />
        <FeatureSection />
        <ScrollSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
