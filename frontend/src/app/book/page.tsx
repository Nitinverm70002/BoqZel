'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Building, Car, Map, Utensils, Star, Clock,
  ArrowRight, Package, Sparkles, ChevronRight, Search,
  ChevronDown, Calendar, ArrowRightLeft, ChevronLeft
} from 'lucide-react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, isBefore, startOfDay
} from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sampleFlights, stays, vehicles, activities } from '@/data/mockData';
import AuthGuard from '@/components/auth/AuthGuard';
import { Flight } from '@/types';
import { useNotifications } from '@/context/NotificationContext';
import { BackgroundBeams } from '@/components/ui/background-beams';

const serviceTabs = [
  { id: 'flights', label: 'Flights', icon: Plane, color: 'text-blue-400' },
  { id: 'hotels', label: 'Hotels', icon: Building, color: 'text-boq-teal-400' },
  { id: 'cars', label: 'Cars', icon: Car, color: 'text-amber-400' },
  { id: 'tours', label: 'Tours', icon: Map, color: 'text-purple-400' },
  { id: 'restaurants', label: 'Dining', icon: Utensils, color: 'text-rose-400' },
];

const bundles = [
  {
    title: 'Apartment + Car',
    savings: '15%',
    description: 'Luxury apartment stay with self-drive car rental.',
    price: 850, originalPrice: 1000,
    items: ['Luxury Apartment (4 nights)', 'Toyota Camry (5 days)'],
    gradient: 'from-teal-600/20 to-cyan-600/10',
    accentColor: 'boq-teal-400',
    borderColor: 'border-teal-500/20',
    badgeColor: 'bg-teal-500/10 text-teal-400',
  },
  {
    title: 'Hotel + Tour',
    savings: '10%',
    description: 'Premium hotel stay with guided safari experience.',
    price: 620, originalPrice: 690,
    items: ['Nile River Hotel (3 nights)', 'Safari Adventure (full day)'],
    gradient: 'from-purple-600/20 to-violet-600/10',
    accentColor: 'purple-400',
    borderColor: 'border-purple-500/20',
    badgeColor: 'bg-purple-500/10 text-purple-400',
  },
  {
    title: 'Full Trip Package',
    savings: '20%',
    description: 'Complete trip: flights, stay, car & activities.',
    price: 1880, originalPrice: 2350,
    items: ['Return flights', 'Luxury Apartment (5 nights)', 'Land Cruiser + Driver', 'Safari + City Tour'],
    gradient: 'from-amber-600/20 to-orange-600/10',
    accentColor: 'boq-amber-400',
    borderColor: 'border-amber-500/20',
    badgeColor: 'bg-amber-500/10 text-amber-400',
  },
];

function FlightMiniCalendar({ selected, onSelect, minDate }: { selected: Date | null; onSelect: (d: Date) => void; minDate?: Date; }) {
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

function FlightDateField({ label, value, onChange, minDate, placeholder }: { label: string; value: Date | null; onChange: (d: Date) => void; minDate?: Date; placeholder: string; }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`flex-1 relative flex flex-col justify-center ${open ? 'z-50' : 'z-10'}`} ref={ref}>
      <div className="relative bg-boq-dark-600 border border-boq-border rounded-2xl p-3 focus-within:border-boq-teal-500 transition-all cursor-pointer h-full flex flex-col justify-center" onClick={() => setOpen((o) => !o)}>
        <label className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider mb-0.5 cursor-pointer">{label}</label>
        <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${value ? 'text-boq-text-primary' : 'text-boq-text-muted'}`}>
                {value ? format(value, 'MM/dd/yyyy') : placeholder}
            </span>
            <Calendar size={14} className="text-boq-text-muted" />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] z-[100]">
            <FlightMiniCalendar selected={value} minDate={minDate} onSelect={(d) => { onChange(d); setOpen(false); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookPage() {
  const [activeTab, setActiveTab] = useState('flights');
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  // Search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { notify } = useNotifications();

  const handleBookItem = (type: string, name: string) => {
    notify({
      type: 'success',
      title: 'Item Selected',
      message: `${name} has been added to your plan.`,
      icon: '✈️'
    });
  };

  const handleSearch = async () => {
    if (!from || !to || !departDate) return;

    setIsLoading(true);
    setSearchError(null);
    try {
      const dateStr = format(departDate, 'yyyy-MM-dd');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/trips/search?from=${from}&to=${to}&date=${dateStr}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const mappedFlights = data.map((item: any) => {
          // Handle different possible structures from API or AI fallback
          const leg = item.legs?.[0] || {};
          const segment = leg.segments?.[0] || {};
          const pricing = item.purchaseLinks?.[0] || {};

          return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            airline: segment.marketingAirline?.name || item.airline || 'Unknown Airline',
            from: segment.originAirportCode || from || '???',
            to: segment.destinationAirportCode || to || '???',
            departureTime: segment.departureTime ? format(new Date(segment.departureTime), 'HH:mm') : (item.departureTime || '00:00'),
            arrivalTime: segment.arrivalTime ? format(new Date(segment.arrivalTime), 'HH:mm') : (item.arrivalTime || '00:00'),
            duration: leg.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : (item.duration || '2h'),
            price: pricing.totalPrice || item.price || 0,
            currency: item.currency || 'USD',
            stops: leg.stopCount ?? item.stops ?? 0,
            class: item.class || 'economy'
          } as Flight;
        });
        setFlights(mappedFlights);
      } else {
        setFlights([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to fetch flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-16 relative bg-[#030712] overflow-hidden">
        {/* Full Section Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-boq-teal-500/5 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-boq-amber-500/5 blur-[100px]" />
          <BackgroundBeams className="opacity-25" />
        </div>

        {/* Header */}
        <div className="relative pt-20 pb-10 z-10">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-boq-teal-500/10 border border-boq-teal-500/20 text-boq-teal-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                <Package size={11} /> All-in-One Booking
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-boq-text-primary mb-3 leading-none">
                Book <span className="text-gradient-teal">Everything</span>
              </h1>
              <p className="text-base text-boq-text-secondary max-w-xl leading-relaxed">
                Flights, hotels, cars, tours — all in one place. Save more with smart bundles.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Service Tabs with sliding indicator */}
            <div className="relative mb-8">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {serviceTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-boq-teal-500 text-white shadow-lg shadow-boq-teal-500/25'
                          : 'glass text-boq-text-muted hover:text-boq-text-primary border border-white/5'
                      }`}>
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            {activeTab === 'flights' ? (
              <div 
                className="relative z-20 rounded-3xl p-6 mb-8 border border-white/5 glow-card"
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                {/* Top Row Links/Selects */}
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <button className="flex items-center gap-2 text-sm text-boq-text-primary hover:text-boq-teal-400 font-semibold transition-colors">
                    Round Trip <ChevronDown size={14} className="text-boq-text-muted" />
                  </button>
                  <div className="w-px h-4 bg-white/10" />
                  <button className="flex items-center gap-2 text-sm text-boq-text-primary hover:text-boq-teal-400 font-semibold transition-colors">
                    1 Passenger, Economy Class <ChevronDown size={14} className="text-boq-text-muted" />
                  </button>
                  <div className="w-px h-4 bg-white/10" />
                  <button className="flex items-center gap-2 text-sm text-boq-text-primary hover:text-boq-teal-400 font-semibold transition-colors">
                    Promo Code <ChevronDown size={14} className="text-boq-text-muted" />
                  </button>
                </div>

                {/* Inputs Row */}
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* FROM */}
                  <div className="flex-1 relative bg-boq-dark-600 border border-boq-border rounded-2xl p-3 focus-within:border-boq-teal-500 transition-all flex flex-col justify-center">
                    <label className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider mb-0.5">From</label>
                    <input 
                      type="text" 
                      placeholder="Origin" 
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none" 
                    />
                  </div>

                  <div className="hidden lg:flex items-center justify-center -mx-4 z-10">
                    <div className="bg-boq-dark-500 rounded-full p-2 border border-white/5 shadow-md">
                       <ArrowRightLeft size={14} className="text-boq-text-muted" />
                    </div>
                  </div>

                  {/* TO */}
                  <div className="flex-1 relative bg-boq-dark-600 border border-boq-border rounded-2xl p-3 focus-within:border-boq-teal-500 transition-all flex flex-col justify-center lg:pl-5">
                    <label className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider mb-0.5">To</label>
                    <input 
                      type="text" 
                      placeholder="Destination" 
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none" 
                    />
                  </div>

                  {/* DEPARTURE */}
                  <FlightDateField 
                    label="Departure"
                    placeholder="04/23/2026"
                    value={departDate}
                    onChange={(d) => {
                       setDepartDate(d);
                       if (returnDate && isBefore(returnDate, d)) setReturnDate(null);
                    }}
                  />

                  {/* RETURN */}
                  <FlightDateField 
                    label="Return"
                    placeholder="04/25/2026"
                    value={returnDate}
                    onChange={setReturnDate}
                    minDate={departDate ?? new Date()}
                  />

                  <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-8 py-3 lg:py-0 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-boq-teal-500/20 text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'SEARCHING...' : 'SEARCH'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-5 mb-8 border border-white/5">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-text-muted" />
                    <input type="text" placeholder={`Search ${activeTab}…`}
                      className="w-full pl-11 pr-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500 transition-all" />
                  </div>
                  <button className="px-8 py-3.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-boq-teal-500/20 text-sm">
                    Search
                  </button>
                </div>
              </div>
            )}

            {/* Flight Results */}
            {activeTab === 'flights' && (
              <div className="space-y-3 mb-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-10 h-10 border-4 border-boq-teal-500/20 border-t-boq-teal-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-boq-text-muted">Searching for best flights...</p>
                  </div>
                ) : searchError ? (
                  <div className="glass rounded-2xl p-8 text-center border border-rose-500/20">
                    <div className="text-rose-400 font-bold mb-2">Search failed</div>
                    <p className="text-sm text-boq-text-muted">{searchError}</p>
                    <button onClick={handleSearch} className="mt-4 text-xs font-black text-boq-teal-400 hover:text-boq-teal-300">Try again</button>
                  </div>
                ) : flights.length > 0 ? (
                  flights.map((flight, idx) => (
                    <motion.div key={`${flight.id}-${idx}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glow-card border border-white/5 hover:border-boq-teal-500/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-boq-dark-500 flex items-center justify-center border border-white/5">
                          <Plane size={20} className="text-boq-teal-400" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-boq-text-primary">{flight.airline}</div>
                          <div className="text-xs text-boq-text-muted">{flight.stops === 0 ? 'Direct Flight' : `${flight.stops} stop(s)`}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-black text-boq-text-primary">{flight.departureTime}</div>
                          <div className="text-xs text-boq-text-muted">{flight.from}</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] text-boq-text-muted">{flight.duration}</div>
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-px bg-boq-dark-300" />
                            <Plane size={10} className="text-boq-teal-400 -rotate-0" />
                            <div className="w-12 h-px bg-boq-dark-300" />
                          </div>
                          <div className="text-[10px] text-boq-teal-400 font-bold">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-black text-boq-text-primary">{flight.arrivalTime}</div>
                          <div className="text-xs text-boq-text-muted">{flight.to}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-black text-boq-text-primary">${flight.price}</div>
                          <div className="text-[10px] text-boq-text-muted capitalize">{flight.class}</div>
                        </div>
                        <button 
                          onClick={() => handleBookItem('flight', flight.airline)}
                          className="px-5 py-2.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-boq-teal-500/20"
                        >
                          Select
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass rounded-2xl p-12 text-center border border-white/5">
                    <div className="w-16 h-16 bg-boq-dark-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <Plane size={24} className="text-boq-text-muted" />
                    </div>
                    <h3 className="text-lg font-black text-boq-text-primary mb-2">No flights found</h3>
                    <p className="text-sm text-boq-text-muted max-w-xs mx-auto">Try searching for different dates or a different route.</p>
                  </div>
                )}
              </div>
            )}

            {/* Hotel Results */}
            {activeTab === 'hotels' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {stays.map((stay, idx) => (
                  <motion.div key={stay.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass rounded-2xl overflow-hidden glow-card cursor-pointer border border-white/5 hover:border-boq-teal-500/15">
                    <div className="h-40 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center bg-boq-dark-500 transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url(${stay.image})` }} />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-black text-boq-text-primary mb-1">{stay.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-boq-text-muted mb-3">
                        <Star size={10} className="text-boq-amber-400 fill-boq-amber-400" />
                        {stay.rating} ({stay.reviewCount})
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-boq-text-primary">${stay.pricePerNight}<span className="text-xs text-boq-text-muted font-normal">/night</span></span>
                        <button 
                          onClick={() => handleBookItem('hotel', stay.name)}
                          className="px-4 py-2 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Cars */}
            {activeTab === 'cars' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {vehicles.map((vehicle, idx) => (
                  <motion.div key={vehicle.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass rounded-2xl p-4 glow-card cursor-pointer border border-white/5">
                    <div className="h-28 rounded-xl bg-boq-dark-500 mb-3 flex items-center justify-center border border-white/5">
                      <Car size={36} className="text-boq-dark-300" />
                    </div>
                    <h3 className="text-sm font-black text-boq-text-primary mb-1">{vehicle.name}</h3>
                    <div className="text-xs text-boq-text-muted mb-3 capitalize">{vehicle.type} • {vehicle.seats} seats</div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-boq-text-primary">${vehicle.pricePerDay}<span className="text-xs text-boq-text-muted font-normal">/day</span></span>
                      <button 
                        onClick={() => handleBookItem('car', vehicle.name)}
                        className="px-3 py-1.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all"
                      >
                        Rent
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tours & Dining */}
            {(activeTab === 'tours' || activeTab === 'restaurants') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {activities.filter((a) => activeTab === 'restaurants' ? a.type === 'dining' : a.type !== 'dining').map((act, idx) => (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="glass rounded-2xl overflow-hidden glow-card cursor-pointer border border-white/5">
                    <div className="h-36 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url(${act.image})` }} />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-black text-boq-text-primary mb-1">{act.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-boq-text-muted mb-2">
                        <Star size={10} className="text-boq-amber-400 fill-boq-amber-400" />
                        {act.rating} <Clock size={10} /> {act.duration}
                      </div>
                      <p className="text-xs text-boq-text-muted mb-3 line-clamp-2">{act.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-boq-teal-400">From ${act.priceFrom}</span>
                        <button 
                          onClick={() => handleBookItem('activity', act.name)}
                          className="px-3 py-1.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Smart Bundles */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-boq-teal-400" />
                    <h2 className="text-lg font-black text-boq-text-primary">Smart Bundles</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-wider">Up to 20% Off</span>
                </div>
                <div className="flex flex-col gap-4">
                  {bundles.map((bundle, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}
                      className={`glass rounded-2xl p-5 glow-card cursor-pointer bg-gradient-to-br ${bundle.gradient} border ${bundle.borderColor} relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/3 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-black text-boq-text-primary">{bundle.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[10px] font-black border border-green-500/20">
                            {bundle.savings}
                          </span>
                        </div>
                        <p className="text-xs text-boq-text-muted mb-4 leading-relaxed line-clamp-2">{bundle.description}</p>
                        <div className="flex items-end justify-between mt-2">
                          <div>
                            <span className="text-xl font-black text-boq-text-primary">${bundle.price}</span>
                          </div>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-boq-teal-500/20">
                            Book <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
