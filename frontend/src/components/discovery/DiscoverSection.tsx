'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FilterPills } from './FilterPills';
import { TrendingGrid } from './TrendingGrid';
import { ExperienceRow } from './ExperienceRow';
import { TrendingRankedItem } from './TrendingRanked';
import { MoodTiles } from './TrendingRanked'; // Moved exports
import { 
  TrendingCardSkeleton, 
  ExperienceCardSkeleton, 
  TrendingRankedSkeleton 
} from './SkeletonLoader';
import { Destination, Experience, Mood, TrendingRanked } from '@/types';
import { Compass, Sparkles, Map, Heart, Search } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { useActivityNotifications } from '@/hooks/useActivityNotifications';

export default function DiscoverSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [trendingWeekly, setTrendingWeekly] = useState<TrendingRanked[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { notifyDiscoverTip } = useActivityNotifications();

  // Fire first-visit tip once per session
  useEffect(() => {
    const key = 'boqzel_discover_tip_shown';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      const t = setTimeout(() => notifyDiscoverTip(), 1200);
      return () => clearTimeout(t);
    }
  }, [notifyDiscoverTip]);

  // Real-time search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      if (hasSearched) clearSearch();
      return;
    }

    if (searchQuery.length < 2) return;

    const timer = setTimeout(() => {
      handleSearch();
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [destRes, expRes, rankRes, moodRes] = await Promise.all([
        fetch('/api/destinations/trending'),
        fetch('/api/experiences'),
        fetch('/api/destinations/trending-this-week'),
        fetch('/api/moods'),
      ]);

      if (!destRes.ok || !expRes.ok || !rankRes.ok || !moodRes.ok) {
        throw new Error('Failed to fetch discovery data');
      }

      const [destData, expData, rankData, moodData] = await Promise.all([
        destRes.json(),
        expRes.json(),
        rankRes.json(),
        moodRes.json(),
      ]);

      setDestinations(destData);
      setExperiences(expData);
      setTrendingWeekly(rankData);
      setMoods(moodData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    // Abort previous request
    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    setAbortController(newController);

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/destinations/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: newController.signal
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        console.log('Search aborted');
      } else {
        console.error('Search error:', err);
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const filteredDestinations = destinations.filter(dest => 
    activeCategory === 'All' || dest.tags.includes(activeCategory)
  );

  return (
    <section className="py-12 space-y-20 relative overflow-hidden">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-80" />
      {/* Search & Intro */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <div className="section-label text-boq-teal-400 border-boq-teal-500/30 bg-boq-teal-500/5">
             <Compass size={14} />
             Discover the World
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-boq-text-primary tracking-tighter">
             Find Your Next <span className="text-gradient-teal">Masterpiece</span>
          </h1>
          <p className="text-boq-text-secondary max-w-xl text-lg leading-relaxed">
             From secret coves to mountain peaks, uncover destinations curated by 
             travelers and AI for your unique style.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md w-full">
           <form onSubmit={handleSearch} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-boq-teal-400"
                  >
                    <Sparkles size={18} />
                  </motion.div>
                ) : (
                  <Search className="text-boq-text-muted group-focus-within:text-boq-teal-400 transition-colors" size={18} />
                )}
              </div>
              <input 
                type="text" 
                placeholder="Search global destinations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-4 bg-boq-dark-400/50 border border-white/5 rounded-2xl text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500/50 transition-all backdrop-blur-xl"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-bold text-boq-text-muted uppercase tracking-widest pointer-events-none">
                 {isSearching ? 'Finding...' : searchQuery ? 'Results' : 'Type to search'}
              </div>
           </form>
        </div>
      </div>

      {/* Mood Tiles */}
      <div className="relative z-10 px-4">
        <div className="flex items-center gap-2 mb-8">
           <Map size={20} className="text-boq-teal-500" />
           <h2 className="text-2xl font-black text-boq-text-primary tracking-tight">Travel by Mood</h2>
        </div>
        {loading ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 glass animate-shimmer rounded-[2rem]" />
              ))}
           </div>
        ) : (
          <MoodTiles moods={moods} />
        )}
      </div>

      {/* Trending Grid & Filters */}
      <div className="relative z-10 px-4 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-2">
               <Sparkles size={24} className="text-boq-amber-400" />
               <h2 className="text-3xl font-black text-boq-text-primary tracking-tight">
                 {hasSearched ? 'Search Results' : 'Trending Destinations'}
               </h2>
               {hasSearched && (
                 <button 
                   onClick={clearSearch}
                   className="text-sm font-bold text-boq-teal-400 hover:underline ml-2"
                 >
                   Clear Search
                 </button>
               )}
            </div>
            {!hasSearched && <FilterPills activeCategory={activeCategory} onSetCategory={setActiveCategory} />}
        </div>

        {loading || isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <TrendingCardSkeleton key={i} />)}
          </div>
        ) : (hasSearched ? searchResults : filteredDestinations).length > 0 ? (
          <TrendingGrid destinations={hasSearched ? searchResults : filteredDestinations} />
        ) : (
          <div className="py-20 text-center glass rounded-3xl border-dashed border-2 border-white/5">
             <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-boq-dark-400 flex items-center justify-center">
                   <Compass size={32} className="text-boq-text-muted" />
                </div>
                <h3 className="text-xl font-bold text-boq-text-primary">
                  {hasSearched ? 'No results found for your search' : 'No destinations found'}
                </h3>
                <p className="text-boq-text-secondary">
                  {hasSearched ? 'Try searching for a city, region or country.' : 'Try switching back to \'All\' or explore other moods.'}
                </p>
                <button 
                  onClick={hasSearched ? clearSearch : () => setActiveCategory('All')}
                  className="mt-2 text-boq-teal-400 font-bold hover:underline"
                >
                  {hasSearched ? 'View trending destinations' : 'Clear all filters'}
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Experience Row */}
      <div className="relative z-10 px-4 space-y-8 overflow-hidden">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-boq-teal-400" />
              <h2 className="text-2xl font-black text-boq-text-primary tracking-tight">Top Experiences</h2>
           </div>
           <button className="text-sm font-bold text-boq-text-secondary hover:text-boq-teal-400 transition-colors">
              View All Activities
           </button>
        </div>
        {loading ? (
           <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => <ExperienceCardSkeleton key={i} />)}
           </div>
        ) : (
          <ExperienceRow experiences={experiences} />
        )}
      </div>

      {/* Trending This Week & Promo */}
      <div className="relative z-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="flex items-center gap-2">
              <Heart size={20} className="text-boq-rose-500 fill-boq-rose-500" />
              <h2 className="text-2xl font-black text-boq-text-primary tracking-tight">Trending This Week</h2>
           </div>
           <div className="space-y-4">
              {loading ? (
                [...Array(5)].map((_, i) => <TrendingRankedSkeleton key={i} />)
              ) : (
                trendingWeekly.map((item) => (
                  <TrendingRankedItem key={item.id} item={item} />
                ))
              )}
           </div>
        </div>
        
        {/* Promotional Card */}
        <div className="lg:col-span-2 relative min-h-[400px] rounded-[2.5rem] overflow-hidden group">
           <Image 
             src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&fit=crop" 
             alt="Promo" 
             fill 
             className="object-cover transition-transform duration-1000 group-hover:scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-boq-dark-900 via-boq-dark-900/60 to-transparent p-10 flex flex-col justify-center">
              <div className="section-label bg-boq-amber-500/10 border-boq-amber-500/40 text-boq-amber-400 mb-6 max-w-fit">
                Limited Time Trip Bundle
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6 max-w-md">
                 Unlock the <br/><span className="text-gradient-warm">Ultimate Adventure</span>
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed">
                 Save up to 45% when you book your stays and activities together in our 
                 exclusive Spring Escape Bundle.
              </p>
              <button className="px-8 py-4 bg-white text-boq-dark-900 font-black rounded-xl hover:bg-boq-teal-400 hover:text-white transition-all shadow-xl shadow-black/20 text-lg max-w-fit">
                Explore Bundles
              </button>
           </div>
           
           <div className="absolute top-10 right-10 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full glass backdrop-blur-xl flex items-center justify-center text-white border border-white/20 animate-float">
                 🔥
              </div>
              <div className="w-12 h-12 rounded-full glass backdrop-blur-xl flex items-center justify-center text-white border border-white/20 animate-float [animation-delay:1s]">
                 ✨
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
