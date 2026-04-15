'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, User, Calendar, MapPin, Shield, Fuel,
  Navigation, ArrowRight, Star, Clock, AlertTriangle,
  CheckCircle, Route, Loader2, ChevronRight, ChevronLeft
} from 'lucide-react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, isBefore, startOfDay
} from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { CardSpotlight } from '@/components/ui/card-spotlight';

const rentalDurations = ['Daily', 'Weekly', 'Monthly'];
const driveOptions = [
  { id: 'self', label: 'Self-Drive', icon: Car, description: 'Drive at your own pace' },
  { id: 'driver', label: 'With Driver', icon: User, description: 'Relax & enjoy the ride' },
];
const safetyTips = [
  { icon: Shield, text: 'Always carry your ID and driving license', accent: 'text-amber-400' },
  { icon: Fuel, text: 'Check fuel levels before long trips', accent: 'text-orange-400' },
  { icon: Navigation, text: 'Download offline maps for remote areas', accent: 'text-blue-400' },
  { icon: AlertTriangle, text: 'Avoid driving at night in unfamiliar areas', accent: 'text-rose-400' },
];
const routeSuggestions = [
  { name: 'Juba → Nimule National Park', distance: '192 km', duration: '3h 30m', difficulty: 'Moderate', highlights: ['Scenic riverside drive', 'Wildlife crossing zones', 'Rest stops available'] },
  { name: 'Juba → Bor Town', distance: '195 km', duration: '4h', difficulty: 'Easy', highlights: ['Flat terrain', 'Local villages', 'River views'] },
  { name: 'Juba City Loop', distance: '25 km', duration: '1h', difficulty: 'Easy', highlights: ['Markets', 'Restaurants', 'Cultural sites'] },
];

function MoveMiniCalendar({ selected, onSelect, minDate }: { selected: Date | null; onSelect: (d: Date) => void; minDate?: Date; }) {
  const [currentMonth, setCurrentMonth] = useState(selected ?? new Date());
  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(endOfMonth(currentMonth)) });

  return (
    <div className="p-4 w-72">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-boq-text-secondary hover:text-boq-text-primary transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-boq-text-primary">{format(currentMonth, 'MMMM yyyy')}</span>
        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-boq-text-secondary hover:text-boq-text-primary transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-1">
        {days.map((day, idx) => {
          const isDisabled = minDate ? isBefore(startOfDay(day), startOfDay(minDate)) : isBefore(startOfDay(day), startOfDay(new Date()));
          const isSelected = selected ? isSameDay(day, selected) : false;
          const inMonth = isSameMonth(day, monthStart);
          return (
            <button key={idx} type="button" disabled={isDisabled} onClick={() => onSelect(day)}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                !inMonth ? 'text-boq-text-muted/30' : isDisabled ? 'text-boq-text-muted/40 cursor-not-allowed' :
                isSelected ? 'bg-boq-teal-500/15 text-boq-teal-400 border border-boq-teal-400 shadow-sm shadow-boq-teal-500/20' :
                isToday(day) ? 'bg-boq-dark-500 text-boq-teal-400 border border-boq-teal-500/30' : 'text-boq-text-primary hover:bg-white/10'
              }`}>
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MoveDateField({ label, value, onChange, minDate, placeholder }: { label: string; value: Date | null; onChange: (d: Date) => void; minDate?: Date; placeholder: string; }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`relative ${open ? 'z-50' : 'z-10'}`} ref={ref}>
      <label className="text-xs font-bold text-boq-text-muted mb-2 block uppercase tracking-wider">{label}</label>
      <div className="relative bg-boq-dark-600 border border-boq-border rounded-xl cursor-pointer focus-within:border-boq-teal-500 transition-all flex items-center px-4 py-3" onClick={() => setOpen((o) => !o)}>
        <Calendar size={14} className="text-boq-teal-400 mr-2" />
        <span className={`text-sm font-semibold flex-1 ${value ? 'text-boq-text-primary' : 'text-boq-text-muted'}`}>
            {value ? format(value, 'MM/dd/yyyy') : placeholder}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] z-[100]">
            <MoveMiniCalendar selected={value} minDate={minDate} onSelect={(d) => { onChange(d); setOpen(false); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MovePage() {
  const [driveMode, setDriveMode] = useState('self');
  const [duration, setDuration] = useState('Daily');
  const [location, setLocation] = useState('Juba');
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedLocation, setDebouncedLocation] = useState('Juba');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLocation(location), 500);
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        const { fetchVehicles } = await import('@/services/move.service');
        const data = await fetchVehicles(debouncedLocation);
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, [debouncedLocation]);

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-16 relative bg-[#020408] overflow-x-hidden">
        {/* Full Page Dynamic Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 orb orb-teal w-[1000px] h-[800px] opacity-[0.05]" />
          <div className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 orb orb-amber w-[1200px] h-[800px] opacity-[0.12] scale-[1.5] blur-[150px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-boq-amber-500/[0.02] via-transparent to-transparent" />
        </div>
        <BackgroundBeams className="opacity-40 pointer-events-none" />

        {/* Header */}
        <div className="relative pt-20 pb-10">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                <Car size={11} /> Local Mobility
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-boq-text-primary mb-3 leading-none">
                Move <span className="text-gradient-teal">Around</span>
              </h1>
              <p className="text-base text-boq-text-secondary max-w-xl leading-relaxed">
                Rent cars, hire drivers, and explore routes for daily or weekly mobility.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Search Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Drive Options */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="relative z-20 rounded-3xl p-6 border border-white/5"
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}>
                <h2 className="text-base font-black text-boq-text-primary mb-5">How do you want to move?</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {driveOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.id} onClick={() => setDriveMode(opt.id)}
                        className={`flex items-center gap-3 p-5 rounded-2xl border transition-all text-left group ${
                          driveMode === opt.id
                            ? 'border-boq-teal-500/50 bg-boq-teal-500/10 shadow-md shadow-boq-teal-500/10'
                            : 'border-boq-border bg-boq-dark-600/60 hover:border-white/10'
                        }`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${driveMode === opt.id ? 'bg-boq-teal-500/20 text-boq-teal-400' : 'bg-boq-dark-500 text-boq-text-muted group-hover:text-boq-text-primary'}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-boq-text-primary">{opt.label}</div>
                          <div className="text-xs text-boq-text-muted">{opt.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-boq-text-muted mb-3 block uppercase tracking-wider">Rental Duration</label>
                  <div className="flex gap-2">
                    {rentalDurations.map((d) => (
                      <button key={d} onClick={() => setDuration(d)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${duration === d ? 'bg-boq-teal-500 text-white shadow-md shadow-boq-teal-500/25' : 'bg-boq-dark-500/80 text-boq-text-muted hover:text-boq-text-primary border border-boq-border'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup / Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-boq-text-muted mb-2 block uppercase tracking-wider">Pickup Location</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-boq-teal-400" />
                      <input type="text" placeholder="Juba International Airport" value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-boq-dark-600 border border-boq-border rounded-xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <MoveDateField 
                      label="Pickup Date"
                      placeholder="dd/mm/yyyy"
                      value={pickupDate}
                      onChange={setPickupDate}
                    />
                  </div>
                </div>
                <button className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-boq-teal-500/25">
                  Search Vehicles <ArrowRight size={16} />
                </button>
              </motion.div>

              {/* Available Vehicles */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-black text-boq-text-primary mb-5">Available Vehicles</h2>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 glass rounded-3xl border border-white/5">
                    <Loader2 size={32} className="text-boq-teal-400 animate-spin" />
                    <p className="text-boq-text-muted text-sm font-medium animate-pulse">Syncing with Live API...</p>
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white/5">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <Car size={24} className="text-boq-text-muted" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No vehicles found</h3>
                    <p className="text-boq-text-secondary text-sm max-w-sm">
                      We couldn't find any vehicles in this location.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {vehicles.slice(0, 6).map((vehicle, idx) => (
                        <motion.div key={vehicle.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }} className="h-full">
                          <CardSpotlight className="h-full p-0 overflow-hidden flex flex-col group cursor-pointer border-white/5 hover:border-boq-teal-500/30 transition-all bg-boq-dark-600/30 rounded-2xl">
                            <div className="relative h-40 w-full overflow-hidden bg-boq-dark-500">
                              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                                {vehicle.type}
                              </div>
                              {vehicle.verified && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                  <Shield size={12} className="text-blue-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col relative z-10">
                              <div className="flex items-start justify-between mb-3">
                                <div className="pr-2">
                                  <h3 className="text-base font-black text-white group-hover:text-boq-teal-400 transition-colors line-clamp-1">{vehicle.name}</h3>
                                  <div className="flex items-center gap-1 text-xs text-boq-text-muted mt-1">
                                    <MapPin size={10} className="text-boq-teal-500 flex-shrink-0" />
                                    <span className="truncate">{vehicle.location}</span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xl font-black text-boq-teal-300">${vehicle.pricePerDay}</div>
                                  <div className="text-[10px] text-boq-text-muted">/{duration.toLowerCase().slice(0, -2)}y</div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                                {[
                                  { icon: User, text: `${vehicle.seats} Seats` },
                                  { icon: Star, text: vehicle.transmission },
                                  { icon: Fuel, text: vehicle.fuelType }
                                ].map((tag, i) => (
                                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-[10px] text-boq-text-secondary border border-white/5 capitalize">
                                    <tag.icon size={10} className="text-boq-text-muted" />
                                    {tag.text}
                                  </div>
                                ))}
                                {vehicle.driverOption && (
                                  <div className="flex items-center gap-1.5 px-2 py-1 bg-boq-teal-500/10 rounded-lg text-[10px] text-boq-teal-400 border border-boq-teal-500/20">
                                    <User size={10} /> Driver Avail.
                                  </div>
                                )}
                              </div>
                              
                              <button className="w-full py-2.5 bg-white/5 text-white font-bold text-xs rounded-xl group-hover:bg-boq-teal-500 group-hover:text-white transition-all border border-white/10 group-hover:border-transparent flex items-center justify-center gap-2">
                                Select Vehicle <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                              </button>
                            </div>
                          </CardSpotlight>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Route Suggestions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-5 border border-white/5">
                <h3 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <Route size={16} className="text-boq-teal-400" /> Route Suggestions
                </h3>
                <div className="space-y-3">
                  {routeSuggestions.map((route, idx) => (
                    <div key={idx} className="p-4 bg-boq-dark-600/60 rounded-2xl border border-boq-border hover:border-boq-teal-500/20 transition-all cursor-pointer group">
                      <div className="text-sm font-bold text-boq-text-primary mb-2 group-hover:text-boq-teal-400 transition-colors">{route.name}</div>
                      <div className="flex items-center gap-3 text-[10px] text-boq-text-muted mb-3">
                        <span className="flex items-center gap-1"><Navigation size={10} /> {route.distance}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {route.duration}</span>
                        <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${route.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {route.difficulty}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {route.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-boq-text-muted">
                            <CheckCircle size={8} className="text-boq-teal-400 flex-shrink-0" /> {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Safety Tips */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-3xl p-5 border border-white/5">
                <h3 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-amber-400" /> Safety Tips
                </h3>
                <div className="space-y-3">
                  {safetyTips.map((tip, idx) => {
                    const Icon = tip.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-boq-dark-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/5">
                          <Icon size={13} className={tip.accent} />
                        </div>
                        <p className="text-xs text-boq-text-muted leading-relaxed">{tip.text}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
