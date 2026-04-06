'use client';

import { motion } from 'framer-motion';
import { FocusCards } from '@/components/ui/focus-cards';

const features = [
  {
    title: 'AI Itinerary Scout',
    src: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop',
    description: 'Bespoke daily plans generated in seconds using our proprietary AI travel model.',
  },
  {
    title: 'Verified Stays Only',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    description: 'Every hotel and apartment is handpicked and personally verified for safety and luxury.',
  },
  {
    title: 'Unified Checkout',
    src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
    description: 'Book your entire trip, including flights and stays, in a single seamless transaction.',
  },
  {
    title: 'Exclusive Network',
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop',
    description: 'Access private tours and local experiences reserved strictly for the BoqZel community.',
  },
  {
    title: 'Real-time Assistant',
    src: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2014&auto=format&fit=crop',
    description: 'Your digital concierge is available 24/7 to handle changes and provide local tips.',
  },
  {
    title: 'Smart Move Around',
    src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    description: 'Effortless transit planning across local transport, premium rentals, and private drivers.',
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 bg-boq-dark-900 border-t border-boq-border" id="feature-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-boq-dark-800 border border-boq-border text-boq-text-muted text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Core Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-outfit text-4xl md:text-5xl font-bold text-boq-text-primary mb-6"
          >
            Designed for the <span className="text-gradient-teal">Intelligent</span> Traveler.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-boq-text-secondary text-lg font-light max-w-2xl mx-auto"
          >
            BoqZel integrates sophisticated technology into every touchpoint of your journey, 
            ensuring your travel is as effortless as possible.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FocusCards cards={features} />
        </motion.div>
      </div>
    </section>
  );
}
