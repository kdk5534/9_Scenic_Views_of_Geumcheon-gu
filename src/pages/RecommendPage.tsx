import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Lang } from '@/types';
import { Translation } from '@/i18n';

interface Props {
  lang: Lang;
  t: Translation;
  who: string;
  setWho: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  prefs: string[];
  setPrefs: (fn: (prev: string[]) => string[]) => void;
  onSubmit: () => void;
}

const WHO_VALUES = ['혼자', '연인', '가족', '친구'];
const TIME_VALUES = ['1~2시간', '반나절', '하루 종일'];
const PREF_VALUES = ['자연·산책', '역사·문화', '야경', '예술·공연', '체험·교육'];

export default function RecommendPage({ lang, t, who, setWho, time, setTime, prefs, setPrefs, onSubmit }: Props) {
  return (
    <motion.div
      key="recommend"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-5 pt-10"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
          <span className="text-yellow-500">✨</span> {t.resultTitle}
        </h2>
        <p className="text-on-surface-variant mt-2">{t.heroSub}</p>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-xl font-bold text-primary mb-4">{t.whoTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {t.whoItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setWho(WHO_VALUES[idx])}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  who === WHO_VALUES[idx]
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                    : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-primary mb-4">{t.timeTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {t.timeItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setTime(TIME_VALUES[idx])}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  time === TIME_VALUES[idx]
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                    : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-xl font-bold text-primary">{t.prefTitle}</h3>
            <span className="text-xs text-on-surface-variant">{t.prefSub}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.prefItems.map((item, idx) => {
              const value = PREF_VALUES[idx];
              const isActive = prefs.includes(value);
              return (
                <button
                  key={idx}
                  onClick={() => setPrefs(prev => isActive ? prev.filter(p => p !== value) : [...prev, value])}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                      : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'
                  }`}
                >
                  {isActive && <CheckCircle2 size={14} />} {item}
                </button>
              );
            })}
          </div>
        </section>

        <button
          onClick={onSubmit}
          className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold shadow-premium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-10 active:scale-95"
        >
          {t.aiSubmit} <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export { WHO_VALUES, TIME_VALUES, PREF_VALUES };
