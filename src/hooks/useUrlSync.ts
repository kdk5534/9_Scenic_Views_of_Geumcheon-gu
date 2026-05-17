import { useEffect } from 'react';
import { View } from '@/types';

const VALID_VIEWS: View[] = ['home', 'recommend', 'results', 'list', 'detail', 'map', 'favorites', 'stamps', 'route', 'admin', 'badges', 'legal'];

function viewToPath(view: View, spotId: number | null): string {
  if (view === 'detail' && spotId) return `/spot/${spotId}`;
  if (view === 'home') return '/';
  return `/${view}`;
}

export function pathToState(path: string): { view: View; spotId: number | null } {
  const m = path.match(/^\/spot\/(\d+)/);
  if (m) {
    const id = parseInt(m[1]);
    if (id >= 1 && id <= 9) return { view: 'detail', spotId: id };
  }
  if (path === '/' || path === '') return { view: 'home', spotId: null };
  const seg = path.slice(1) as View;
  if (VALID_VIEWS.includes(seg)) return { view: seg, spotId: null };
  return { view: 'notfound', spotId: null };
}

export function useUrlSync(
  view: View,
  spotId: number | null,
  setView: (v: View) => void,
  setSpotId: (id: number | null) => void,
) {
  // Listen to browser back/forward only — initial URL is parsed by App.tsx state initializer
  useEffect(() => {
    const handle = () => {
      const { view: v, spotId: id } = pathToState(window.location.pathname);
      setView(v);
      setSpotId(id);
    };
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push URL when view/spotId changes
  useEffect(() => {
    const path = viewToPath(view, spotId);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [view, spotId]);
}
