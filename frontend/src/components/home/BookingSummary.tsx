'use client';

import { motion } from 'framer-motion';
import {
  X,
  Edit3,
  Plane,
  Building,
  Map,
  Car,
  Check,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { sampleBookingItems } from '@/data/mockData';

const bookingIcons: Record<string, React.ReactNode> = {
  flight: <Plane size={16} />,
  stay: <Building size={16} />,
  tour: <Map size={16} />,
  vehicle: <Car size={16} />,
};

export default function BookingSummary() {
  const totalPrice = sampleBookingItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5 sticky top-20"
      id="booking-summary"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-boq-text-primary">
          Booking Summary
        </h3>
        <button className="p-1 text-boq-text-muted hover:text-boq-text-primary transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Trip Info */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-boq-text-secondary">
          5 Days • 4 Nights
        </div>
        <button className="flex items-center gap-1 text-xs text-boq-teal-400 hover:text-boq-teal-300 transition-colors">
          <Edit3 size={12} />
          Edit
        </button>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {sampleBookingItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-boq-dark-500 flex items-center justify-center text-boq-teal-400">
                {bookingIcons[item.type]}
              </div>
              <div>
                <div className="text-sm font-medium text-boq-text-primary">
                  {item.name}
                </div>
                <div className="text-xs text-boq-text-muted">{item.details}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-boq-text-primary">
                ${item.price}
              </span>
              {item.confirmed && (
                <Check size={14} className="text-boq-teal-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-boq-border pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-boq-text-secondary">Total Price</div>
            <div className="text-xs text-boq-text-muted">
              Taxes & fees included
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-boq-text-primary">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-[10px] text-boq-text-muted">1 Selected</div>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <button
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 mb-3"
        id="book-now-btn"
      >
        Book Now
        <ArrowRight size={16} />
      </button>

      {/* Flexible Booking */}
      <div className="flex items-center gap-2 justify-center">
        <Shield size={14} className="text-boq-teal-400" />
        <div>
          <span className="text-xs font-medium text-boq-text-primary">
            Flexible Booking
          </span>
          <span className="text-xs text-boq-text-muted ml-1">
            Free cancellation up to 48 hours
          </span>
        </div>
      </div>
    </motion.div>
  );
}
