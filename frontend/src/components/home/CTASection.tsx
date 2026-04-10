'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function CTASection() {
  return (
    <section className="py-24 bg-boq-dark-900 border-t border-boq-border" id="cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CardSpotlight 
          className="relative p-12 md:p-20 rounded-[3rem] overflow-hidden border border-white/10 bg-boq-dark-800/50"
          radius={400}
        >
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-outfit text-4xl md:text-6xl font-bold text-boq-text-primary mb-8 tracking-tight">
              Ready to <span className="text-gradient-teal">Experience</span> the Future of Travel?
            </h2>
            <p className="text-boq-text-secondary text-xl font-light mb-12 leading-relaxed">
              Join thousands of discerning travelers using BoqZel to plan, book, and enjoy their most memorable trips.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-boq-teal-500 hover:bg-boq-teal-400 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-boq-teal-500/20 flex items-center justify-center gap-2 group"
              >
                Create Your Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </CardSpotlight>
      </div>
    </section>
  );
}
