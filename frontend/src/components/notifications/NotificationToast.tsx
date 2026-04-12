'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { Notification, NotificationType, useNotifications } from '@/context/NotificationContext';

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; accent: string; bg: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    accent: 'bg-boq-teal-400',
    bg: 'from-boq-teal-500/10 to-transparent',
    iconColor: 'text-boq-teal-400',
  },
  info: {
    icon: Info,
    accent: 'bg-blue-400',
    bg: 'from-blue-500/10 to-transparent',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    accent: 'bg-amber-400',
    bg: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: AlertCircle,
    accent: 'bg-rose-500',
    bg: 'from-rose-500/10 to-transparent',
    iconColor: 'text-rose-400',
  },
  tip: {
    icon: Lightbulb,
    accent: 'bg-violet-400',
    bg: 'from-violet-500/10 to-transparent',
    iconColor: 'text-violet-400',
  },
};

function ToastItem({ notif }: { notif: Notification }) {
  const { dismiss, markRead } = useNotifications();
  const config = TYPE_CONFIG[notif.type];
  const Icon = config.icon;
  const progressRef = useRef<HTMLDivElement>(null);
  const closeDuration = notif.autoClose && notif.autoClose > 0 ? notif.autoClose : null;

  useEffect(() => {
    if (!closeDuration) return;
    const timer = setTimeout(() => dismiss(notif.id), closeDuration);
    // Animate progress bar
    if (progressRef.current) {
      progressRef.current.style.transition = `width ${closeDuration}ms linear`;
      // Trigger reflow
      void progressRef.current.offsetWidth;
      progressRef.current.style.width = '0%';
    }
    return () => clearTimeout(timer);
  }, [closeDuration, notif.id, dismiss]);

  const handleClose = () => {
    markRead(notif.id);
    dismiss(notif.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className="relative w-[360px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
      style={{
        background: 'rgba(10, 15, 26, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Type accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />

      {/* BG gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.bg} opacity-60 pointer-events-none`} />

      <div className="relative flex items-start gap-3 p-4 pl-5">
        {/* Icon */}
        <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
          {notif.icon ? (
            <span className="text-xl leading-none">{notif.icon}</span>
          ) : (
            <Icon size={20} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">{notif.title}</p>
          {notif.message && (
            <p className="text-xs text-boq-text-secondary mt-0.5 leading-snug">
              {notif.message}
            </p>
          )}
          <p className="text-[10px] text-boq-text-muted mt-1.5 uppercase tracking-wide font-medium">
            Just now
          </p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="shrink-0 p-1 rounded-lg text-boq-text-muted hover:text-white hover:bg-white/10 transition-all -mt-0.5 -mr-0.5"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      {closeDuration && (
        <div className="h-0.5 bg-white/5 w-full">
          <div
            ref={progressRef}
            className={`h-full ${config.accent} opacity-60`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function NotificationToast() {
  const { notifications } = useNotifications();
  // Only show toasts that are unread (unread = just fired)
  const toasts = notifications.filter((n) => !n.read).slice(0, 5);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 items-end pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((notif) => (
          <div key={notif.id} className="pointer-events-auto">
            <ToastItem notif={notif} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
