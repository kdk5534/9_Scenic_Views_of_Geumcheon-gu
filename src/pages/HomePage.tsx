import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Spot, Lang, View } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import ScenicImage from '@/components/common/ScenicImage';
import WeatherWidget from '@/components/common/WeatherWidget';
import CherryBlossomBanner from '@/components/common/CherryBlossomBanner';
import EventBanner from '@/components/common/EventBanner';

interface Props {
  spots: Spot[];
  lang: Lang;
  t: Translation;
  setView: (v: View) => void;
  onSpotClick: (id: number) => void;
}

export default function HomePage({ spots, lang, t, setView, onSpotClick }: Props) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 pt-6"
    >
      {/* Weather */}
      <div className="mb-4">
        <WeatherWidget lang={lang} />
      </div>

      {/* Cherry blossom seasonal banner */}
      <CherryBlossomBanner lang={lang} onSpotClick={onSpotClick} setView={setView} />

      {/* Active event banners */}
      <EventBanner lang={lang} onSpotClick={onSpotClick} />

      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary mb-2">{t.heroTitle}</h2>
        <p className="text-on-surface-variant text-lg">{t.heroSub}</p>
        <button
          onClick={() => setView('recommend')}
          className="mt-8 bg-primary text-on-primary py-4 px-8 rounded-full shadow-premium hover:bg-primary-container transition-all flex items-center gap-2 mx-auto active:scale-95"
        >
          <Sparkles size={18} className="text-yellow-400" /> {t.aiBtn}
        </button>
      </div>

      {/* Spot grid */}
      <div className="grid grid-cols-2 gap-4 pb-6">
        {spots.map((spot, index) => (
          <article
            key={spot.id}
            role="button"
            tabIndex={0}
            onClick={() => onSpotClick(spot.id)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSpotClick(spot.id)}
            aria-label={getLocalized(spot as any, 'name', lang)}
            className="bg-white rounded-2xl border border-surface-variant overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <ScenicImage
                src={spot.image}
                alt={getLocalized(spot as any, 'name', lang)}
                categories={spot.categories}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md rounded-full px-2.5 py-1 text-white text-xs font-bold border border-white/20">
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-on-surface truncate">
                {getLocalized(spot as any, 'name', lang)}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
