'use client';

import * as React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string; // expects 'yyyy-MM-dd'
  onChange: (value: string) => void;
  minDate?: string; // 'yyyy-MM-dd'
  placeholder?: string;
}

export function DatePicker({ value, onChange, minDate, placeholder = 'Select date' }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const parseDateString = (dateStr: string) => {
    if (!dateStr) return undefined;
    return new Date(dateStr + 'T12:00:00');
  };

  const initialMonth = value ? parseDateString(value) || new Date() : new Date();
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleSelect = (day: Date) => {
    // Keep exact local calendar date
    const dateStr = format(day, 'yyyy-MM-dd');
    if (minDate && dateStr < minDate) return;
    onChange(dateStr);
    setIsOpen(false);
  };

  const selectedDateStr = value;
  const minDateStr = minDate;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-boq-dark-600 border border-boq-border hover:border-boq-teal-500/50 rounded-2xl text-sm transition-all focus:outline-none focus:border-boq-teal-500"
      >
        <span className={value ? "text-boq-text-primary font-medium" : "text-boq-text-muted"}>
          {value ? format(parseDateString(value)!, 'PP') : placeholder}
        </span>
        <CalendarIcon size={16} className="text-boq-teal-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 p-4 w-72 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] z-[99]"
          >
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-boq-dark-600 text-boq-text-secondary hover:text-boq-text-primary transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-bold text-boq-text-primary">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-boq-dark-600 text-boq-text-secondary hover:text-boq-text-primary transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-bold text-boq-text-muted uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day, idx) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isDisabled = minDateStr ? dayStr < minDateStr : false;
                const isSelected = dayStr === selectedDateStr;
                const isCurrentMonth = isSameMonth(day, monthStart);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(day)}
                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      !isCurrentMonth ? 'text-boq-text-muted/30' :
                      isDisabled ? 'text-boq-text-muted/50 cursor-not-allowed' :
                      isSelected ? 'bg-boq-teal-500 text-white shadow-md shadow-boq-teal-500/30' :
                      isToday(day) ? 'bg-boq-dark-600 text-boq-teal-400 border border-boq-teal-500/30' :
                      'text-boq-text-primary hover:bg-boq-dark-500'
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
