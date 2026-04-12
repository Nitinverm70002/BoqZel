'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Sparkles,
  Loader2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { StayCard } from '@/components/stays/StayCard';
import { fetchStays } from '@/services/stays.service';
import { Stay } from '@/types';
import { useActivityNotifications } from '@/hooks/useActivityNotifications';

const stayTypes = ['All', 'Hotels', 'Resorts', 'Apartments', 'Villas'];

export default function StaysPage() {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const { notifyStaysLoaded, notifyNoResults, notifyError, notifyWishlist } =
    useActivityNotifications();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadStays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStays(activeType, debouncedSearch, sortBy);
      setStays(data);
      if (data.length > 0) {
        notifyStaysLoaded(data.length, debouncedSearch || undefined);
      } else {
        notifyNoResults(debouncedSearch || undefined);
      }
    } catch (err) {
      console.error(err);
      const msg = 'Could not connect to the booking server. Please try again.';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeType, debouncedSearch, sortBy, notifyStaysLoaded, notifyNoResults, notifyError]);

  useEffect(() => {
    loadStays();
  }, [loadStays]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      const added = !next.has(id);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const stay = stays.find((s) => s.id === id);
      notifyWishlist(added, stay?.name);
      return next;
    });
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-24 relative bg-[#020408] overflow-hidden">
        {/* Visual Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-boq-teal-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-boq-amber-500/5 blur-[120px]" />
          <BackgroundBeams className="opacity-20" />
        </div>

        {/* Header Section */}
        <div className="relative pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-boq-teal-500/10 border border-boq-teal-500/20 text-boq-teal-400 text-xs font-bold mb-6 uppercase tracking-[0.2em] backdrop-blur-md">
                <Sparkles size={14} className="animate-pulse" />
                Premium Accommodations
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
                Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-boq-teal-400 to-boq-teal-200">Stays</span>
              </h1>
              <p className="text-lg text-boq-text-secondary max-w-2xl leading-relaxed">
                From boutique hotels to secluded safari lodges, discover stays that define excellence across South Sudan and beyond.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-12 flex flex-col lg:flex-row gap-4 items-stretch"
            >
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-boq-teal-500/5 blur-xl group-focus-within:bg-boq-teal-500/10 transition-all rounded-3xl" />
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-boq-text-muted transition-colors group-focus-within:text-boq-teal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to stay? Search by city or hotel..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500/50 backdrop-blur-xl transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-boq-text-muted hover:text-white transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>

              <div className="flex gap-3 h-[68px] relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-8 py-5 border rounded-[2rem] text-sm font-bold transition-all backdrop-blur-xl ${
                    showFilters 
                      ? 'bg-boq-teal-500 border-boq-teal-400 text-white' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-64 glass border border-white/10 rounded-[1.5rem] p-4 z-50 shadow-2xl overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-boq-text-muted uppercase tracking-widest mb-3 block">Sort By</label>
                          <div className="grid grid-cols-1 gap-1.5">
                            {[
                              { id: 'rating', label: 'Top Rated' },
                              { id: 'priceLow', label: 'Price: Low to High' },
                              { id: 'priceHigh', label: 'Price: High to Low' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => { setSortBy(opt.id); setShowFilters(false); }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                  sortBy === opt.id 
                                    ? 'bg-boq-teal-500 text-white' 
                                    : 'text-boq-text-secondary hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center justify-center aspect-square w-14 rounded-[1.5rem] transition-all ${viewMode === 'grid' ? 'bg-boq-teal-500 text-white shadow-lg shadow-boq-teal-500/20' : 'text-boq-text-muted hover:text-white'}`}
                  >
                    <Grid3X3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center aspect-square w-14 rounded-[1.5rem] transition-all ${viewMode === 'list' ? 'bg-boq-teal-500 text-white shadow-lg shadow-boq-teal-500/20' : 'text-boq-text-muted hover:text-white'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Type Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex gap-3 mt-8 overflow-x-auto pb-2 no-scrollbar"
            >
              {stayTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                    activeType === type
                      ? 'bg-boq-teal-500 text-white border-transparent shadow-xl shadow-boq-teal-500/10'
                      : 'bg-white/5 text-boq-text-muted border border-white/5 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 size={40} className="text-boq-teal-400 animate-spin" />
              <p className="text-boq-text-muted font-medium animate-pulse">Syncing with BoqZel stays...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connection Issue</h3>
              <p className="text-boq-text-secondary max-w-md mb-8">{error}</p>
              <button 
                onClick={() => loadStays()}
                className="px-8 py-3 bg-white text-boq-dark-900 rounded-2xl font-bold hover:bg-boq-teal-400 transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : stays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Search size={32} className="text-boq-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No stays found</h3>
              <p className="text-boq-text-secondary max-w-md mb-8">
                We couldn't find any accommodations matching your current filters or search terms.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveType('All'); }}
                className="px-8 py-3 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-8'}>
                <AnimatePresence mode="popLayout">
                  {stays.map((stay, idx) => (
                    <StayCard
                      key={stay.id}
                      stay={stay}
                      index={idx}
                      viewMode={viewMode}
                      isFavorite={wishlist.has(stay.id)}
                      onFavoriteToggle={toggleWishlist}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-20">
                <button className="group relative px-12 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest overflow-hidden transition-all hover:border-boq-teal-500/50 hover:bg-white/10">
                  <span className="relative z-10 flex items-center gap-2">
                    Show More Listings
                    <Sparkles size={14} className="text-boq-teal-400 group-hover:scale-125 transition-transform" />
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}

