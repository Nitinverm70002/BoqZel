"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-[2rem] relative bg-boq-dark-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out border border-white/5",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-50"
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover absolute inset-0"
      />
      {/* Permanent bottom gradient for title legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
      
      <div
        className={cn(
          "absolute inset-0 flex items-end py-10 px-6 transition-all duration-300",
          hovered === index ? "bg-black/40 backdrop-blur-[2px]" : "bg-transparent"
        )}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="text-2xl md:text-3xl font-bold text-white font-apple tracking-tight">
            {card.title}
          </div>
          <div 
            className={cn(
              "transition-all duration-300 overflow-hidden",
              hovered === index ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
            )}
          >
            {card.description && (
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {card.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
);

Card.displayName = "Card";

type CardData = {
  title: string;
  src: string;
  description?: string;
};

export function FocusCards({ cards }: { cards: CardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
