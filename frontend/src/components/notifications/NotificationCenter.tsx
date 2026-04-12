'use client';

import { NotificationToast } from './NotificationToast';
import { NotificationPanel } from './NotificationPanel';

/**
 * NotificationCenter — mounted once in the root layout.
 * Renders both the toast stack (bottom-right) and the slide-in panel.
 */
export function NotificationCenter() {
  return (
    <>
      <NotificationToast />
      <NotificationPanel />
    </>
  );
}
