import { motion } from 'motion/react';
import { Sparkles, ChevronRight, RefreshCw, MapPin } from 'lucide-react';
import { Spot, Lang, Recommendation, View } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import ScenicImage from '@/components/common/ScenicImage';

interface Props {
  spots: Spot[];
  lang: Lang;
  t: Translation;
  results: Recommendation[];
  isLoading: boolean;
  onSpotClick: (id: number) => void;
  onRetry: () => void;
  setView: (v: View) => void;
}

const ROUTE_LABEL: Record<Lang, string> = {
  ko: '코스 지도 보기',
  en: 'View Route Map',
  zh: '查看路线地图',
  ja: 'ルートマップを見る',
};

export default function ResultsPage({ spots, lang, t, results, isLoading, onSpotClick, onRetry, setView }: Props) {
  const resultSpots = results.map(r => spots.find(s => s.id === r.id)).filter(Boolean) as Spot[];

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 pt-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={24} className="text-primary fill-current" />
          <h2 className="text-2xl font-bold text-primary">{t.resultTitle}</h2>
        </div>
        <p className="text-on-surface-variant">{t.resultSub}</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="animate-spin text-primary" size={40} />
          <p className="text-on-surface-variant animate-pulse font-medium">
            {lang === 'ko' ? '최적의 코스를 찾고 있습니다...' : 'Finding the best course...'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((rec) => {
            const spot = spots.find(s => s.id === rec.id);
            if (!spot) return null;
            return (
              <article key={spot.id} className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                <div className="h-48 overflow-hidden">
                  <ScenicImage
                    src={spot.image}
                    alt={getLocalized(spot as any, 'name', lang)}
                    categories={spot.categories}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{spot.id}경</span>
                    <h3 className="text-xl font-bold text-primary">{getLocalized(spot as any, 'name', lang)}</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{rec.reason}</p>
                  <button
                    onClick={() => onSpotClick(spot.id)}
                    className="flex items-center gap-1 text-sm font-bold text-primary hover:translate-x-1 transition-transform ml-auto"
                  >
                    {t.viewDetail} <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}

          {/* 코스 지도 보기 버튼 */}
          {resultSpots.length > 0 && (
            <button
              onClick={() => setView('route')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold shadow-premium hover:bg-primary/90 transition-all active:scale-95"
            >
              <MapPin size={18} /> {ROUTE_LABEL[lang]}
            </button>
          )}

          <div className="py-4 flex justify-center">
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 border-2 border-outline-variant text-primary font-bold rounded-xl hover:bg-surface-variant/20 transition-all active:scale-95"
            >
              <RefreshCw size={18} /> {t.reRetry}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
