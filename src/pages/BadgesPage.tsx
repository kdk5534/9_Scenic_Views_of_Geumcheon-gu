import { motion } from 'motion/react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Lang, View } from '@/types';
import { Badge } from '@/hooks/useBadges';

interface Props {
  badges: Badge[];
  lang: Lang;
  setView: (v: View) => void;
}

const LABELS: Record<Lang, { title: string; sub: string; progress: string; unlocked: string; locked: string }> = {
  ko: { title: '내 배지', sub: '퀴즈와 방문으로 배지를 획득하세요!', progress: '획득', unlocked: '획득 완료', locked: '잠김' },
  en: { title: 'My Badges', sub: 'Earn badges by quizzing and visiting!', progress: 'earned', unlocked: 'Unlocked', locked: 'Locked' },
  zh: { title: '我的徽章', sub: '通过测验和访问获得徽章！', progress: '已获得', unlocked: '已解锁', locked: '已锁定' },
  ja: { title: 'マイバッジ', sub: 'クイズと訪問でバッジを獲得しよう！', progress: '獲得済み', unlocked: '獲得済み', locked: 'ロック中' },
};

export default function BadgesPage({ badges, lang, setView }: Props) {
  const l = LABELS[lang];
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <motion.div
      key="badges"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 pt-8 pb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setView('stamps')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-variant/40 transition-colors"
          aria-label={lang === 'ko' ? '뒤로' : 'Back'}
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">{l.title}</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{l.sub}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-primary/5 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-primary">{unlockedCount}<span className="text-lg text-outline font-normal"> / {badges.length}</span></p>
          <p className="text-xs text-on-surface-variant mt-0.5">{l.progress}</p>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          {/* mini progress dots */}
          <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
            {badges.map(b => (
              <div
                key={b.id}
                className={`w-3 h-3 rounded-full transition-all ${b.unlocked ? 'bg-primary' : 'bg-outline-variant'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`relative flex flex-col items-center rounded-2xl p-3 border-2 transition-all ${
              badge.unlocked
                ? 'border-primary/30 bg-primary/5 shadow-sm'
                : 'border-outline-variant/30 bg-surface-container-low opacity-60'
            }`}
          >
            {/* Lock overlay */}
            {!badge.unlocked && (
              <div className="absolute top-2 right-2">
                <Lock size={12} className="text-outline" />
              </div>
            )}

            {/* Emoji */}
            <div className={`text-3xl mb-2 leading-none transition-all ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
              {badge.emoji}
            </div>

            {/* Name */}
            <p className={`text-[10px] font-bold text-center leading-tight ${badge.unlocked ? 'text-primary' : 'text-outline'}`}>
              {badge.name[lang]}
            </p>

            {/* Desc — shown only when unlocked */}
            {badge.unlocked && (
              <p className="text-[9px] text-on-surface-variant text-center mt-1 leading-tight">
                {badge.desc[lang]}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* All unlocked celebration */}
      {unlockedCount === badges.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-primary text-on-primary rounded-3xl p-6 text-center shadow-premium"
        >
          <p className="text-4xl mb-2">🏆</p>
          <p className="text-xl font-bold">
            {lang === 'ko' ? '모든 배지 획득!' : lang === 'en' ? 'All Badges Unlocked!' : lang === 'zh' ? '全部徽章解锁！' : 'すべてのバッジ獲得！'}
          </p>
          <p className="text-sm opacity-80 mt-1">
            {lang === 'ko' ? '금천구 최고의 탐험가!' : lang === 'en' ? 'Geumcheon\'s Ultimate Explorer!' : lang === 'zh' ? '金川区最强探险家！' : '衿川区最高の探検家！'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
