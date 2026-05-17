import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Navigation, ExternalLink, Clock, Footprints } from 'lucide-react';
import { Spot, Lang, View } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import { haversineKm, walkMinutes, optimizeOrder, externalMapLinks } from '@/services/route';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Props {
  spots: Spot[];       // 추천된 3개 명소
  lang: Lang;
  t: Translation;
  setView: (v: View) => void;
  onSpotClick: (id: number) => void;
}

const LABELS = {
  ko: { title: '추천 코스 지도', back: '추천으로', walk: '도보', from: '출발지에서', myLoc: '내 위치', noGps: 'GPS 미사용', openWith: '지도 앱으로 열기', kakao: '카카오맵', naver: '네이버지도', google: '구글지도', total: '총 도보거리', step: '구간' },
  en: { title: 'Course Map', back: 'Back', walk: 'walk', from: 'From start', myLoc: 'My location', noGps: 'No GPS', openWith: 'Open in maps', kakao: 'Kakao Map', naver: 'Naver Map', google: 'Google Maps', total: 'Total walk', step: 'Leg' },
  zh: { title: '推荐路线地图', back: '返回推荐', walk: '步行', from: '从出发点', myLoc: '我的位置', noGps: '未使用GPS', openWith: '用地图应用打开', kakao: '카카오地图', naver: 'Naver地图', google: '谷歌地图', total: '总步行距离', step: '区间' },
  ja: { title: 'おすすめコースマップ', back: '戻る', walk: '徒歩', from: '出発地から', myLoc: '現在地', noGps: 'GPS未使用', openWith: '地図アプリで開く', kakao: 'カカオマップ', naver: 'Naver地図', google: 'Googleマップ', total: '合計徒歩距離', step: '区間' },
};

export default function RouteMapPage({ spots, lang, t, setView, onSpotClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [useGps, setUseGps] = useState(false);
  const geo = useGeolocation(useGps);
  const l = LABELS[lang];

  // GPS 좌표 또는 기본 시작점(금천구청)으로 순서 최적화
  const ordered = optimizeOrder(spots, geo.lat ?? undefined, geo.lng ?? undefined);

  // 구간별 거리/시간 계산
  const segments = ordered.map((spot, i) => {
    if (i === 0) {
      const fromLat = geo.lat ?? ordered[0].lat;
      const fromLng = geo.lng ?? ordered[0].lng;
      const km = (geo.lat && geo.lng) ? haversineKm(fromLat, fromLng, spot.lat, spot.lng) : 0;
      return { from: geo.lat ? l.myLoc : '-', to: getLocalized(spot as any, 'name', lang), km, min: walkMinutes(km) };
    }
    const prev = ordered[i - 1];
    const km = haversineKm(prev.lat, prev.lng, spot.lat, spot.lng);
    return { from: getLocalized(prev as any, 'name', lang), to: getLocalized(spot as any, 'name', lang), km, min: walkMinutes(km) };
  });

  const totalKm = segments.reduce((acc, s) => acc + s.km, 0);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const center = ordered[0] ? [ordered[0].lat, ordered[0].lng] : [37.457, 126.9];
    const map = L.map(mapRef.current, { center, zoom: 14, zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // 마커
    ordered.forEach((spot, idx) => {
      const color = idx === 0 ? '#c0392b' : idx === 1 ? '#2980b9' : '#27ae60';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;background:${color};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${idx + 1}</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20],
      });
      const name = getLocalized(spot as any, 'name', lang);
      L.marker([spot.lat, spot.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="text-align:center;min-width:110px"><b style="font-size:13px">${idx + 1}. ${name}</b><br><button onclick="window.__goToSpot(${spot.id})" style="margin-top:6px;background:#012d1d;color:white;padding:4px 10px;border:none;border-radius:6px;font-size:11px;cursor:pointer">${t.viewDetail}</button></div>`);
    });

    // 폴리라인 (순서대로 연결)
    const latlngs = ordered.map(s => [s.lat, s.lng]);
    if (geo.lat && geo.lng) latlngs.unshift([geo.lat, geo.lng]);
    if (latlngs.length >= 2) {
      L.polyline(latlngs, { color: '#012d1d', weight: 3, opacity: 0.7, dashArray: '8, 6' }).addTo(map);
    }

    // 사용자 위치 마커
    if (geo.lat && geo.lng) {
      const myIcon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;background:#3498db;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(52,152,219,0.3)"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker([geo.lat, geo.lng], { icon: myIcon }).addTo(map).bindPopup(l.myLoc);
    }

    // 전체 경로 fit
    const allLat = ordered.map(s => s.lat);
    const allLng = ordered.map(s => s.lng);
    if (geo.lat) { allLat.push(geo.lat); allLng.push(geo.lng!); }
    map.fitBounds([[Math.min(...allLat) - 0.003, Math.min(...allLng) - 0.003], [Math.max(...allLat) + 0.003, Math.max(...allLng) + 0.003]]);

    mapInstanceRef.current = map;
    setTimeout(() => map.invalidateSize(), 150);

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [ordered, geo.lat, geo.lng, lang]);

  useEffect(() => {
    (window as any).__goToSpot = onSpotClick;
    return () => { delete (window as any).__goToSpot; };
  }, [onSpotClick]);

  const lastSpot = ordered[ordered.length - 1];
  const links = lastSpot ? externalMapLinks(lastSpot.lat, lastSpot.lng, getLocalized(lastSpot as any, 'name', lang)) : null;

  return (
    <motion.div
      key="route-map"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-surface-variant bg-background">
        <button onClick={() => setView('results')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors" aria-label={l.back}>
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h2 className="text-lg font-bold text-primary flex-1">{l.title}</h2>
        <button
          onClick={() => setUseGps(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${useGps ? 'bg-primary text-white' : 'bg-surface-container-high text-primary'}`}
        >
          <Navigation size={13} />
          {geo.loading ? '...' : useGps && geo.lat ? l.myLoc : l.noGps}
        </button>
      </div>

      {/* 지도 */}
      <div className="relative h-64 bg-[#f0f0f0]">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* 구간 정보 */}
      <div className="px-5 py-4 space-y-2 overflow-y-auto flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-outline font-bold">{l.total}</span>
          <span className="text-sm font-bold text-primary">{totalKm.toFixed(1)} km · {walkMinutes(totalKm)}{lang === 'ko' ? '분' : 'min'}</span>
        </div>

        {ordered.map((spot, idx) => {
          const seg = segments[idx];
          const spotName = getLocalized(spot as any, 'name', lang);
          const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-600'];
          const extLinks = externalMapLinks(spot.lat, spot.lng, spotName);
          return (
            <div key={spot.id} className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40">
              <div className="flex items-start gap-3">
                <div className={`${colors[idx]} text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => onSpotClick(spot.id)}
                    className="text-base font-bold text-primary hover:underline text-left"
                  >
                    {spotName}
                  </button>
                  {seg.km > 0 && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-outline">
                      <span className="flex items-center gap-1"><Footprints size={11} /> {seg.km.toFixed(1)} km</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {seg.min}{lang === 'ko' ? '분' : 'min'} {l.walk}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 외부 지도 딥링크 */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  { label: l.kakao, url: extLinks.kakao },
                  { label: l.naver, url: extLinks.naver },
                  { label: l.google, url: extLinks.google },
                ].map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary-container/30 text-primary hover:bg-secondary-container/60 transition-colors"
                  >
                    <ExternalLink size={10} /> {label}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
