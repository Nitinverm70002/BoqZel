'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, ChevronRight } from 'lucide-react';
import { TrendingRanked as RTrending, Mood as TMood } from '@/types';
import * as Icons from 'lucide-react';

export const TrendingRankedItem = ({ item }: { item: RTrending }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-boq-teal-500/30 transition-all cursor-pointer"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
          <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
        </div>
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-boq-teal-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-boq-dark-900">
           {item.rank}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-boq-text-primary group-hover:text-boq-teal-400 transition-colors truncate">
          {item.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-boq-rose-400">
            <Flame size={12} className="fill-boq-rose-500" />
            <span>{item.trend}</span>
          </div>
          <span className="text-[10px] text-boq-text-muted font-bold tracking-wider uppercase">this week</span>
        </div>
      </div>
      
      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-boq-teal-500/10 group-hover:border-boq-teal-500/20 transition-all">
         <TrendingUp size={16} className="text-boq-teal-400" />
      </div>
    </motion.div>
  );
};

export const MoodTile = ({ mood }: { mood: TMood }) => {
  // @ts-ignore - Dynamic icon loading based on string name
  const Icon = Icons[mood.icon as keyof typeof Icons] || Icons.Compass;
  
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center justify-center gap-3 p-6 glass rounded-[2rem] border border-white/5 hover:border-boq-teal-500/40 transition-all group"
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] shadow-lg"
        style={{ backgroundColor: `${mood.color}15`, border: `1px solid ${mood.color}30` }}
      >
        <Icon size={28} style={{ color: mood.color }} />
      </div>
      <span className="font-bold text-boq-text-secondary group-hover:text-boq-text-primary transition-colors uppercase tracking-widest text-[11px]">
        {mood.label}
      </span>
    </motion.button>
  );
};

export const MoodTiles = ({ moods }: { moods: TMood[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {moods.map((mood) => (
        <MoodTile key={mood.id} mood={mood} />
      ))}
    </div>
  );
};
