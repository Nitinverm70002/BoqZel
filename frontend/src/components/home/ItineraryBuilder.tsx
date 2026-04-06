'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Save,
  Edit3,
  MoreVertical,
  Plus,
  ArrowLeftRight,
  Star,
  Plane,
  Building,
  Map,
  Utensils,
  Camera,
  Clock,
} from 'lucide-react';
import { sampleItinerary, activities } from '@/data/mockData';

const steps = [
  { number: 1, label: 'PLAN', sublabel: 'Tell us your preferences', active: false, completed: true },
  { number: 2, label: 'CUSTOMIZE', sublabel: 'Make it your own', active: true, completed: false },
  { number: 3, label: 'MOVE & BOOK', sublabel: 'Confirm & pay', active: false, completed: false },
  { number: 4, label: 'EXPERIENCE', sublabel: 'Enjoy your journey', active: false, completed: false },
];

const activityIcons: Record<string, React.ReactNode> = {
  arrival: <Plane size={16} />,
  stay: <Building size={16} />,
  tour: <Map size={16} />,
  dining: <Utensils size={16} />,
  relaxation: <Camera size={16} />,
  transport: <Plane size={16} />,
  departure: <Plane size={16} />,
};

const suggestions = [
  {
    name: 'Airport Pickup',
    price: 25,
    image: '/images/act-airport.jpg',
    rating: 4.8,
  },
  {
    name: 'Sunset Dinner',
    price: 40,
    image: '/images/act-dinner.jpg',
    rating: 4.9,
  },
  {
    name: 'City Tour',
    price: 35,
    image: '/images/act-city.jpg',
    rating: 4.7,
  },
];

export default function ItineraryBuilder() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" id="itinerary-builder">
      {/* Step Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-2 md:gap-4 mb-8 overflow-x-auto scrollbar-hide"
      >
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.active
                    ? 'bg-boq-teal-500 text-white glow-teal-sm'
                    : step.completed
                    ? 'bg-boq-dark-300 text-boq-text-primary'
                    : 'bg-boq-dark-500 text-boq-text-muted'
                }`}
              >
                {step.number}
              </div>
              <div className="hidden sm:block">
                <div
                  className={`text-xs font-bold ${
                    step.active ? 'text-boq-teal-400' : 'text-boq-text-muted'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10px] text-boq-text-muted whitespace-nowrap">
                  {step.sublabel}
                </div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 md:w-16 h-px bg-boq-dark-300" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Itinerary Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-boq-text-primary">
              Customize Your Itinerary
            </h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-boq-teal-500/10 border border-boq-teal-500/30 text-boq-teal-400 rounded-lg text-xs font-medium hover:bg-boq-teal-500/20 transition-all">
                <Sparkles size={14} />
                AI Optimize
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-boq-dark-500 border border-boq-border text-boq-text-secondary rounded-lg text-xs font-medium hover:bg-boq-dark-400 transition-all">
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>

          <p className="text-xs text-boq-text-muted mb-6">
            Drag, drop, swap, and adjust every part of your trip.
          </p>

          {/* Timeline */}
          <div className="flex gap-4">
            {/* Day Selector */}
            <div className="flex flex-col gap-1 min-w-[70px]">
              {sampleItinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`text-left px-3 py-2.5 rounded-lg transition-all text-xs ${
                    activeDay === day.day
                      ? 'bg-boq-teal-500/15 border border-boq-teal-500/30 text-boq-teal-400'
                      : 'text-boq-text-muted hover:text-boq-text-secondary hover:bg-boq-dark-500/50'
                  }`}
                >
                  <div className="font-bold">Day {day.day}</div>
                  <div className="text-[10px] opacity-80">{day.date}</div>
                </button>
              ))}
            </div>

            {/* Activities */}
            <div className="flex-1 space-y-3">
              {sampleItinerary.map((day) => (
                <div key={day.day}>
                  {day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        activity.type === 'stay'
                          ? 'bg-boq-teal-500/8 border border-boq-teal-500/20'
                          : 'bg-boq-dark-600/50 border border-boq-border hover:border-boq-border-light'
                      }`}
                    >
                      {/* Day indicator */}
                      <div className="hidden sm:flex flex-col items-center text-[10px] text-boq-text-muted min-w-[40px]">
                        <span className="text-boq-text-secondary font-bold">Day{day.day}</span>
                        <span>{day.date}</span>
                      </div>

                      {/* Image placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-boq-dark-500 flex items-center justify-center text-boq-teal-400 flex-shrink-0 overflow-hidden">
                        {activity.image ? (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${activity.image})` }}
                          />
                        ) : (
                          activityIcons[activity.type]
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-boq-text-primary truncate">
                            {activity.title}
                          </span>
                          {activity.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star
                                size={10}
                                className="text-boq-amber-400 fill-boq-amber-400"
                              />
                              <span className="text-[10px] text-boq-amber-400">
                                {activity.rating}
                              </span>
                            </div>
                          )}
                          {activity.price && (
                            <span className="text-[10px] text-boq-text-muted">
                              - ${activity.price}/night
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-boq-text-muted truncate">
                          {activity.description}
                        </p>
                        {activity.time && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-boq-text-muted" />
                            <span className="text-[10px] text-boq-text-muted">
                              {activity.time}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {activity.type === 'stay' && (
                          <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-boq-teal-400 hover:bg-boq-teal-500/10 rounded transition-all">
                            <ArrowLeftRight size={10} />
                            Swap
                          </button>
                        )}
                        <button className="p-1 text-boq-text-muted hover:text-boq-text-primary transition-colors text-xs">
                          Edit
                        </button>
                        <button className="p-1 text-boq-text-muted hover:text-boq-text-primary transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Add Activity Button */}
              <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-boq-border rounded-xl text-xs text-boq-text-muted hover:text-boq-teal-400 hover:border-boq-teal-500/30 transition-all">
                <Plus size={14} />
                Add Activity or Experience
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right: Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Suggestions */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-bold text-boq-text-primary mb-1">
              Suggestions for Day {activeDay}
            </h3>
            <p className="text-xs text-boq-text-muted mb-4">
              Add these to make it better
            </p>

            <div className="space-y-3">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 bg-boq-dark-600/50 rounded-xl border border-boq-border hover:border-boq-teal-500/20 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-boq-dark-500 flex-shrink-0 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${sug.image})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-boq-text-primary">
                      {sug.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={10}
                        className="text-boq-amber-400 fill-boq-amber-400"
                      />
                      <span className="text-[10px] text-boq-text-muted">
                        {sug.rating}
                      </span>
                    </div>
                    <div className="text-xs text-boq-text-muted">
                      From ${sug.price}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-boq-teal-500/10 text-boq-teal-400 text-xs font-medium rounded-lg hover:bg-boq-teal-500/20 transition-all">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
