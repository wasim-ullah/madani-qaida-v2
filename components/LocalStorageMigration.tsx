'use client';

/**
 * Invisible component — renders nothing.
 * On first login it reads any existing LocalStorage progress/marks,
 * POSTs them to /api/migrate-localstorage, then sets a sentinel so it
 * never runs again.
 *
 * Safe to mount on every page; the sentinel key makes it idempotent.
 */

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const SENTINEL = 'ls_migration_done_v1';

export default function LocalStorageMigration() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (typeof window === 'undefined') return;

    // Already migrated — skip
    if (localStorage.getItem(SENTINEL) === user!.id) return;

    // Collect all relevant LocalStorage keys
    const progressData: Record<string, { stars: number; completed: boolean }> = {};
    const marksData: Record<string, { markState: string; itemType: string; note?: string }> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Progress keys: "progress:<lessonId>"
      if (key.startsWith('progress:')) {
        try {
          const val = JSON.parse(localStorage.getItem(key) ?? '');
          if (val && typeof val === 'object') {
            progressData[key.slice('progress:'.length)] = val;
          }
        } catch { /* ignore */ }
      }

      // Teacher mark keys: "mark:<itemId>"
      if (key.startsWith('mark:')) {
        try {
          const val = JSON.parse(localStorage.getItem(key) ?? '');
          if (val && typeof val === 'object') {
            marksData[key.slice('mark:'.length)] = val;
          }
        } catch { /* ignore */ }
      }
    }

    const hasData =
      Object.keys(progressData).length > 0 ||
      Object.keys(marksData).length > 0;

    if (!hasData) {
      // Nothing to migrate — stamp sentinel and bail
      localStorage.setItem(SENTINEL, user!.id);
      return;
    }

    // Fire-and-forget POST
    fetch('/api/migrate-localstorage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressData, marksData }),
    })
      .then((res) => {
        if (res.ok) {
          localStorage.setItem(SENTINEL, user!.id);
          console.info('[migration] LocalStorage data migrated to Neon ✓');
        }
      })
      .catch((err) => {
        console.warn('[migration] Migration request failed, will retry next visit:', err);
      });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
