'use client';

import { useCallback } from 'react';
import { useNotifications } from '@/context/NotificationContext';

/**
 * Convenience hook exposing typed notify shortcuts.
 * Wrap per-page activity triggers around these helpers.
 */
export function useActivityNotifications() {
  const { notify } = useNotifications();

  /** Stays page — data loaded successfully */
  const notifyStaysLoaded = useCallback(
    (count: number, query?: string) => {
      if (count === 0) return;
      notify({
        type: 'success',
        icon: '🏨',
        title: `${count} stay${count !== 1 ? 's' : ''} found`,
        message: query
          ? `Showing results for "${query}"`
          : 'Browse curated accommodations below.',
        autoClose: 4000,
      });
    },
    [notify]
  );

  /** Stays page — wishlist toggled */
  const notifyWishlist = useCallback(
    (added: boolean, name?: string) => {
      notify({
        type: added ? 'success' : 'info',
        icon: added ? '❤️' : '🤍',
        title: added ? 'Added to wishlist' : 'Removed from wishlist',
        message: name ? `"${name}" updated.` : undefined,
        autoClose: 3000,
      });
    },
    [notify]
  );

  /** Stays page — no results */
  const notifyNoResults = useCallback(
    (query?: string) => {
      notify({
        type: 'warning',
        icon: '🔍',
        title: 'No stays found',
        message: query
          ? `No results for "${query}". Try different keywords or filters.`
          : 'Try adjusting your filters.',
        autoClose: 5000,
      });
    },
    [notify]
  );

  /** Generic API error */
  const notifyError = useCallback(
    (message?: string) => {
      notify({
        type: 'error',
        icon: '🚨',
        title: 'Connection issue',
        message: message ?? 'Could not reach the server. Check your connection.',
        autoClose: 6000,
      });
    },
    [notify]
  );

  /** Auth — welcome back on login */
  const notifyWelcome = useCallback(
    (name?: string) => {
      notify({
        type: 'success',
        icon: '👋',
        title: name ? `Welcome back, ${name}!` : 'Welcome back!',
        message: 'Your trips and stays are ready.',
        autoClose: 5000,
      });
    },
    [notify]
  );

  /** Auth — goodbye on logout */
  const notifyLogout = useCallback(() => {
    notify({
      type: 'info',
      icon: '✈️',
      title: 'See you around!',
      message: 'Your session has ended safely.',
      autoClose: 4000,
    });
  }, [notify]);

  /** Discover — first-visit contextual tip */
  const notifyDiscoverTip = useCallback(() => {
    notify({
      type: 'tip',
      icon: '🧭',
      title: 'Explore destinations',
      message: 'Tap any experience to dive deeper into curated travel vibes.',
      autoClose: 6000,
    });
  }, [notify]);

  /** Plan — idle nudge */
  const notifyPlanIdle = useCallback(() => {
    notify({
      type: 'tip',
      icon: '💡',
      title: 'Still planning?',
      message: "Don't forget to save your itinerary before you leave.",
      autoClose: 7000,
    });
  }, [notify]);

  /** Generic info */
  const notifyInfo = useCallback(
    (title: string, message?: string) => {
      notify({ type: 'info', title, message, autoClose: 5000 });
    },
    [notify]
  );

  return {
    notifyStaysLoaded,
    notifyWishlist,
    notifyNoResults,
    notifyError,
    notifyWelcome,
    notifyLogout,
    notifyDiscoverTip,
    notifyPlanIdle,
    notifyInfo,
  };
}
