'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin, ShieldCheck, Globe } from 'lucide-react';
import { Destination } from '@/types';

interface TrendingCardProps {
  destination: Destination;
}

export const TrendingCard = ({ destination }: TrendingCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative glass rounded-2xl overflow-hidden card-hover preserve-3d"
    >
      {/* Image Section */}
      <div className="relative h-[240px] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-boq-dark-900 via-transparent to-transparent opacity-60" />
        
        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all z-10"
        >
          <motion.div animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}>
            <Heart
              size={18}
              className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'}
              strokeWidth={2.5}
            />
          </motion.div>
        </button>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {destination.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-boq-teal-500/20 backdrop-blur-md border border-boq-teal-400/30 text-boq-teal-300 rounded-lg shadow-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-boq-text-primary group-hover:text-boq-teal-400 transition-colors">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1.5 text-boq-text-secondary text-sm">
              <MapPin size={14} className="text-boq-teal-500" />
              <span>{destination.country}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-boq-amber-500/10 px-2 py-1 rounded-lg border border-boq-amber-400/20">
              <Star size={14} className="fill-boq-amber-400 text-boq-amber-400" />
              <span className="text-sm font-bold text-boq-amber-300">{destination.rating}</span>
            </div>
            <span className="text-[10px] text-boq-text-muted mt-1">({destination.reviewCount} reviews)</span>
          </div>
        </div>

        <p className="text-sm text-boq-text-secondary line-clamp-2 mb-4 leading-relaxed">
          {destination.description}
        </p>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-boq-text-muted uppercase font-bold tracking-widest">Starts from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-boq-teal-400">${destination.averageNightlyPrice || 240}</span>
              <span className="text-xs text-boq-text-muted">/night</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {destination.verified && (
               <div className="p-2 rounded-xl bg-boq-teal-500/10 text-boq-teal-400 border border-boq-teal-400/20" title="Verified Destination">
                 <ShieldCheck size={18} />
               </div>
            )}
            <button className="p-2 ml-1 rounded-xl glass-button text-boq-text-primary hover:text-boq-teal-400">
               <Globe size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TrendingGrid = ({ destinations }: { destinations: Destination[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {destinations.map((dest) => (
        <TrendingCard key={dest.id} destination={dest} />
      ))}
    </div>
  );
};
