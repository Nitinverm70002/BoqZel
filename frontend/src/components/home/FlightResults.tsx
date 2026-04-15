'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Clock, ArrowRight, Info } from 'lucide-react';

interface FlightProposal {
  id: string;
  airline: {
    name: string;
    logo?: string;
  };
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
  duration: string;
  price: number;
  currency: string;
}

export default function FlightResults({ flights }: { flights: any[] | null }) {
  if (!flights) return null;

  return (
    <div className="mt-8 space-y-4">
      <AnimatePresence mode="popLayout">
        {flights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center"
          >
            <div className="w-12 h-12 bg-boq-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="text-boq-teal-400" size={20} />
            </div>
            <h3 className="text-boq-text-primary font-bold">No flights found</h3>
            <p className="text-boq-text-muted text-sm mt-1">
              Try different dates or search for nearby cities.
            </p>
          </motion.div>
        ) : (
          flights.map((flight, idx) => {
            // Robust mapping for TripAdvisor API structure
            const itinerary = flight;
            const price = itinerary.purchaseLinks?.[0]?.totalPrice || itinerary.price?.amount || 299;
            const leg = itinerary.legs?.[0];
            const segment = leg?.segments?.[0];
            const airline = segment?.marketingAirline?.name || 'Multiple Airlines';
            const departureTime = segment?.departureTime || '10:30 AM';
            const arrivalTime = segment?.arrivalTime || '2:15 PM';
            const origin = segment?.originAirportCode || itinerary.origin || 'JUB';
            const destination = segment?.destinationAirportCode || itinerary.destination || 'NBO';
            const duration = leg?.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : '3h 45m';
            
            return (
              <motion.div
                key={itinerary.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl hover:bg-[#0a0f1a]/95 transition-all hover:border-boq-teal-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-boq-teal-500/0 via-boq-teal-500/5 to-boq-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                  {/* Airline & Logo */}
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      <Plane size={18} className="text-boq-teal-400 -rotate-45" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-boq-text-primary truncate">
                        {airline}
                      </div>
                      <div className="text-[10px] text-boq-text-muted uppercase tracking-wider">
                        Main Cabin
                      </div>
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="flex-1 flex items-center justify-between gap-4 px-2">
                    <div className="text-center sm:text-left">
                      <div className="text-lg font-black text-boq-text-primary">
                        {departureTime.includes('T') ? departureTime.split('T')[1].slice(0, 5) : departureTime}
                      </div>
                      <div className="text-[10px] font-bold text-boq-teal-400">
                        {origin}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-1 max-w-[120px]">
                      <span className="text-[10px] text-boq-text-muted font-medium">{duration}</span>
                      <div className="w-full h-px bg-white/10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-boq-teal-500" />
                        <ArrowRight size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20" />
                      </div>
                      <span className="text-[9px] text-boq-teal-400/70 font-bold uppercase letter tracking-[0.1em]">
                        {leg?.stopCount === 0 ? 'Direct' : `${leg?.stopCount} Stop`}
                      </span>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-lg font-black text-boq-text-primary">
                        {arrivalTime.includes('T') ? arrivalTime.split('T')[1].slice(0, 5) : arrivalTime}
                      </div>
                      <div className="text-[10px] font-bold text-boq-teal-400">
                        {destination}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-1 min-w-[100px] pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="text-2xl font-black text-boq-teal-400">
                      ${Math.floor(Number(price))}
                    </div>
                    <div className="text-[10px] text-boq-text-muted">per person</div>
                    <button className="mt-2 text-[10px] font-bold text-white bg-boq-teal-500 hover:bg-boq-teal-400 px-4 py-1.5 rounded-lg transition-colors sm:hidden">
                      Select
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
