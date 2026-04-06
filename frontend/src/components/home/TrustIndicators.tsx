'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Headphones, Shield, Star } from 'lucide-react';

const indicators = [
  {
    icon: BadgeCheck,
    title: 'Verified Stays',
    description: 'Quality you can trust',
    color: 'text-boq-teal-400',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: "We're here for you",
    color: 'text-boq-teal-400',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Your safety first',
    color: 'text-boq-teal-400',
  },
];

export default function TrustIndicators() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" id="trust-indicators">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-boq-dark-500 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className={item.color} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-boq-text-primary">
                    {item.title}
                  </div>
                  <div className="text-xs text-boq-text-muted">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
