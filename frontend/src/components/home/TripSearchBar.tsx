'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  Search,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';

// ─── Inline mini calendar ──────────────────────────────────────────────────
function MiniCalendar({
  selected,
  onSelect,
  minDate,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  minDate?: Date;
}) {
  const [currentMonth, setCurrentMonth] = useState(selected ?? new Date());
  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="p-4 w-72">
      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-white/10 text-boq-text-secondary hover:text-boq-text-primary transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-boq-text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-white/10 text-boq-text-secondary hover:text-boq-text-primary transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center gap-y-1">
        {days.map((day, idx) => {
          const isDisabled = minDate
            ? isBefore(startOfDay(day), startOfDay(minDate))
            : isBefore(startOfDay(day), startOfDay(new Date()));
          const isSelected = selected ? isSameDay(day, selected) : false;
          const inMonth = isSameMonth(day, monthStart);
          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(day)}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                !inMonth
                  ? 'text-boq-text-muted/30'
                  : isDisabled
                  ? 'text-boq-text-muted/40 cursor-not-allowed'
                  : isSelected
                  ? 'bg-boq-teal-500 text-white shadow-md shadow-boq-teal-500/40'
                  : isToday(day)
                  ? 'bg-boq-dark-500 text-boq-teal-400 border border-boq-teal-500/30'
                  : 'text-boq-text-primary hover:bg-white/10'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── City suggestions (static for now) ──────────────────────────────────────
const CITIES = [
  { code: 'JUB', city: 'Juba', country: 'South Sudan' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya' },
  { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia' },
  { code: 'CMB', city: 'Colombo', country: 'Sri Lanka' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa' },
  { code: 'MRK', city: 'Marrakech', country: 'Morocco' },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria' },
  { code: 'DAR', city: 'Dar es Salaam', country: 'Tanzania' },
  { code: 'ZNZ', city: 'Zanzibar', country: 'Tanzania' },
];

interface CityOption {
  code: string;
  city: string;
  country: string;
}

// ─── City input field ────────────────────────────────────────────────────────
function CityField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: CityOption | null;
  onChange: (c: CityOption) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  const displayText = value ? `${value.city}` : '';

  return (
    <div className="relative flex-1 min-w-0" ref={ref}>
      <div
        className="flex flex-col px-4 py-3 cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-boq-text-muted mb-1">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-boq-teal-400 flex-shrink-0" />
          {open ? (
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="bg-transparent text-sm font-semibold text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none w-full"
            />
          ) : (
            <span
              className={`text-sm font-semibold truncate ${
                displayText ? 'text-boq-text-primary' : 'text-boq-text-muted'
              }`}
            >
              {displayText || placeholder}
            </span>
          )}
          {value && !open && (
            <span className="text-[10px] font-bold text-boq-teal-400 bg-boq-teal-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {value.code}
            </span>
          )}
        </div>
        {value && (
          <span className="text-[10px] text-boq-text-muted mt-0.5 pl-5">
            {value.country}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
          >
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c);
                  setQuery('');
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-boq-teal-500/10 border border-boq-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-boq-teal-400">{c.code}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-boq-text-primary group-hover:text-boq-teal-400 transition-colors">
                    {c.city}
                  </div>
                  <div className="text-[10px] text-boq-text-muted">{c.country}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Date field ──────────────────────────────────────────────────────────────
function DateField({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex flex-col px-4 py-3 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-boq-text-muted mb-1">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-boq-teal-400 flex-shrink-0" />
          <span
            className={`text-sm font-semibold ${
              value ? 'text-boq-text-primary' : 'text-boq-text-muted'
            }`}
          >
            {value ? format(value, 'dd MMM yyyy') : 'Select date'}
          </span>
        </div>
        {value && (
          <span className="text-[10px] text-boq-text-muted mt-0.5 pl-5">
            {format(value, 'EEEE')}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] z-50"
          >
            <MiniCalendar
              selected={value}
              minDate={minDate}
              onSelect={(d) => {
                onChange(d);
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-px self-stretch bg-white/[0.07] my-2 flex-shrink-0" />;
}

// ─── Main TripSearchBar ───────────────────────────────────────────────────────
export default function TripSearchBar() {
  const [from, setFrom] = useState<CityOption | null>(null);
  const [to, setTo] = useState<CityOption | null>(null);
  const [depart, setDepart] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [swapping, setSwapping] = useState(false);

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => {
      setFrom(to);
      setTo(from);
      setSwapping(false);
    }, 200);
  };

  return (
    <section
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-14"
      id="trip-search-section"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Label strip above the bar */}
        <div className="flex items-center gap-2 mb-3 pl-1">
          <Plane size={13} className="text-boq-teal-400" />
          <span className="text-xs font-semibold text-boq-text-secondary tracking-wide">
            Search Flights & Trips
          </span>
        </div>

        {/* The bar itself */}
        <div
          className="flex flex-col lg:flex-row items-stretch lg:items-center rounded-2xl border border-white/[0.07] overflow-visible"
          style={{
            background: 'rgba(10, 15, 26, 0.72)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow:
              '0 0 0 1px rgba(20,184,166,0.06), 0 20px 60px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* ── FROM ── */}
          <CityField
            label="From"
            placeholder="Origin city"
            value={from}
            onChange={setFrom}
          />

          {/* ── SWAP BUTTON ── */}
          <div className="relative flex items-center justify-center lg:px-0 px-4 py-2 lg:py-0 flex-shrink-0">
            {/* horizontal dividers on desktop */}
            <div className="hidden lg:block w-px self-stretch bg-white/[0.07] my-2" />
            <motion.button
              type="button"
              onClick={handleSwap}
              animate={{ rotate: swapping ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="mx-3 w-8 h-8 rounded-full bg-boq-dark-500 border border-white/10 flex items-center justify-center text-boq-teal-400 hover:bg-boq-teal-500/20 hover:border-boq-teal-500/40 transition-all flex-shrink-0 shadow-md"
              id="swap-cities-btn"
              aria-label="Swap origin and destination"
            >
              <ArrowLeftRight size={14} />
            </motion.button>
            <div className="hidden lg:block w-px self-stretch bg-white/[0.07] my-2" />
          </div>

          {/* ── TO ── */}
          <CityField
            label="To"
            placeholder="Destination city"
            value={to}
            onChange={setTo}
          />

          <Divider />

          {/* ── DEPART ── */}
          <DateField
            label="Depart"
            value={depart}
            onChange={(d) => {
              setDepart(d);
              // Clear return if it's now before departure
              if (returnDate && isBefore(returnDate, d)) setReturnDate(null);
            }}
          />

          <Divider />

          {/* ── RETURN ── */}
          <div className="flex items-center flex-1 relative">
            <DateField
              label="Return"
              value={returnDate}
              onChange={setReturnDate}
              minDate={depart ?? new Date()}
            />
            {returnDate && (
              <button
                type="button"
                onClick={() => setReturnDate(null)}
                className="mr-3 p-1 rounded-full hover:bg-white/10 text-boq-text-muted hover:text-boq-text-primary transition-colors flex-shrink-0"
                aria-label="Clear return date"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* ── SEARCH BUTTON ── */}
          <div className="p-2 flex-shrink-0">
            <motion.button
              id="search-flights-btn"
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 h-14 bg-boq-teal-500 hover:bg-boq-teal-400 text-white font-bold text-sm rounded-xl transition-colors w-full lg:w-auto whitespace-nowrap"
              style={{
                boxShadow:
                  '0 0 20px rgba(20,184,166,0.25), 0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <Search size={16} />
              Search
            </motion.button>
          </div>
        </div>

        {/* Quick-pick tags */}
        <div className="flex items-center gap-2 mt-3 pl-1 flex-wrap">
          <span className="text-[11px] text-boq-text-muted">Popular:</span>
          {[
            { label: 'Juba → Nairobi', f: CITIES[0], t: CITIES[1] },
            { label: 'Juba → Dubai', f: CITIES[0], t: CITIES[4] },
            { label: 'Nairobi → Cape Town', f: CITIES[1], t: CITIES[5] },
          ].map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => {
                setFrom(q.f);
                setTo(q.t);
              }}
              className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-boq-text-muted hover:text-boq-teal-400 hover:border-boq-teal-500/30 hover:bg-boq-teal-500/5 transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
