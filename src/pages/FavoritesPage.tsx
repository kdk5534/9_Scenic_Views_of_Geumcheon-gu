import { motion } from 'motion/react';
import { Heart, ChevronRight } from 'lucide-react';
import { Spot, Lang } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import ScenicImage from '@/components/common/ScenicImage';

interface Props {
  spots: Spot[];
  favorites: number[];
  lang: Lang;
  t: Translation;
  onSpotClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const EMPTY: Record<Lang, string> = {
  ko: '아직 즐겨찾기한 명소가 없어요.\n마음에 드는 곳의 하트를 눌러보세요!',
  en: 'No favorites yet.\nTap the heart on any spot to save it!',
  zh: '还没有收藏的景点。\n点击景点的心形按钮来收藏吧！',
  ja: 'まだお気に入りのスポットがありません。\nスポットのハートボタンをタップして保存しましょう！',
};

const TITLE: Record<Lang, string> = {
  ko: '즐겨찾기',
  en: 'Favorites',
  zh: '收藏',
  ja: 'お気に入り',
};

export default function FavoritesPage({ spots, favorites, lang, t, onSpotClick, onToggleFavorite }: Props) {
  const favoriteSpots = spots.filter(s => favorites.includes(s.id));

  return (
    <motion.div
      key="favorites"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col"
    >
      <div className="px-5 pt-8 pb-4 border-b border-surface-variant">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 fill-current" size={22} />
          <h2 className="text-2xl font-bold text-primary">{TITLE[lang]}</h2>
          <span className="ml-auto text-sm text-outline font-medium">{favoriteSpots.length}개</span>
        </div>
      </div>

      {favoriteSpots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <Heart size={48} className="text-outline-variant mb-4" />
          <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{EMPTY[lang]}</p>
        </div>
      ) : (
        <div className="divide-y divide-surface-variant">
          {favoriteSpots.map(spot => (
            <article
              key={spot.id}
              className="flex items-center gap-4 p-5 hover:bg-surface-container-lowest transition-colors cursor-pointer group"
            >
              <div
                className="w-20 h-20 rounded-xl overflow-hidden border border-surface-variant shadow-sm flex-shrink-0"
                onClick={() => onSpotClick(spot.id)}
              >
                <ScenicImage
                  src={spot.image}
                  alt={getLocalized(spot as any, 'name', lang)}
                  categories={spot.categories}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow" onClick={() => onSpotClick(spot.id)}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-secondary">{spot.id}경</span>
                  <h3 className="text-base font-bold text-primary">
                    {getLocalized(spot as any, 'name', lang)}
                  </h3>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {spot.categories.map(c => {
                    const label = lang === 'ko' ? c : ((t as any).categories?.[c] ?? c);
                    return (
                      <span key={c} className="text-[10px] px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-medium">
                        #{label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(spot.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                  aria-label="즐겨찾기 해제"
                >
                  <Heart size={18} className="text-red-500 fill-current" />
                </button>
                <ChevronRight
                  size={18}
                  className="text-outline-variant group-hover:text-primary transition-colors"
                  onClick={() => onSpotClick(spot.id)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </motion.div>
  );
}
