'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, Star, Heart, BadgeCheck,
  TrendingUp, MapPin, ChevronRight, Sparkles, Compass,
  Mountain, Sun, Wallet, Crown
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { destinations, travelStyles, activities } from '@/data/mockData';
import AuthGuard from '@/components/auth/AuthGuard';
import { BackgroundBeams } from '@/components/ui/background-beams';

const IconMap: Record<string, any> = {
  Heart,
  Mountain,
  Sun,
  Wallet,
  Crown,
};

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!selectedStyle) return matchesSearch;
    
    const styleTags: Record<string, string[]> = {
      romantic: ['romantic', 'beach'],
      adventure: ['safari', 'wildlife', 'nature'],
      weekend: ['urban', 'local', 'markets'],
      luxury: ['luxury'],
      budget: ['cultural', 'markets', 'local']
    };
    
    const hasTag = (styleTags[selectedStyle] || []).some(tag => dest.tags.includes(tag));
    return matchesSearch && hasTag;
  });

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         act.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!selectedStyle) return matchesSearch;
    
    const styleTypes: Record<string, string[]> = {
      romantic: ['dining', 'relaxation'],
      adventure: ['adventure', 'tour'],
      weekend: ['tour', 'cultural', 'transport'],
      budget: ['transport', 'cultural'],
      luxury: ['relaxation', 'dining']
    };
    
    const hasType = (styleTypes[selectedStyle] || []).includes(act.type);
    const isBudgetMatch = selectedStyle === 'budget' ? act.priceFrom < 60 : true;
    const isLuxuryMatch = selectedStyle === 'luxury' ? act.priceFrom >= 40 : true;
    
    return matchesSearch && hasType && isBudgetMatch && isLuxuryMatch;
  });

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

        {/* Editorial Hero */}
        <div className="relative pt-20 pb-14">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-boq-teal-500/10 border border-boq-teal-500/20 text-boq-teal-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                <Compass size={11} /> Explore the World
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-boq-text-primary mb-3 leading-none">
                Discover Your Next <span className="text-gradient-teal">Adventure</span>
              </h1>
              <p className="text-base text-boq-text-secondary max-w-xl leading-relaxed">
                Browse trending destinations, explore travel styles, and find experiences curated just for you.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-text-muted" />
                <input type="text" placeholder="Search destinations, experiences, stays..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-boq-dark-600/80 border border-boq-border rounded-2xl text-sm text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500/60 transition-all"
                  id="discover-search" />
              </div>
              <button className="flex items-center gap-2 px-5 py-3.5 glass rounded-2xl text-sm font-semibold text-boq-text-secondary hover:text-boq-text-primary border border-white/5 transition-all">
                <SlidersHorizontal size={16} /> Filters
              </button>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Travel Styles */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-boq-teal-400" />
              <h2 className="text-xl font-black text-boq-text-primary">Travel Styles</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {travelStyles.map((style, idx) => {
                const Icon = IconMap[style.icon] || Heart;
                const isActive = selectedStyle === style.id;
                return (
                  <motion.div key={style.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}
                    whileHover={{ y: -6 }}
                    onClick={() => setSelectedStyle(isActive ? null : style.id)}
                    className={`relative p-6 rounded-[2rem] bg-boq-dark-600/30 backdrop-blur-md border cursor-pointer overflow-hidden group transition-all duration-500 shadow-xl shadow-black/20 ${isActive ? 'border-boq-teal-500/50 ring-1 ring-boq-teal-500/20 shadow-boq-teal-500/10' : 'border-white/[0.03] hover:border-white/[0.08]'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500 relative">
                        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${isActive ? 'bg-boq-teal-500 border-white/20' : 'bg-boq-teal-500/10 border-boq-teal-500/20'}`} />
                        {!isActive && <div className="absolute inset-0 rounded-2xl bg-boq-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(13,148,136,0.4)]" />}
                        <Icon size={22} strokeWidth={1.5} className={`relative z-10 transition-colors duration-500 ${isActive ? 'text-white' : 'text-boq-teal-400 group-hover:text-white'}`} />
                      </div>
                      <h3 className={`text-xs font-black mb-1.5 uppercase tracking-widest transition-all ${isActive ? 'text-boq-teal-400' : 'text-boq-text-primary opacity-90 group-hover:opacity-100'}`}>{style.name}</h3>
                      <p className={`text-[10px] leading-relaxed font-medium transition-colors px-2 ${isActive ? 'text-boq-text-primary' : 'text-boq-text-muted group-hover:text-boq-text-secondary'}`}>{style.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Trending Destinations */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-boq-text-primary">Trending Destinations</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-boq-amber-500/10 border border-boq-amber-500/20 text-boq-amber-400 text-[10px] font-bold uppercase tracking-wider">Hot</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-semibold text-boq-text-muted hover:text-boq-teal-400 transition-colors">
                View all <ChevronRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDestinations.map((dest, idx) => {
                const isFav = wishlist.has(dest.id);
                return (
                  <motion.div key={dest.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                    className="group glass rounded-3xl overflow-hidden glow-card cursor-pointer border border-white/5 hover:border-boq-teal-500/15">
                    <div className="relative h-52 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 bg-boq-dark-500" style={{ backgroundImage: `url(${dest.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-boq-dark-900/85 via-transparent to-transparent" />
                      <button onClick={() => toggleWishlist(dest.id)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all">
                        <Heart size={16} className={`transition-colors ${isFav ? 'text-rose-400 fill-rose-400' : 'text-white'}`} />
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <MapPin size={11} className="text-boq-teal-400" />
                        <span className="text-xs text-white/90 font-medium">{dest.country}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-black text-boq-text-primary mb-1">{dest.name}</h3>
                      <p className="text-xs text-boq-text-muted mb-4 line-clamp-2 leading-relaxed">{dest.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star size={12} className="text-boq-amber-400 fill-boq-amber-400" />
                          <span className="text-sm font-bold text-boq-text-primary">{dest.rating}</span>
                          <span className="text-xs text-boq-text-muted">({dest.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {dest.verified && (
                            <div className="flex items-center gap-1">
                              <BadgeCheck size={12} className="text-boq-teal-400" />
                              <span className="text-[10px] text-boq-teal-400 font-semibold">Verified</span>
                            </div>
                          )}
                          <span className="text-xs text-boq-text-muted">{dest.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Trending Experiences */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-boq-amber-400" />
              <h2 className="text-xl font-black text-boq-text-primary">Trending Experiences</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.slice(0, 6).map((act, idx) => (
                <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.07 }}
                  className="flex items-center gap-4 glass rounded-2xl p-4 glow-card cursor-pointer border border-white/5 hover:border-boq-teal-500/15">
                  <div className="w-16 h-16 rounded-2xl bg-boq-dark-500 flex-shrink-0 overflow-hidden border border-white/5">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${act.image})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-boq-text-primary truncate mb-1">{act.name}</h4>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Star size={10} className="text-boq-amber-400 fill-boq-amber-400" />
                      <span className="text-xs text-boq-text-muted">{act.rating} • {act.duration}</span>
                    </div>
                    <div className="text-xs font-bold text-boq-teal-400">From ${act.priceFrom}</div>
                  </div>
                  <ChevronRight size={14} className="text-boq-text-muted flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
