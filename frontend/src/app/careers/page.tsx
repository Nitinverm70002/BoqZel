'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CareersPage() {
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
              Join the Vanguard
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Building the Future of <br />
              <span className="text-gradient-teal">Exploration.</span>
            </h1>
            <p className="text-xl text-boq-text-secondary leading-relaxed font-light max-w-2xl mx-auto">
              At BoqZel, we are redefining the intersection of AI and Hospitality. 
              We seek visionaries, engineers, and curators to join our mission of simplifying global travel.
            </p>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-32">
            
            {/* Culture */}
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
                Our Culture
              </h2>
              <p className="text-lg text-boq-text-secondary leading-relaxed max-w-3xl">
                We value craftsmanship, innovation, and intellectual curiosity. 
                At BoqZel, we don&apos;t just build software; we build high-fidelity experiences 
                that empower travelers across the globe.
              </p>
            </motion.section>

            {/* Why BoqZel */}
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
                Why BoqZel?
              </h2>
              <p className="text-lg text-boq-text-secondary leading-relaxed max-w-3xl ml-auto">
                You will be working on cutting-edge AI problems while maintaining a focus on human experience. 
                We operate with transparency, speed, and a commitment to quality.
              </p>
            </motion.section>

            {/* The BoqZel Promise */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group mt-24"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-boq-teal-500/20 via-boq-indigo-500/20 to-boq-teal-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative px-8 md:px-16 py-20 rounded-[2rem] bg-boq-dark-800/80 border border-white/10 backdrop-blur-3xl text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-boq-teal-500/50 to-transparent" />
                
                <span className="text-boq-teal-400 font-black text-xs tracking-[0.3em] uppercase mb-6 block">
                  The Manifesto
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-tight">
                  The BoqZel <span className="text-gradient-teal">Promise.</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-12 text-left max-w-5xl mx-auto mb-12">
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg">Uncompromising Quality</h3>
                    <p className="text-boq-text-secondary text-sm leading-relaxed">
                      We don&apos;t settle for &quot;good enough.&quot; Every pixel, every line of code, and every curated stay is a testament to our pursuit of perfection.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg">Human-Centric AI</h3>
                    <p className="text-boq-text-secondary text-sm leading-relaxed">
                      We believe technology should dissolve into the background. Our AI is built to empower human intuition, not replace it.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg">Radical Transparency</h3>
                    <p className="text-boq-text-secondary text-sm leading-relaxed">
                      From our internal operations to our user pricing, honesty is our default. We build trust through clarity and consistency.
                    </p>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5">
                  <p className="text-boq-text-muted text-sm italic mb-4">
                    Interested in joining a team that lives by these values?
                  </p>
                  <a 
                    href="mailto:boqzel676@gmail.com"
                    className="inline-flex items-center gap-2 text-white font-bold hover:text-boq-teal-400 transition-colors"
                  >
                    Send us your portfolio &rarr; 
                    <span className="text-boq-text-muted font-normal ml-2">boqzel676@gmail.com</span>
                  </a>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
