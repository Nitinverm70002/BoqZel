'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MapPin, Plus, X, DollarSign, Navigation,
  Coffee, Music, Fuel, ArrowRight, Sparkles,
  UserPlus, Route, Calculator, Car,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';

const initialFriends = [
  { name: 'Akec M.', avatar: 'A', color: 'from-boq-teal-500 to-boq-teal-300' },
  { name: 'Deng K.', avatar: 'D', color: 'from-purple-500 to-violet-400' },
  { name: 'Nyajal W.', avatar: 'N', color: 'from-amber-500 to-orange-400' },
];

const suggestedStops = [
  { name: 'Riverside Café', type: 'Food & Drinks', time: '20 min', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Scenic Viewpoint', type: 'Photo Stop', time: '15 min', icon: Navigation, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Local Music Spot', type: 'Entertainment', time: '45 min', icon: Music, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'Gas Station', type: 'Refuel', time: '10 min', icon: Fuel, color: 'text-boq-amber-400', bg: 'bg-boq-amber-500/10' },
];

const expenses = [
  { label: 'Gas / Transport', amount: 45, color: 'bg-blue-500' },
  { label: 'Food & Drinks', amount: 90, color: 'bg-boq-teal-500' },
  { label: 'Activities', amount: 60, color: 'bg-purple-500' },
];

const totalBudget = 300;
const spent = expenses.reduce((s, e) => s + e.amount, 0);
const spendPct = (spent / totalBudget) * 100;

// Simple SVG ring component
function BudgetRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <motion.circle
        cx="48" cy="48" r={r} fill="none"
        stroke="url(#ringGrad)" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ChillPage() {
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [addingFriend, setAddingFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  const removeFriend = (idx: number) => setFriendsList((prev) => prev.filter((_, i) => i !== idx));

  const addFriend = () => {
    if (newFriendName.trim()) {
      const colors = ['from-rose-500 to-pink-400', 'from-emerald-500 to-teal-400', 'from-indigo-500 to-blue-400'];
      setFriendsList((prev) => [
        ...prev,
        { name: newFriendName.trim(), avatar: newFriendName.trim()[0].toUpperCase(), color: colors[prev.length % colors.length] },
      ]);
      setNewFriendName('');
      setAddingFriend(false);
    }
  };

  const perPerson = Math.round(totalBudget / (friendsList.length || 1));

  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 min-h-screen pb-16">
        {/* Header */}
        <div className="relative pt-20 pb-10 overflow-hidden">
          <div className="orb orb-purple w-[600px] h-[400px] -top-32 -left-40" />
          <div className="orb orb-teal w-[400px] h-[300px] -top-10 right-0" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                <Users size={11} /> Group Vibes
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-boq-text-primary mb-3 leading-none">
                Plan a <span className="text-gradient-purple">Chill Trip</span>
              </h1>
              <p className="text-base text-boq-text-secondary max-w-md mx-auto leading-relaxed">
                Quick outings with friends — pick a route, add stops, split the budget, and go.
              </p>
            </motion.div>

            {/* Friend Avatars Stack */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-1 mt-6">
              <div className="flex -space-x-3">
                {friendsList.map((f, idx) => (
                  <div key={idx} className={`w-10 h-10 rounded-full bg-gradient-to-br ${f.color} border-2 border-boq-dark-900 flex items-center justify-center text-white text-sm font-black`}>
                    {f.avatar}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-boq-dark-500 border-2 border-dashed border-boq-dark-300 flex items-center justify-center text-boq-text-muted hover:text-boq-text-primary hover:border-purple-400 transition-all cursor-pointer"
                  onClick={() => setAddingFriend(true)}>
                  <Plus size={14} />
                </div>
              </div>
              <span className="ml-3 text-sm text-boq-text-muted">{friendsList.length} going</span>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Friends + Route */}
            <div className="space-y-5">
              {/* Friends List */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-5 border border-white/5">
                <h2 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <UserPlus size={15} className="text-purple-400" /> Your Group
                </h2>
                <div className="space-y-2 mb-4">
                  {friendsList.map((friend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-boq-dark-600/60 rounded-2xl border border-boq-border group hover:border-purple-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-white text-sm font-bold`}>
                          {friend.avatar}
                        </div>
                        <span className="text-sm font-semibold text-boq-text-primary">{friend.name}</span>
                      </div>
                      <button onClick={() => removeFriend(idx)} className="p-1.5 text-boq-text-muted hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-400/10">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {addingFriend ? (
                  <div className="flex gap-2">
                    <input autoFocus value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFriend()}
                      placeholder="Friend's name…"
                      className="flex-1 px-3 py-2.5 bg-boq-dark-600 border border-purple-500/30 rounded-xl text-sm text-boq-text-primary focus:outline-none focus:border-purple-500 transition-all" />
                    <button onClick={addFriend} className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all text-xs font-bold">Add</button>
                    <button onClick={() => setAddingFriend(false)} className="px-3 py-2 glass rounded-xl text-boq-text-muted hover:text-boq-text-primary transition-all text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingFriend(true)} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-boq-border rounded-2xl text-xs text-boq-text-muted hover:text-purple-400 hover:border-purple-500/30 transition-all">
                    <Plus size={13} /> Add Friend
                  </button>
                )}
              </motion.div>

              {/* Route */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-5 border border-white/5">
                <h2 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <Route size={15} className="text-boq-teal-400" /> Route Planning
                </h2>
                <div className="space-y-2 relative">
                  {/* Vertical connector */}
                  <div className="absolute left-[10px] top-8 bottom-8 w-px border-l border-dashed border-boq-dark-300 z-0" />

                  {[
                    { dot: 'bg-green-400', placeholder: 'Starting point', default: 'Juba City Center' },
                    { dot: 'bg-boq-amber-400', placeholder: 'First stop', default: '' },
                    { dot: 'bg-rose-400', placeholder: 'Destination', default: '' },
                  ].map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3 relative z-10">
                      <div className={`w-3 h-3 rounded-full ${stop.dot} flex-shrink-0 shadow-md`} />
                      <input type="text" placeholder={stop.placeholder} defaultValue={stop.default}
                        className="flex-1 px-3 py-2.5 bg-boq-dark-600 border border-boq-border rounded-xl text-sm text-boq-text-primary focus:outline-none focus:border-boq-teal-500 transition-all" />
                    </div>
                  ))}
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-boq-teal-400 hover:text-boq-teal-300 transition-colors">
                  <Plus size={12} /> Add stop
                </button>

                <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-boq-dark-600/60 border border-boq-border">
                  <Car size={16} className="text-boq-teal-400" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-boq-text-primary">Estimated Drive</div>
                    <div className="text-[10px] text-boq-text-muted">~45 mins · 28 km</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold">Clear roads</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Stops + Budget */}
            <div className="space-y-5">
              {/* Suggested Stops */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-5 border border-white/5">
                <h2 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <MapPin size={15} className="text-purple-400" /> Suggested Stops
                </h2>
                <div className="space-y-2">
                  {suggestedStops.map((stop, idx) => {
                    const Icon = stop.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3.5 bg-boq-dark-600/60 rounded-2xl border border-boq-border hover:border-purple-500/20 transition-all cursor-pointer group">
                        <div className={`w-10 h-10 rounded-xl ${stop.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={16} className={stop.color} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-boq-text-primary">{stop.name}</div>
                          <div className="text-[10px] text-boq-text-muted">{stop.type} · {stop.time}</div>
                        </div>
                        <button className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-xl hover:bg-purple-500/20 transition-all opacity-0 group-hover:opacity-100 border border-purple-500/20">
                          Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Budget Split */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-3xl p-5 border border-white/5">
                <h2 className="text-sm font-black text-boq-text-primary mb-4 flex items-center gap-2">
                  <Calculator size={15} className="text-boq-amber-400" /> Budget Split
                </h2>

                {/* Ring + summary */}
                <div className="flex items-center gap-5 mb-4 p-4 bg-boq-dark-600/60 rounded-2xl border border-boq-border">
                  <div className="relative flex-shrink-0">
                    <BudgetRing pct={spendPct} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-[10px] text-boq-text-muted">Spent</div>
                      <div className="text-sm font-black text-boq-text-primary">{Math.round(spendPct)}%</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-boq-text-muted">Total Budget</span>
                      <span className="text-xl font-black text-boq-text-primary">${totalBudget}</span>
                    </div>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-boq-text-muted">Per person ({friendsList.length})</span>
                      <span className="text-base font-black text-boq-teal-400">${perPerson}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-boq-text-muted">Estimated: ${spent}</span>
                      <span className="text-green-400 font-bold">${totalBudget - spent} left</span>
                    </div>
                  </div>
                </div>

                {/* Expense breakdown */}
                <div className="space-y-2.5">
                  {expenses.map((exp) => (
                    <div key={exp.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-boq-text-muted">{exp.label}</span>
                        <span className="text-boq-text-primary font-bold">${exp.amount}</span>
                      </div>
                      <div className="h-1 bg-boq-dark-400 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${exp.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(exp.amount / totalBudget) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-purple-500/25 animate-pulse-ring text-base"
              >
                <Sparkles size={18} />
                Quick Book This Trip
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
