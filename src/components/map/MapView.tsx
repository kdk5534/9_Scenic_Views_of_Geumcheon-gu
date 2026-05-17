import React from 'react';
import { Spot, Lang } from '@/types';
import { Translation, getLocalized } from '@/i18n';

interface Props {
  spots: Spot[];
  lang: Lang;
  onSpotClick: (id: number) => void;
  t: Translation;
}

export default function MapView({ spots, lang, onSpotClick, t }: Props) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [37.4570, 126.9002],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    spots.forEach((spot) => {
      const name = getLocalized(spot as any, 'name', lang);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:#012d1d;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);">${spot.id}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      L.marker([spot.lat, spot.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 text-center min-w-[120px]">
            <b class="text-sm block mb-2">${name}</b>
            <button
              onclick="window.__goToSpot(${spot.id})"
              class="bg-primary text-white text-[10px] px-3 py-1 rounded font-bold hover:opacity-90"
            >
              ${t.viewDetail}
            </button>
          </div>
        `);
    });

    mapInstanceRef.current = map;
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, lang]);

  React.useEffect(() => {
    (window as any).__goToSpot = onSpotClick;
    return () => { delete (window as any).__goToSpot; };
  }, [onSpotClick]);

  return (
    <div className="fixed top-16 bottom-16 left-0 right-0 z-10 bg-[#f8f9fa] max-w-2xl mx-auto">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
