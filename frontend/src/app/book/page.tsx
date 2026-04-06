'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, Building, Car, Map, Utensils, Star, Clock,
  ArrowRight, Package, Sparkles, ChevronRight, Search,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sampleFlights, stays, vehicles, activities } from '@/data/mockData';
import AuthGuard from '@/components/auth/AuthGuard';

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

export default function BookPage() {
  const [activeTab, setActiveTab] = useState('flights');

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-16">
        {/* Header */}
        <div className="relative pt-20 pb-10 overflow-hidden">
          <div className="orb orb-teal w-[600px] h-[400px] -top-32 -left-40" />
          <div className="orb orb-amber w-[400px] h-[300px] top-0 right-0" />
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Smart Bundles */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Package size={20} className="text-boq-teal-400" />
              <h2 className="text-xl font-black text-boq-text-primary">Smart Bundles</h2>
              <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider">Save up to 20%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {bundles.map((bundle, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}
                  className={`glass rounded-3xl p-6 glow-card cursor-pointer bg-gradient-to-br ${bundle.gradient} border ${bundle.borderColor} relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/3 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-black text-boq-text-primary">{bundle.title}</h3>
                      <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 text-[10px] font-black border border-green-500/20">
                        Save {bundle.savings}
                      </span>
                    </div>
                    <p className="text-xs text-boq-text-muted mb-4 leading-relaxed">{bundle.description}</p>
                    <ul className="space-y-2 mb-5">
                      {bundle.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-boq-text-secondary">
                          <div className="w-1.5 h-1.5 rounded-full bg-boq-teal-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-black text-boq-text-primary">${bundle.price}</span>
                        <span className="text-sm text-boq-text-muted line-through ml-2">${bundle.originalPrice}</span>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-boq-teal-500/20">
                        Book <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

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

          {/* Flight Results */}
          {activeTab === 'flights' && (
            <div className="space-y-3 mb-8">
              {[...sampleFlights, ...sampleFlights].map((flight, idx) => (
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
                    <button className="px-5 py-2.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-boq-teal-500/20">
                      Select
                    </button>
                  </div>
                </motion.div>
              ))}
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
                      <button className="px-4 py-2 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all">Book</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Cars */}
          {activeTab === 'cars' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                    <button className="px-3 py-1.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all">Rent</button>
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
                      <button className="px-3 py-1.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white text-xs font-black rounded-xl transition-all">Book</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
