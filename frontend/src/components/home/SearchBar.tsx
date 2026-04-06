'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Search, Sparkles } from 'lucide-react';

const searchFields = [
  {
    icon: MapPin,
    label: 'Where to?',
    value: 'Juba, South Superiences',
    id: 'search-destination',
  },
  {
    icon: Calendar,
    label: 'Dates',
    value: 'May 20 - May 25',
    id: 'search-dates',
  },
  {
    icon: Users,
    label: 'Who?',
    value: '2 Adults, 1 Child',
    id: 'search-travelers',
  },
  {
    icon: DollarSign,
    label: 'Budget',
    value: '$1,500 - $2,500',
    id: 'search-budget',
  },
];

export default function SearchBar() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12" id="search-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-boq-teal-400" />
          <span className="text-sm font-semibold text-boq-text-primary">
            Plan Your Trip Easily
          </span>
          <span className="text-xs text-boq-text-muted ml-1">
            Tell us your preferences and we&apos;ll build the perfect itinerary for you.
          </span>
        </div>

        {/* Search Fields */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {searchFields.map((field, idx) => {
            const Icon = field.icon;
            return (
              <button
                key={field.id}
                id={field.id}
                className="flex-1 flex items-center gap-3 px-4 py-3 bg-boq-dark-600/80 hover:bg-boq-dark-500 rounded-xl border border-boq-border transition-all duration-200 cursor-pointer text-left"
              >
                <Icon size={16} className="text-boq-teal-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-boq-text-muted font-medium">
                    {field.label}
                  </div>
                  <div className="text-sm text-boq-text-primary font-medium">
                    {field.value}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Search Button */}
          <button
            className="flex items-center justify-center gap-2 px-8 py-3 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-semibold rounded-xl transition-all duration-300 glow-teal-sm hover:glow-teal cursor-pointer whitespace-nowrap"
            id="search-trips-btn"
          >
            Search Trips
            <span className="text-lg">→</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
