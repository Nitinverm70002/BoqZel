'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-boq-dark-900 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <span className="text-boq-teal-400 font-bold text-sm tracking-widest uppercase mb-4 block">
              Our Vision
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Transcending <br />
              <span className="text-gradient-teal">The Ordinary.</span>
            </h1>
            <p className="text-xl text-boq-text-secondary leading-relaxed font-light max-w-2xl mx-auto">
              BoqZel was founded on the belief that travel is the ultimate form of self-discovery. 
              We leverage advanced AI to simplify the logistics, so you can rediscover the soul of exploration.
            </p>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-32">
            
            {/* Mission */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-12 top-0 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none">
                01
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
                The Mission
              </h2>
              <div className="text-lg text-boq-text-secondary leading-relaxed space-y-6 max-w-3xl">
                <p>
                  In an era of mass-market tourism, true boutique experiences are becoming harder to find. 
                  BoqZel serves as a digital compass, pointing you toward the extraordinary. 
                  We don&apos;t just list destinations; we curate memories.
                </p>
                <p>
                  Our team of curators and engineers work in harmony to identify properties and 
                  experiences that meet our rigorous standards of luxury, authenticity, and design excellence.
                </p>
              </div>
            </motion.section>

            {/* AI Philosophy */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative text-right"
            >
              <div className="absolute -right-12 top-0 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none">
                02
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
                AI with Intent
              </h2>
              <div className="text-lg text-boq-text-secondary leading-relaxed space-y-6 max-w-3xl ml-auto">
                <p>
                  Technology should never be a barrier between you and your destination. 
                  At BoqZel, we use Artificial Intelligence to handle the complex variables of travel planning 
                  — from dynamic pricing to itinerary optimization — so you can enjoy a friction-less journey.
                </p>
                <p>
                  Our AI doesn&apos;t make choices for you; it empowers you with choices that matter.
                </p>
              </div>
            </motion.section>



          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
