import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Lang } from '@/types';

interface Question {
  q: string; q_en: string; q_zh: string; q_ja: string;
  options: string[]; options_en: string[]; options_zh: string[]; options_ja: string[];
  answer: number;
}
export interface QuizData { spotId: number; questions: Question[] }

const COPY: Record<Lang, { title: string; correct: string; wrong: string; next: string; finish: string; result: string; share: string; perfect: string }> = {
  ko: { title: '퀴즈', correct: '정답!', wrong: '오답', next: '다음', finish: '완료', result: '점', share: '공유', perfect: '만점 달성! 🎉' },
  en: { title: 'Quiz', correct: 'Correct!', wrong: 'Wrong', next: 'Next', finish: 'Done', result: 'pts', share: 'Share', perfect: 'Perfect score! 🎉' },
  zh: { title: '测验', correct: '正确！', wrong: '错误', next: '下一题', finish: '完成', result: '分', share: '分享', perfect: '满分！🎉' },
  ja: { title: 'クイズ', correct: '正解！', wrong: '不正解', next: '次へ', finish: '完了', result: '点', share: 'シェア', perfect: '満点達成！🎉' },
};

interface Props {
  quiz: QuizData;
  lang: Lang;
  spotName: string;
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export default function QuizModal({ quiz, lang, spotName, open, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'question' | 'feedback' | 'result'>('question');
  const c = COPY[lang];

  useEffect(() => {
    if (open) { setStep(0); setSelected(null); setScore(0); setPhase('question'); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  const q = quiz.questions[step];
  const getQ = () => lang === 'ko' ? q.q : lang === 'en' ? q.q_en : lang === 'zh' ? q.q_zh : q.q_ja;
  const getOpts = () => lang === 'ko' ? q.options : lang === 'en' ? q.options_en : lang === 'zh' ? q.options_zh : q.options_ja;
  const isLast = step === quiz.questions.length - 1;

  const handleSelect = (i: number) => {
    if (phase !== 'question') return;
    setSelected(i);
    setPhase('feedback');
    if (i === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = selected === q.answer ? score : score; // already updated
      setPhase('result');
      onComplete(score + (selected === q.answer ? 0 : 0)); // score already counted
    } else {
      setStep(s => s + 1);
      setSelected(null);
      setPhase('question');
    }
  };

  const handleFinish = () => {
    onComplete(score);
    onClose();
  };

  const handleShare = async () => {
    const msg = lang === 'ko'
      ? `금천 9경 퀴즈 - ${spotName}: ${score}/${quiz.questions.length}점 달성!`
      : `Geumcheon Quiz - ${spotName}: ${score}/${quiz.questions.length} pts!`;
    if (navigator.share) await navigator.share({ text: msg, url: window.location.href });
    else await navigator.clipboard.writeText(msg);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[120] backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[130] bg-background rounded-t-3xl px-5 pt-6 pb-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-outline font-bold">{spotName} · {c.title}</p>
            {phase !== 'result' && (
              <div className="flex gap-1 mt-1.5">
                {quiz.questions.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full flex-1 transition-all ${i < step ? 'bg-primary' : i === step ? 'bg-primary/50' : 'bg-outline-variant'}`} />
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant" aria-label="닫기">
            <X size={16} className="text-on-surface-variant" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'result' ? (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="text-6xl mb-3">{score === 3 ? '🏆' : score === 2 ? '🎉' : score === 1 ? '😊' : '😅'}</div>
              <p className="text-3xl font-bold text-primary mb-1">{score} / {quiz.questions.length} {c.result}</p>
              {score === quiz.questions.length && <p className="text-sm font-bold text-yellow-500 mb-4">{c.perfect}</p>}
              <div className="flex gap-3 justify-center mt-6">
                <button onClick={handleShare} className="flex items-center gap-1.5 text-sm font-bold border-2 border-outline-variant text-primary px-4 py-2 rounded-full active:scale-95 transition-transform">
                  {c.share}
                </button>
                <button onClick={handleFinish} className="flex items-center gap-1.5 text-sm font-bold bg-primary text-white px-6 py-2 rounded-full active:scale-95 transition-transform">
                  {c.finish}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <p className="text-lg font-bold text-on-surface mb-5 leading-snug">{getQ()}</p>
              <div className="space-y-2.5 mb-5">
                {getOpts().map((opt, i) => {
                  let cls = 'w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all ';
                  if (phase === 'question') cls += 'border-outline-variant hover:border-primary hover:bg-primary/5 active:scale-[0.98]';
                  else if (i === q.answer) cls += 'border-primary bg-primary/10 text-primary';
                  else if (i === selected) cls += 'border-red-400 bg-red-50 text-red-600';
                  else cls += 'border-outline-variant opacity-50';
                  return (
                    <button key={i} onClick={() => handleSelect(i)} disabled={phase !== 'question'} className={cls}>
                      <span className="flex items-center gap-2">
                        {phase === 'feedback' && i === q.answer && <CheckCircle2 size={15} className="text-primary shrink-0" />}
                        {phase === 'feedback' && i === selected && i !== q.answer && <XCircle size={15} className="text-red-500 shrink-0" />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {phase === 'feedback' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${selected === q.answer ? 'text-primary' : 'text-red-500'}`}>
                    {selected === q.answer ? c.correct : c.wrong}
                  </span>
                  <button onClick={handleNext} className="flex items-center gap-1 text-sm font-bold bg-primary text-white px-4 py-2 rounded-full active:scale-95 transition-transform">
                    {isLast ? c.finish : c.next} <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
