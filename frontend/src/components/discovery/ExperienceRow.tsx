'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock, Users } from 'lucide-react';
import { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="min-w-[320px] max-w-[320px] glass rounded-2xl overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title || 'Experience image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-1 border border-white/10">
          <Star size={12} className="fill-boq-amber-400 text-boq-amber-400" />
          <span className="text-xs font-bold text-white">{experience.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-boq-text-primary group-hover:text-boq-teal-400 transition-colors line-clamp-1 mb-1">
          {experience.title}
        </h4>
        <p className="text-xs text-boq-text-secondary mb-3 flex items-center gap-1">
           {experience.location}
        </p>
        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-boq-text-muted">
            <Clock size={14} className="text-boq-teal-500" />
            <span className="text-[11px] font-medium">{experience.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-boq-text-muted">
            <Users size={14} className="text-boq-teal-500" />
            <span className="text-[11px] font-medium">Group</span>
          </div>
          <div className="flex-1" />
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-boq-text-muted uppercase font-bold tracking-tighter">per person</span>
             <span className="text-sm font-black text-boq-teal-400">${experience.pricePerPerson}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ExperienceRow = ({ experiences }: { experiences: Experience[] }) => {
  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
};
