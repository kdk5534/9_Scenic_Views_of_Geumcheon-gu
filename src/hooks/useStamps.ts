import { useState, useCallback } from 'react';

const STORAGE_KEY = 'geumcheon_stamps';

interface StampEntry {
  id: number;
  visitedAt: string;
}

const load = (): StampEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const save = (entries: StampEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// 두 좌표 사이 거리 (미터, Haversine)
const haversineMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const RADIUS_M = 200;

export type StampResult = 'success' | 'already' | 'too_far' | 'denied' | 'error';

export const useStamps = () => {
  const [stamps, setStamps] = useState<StampEntry[]>(load);

  const isStamped = useCallback((id: number) => stamps.some(s => s.id === id), [stamps]);

  const addStamp = useCallback(
    async (spotId: number, spotLat: number, spotLng: number): Promise<StampResult> => {
      if (stamps.some(s => s.id === spotId)) return 'already';

      return new Promise(resolve => {
        if (!navigator.geolocation) { resolve('error'); return; }

        navigator.geolocation.getCurrentPosition(
          pos => {
            const dist = haversineMeters(pos.coords.latitude, pos.coords.longitude, spotLat, spotLng);
            if (dist > RADIUS_M) { resolve('too_far'); return; }

            const entry: StampEntry = { id: spotId, visitedAt: new Date().toISOString() };
            setStamps(prev => {
              const next = [...prev, entry];
              save(next);
              return next;
            });
            resolve('success');
          },
          err => {
            if (err.code === err.PERMISSION_DENIED) resolve('denied');
            else resolve('error');
          },
          { timeout: 8000, maximumAge: 60000 },
        );
      });
    },
    [stamps],
  );

  const totalCount = stamps.length;
  const isComplete = totalCount >= 9;

  return { stamps, isStamped, addStamp, totalCount, isComplete };
};
