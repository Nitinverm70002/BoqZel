"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, BadgeCheck, Wifi, Waves, Utensils, Car, Shield } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Stay } from "@/types";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  'Free WiFi': <Wifi size={12} />,
  Pool: <Waves size={12} />,
  'Swimming Pool': <Waves size={12} />,
  Restaurant: <Utensils size={12} />,
  Dining: <Utensils size={12} />,
  Parking: <Car size={12} />,
  'Free Parking': <Car size={12} />,
  Security: <Shield size={12} />,
  '24h Security': <Shield size={12} />,
  AC: <Waves size={12} />, // Using waves as a fallback for cool air
  'Air Conditioning': <Waves size={12} />,
};

interface StayCardProps {
  stay: Stay;
  index: number;
  viewMode: "grid" | "list";
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
}

export const StayCard = ({
  stay,
  index,
  viewMode,
  isFavorite,
  onFavoriteToggle,
}: StayCardProps) => {
  const isGrid = viewMode === "grid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative",
        !isGrid && "flex h-80"
      )}
    >
      <CardSpotlight 
        className={cn(
          "h-full w-full overflow-hidden border border-white/10 bg-boq-dark-900/40 backdrop-blur-xl rounded-[2rem] p-0 transition-all hover:border-boq-teal-500/30"
        )}
        radius={240}
        color="rgba(20, 184, 166, 0.1)"
      >
        <div className={cn(
          "w-full overflow-hidden",
          isGrid ? "flex flex-col h-full" : "flex flex-row h-[320px]"
        )}>
          {/* Image Section */}
          <div className={cn(
            "relative overflow-hidden shrink-0",
            isGrid ? "h-64 w-full" : "w-[400px] h-full"
          )}>
            <Image
              src={stay.image}
              alt={stay.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-boq-dark-900/90 via-transparent to-transparent opacity-60" />
            
            {/* Top Actions */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                {stay.type}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(stay.id);
                }}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110 active:scale-95 group/heart"
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-all duration-300",
                    isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "group-hover/heart:text-rose-400"
                  )}
                />
              </button>
            </div>

            {/* Bottom Badge */}
            {stay.verified && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-boq-teal-500/20 backdrop-blur-md border border-boq-teal-500/30">
                <BadgeCheck size={14} className="text-boq-teal-400" />
                <span className="text-[10px] font-bold text-boq-teal-300 uppercase tracking-tight">Verified</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className={cn(
            "flex flex-col justify-between flex-1",
            isGrid ? "p-6" : "p-10"
          )}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className={cn(
                    "font-bold text-white leading-tight mb-2 truncate group-hover:text-boq-teal-400 transition-colors",
                    isGrid ? "text-xl" : "text-3xl"
                  )}>
                    {stay.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-boq-text-muted">
                    <MapPin size={14} className="text-boq-teal-500" />
                    <span className="truncate">{stay.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <Star size={18} className="text-boq-amber-400 fill-boq-amber-400" />
                    <span className="text-lg font-black text-white">{stay.rating}</span>
                  </div>
                  <span className="text-xs text-boq-text-muted font-medium">({stay.reviewCount} reviews)</span>
                </div>
              </div>

              <p className={cn(
                "text-boq-text-secondary leading-relaxed mb-8",
                isGrid ? "text-sm line-clamp-2" : "text-base line-clamp-3"
              )}>
                {stay.description}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2.5">
                {stay.amenities.slice(0, isGrid ? 4 : 8).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-boq-text-secondary hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    {amenityIcons[amenity] || null}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn(
              "flex items-end justify-between border-t border-white/5",
              isGrid ? "pt-6" : "pt-8 mt-4"
            )}>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className={cn("font-black text-white", isGrid ? "text-2xl" : "text-4xl")}>${stay.pricePerNight}</span>
                  <span className="text-sm text-boq-text-muted font-medium">/ night</span>
                </div>
              </div>
              <button className={cn(
                "relative group/btn rounded-2xl bg-boq-teal-500 text-white font-bold transition-all hover:bg-boq-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95 overflow-hidden",
                isGrid ? "px-6 py-3 text-sm" : "px-12 py-4 text-lg"
              )}>
                <span className="relative z-10">Check Availability</span>
                <div className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 bg-gradient-to-r from-white/10 to-transparent transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </CardSpotlight>
    </motion.div>
  );
};
