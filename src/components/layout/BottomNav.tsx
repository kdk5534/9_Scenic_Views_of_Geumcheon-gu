import { Home, Sparkles, Compass, Map as MapIcon, Heart, Stamp } from 'lucide-react';
import { View } from '@/types';
import { Translation } from '@/i18n';

interface Props {
  active: View;
  setView: (v: View) => void;
  t: Translation;
  favCount: number;
  stampCount: number;
}

const NAV_ITEMS = [
  { id: 'home' as View, icon: Home, labelKey: 'navHome' as const },
  { id: 'recommend' as View, icon: Sparkles, labelKey: 'navRecommend' as const },
  { id: 'list' as View, icon: Compass, labelKey: 'navList' as const },
  { id: 'map' as View, icon: MapIcon, labelKey: 'navMap' as const },
];

export default function BottomNav({ active, setView, t, favCount, stampCount }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 pb-safe bg-white/90 backdrop-blur-md border-t border-outline-variant shadow-sm rounded-t-xl max-w-2xl mx-auto right-0">
      {NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          aria-label={t[labelKey]}
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 ${
            active === id
              ? 'bg-primary-container text-on-primary-container rounded-full scale-95 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-variant/30 rounded-lg'
          }`}
        >
          <Icon size={20} className={active === id ? 'fill-current' : ''} />
          <span className="text-[10px] mt-1 font-medium">{t[labelKey]}</span>
        </button>
      ))}

      {/* 즐겨찾기 */}
      <button
        onClick={() => setView('favorites')}
        aria-label="즐겨찾기"
        className={`relative flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 ${
          active === 'favorites'
            ? 'bg-primary-container text-on-primary-container rounded-full scale-95 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-variant/30 rounded-lg'
        }`}
      >
        <Heart size={20} className={active === 'favorites' ? 'fill-current' : ''} />
        {favCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {favCount > 9 ? '9+' : favCount}
          </span>
        )}
        <span className="text-[10px] mt-1 font-medium">{t.navFavorites ?? '찜'}</span>
      </button>

      {/* 도장 */}
      <button
        onClick={() => setView('stamps')}
        aria-label="도장깨기"
        className={`relative flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 ${
          active === 'stamps'
            ? 'bg-primary-container text-on-primary-container rounded-full scale-95 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-variant/30 rounded-lg'
        }`}
      >
        <Stamp size={20} className={active === 'stamps' ? 'fill-current' : ''} />
        {stampCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {stampCount}
          </span>
        )}
        <span className="text-[10px] mt-1 font-medium">{t.navStamps ?? '도장'}</span>
      </button>
    </nav>
  );
}
