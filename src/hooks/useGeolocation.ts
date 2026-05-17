import { useState, useEffect } from 'react';

interface GeoState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (enabled = false) => {
  const [state, setState] = useState<GeoState>({ lat: null, lng: null, error: null, loading: false });

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;
    setState(s => ({ ...s, loading: true }));
    navigator.geolocation.getCurrentPosition(
      pos => setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false }),
      err => setState({ lat: null, lng: null, error: err.message, loading: false }),
      { timeout: 8000, maximumAge: 300000 },
    );
  }, [enabled]);

  return state;
};
