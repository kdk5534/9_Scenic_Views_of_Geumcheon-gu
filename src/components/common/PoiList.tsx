import { useEffect, useState } from 'react';
import { ExternalLink, Coffee, UtensilsCrossed, ShoppingBag, ParkingCircle, Toilet, Bus } from 'lucide-react';
import { Lang, PoiItem } from '@/types';
import { haversineKm, walkMinutes } from '@/services/route';

const TYPE_ICON: Record<PoiItem['type'], React.FC<{ size: number; className?: string }>> = {
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  convenience: ShoppingBag,
  parking: ParkingCircle,
  restroom: Toilet,
  transport: Bus,
};

const TYPE_LABEL: Record<PoiItem['type'], Record<Lang, string>> = {
  restaurant: { ko: '음식점', en: 'Restaurant', zh: '餐厅', ja: 'レストラン' },
  cafe: { ko: '카페', en: 'Café', zh: '咖啡厅', ja: 'カフェ' },
  convenience: { ko: '편의점', en: 'Convenience', zh: '便利店', ja: 'コンビニ' },
  parking: { ko: '주차장', en: 'Parking', zh: '停车场', ja: '駐車場' },
  restroom: { ko: '화장실', en: 'Restroom', zh: '洗手间', ja: 'トイレ' },
  transport: { ko: '교통', en: 'Transport', zh: '交通', ja: '交通' },
};

const TITLE: Record<Lang, string> = {
  ko: '근처 편의시설',
  en: 'Nearby Facilities',
  zh: '附近便民设施',
  ja: '近くの施設',
};

interface Props {
  spotId: number;
  spotLat: number;
  spotLng: number;
  lang: Lang;
}

export default function PoiList({ spotId, spotLat, spotLng, lang }: Props) {
  const [pois, setPois] = useState<PoiItem[]>([]);

  useEffect(() => {
    fetch('/pois.json')
      .then(r => r.json())
      .then((data: Record<string, PoiItem[]>) => {
        setPois(data[String(spotId)] ?? []);
      })
      .catch(() => {});
  }, [spotId]);

  if (pois.length === 0) return null;

  const withDist = pois
    .map(p => ({ ...p, dist_km: haversineKm(spotLat, spotLng, p.lat, p.lng) }))
    .sort((a, b) => a.dist_km - b.dist_km);

  const getName = (p: PoiItem) =>
    lang === 'ko' ? p.name
    : lang === 'en' ? (p.name_en ?? p.name)
    : lang === 'zh' ? (p.name_zh ?? p.name)
    : (p.name_ja ?? p.name);

  const googleUrl = (p: PoiItem) =>
    `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold text-primary mb-4">{TITLE[lang]}</h3>
      <div className="space-y-2">
        {withDist.map((p, i) => {
          const Icon = TYPE_ICON[p.type];
          const min = walkMinutes(p.dist_km);
          return (
            <div key={i} className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{getName(p)}</p>
                <p className="text-[10px] text-outline">
                  {TYPE_LABEL[p.type][lang]} · {p.dist_km < 0.1 ? `${Math.round(p.dist_km * 1000)}m` : `${p.dist_km.toFixed(1)}km`} · {lang === 'ko' ? `도보 ${min}분` : `${min} min walk`}
                </p>
              </div>
              <a
                href={p.kakaoUrl ?? googleUrl(p)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${getName(p)} 지도로 보기`}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors shrink-0"
              >
                <ExternalLink size={13} className="text-outline" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
