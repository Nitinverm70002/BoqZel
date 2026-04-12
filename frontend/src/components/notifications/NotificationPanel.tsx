'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  LucideIcon,
} from 'lucide-react';
import { Notification, NotificationType, useNotifications } from '@/context/NotificationContext';

const TYPE_ICON_MAP: Record<NotificationType, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  tip: Lightbulb,
};

const TYPE_COLOR_MAP: Record<NotificationType, string> = {
  success: 'text-boq-teal-400',
  info: 'text-blue-400',
  warning: 'text-amber-400',
  error: 'text-rose-400',
  tip: 'text-violet-400',
};

const TYPE_BG_MAP: Record<NotificationType, string> = {
  success: 'bg-boq-teal-500/10',
  info: 'bg-blue-500/10',
  warning: 'bg-amber-500/10',
  error: 'bg-rose-500/10',
  tip: 'bg-violet-500/10',
};

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString();
}

function NotificationItem({ notif }: { notif: Notification }) {
  const { markRead, dismiss } = useNotifications();
  const Icon = TYPE_ICON_MAP[notif.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      className={`relative flex items-start gap-3 p-3.5 rounded-xl transition-all cursor-default group ${
        notif.read ? 'opacity-60' : ''
      } hover:bg-white/5`}
      onClick={() => markRead(notif.id)}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span className="absolute top-4 right-3 w-1.5 h-1.5 rounded-full bg-boq-teal-400 shrink-0" />
      )}

      {/* Icon pill */}
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${TYPE_BG_MAP[notif.type]}`}
      >
        {notif.icon ? (
          <span className="text-lg leading-none">{notif.icon}</span>
        ) : (
          <Icon size={17} className={TYPE_COLOR_MAP[notif.type]} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-semibold text-white leading-snug">{notif.title}</p>
        {notif.message && (
          <p className="text-xs text-boq-text-secondary mt-0.5 leading-snug line-clamp-2">
            {notif.message}
          </p>
        )}
        <p className="text-[10px] text-boq-text-muted mt-1.5 uppercase tracking-wide">
          {formatRelativeTime(notif.timestamp)}
        </p>
      </div>

      {/* Dismiss on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-boq-text-muted hover:text-white hover:bg-white/10 transition-all"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

export function NotificationPanel() {
  const { notifications, unreadCount, markAllRead, clearAll, panelOpen, setPanelOpen } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [panelOpen, setPanelOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanelOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setPanelOpen]);

  // Group notifications
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayNotifs = notifications.filter((n) => n.timestamp.getTime() >= todayStart);
  const earlierNotifs = notifications.filter((n) => n.timestamp.getTime() < todayStart);

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/30 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed top-[78px] right-4 z-[9995] w-[380px] max-h-[calc(100vh-100px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
            style={{
              background: 'rgba(10, 15, 26, 0.95)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <Bell size={16} className="text-boq-teal-400" />
                <span className="text-sm font-black text-white tracking-tight">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-boq-teal-500 text-white text-[10px] font-black">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-boq-text-secondary hover:text-white hover:bg-white/5 transition-all"
                    title="Mark all as read"
                  >
                    <CheckCheck size={13} />
                    All read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 p-1.5 rounded-lg text-boq-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1.5 rounded-lg text-boq-text-muted hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center"
                  >
                    <Bell size={22} className="text-boq-text-muted" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">All caught up!</p>
                    <p className="text-xs text-boq-text-muted mt-1">
                      Notifications will appear here as you use BoqZel.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {todayNotifs.length > 0 && (
                    <div key="today">
                      <p className="text-[10px] font-black text-boq-text-muted uppercase tracking-widest px-3.5 py-2">
                        Today
                      </p>
                      {todayNotifs.map((n) => (
                        <NotificationItem key={n.id} notif={n} />
                      ))}
                    </div>
                  )}
                  {earlierNotifs.length > 0 && (
                    <div key="earlier">
                      <p className="text-[10px] font-black text-boq-text-muted uppercase tracking-widest px-3.5 py-2 mt-2">
                        Earlier
                      </p>
                      {earlierNotifs.map((n) => (
                        <NotificationItem key={n.id} notif={n} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="shrink-0 px-4 py-3 border-t border-white/5 text-center">
                <p className="text-[11px] text-boq-text-muted">
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''} •{' '}
                  {unreadCount} unread
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
