import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Spot, Lang } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import ScenicImage from '@/components/common/ScenicImage';

interface Props {
  spots: Spot[];
  lang: Lang;
  t: Translation;
  onSpotClick: (id: number) => void;
}

export default function ListPage({ spots, lang, t, onSpotClick }: Props) {
  const [activeCategory, setActiveCategory] = useState('전체');

  const categories = [
    { label: t.filterAll, value: '전체' },
    { label: t.filterNature, value: '자연·산책' },
    { label: t.filterHistory, value: '역사·문화' },
    { label: t.filterArt, value: '예술·공연' },
    { label: t.filterExperience, value: '체험·교육' },
  ];

  const filtered = activeCategory === '전체'
    ? spots
    : spots.filter(s => s.categories.includes(activeCategory));

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col"
    >
      <div className="sticky top-16 bg-background/95 backdrop-blur-sm z-30 border-b border-surface-variant px-5 py-4 overflow-x-auto no-scrollbar flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.value
                ? 'bg-secondary-container text-on-secondary-container shadow-sm ring-1 ring-secondary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-surface-variant">
        {filtered.map((spot) => {
          const localizedCategoryLabel = (c: string) =>
            lang === 'ko' ? c : ((t as any).categories?.[c] ?? c);

          return (
            <article
              key={spot.id}
              role="button"
              tabIndex={0}
              onClick={() => onSpotClick(spot.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSpotClick(spot.id)}
              aria-label={getLocalized(spot as any, 'name', lang)}
              className="flex items-center gap-4 p-5 hover:bg-surface-container-lowest transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-surface-variant relative shadow-sm">
                <ScenicImage
                  src={spot.image}
                  alt={getLocalized(spot as any, 'name', lang)}
                  categories={spot.categories}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-secondary">{spot.id}경</span>
                  <h3 className="text-lg font-bold text-primary">
                    {getLocalized(spot as any, 'name', lang)}
                  </h3>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {spot.categories.map(c => (
                    <span key={c} className="text-[10px] px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-medium">
                      #{localizedCategoryLabel(c)}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="text-outline-variant group-hover:text-primary transition-colors" />
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}
