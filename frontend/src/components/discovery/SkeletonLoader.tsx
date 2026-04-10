'use client';

import { motion } from 'framer-motion';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-shimmer bg-boq-dark-400 rounded-xl ${className}`} />
);

export const TrendingCardSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden h-[400px]">
    <Skeleton className="h-[250px] w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-8" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="pt-4 border-t border-white/5 flex justify-between items-end">
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);

export const ExperienceCardSkeleton = () => (
  <div className="min-w-[300px] glass rounded-2xl overflow-hidden">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  </div>
);

export const TrendingRankedSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-xl border border-white/5">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="h-6 w-12 rounded-full" />
  </div>
);
