'use client';

import { motion } from 'framer-motion';

const categories = [
  'All',
  'Beaches',
  'Mountains',
  'Cities',
  'Luxury',
  'Adventure',
  'Culture',
  'Wildlife',
];

interface FilterPillsProps {
  activeCategory: string;
  onSetCategory: (category: string) => void;
}

export const FilterPills = ({ activeCategory, onSetCategory }: FilterPillsProps) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSetCategory(category)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
              isActive
                ? 'text-white border-boq-teal-500/50'
                : 'text-boq-text-secondary border-white/5 hover:border-white/10 hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-gradient-to-r from-boq-teal-600 to-boq-teal-400 rounded-full -z-10 shadow-lg shadow-boq-teal-500/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
};
