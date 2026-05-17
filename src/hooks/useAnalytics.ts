import { useCallback } from 'react';
import { track } from '@vercel/analytics';

export function useAnalytics() {
  const trackEvent = useCallback((name: string, props?: Record<string, string | number | boolean>) => {
    try {
      track(name, props);
    } catch {
      // Vercel Analytics not available in dev
    }
  }, []);

  return { trackEvent };
}
