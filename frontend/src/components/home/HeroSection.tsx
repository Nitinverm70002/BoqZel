'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';

export default function HeroSection() {
  const globeMarkers: GlobeMarker[] = [
    { lat: 25.2048, lng: 55.2708, src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=100&fit=crop', label: 'Dubai' },
    { lat: 48.8566, lng: 2.3522, src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&h=100&fit=crop', label: 'Paris' },
    { lat: 29.9792, lng: 31.1342, src: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=100&h=100&fit=crop', label: 'Cairo' },
    { lat: -33.9249, lng: 18.4241, src: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=100&h=100&fit=crop', label: 'Cape Town' },
    { lat: 31.6295, lng: -7.9811, src: 'https://images.unsplash.com/photo-1539020140131-016462703977?w=100&h=100&fit=crop', label: 'Marrakech' },
    { lat: -1.5000, lng: 35.0000, src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100&h=100&fit=crop', label: 'Serengeti' },
    { lat: 4.8517, lng: 31.5822, src: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=100&h=100&fit=crop', label: 'Juba, South Sudan' },
    { lat: 34.0522, lng: -118.2437, src: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=100&h=100&fit=crop', label: 'Los Angeles' },
    { lat: -33.8688, lng: 151.2093, src: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=100&h=100&fit=crop', label: 'Sydney' },
    { lat: 1.3521, lng: 103.8198, src: 'https://images.unsplash.com/photo-1525625232717-1c6cdc15e61e?w=100&h=100&fit=crop', label: 'Singapore' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden pt-20" id="hero-section">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[15s] hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1684100096410-fd39cdff91a3?w=1920&h=1080&fit=crop')`,
          }}
        />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Deep Matte Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-boq-dark-900/40 via-boq-dark-900/90 to-boq-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-boq-dark-900/95 via-boq-dark-900/40 to-transparent" />
        
        {/* Spotlight effect for the globe area */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-boq-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left font-apple">
            {/* Sparkle Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-boq-dark-500/40 border border-boq-amber-500/20 text-boq-amber-400 text-xs font-medium mb-6 backdrop-blur-lg shadow-xl shadow-boq-amber-500/5 hover:border-boq-amber-500/40 transition-colors cursor-default"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Elevating Every Moment</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-apple text-4xl md:text-6xl lg:text-7xl font-bold leading-[1] mb-6 tracking-tighter text-boq-text-primary"
            >
              <span className="text-white">
                Elevate
              </span>{" "}
              Your <br />
              <span className="text-boq-teal-400">
                Experience
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="font-apple text-base md:text-lg text-boq-text-secondary max-w-lg mb-10 leading-relaxed font-light"
            >
              Immerse yourself in curated travel experiences, powered by BoqZel&apos;s AI. 
              Discover, plan, and book your next masterpiece journey today.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-7 py-3.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-boq-teal-500/10 hover:shadow-boq-teal-500/30 flex items-center justify-center gap-2.5 group"
              >
                Get Started
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 glass text-boq-text-primary hover:bg-white/10 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center border border-white/10"
              >
                Log In
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative w-full h-[400px] lg:h-[700px] flex items-center justify-center lg:justify-end pr-0 lg:pr-8"
          >
            <Globe3D 
              markers={globeMarkers}
              className="w-full h-full"
              config={{
                autoRotateSpeed: 0.5,
                showAtmosphere: false,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
