'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, DollarSign, Sparkles, ArrowRight, ArrowLeft,
  Compass, Wallet, Crown, MoreVertical, Wand2,
  AlertCircle, RefreshCw, Clock, Heart, Mountain, Sun, Banknote, Gem
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';
import { travelStyles } from '@/data/mockData';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { BackgroundBeams } from '@/components/ui/background-beams';

const wizardSteps = [
  { id: 'destination', label: 'Destination', icon: MapPin },
  { id: 'dates', label: 'Dates', icon: Calendar },
  { id: 'travelers', label: 'Travelers', icon: Users },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'style', label: 'Style', icon: Compass },
];

const popularDestinations = [
  { name: 'Juba', country: 'South Sudan', emoji: '🌍' },
  { name: 'Zanzibar', country: 'Tanzania', emoji: '🏝️' },
  { name: 'Nairobi', country: 'Kenya', emoji: '🦁' },
  { name: 'Cape Town', country: 'South Africa', emoji: '⛰️' },
  { name: 'Marrakech', country: 'Morocco', emoji: '🕌' },
  { name: 'Dubai', country: 'UAE', emoji: '🌆' },
];

const tripTypes = [
  { id: 'full', name: 'Full Trip', description: 'Complete travel with stays, flights & activities', icon: '✈️' },
  { id: 'chill', name: 'Chill Trip', description: 'Relaxed outing with friends, short drive', icon: '🍃' },
  { id: 'explore', name: 'Explore Freely', description: 'Flexible self-guided exploration', icon: '🧭' },
];

// Type for the AI-generated itinerary
interface AiActivity {
  title: string;
  description: string;
  time?: string;
  type?: string;
  estimatedCost?: string;
}

interface AiDay {
  day: number;
  title: string;
  activities: AiActivity[];
  eveningActivity?: string;
  stayRecommendation?: string;
}

interface AiItinerary {
  title: string;
  description: string;
  totalDays: number;
  estimatedBudget?: string;
  days: AiDay[];
}

const ACTIVITY_IMAGES: Record<string, string> = {
  arrival: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=200&h=200&fit=crop',
  tour: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
  adventure: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&h=200&fit=crop',
  relaxation: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop',
  cultural: 'https://images.unsplash.com/photo-1528277342758-f1d7613953a2?w=200&h=200&fit=crop',
  stay: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop',
  departure: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=200&h=200&fit=crop',
  default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop',
};

const IconMap: Record<string, any> = {
  Heart,
  Mountain,
  Sun,
  Wallet,
  Crown,
};

export default function PlanPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [selectedDest, setSelectedDest] = useState('');
  const [dates, setDates] = useState({ departure: '', returnDate: '' });
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, infants: 0 });
  const [budget, setBudget] = useState({ min: '', max: '' });
  const [selectedBudgetTier, setSelectedBudgetTier] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('full');

  // AI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [aiItinerary, setAiItinerary] = useState<AiItinerary | null>(null);
  const [error, setError] = useState('');

  const updateTravelers = (key: 'adults' | 'children' | 'infants', delta: number) => {
    setTravelers((prev) => ({
      ...prev,
      [key]: Math.max(key === 'adults' ? 1 : 0, prev[key] + delta),
    }));
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    );
  };

  const buildQuery = () => {
    const totalTravelers = travelers.adults + travelers.children + travelers.infants;
    const styleNames = selectedStyles
      .map((id) => travelStyles.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    let budgetStr = '';
    if (budget.min && budget.max) {
      budgetStr = `$${budget.min} to $${budget.max}`;
    } else if (selectedBudgetTier) {
      budgetStr = selectedBudgetTier;
    }

    const tripTypeLabel = tripTypes.find((t) => t.id === selectedType)?.name || 'Full Trip';
    
    let dateStr = '';
    if (dates.departure && dates.returnDate) {
      dateStr = `from ${dates.departure} to ${dates.returnDate}`;
    } else if (dates.departure) {
      dateStr = `starting ${dates.departure}`;
    }

    return `Plan a ${tripTypeLabel.toLowerCase()} to ${selectedDest || 'Juba, South Sudan'}${dateStr ? ` ${dateStr}` : ''} for ${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''} (${travelers.adults} adult${travelers.adults > 1 ? 's' : ''}${travelers.children ? `, ${travelers.children} children` : ''}${travelers.infants ? `, ${travelers.infants} infant${travelers.infants > 1 ? 's' : ''}` : ''}).${budgetStr ? ` Budget: ${budgetStr}.` : ''}${styleNames ? ` Travel style: ${styleNames}.` : ''} Include specific places, restaurants, and activities. Make it a premium, unforgettable experience.`;
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    setError('');

    const query = buildQuery();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

    try {
      const res = await fetch(`${API_BASE_URL}/ai/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }

      const data: AiItinerary = await res.json();

      if (!data.days || data.days.length === 0) {
        throw new Error('AI returned an empty itinerary. Please try again.');
      }

      setAiItinerary(data);
      setShowItinerary(true);
    } catch (err: unknown) {
      console.error('Itinerary generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary. Please try again.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateItinerary();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleRegenerate = () => {
    setShowItinerary(false);
    setAiItinerary(null);
    setError('');
    generateItinerary();
  };

  const handleStartOver = () => {
    setShowItinerary(false);
    setAiItinerary(null);
    setError('');
    setCurrentStep(0);
  };

  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const getActivityImage = (type?: string) =>
    ACTIVITY_IMAGES[type || 'default'] || ACTIVITY_IMAGES.default;

  // Calculate trip duration string
  const getTripDuration = () => {
    if (!aiItinerary) return '';
    const days = aiItinerary.totalDays || aiItinerary.days.length;
    return `${days} Day${days > 1 ? 's' : ''} · ${days - 1} Night${days - 1 > 1 ? 's' : ''}`;
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-16 relative bg-[#020408] overflow-x-hidden">
        {/* Full Page Dynamic Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle top highlights */}
          <div className="absolute -top-1/4 -left-1/4 orb orb-teal w-[1000px] h-[800px] opacity-[0.05]" />
          
          {/* Main Orange/Amber Glow from bottom */}
          <div className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 orb orb-amber w-[1200px] h-[800px] opacity-[0.15] scale-[1.5] blur-[150px]" />
          <div className="absolute -bottom-1/4 -right-1/4 orb orb-amber w-[800px] h-[600px] opacity-[0.08] blur-[120px]" />
          
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-boq-amber-500/[0.03] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.06)_0%,transparent_70%)]" />
        </div>
        
        <BackgroundBeams className="opacity-40 pointer-events-none" />

        {/* Header content */}
        <div className="relative pt-20 pb-10">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-boq-teal-500/10 border border-boq-teal-500/20 text-boq-teal-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                <Sparkles size={11} /> AI-Powered Planning
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-boq-text-primary mb-3 leading-none">
                Plan Your <span className="text-gradient-teal">Dream Trip</span>
              </h1>
              <p className="text-base text-boq-text-secondary">
                Tell us what you want, and our AI will create the perfect itinerary.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* ─── GENERATING STATE ─── */}
            {isGenerating ? (
              <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <CardSpotlight className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-boq-teal-500 to-boq-teal-300 flex items-center justify-center mb-6 animate-pulse-ring shadow-lg shadow-boq-teal-500/30 mx-auto">
                      <Wand2 size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-boq-text-primary mb-2">Crafting your itinerary…</h2>
                    <p className="text-boq-text-muted mb-8">Our AI is designing your perfect trip to <span className="text-boq-teal-400 font-semibold">{selectedDest || 'your destination'}</span></p>
                    <div className="flex gap-2 justify-center">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-boq-teal-400" />
                      ))}
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>

            /* ─── ERROR STATE ─── */
            ) : error && !showItinerary ? (
              <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <CardSpotlight className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center mb-5">
                      <AlertCircle size={28} className="text-rose-400" />
                    </div>
                    <h2 className="text-xl font-black text-boq-text-primary mb-2">Something went wrong</h2>
                    <p className="text-sm text-boq-text-muted mb-6 max-w-md">{error}</p>
                    <div className="flex gap-3">
                      <button onClick={handleRegenerate}
                        className="flex items-center gap-2 px-6 py-3 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-boq-teal-500/25">
                        <RefreshCw size={16} /> Try Again
                      </button>
                      <button onClick={handleStartOver}
                        className="flex items-center gap-2 px-6 py-3 glass border border-white/5 text-boq-text-secondary font-bold rounded-2xl hover:text-boq-text-primary transition-all">
                        <ArrowLeft size={16} /> Start Over
                      </button>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>

            /* ─── WIZARD ─── */
            ) : !showItinerary ? (
              <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Progress Bar */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-3">
                    {wizardSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = idx === currentStep;
                      const isDone = idx < currentStep;
                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center gap-1.5 relative">
                          {idx < wizardSteps.length - 1 && (
                            <div className="absolute left-1/2 top-5 w-full h-px bg-boq-dark-300 z-0">
                              <div className="h-full bg-gradient-to-r from-boq-teal-500 to-boq-teal-300 transition-all duration-500" style={{ width: isDone ? '100%' : '0%' }} />
                            </div>
                          )}
                          <button onClick={() => idx <= currentStep && setCurrentStep(idx)}
                            className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isActive ? 'border-boq-teal-500 bg-boq-teal-500/20 text-boq-teal-400 scale-110' :
                              isDone ? 'border-boq-teal-400 bg-boq-teal-400 text-white' :
                              'border-boq-dark-300 bg-boq-dark-600 text-boq-text-muted'
                            }`}>
                            <Icon size={16} />
                          </button>
                          <span className={`text-[10px] font-semibold hidden sm:block ${isActive ? 'text-boq-teal-400' : isDone ? 'text-boq-text-primary' : 'text-boq-text-muted'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-1.5 bg-boq-dark-400 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-boq-teal-600 to-boq-teal-300 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-boq-text-muted">Step {currentStep + 1} of {wizardSteps.length}</span>
                    <span className="text-xs text-boq-teal-400 font-semibold">{Math.round(progress)}% complete</span>
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                    <CardSpotlight className="rounded-3xl p-8 mb-8 border border-white/5 bg-boq-dark-900/50 backdrop-blur-sm">

                    {/* Step 0: Destination */}
                    {currentStep === 0 && (
                      <div>
                        <h2 className="text-2xl font-black text-boq-text-primary mb-1">Where do you want to go?</h2>
                        <p className="text-sm text-boq-text-muted mb-6">Search or pick from popular destinations</p>
                        <div className="relative mb-5">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-teal-400" />
                          <input type="text" placeholder="Search destinations…" value={selectedDest} onChange={(e) => setSelectedDest(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {popularDestinations.map((dest) => (
                            <button key={dest.name} onClick={() => setSelectedDest(dest.name)}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${selectedDest === dest.name ? 'border-boq-teal-500/60 bg-boq-teal-500/12 shadow-sm shadow-boq-teal-500/20' : 'border-boq-border bg-boq-dark-600/60 hover:border-white/10 hover:bg-boq-dark-500/40'}`}>
                              <span className="text-2xl">{dest.emoji}</span>
                              <div>
                                <div className="text-sm font-bold text-boq-text-primary">{dest.name}</div>
                                <div className="text-[10px] text-boq-text-muted">{dest.country}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 1: Dates */}
                    {currentStep === 1 && (
                      <div>
                        <h2 className="text-2xl font-black text-boq-text-primary mb-1">When are you traveling?</h2>
                        <p className="text-sm text-boq-text-muted mb-6">Select your travel dates</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-boq-text-muted mb-2 block uppercase tracking-wider">Departure</label>
                            <input type="date" value={dates.departure} onChange={(e) => setDates((prev) => ({ ...prev, departure: e.target.value }))}
                              className="w-full px-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-boq-text-muted mb-2 block uppercase tracking-wider">Return</label>
                            <input type="date" value={dates.returnDate} onChange={(e) => setDates((prev) => ({ ...prev, returnDate: e.target.value }))}
                              min={dates.departure}
                              className="w-full px-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                          </div>
                        </div>
                        <div className="mt-5 p-4 rounded-2xl bg-boq-teal-500/5 border border-boq-teal-500/15">
                          <p className="text-xs text-boq-teal-400 font-medium">💡 Tip: Book 6-8 weeks in advance for the best rates to East Africa</p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Travelers */}
                    {currentStep === 2 && (
                      <div>
                        <h2 className="text-2xl font-black text-boq-text-primary mb-1">Who&apos;s traveling?</h2>
                        <p className="text-sm text-boq-text-muted mb-6">Tell us about your travel group</p>
                        <div className="space-y-3">
                          {([
                            { key: 'adults' as const, label: 'Adults', sublabel: 'Ages 13+' },
                            { key: 'children' as const, label: 'Children', sublabel: 'Ages 2–12' },
                            { key: 'infants' as const, label: 'Infants', sublabel: 'Under 2' },
                          ]).map((g) => (
                            <div key={g.key} className="flex items-center justify-between p-4 bg-boq-dark-600/60 rounded-2xl border border-boq-border">
                              <div>
                                <div className="text-sm font-bold text-boq-text-primary">{g.label}</div>
                                <div className="text-xs text-boq-text-muted">{g.sublabel}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button onClick={() => updateTravelers(g.key, -1)}
                                  className="w-9 h-9 rounded-xl bg-boq-dark-400 text-boq-text-primary flex items-center justify-center hover:bg-boq-dark-300 text-lg font-bold transition-all">−</button>
                                <span className="text-base font-black text-boq-text-primary w-5 text-center">{travelers[g.key]}</span>
                                <button onClick={() => updateTravelers(g.key, 1)}
                                  className="w-9 h-9 rounded-xl bg-boq-teal-500/20 text-boq-teal-400 flex items-center justify-center hover:bg-boq-teal-500/30 text-lg font-bold transition-all">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Budget */}
                    {currentStep === 3 && (
                      <div>
                        <h2 className="text-2xl font-black text-boq-text-primary mb-1">What&apos;s your budget?</h2>
                        <p className="text-sm text-boq-text-muted mb-6">We&apos;ll find the best options within your range</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="text-xs font-semibold text-boq-text-muted mb-2 block uppercase tracking-wider">Minimum ($)</label>
                            <input type="number" placeholder="500" value={budget.min} onChange={(e) => setBudget((prev) => ({ ...prev, min: e.target.value }))}
                              className="w-full px-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-boq-text-muted mb-2 block uppercase tracking-wider">Maximum ($)</label>
                            <input type="number" placeholder="5000" value={budget.max} onChange={(e) => setBudget((prev) => ({ ...prev, max: e.target.value }))}
                              className="w-full px-4 py-3.5 bg-boq-dark-600 border border-boq-border rounded-2xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Budget', icon: Wallet, sub: 'Under $500', value: 'budget' },
                            { label: 'Mid-range', icon: DollarSign, sub: '$500–$2000', value: 'mid-range' },
                            { label: 'Luxury', icon: Crown, sub: '$2000+', value: 'luxury' },
                          ].map((tier) => {
                            const Icon = tier.icon;
                            const isSelected = selectedBudgetTier === tier.value;
                            return (
                              <button key={tier.label}
                                onClick={() => setSelectedBudgetTier(tier.value)}
                                className={`p-4 rounded-2xl border transition-all text-center group ${
                                  isSelected
                                    ? 'border-boq-teal-500/50 bg-boq-teal-500/10'
                                    : 'border-boq-border bg-boq-dark-600/60 hover:border-boq-teal-500/40 hover:bg-boq-teal-500/8'
                                }`}>
                                <Icon size={20} className={`mx-auto mb-2 transition-colors ${isSelected ? 'text-boq-teal-400' : 'text-boq-text-muted group-hover:text-boq-teal-400'}`} />
                                <div className="text-xs font-bold text-boq-text-primary">{tier.label}</div>
                                <div className="text-[10px] text-boq-text-muted">{tier.sub}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Style */}
                    {currentStep === 4 && (
                      <div>
                        <h2 className="text-2xl font-black text-boq-text-primary mb-1">What&apos;s your travel style?</h2>
                        <p className="text-sm text-boq-text-muted mb-5">Pick one or more that match your vibe</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {travelStyles.map((style) => {
                            const isSelected = selectedStyles.includes(style.id);
                            const Icon = IconMap[style.icon] || Heart;
                            return (
                              <button key={style.id}
                                onClick={() => toggleStyle(style.id)}
                                className={`p-4 rounded-2xl border transition-all duration-300 text-left group ${
                                  isSelected 
                                    ? 'border-boq-teal-500/50 bg-boq-teal-500 shadow-[0_0_20px_rgba(13,148,136,0.3)] ring-1 ring-white/10' 
                                    : 'border-white/5 bg-boq-dark-600/60 hover:border-boq-teal-500/30 hover:bg-boq-dark-500'
                                }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${
                                  isSelected ? 'bg-white/20' : 'bg-boq-teal-500/10'
                                }`}>
                                  <Icon size={18} strokeWidth={2} className={isSelected ? 'text-white' : 'text-boq-teal-400'} />
                                </div>
                                <div className={`text-sm font-black transition-colors ${isSelected ? 'text-white' : 'text-boq-text-primary'}`}>{style.name}</div>
                                <div className={`text-[10px] transition-colors ${isSelected ? 'text-white/80' : 'text-boq-text-muted'}`}>{style.description}</div>
                              </button>
                            );
                          })}
                        </div>
                        <h3 className="text-sm font-black text-boq-text-primary mb-3">Trip Type</h3>
                        <div className="space-y-2">
                          {tripTypes.map((type) => (
                            <button key={type.id} onClick={() => setSelectedType(type.id)}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedType === type.id ? 'border-boq-teal-500/60 bg-boq-teal-500/10' : 'border-boq-border bg-boq-dark-600/60 hover:border-white/10'}`}>
                              <span className="text-2xl">{type.icon}</span>
                              <div>
                                <div className="text-sm font-bold text-boq-text-primary">{type.name}</div>
                                <div className="text-xs text-boq-text-muted">{type.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardSpotlight>
                </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button onClick={handleBack} disabled={currentStep === 0}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-boq-text-secondary hover:text-boq-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-boq-teal-500/25 hover:shadow-boq-teal-500/40">
                    {currentStep === wizardSteps.length - 1 ? (
                      <><Sparkles size={16} /> Generate Itinerary</>
                    ) : (
                      <>Continue <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </motion.div>

            /* ─── AI ITINERARY RESULT ─── */
            ) : aiItinerary ? (
              <motion.div key="itinerary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> AI Generated
                    </div>
                    <h1 className="text-2xl font-black text-boq-text-primary mb-1">{aiItinerary.title}</h1>
                    <p className="text-sm text-boq-text-muted">{getTripDuration()} · {aiItinerary.estimatedBudget || 'Custom Budget'}</p>
                    {aiItinerary.description && (
                      <p className="text-xs text-boq-text-secondary mt-2 max-w-lg leading-relaxed">{aiItinerary.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={handleRegenerate}
                      className="flex items-center gap-2 px-4 py-2 bg-boq-teal-500/10 border border-boq-teal-500/30 text-boq-teal-400 rounded-xl text-xs font-bold hover:bg-boq-teal-500/20 transition-all">
                      <RefreshCw size={13} /> Regenerate
                    </button>
                    <button onClick={handleStartOver}
                      className="flex items-center gap-2 px-4 py-2 glass border border-white/5 text-boq-text-secondary rounded-xl text-xs font-bold hover:text-boq-text-primary transition-all">
                      <ArrowLeft size={13} /> Edit Trip
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-boq-teal-500 via-boq-dark-300 to-transparent" />
                  {aiItinerary.days.map((day) => (
                    <motion.div key={day.day} className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: day.day * 0.1 }}>
                      <div className="absolute -left-8 top-4 w-7 h-7 rounded-full bg-boq-teal-500/20 border-2 border-boq-teal-500 flex items-center justify-center text-boq-teal-400 text-xs font-black">
                        {day.day}
                      </div>
                      <CardSpotlight className="rounded-2xl p-5 border border-white/5 bg-boq-dark-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="text-sm font-black text-boq-text-primary">Day {day.day}: {day.title}</div>
                        </div>
                        <div className="space-y-3">
                          {day.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="flex items-center gap-3 p-3 bg-boq-dark-600/60 rounded-xl border border-boq-border hover:border-boq-teal-500/20 transition-all group">
                              <div className="w-12 h-12 rounded-xl bg-boq-dark-500 flex-shrink-0 overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${getActivityImage(activity.type)})` }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-boq-text-primary">{activity.title}</div>
                                <div className="text-xs text-boq-text-muted line-clamp-1">{activity.description}</div>
                                <div className="flex items-center gap-3 mt-1">
                                  {activity.time && (
                                    <span className="flex items-center gap-1 text-[10px] text-boq-teal-400 font-medium">
                                      <Clock size={9} /> {activity.time}
                                    </span>
                                  )}
                                  {activity.estimatedCost && (
                                    <span className="text-[10px] text-boq-amber-400 font-medium">
                                      {activity.estimatedCost}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <MoreVertical size={14} className="text-boq-text-muted flex-shrink-0" />
                            </div>
                          ))}

                          {/* Evening + Stay suggestions */}
                          {(day.eveningActivity || day.stayRecommendation) && (
                            <div className="mt-2 pt-3 border-t border-boq-border/50 space-y-2">
                              {day.eveningActivity && (
                                <div className="flex items-start gap-2 text-xs">
                                  <span className="text-boq-amber-400 mt-0.5">🌙</span>
                                  <div>
                                    <span className="font-semibold text-boq-text-secondary">Evening: </span>
                                    <span className="text-boq-text-muted">{day.eveningActivity}</span>
                                  </div>
                                </div>
                              )}
                              {day.stayRecommendation && (
                                <div className="flex items-start gap-2 text-xs">
                                  <span className="text-boq-teal-400 mt-0.5">🏨</span>
                                  <div>
                                    <span className="font-semibold text-boq-text-secondary">Stay: </span>
                                    <span className="text-boq-text-muted">{day.stayRecommendation}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardSpotlight>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <button className="flex items-center gap-2 px-10 py-4 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-boq-teal-500/30 text-base">
                    Proceed to Booking <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
