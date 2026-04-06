'use client';

import { motion } from 'framer-motion';
import { Search, Sliders, CalendarDays, CreditCard, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover & Search',
    description: 'Browse destinations, filter by style, and find your perfect getaway.',
    color: 'from-boq-teal-500 to-boq-teal-400',
  },
  {
    icon: Sliders,
    title: 'Plan & Customize',
    description: 'Build your itinerary day by day with AI-powered suggestions.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: CalendarDays,
    title: 'Book Everything',
    description: 'Flights, stays, cars, and experiences — all in one checkout.',
    color: 'from-purple-500 to-violet-400',
  },
  {
    icon: Sparkles,
    title: 'Experience & Enjoy',
    description: 'Live tracking, reminders, and nearby suggestions during your trip.',
    color: 'from-amber-500 to-orange-400',
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" id="how-it-works">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-bold text-boq-text-primary mb-2">
          How It Works
        </h2>
        <p className="text-sm text-boq-text-muted">
          From inspiration to experience — 4 simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="text-xs font-bold text-boq-text-muted mb-2 uppercase tracking-wider">
                Step {idx + 1}
              </div>
              <h3 className="text-sm font-bold text-boq-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-boq-text-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
