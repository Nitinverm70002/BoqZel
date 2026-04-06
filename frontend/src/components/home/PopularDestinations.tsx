'use client';

import { motion } from 'framer-motion';
import { Star, Heart, BadgeCheck, ChevronRight } from 'lucide-react';
import { destinations } from '@/data/mockData';

export default function PopularDestinations() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" id="popular-destinations">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-boq-text-primary">
          Popular in South Sudan
        </h2>
        <button className="flex items-center gap-1 text-sm text-boq-text-muted hover:text-boq-teal-400 transition-colors">
          See all
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.slice(0, 4).map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative glass rounded-2xl overflow-hidden card-hover cursor-pointer"
            id={`dest-${dest.id}`}
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-boq-dark-900/80 via-transparent to-transparent" />

              {/* Heart Button */}
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-boq-dark-900/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-rose-400 transition-colors">
                <Heart size={16} />
              </button>

              {/* Logo watermark */}
              <div className="absolute top-3 left-3 w-6 h-6 rounded bg-boq-dark-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-[8px] font-bold text-boq-teal-400">B</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-boq-text-primary mb-1">
                {dest.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < Math.floor(dest.rating)
                          ? 'text-boq-amber-400 fill-boq-amber-400'
                          : 'text-boq-dark-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-boq-text-primary font-medium">
                  {dest.rating}
                </span>
                <span className="text-xs text-boq-text-muted">
                  ({dest.reviewCount})
                </span>
              </div>

              {dest.verified && (
                <div className="flex items-center gap-1">
                  <BadgeCheck size={12} className="text-boq-teal-400" />
                  <span className="text-[10px] text-boq-teal-400 font-medium">
                    Verified
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
