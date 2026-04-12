'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'tip';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  icon?: string;
  timestamp: Date;
  read: boolean;
  autoClose?: number; // ms, 0 = no auto-close
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  notify: (opts: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  // Deduplicate: store last titles to avoid spamming identical notifs
  const recentTitlesRef = useRef<Map<string, number>>(new Map());

  const notify = useCallback(
    (opts: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const now = Date.now();
      const key = opts.title;
      const lastTime = recentTitlesRef.current.get(key) ?? 0;
      // Debounce identical notifications within 3 seconds
      if (now - lastTime < 3000) return key;
      recentTitlesRef.current.set(key, now);

      const id = `notif-${now}-${Math.random().toString(36).slice(2, 7)}`;
      const notif: Notification = {
        ...opts,
        id,
        timestamp: new Date(),
        read: false,
        autoClose: opts.autoClose ?? 5000,
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 50));
      return id;
    },
    []
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        notify,
        markRead,
        markAllRead,
        dismiss,
        clearAll,
        panelOpen,
        setPanelOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
