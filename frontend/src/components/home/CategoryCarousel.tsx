'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
  useSpring,
} from 'framer-motion';
import Image from 'next/image';

const categories = [
  {
    id: '01',
    title: 'Romantic Escape',
    label: 'Perfect for couples',
    image: 'https://images.unsplash.com/photo-1510018572596-e40e2619b412?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '02',
    title: 'Adventure',
    label: 'Thrill & exploration',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '03',
    title: 'Weekend Getaway',
    label: 'Short & memorable',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '04',
    title: 'Budget Travel',
    label: 'Smart & affordable',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '05',
    title: 'Luxury',
    label: 'Premium experiences',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop',
  },
];

// Duplicate for smooth infinite scroll
const extendedCategories = [...categories, ...categories, ...categories];

const CARD_WIDTH = 300;
const GAP = 32;
const STEP = CARD_WIDTH + GAP;

function MarqueeCard({ cat, index, x, containerWidth }: { cat: any, index: number, x: any, containerWidth: number }) {
  // Calculate relative position based on global x and index
  const itemX = useTransform(x, (latestX: number) => {
    const totalWidth = extendedCategories.length * STEP;
    let pos = (latestX + index * STEP) % totalWidth;
    if (pos < -1000) pos += totalWidth; // Pre-buffer for early entries
    return pos;
  });

  // Concave Perspective Mapping (Small in center, Large at edges)
  // Tightening the centerPos range to 600px for a sharper curve
  const centerPos = containerWidth / 2 - CARD_WIDTH / 2;
  const RANGE = 700;
  
  // Tilted outwards: Positive rotateY at the left edge, Negative at the right edge
  const rotateY = useTransform(itemX, 
    [centerPos - RANGE, centerPos, centerPos + RANGE], 
    [40, 0, -40]
  );
  
  // Recessed in the center, pulled forward at the edges
  const z = useTransform(itemX, 
    [centerPos - RANGE, centerPos, centerPos + RANGE], 
    [0, -250, 0]
  );

  // Scaled up at edges, slightly smaller in the center (concave look)
  const scale = useTransform(itemX,
    [centerPos - RANGE, centerPos, centerPos + RANGE],
    [1.15, 0.8, 1.15]
  );

  // Fade out smoothly at the very edges of the viewport
  const opacity = useTransform(itemX,
    [centerPos - RANGE - 200, centerPos - RANGE, centerPos, centerPos + RANGE, centerPos + RANGE + 200],
    [0, 1, 0.9, 1, 0]
  );

  return (
    <motion.div
      style={{
        x: itemX,
        rotateY,
        z,
        scale,
        opacity,
        position: 'absolute',
        width: CARD_WIDTH,
        transformStyle: 'preserve-3d',
      }}
      className="flex-shrink-0 group pointer-events-none"
    >
      <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 transition-all duration-700 preserve-3d group-hover:scale-[1.05] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        <Image
          src={cat.image}
          alt={cat.title}
          fill
          sizes="500px"
          priority={index < 3}
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* Subtle glass overlay for that premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>
      
      <div className="text-center group pointer-events-auto">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-boq-orange-500 font-black text-xs tracking-tighter uppercase opacity-80">#{cat.id}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none mb-2">
          {cat.title}
        </h3>
        <p className="text-[10px] text-boq-text-muted mt-1 uppercase tracking-[0.2em] font-bold">
          {cat.label}
        </p>
      </div>
    </motion.div>
  );
}

export default function CategoryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1440);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame((time, delta) => {
    // Normal scroll speed
    const moveBy = (delta * 0.05); // Adjust speed here
    x.set(x.get() - moveBy);
  });

  return (
    <section className="bg-[#050a14] py-32 overflow-hidden border-b border-white/5" id="category-marquee">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-boq-orange-400 font-bold tracking-widest uppercase text-xs mb-4 block"
        >
          Behind the Journeys
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-boq-text-primary mb-8"
        >
          Curious where we go?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-boq-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Explore our most popular travel categories and AI-curated experiences designed for every type of explorer.
        </motion.p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[650px] overflow-hidden perspective-1500 select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 flex items-center bg-transparent preserve-3d">
          {extendedCategories.map((cat, i) => (
            <MarqueeCard 
              key={`${cat.id}-${i}`} 
              cat={cat} 
              index={i} 
              x={x} 
              containerWidth={containerWidth} 
            />
          ))}
        </div>
        
        {/* Optical overlays to enhance the curve */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050a14] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050a14] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
