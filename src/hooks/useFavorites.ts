import { useState, useCallback } from 'react';

const STORAGE_KEY = 'geumcheon_favorites';

const load = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const save = (ids: number[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(load);

  const toggle = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
};
