import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Share2, Heart, MapPin, Clock, Ticket,
  Bus, Timer, Sparkles, CheckCircle2, Quote, Stamp,
  CheckCheck, AlertCircle, Play, Square, Gauge, BookOpen,
} from 'lucide-react';
import { Spot, Lang, View, SpotImage } from '@/types';
import { Translation, getLocalized } from '@/i18n';
import type { QuizData } from '@/components/quiz/QuizModal';
import PhotoGallery from '@/components/common/PhotoGallery';
import PoiList from '@/components/common/PoiList';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import { useSpeech } from '@/hooks/useSpeech';
import { useReviews } from '@/hooks/useReviews';
import { useAnalytics } from '@/hooks/useAnalytics';
import { isConfigured as supabaseConfigured } from '@/lib/supabase';
import type { StampResult } from '@/hooks/useStamps';

interface Props {
  spot: Spot;
  lang: Lang;
  t: Translation;
  setView: (v: View) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  isStamped: boolean;
  onAddStamp: (id: number, lat: number, lng: number) => Promise<StampResult>;
  userId: string | null;
  onLoginRequest: () => void;
  quizData: QuizData | null;
  isQuizCompleted: boolean;
  quizScore: number;
  onQuizOpen: () => void;
}

const STAMP_MSG: Record<StampResult, Record<Lang, string>> = {
  success:  { ko: '도장 획득! 🎉', en: 'Stamp collected! 🎉', zh: '印章获得！🎉', ja: 'スタンプ獲得！🎉' },
  already:  { ko: '이미 방문 인증된 곳이에요.', en: 'Already stamped.', zh: '已经盖过章了。', ja: 'すでにスタンプ済みです。' },
  too_far:  { ko: '명소에서 200m 이내여야 인증 가능해요.', en: 'Must be within 200m of the spot.', zh: '需要在景点200米范围内。', ja: 'スポットから200m以内で認証できます。' },
  denied:   { ko: '위치 권한을 허용해주세요.', en: 'Please allow location access.', zh: '请允许位置权限。', ja: '位置情報の許可が必要です。' },
  error:    { ko: '위치를 가져올 수 없어요. 다시 시도해주세요.', en: 'Could not get location. Try again.', zh: '无法获取位置，请重试。', ja: '位置情報を取得できませんでした。再試行してください。' },
};

const TTS_LABEL: Record<Lang, { play: string; stop: string; rate: string }> = {
  ko: { play: '음성 안내', stop: '정지', rate: '속도' },
  en: { play: 'Audio guide', stop: 'Stop', rate: 'Speed' },
  zh: { play: '语音导览', stop: '停止', rate: '速度' },
  ja: { play: '音声ガイド', stop: '停止', rate: '速度' },
};

export default function DetailPage({ spot, lang, t, setView, isFavorite, onToggleFavorite, isStamped, onAddStamp, userId, onLoginRequest, quizData, isQuizCompleted, quizScore, onQuizOpen }: Props) {
  const [stampLoading, setStampLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const storyText = getLocalized(spot as any, 'story', lang) as string;
  const { speak, stop, speaking, rate, cycleRate, supported: ttsSupported } = useSpeech(storyText, lang);
  const { reviews, rating: spotRating, loading: reviewsLoading, submit: submitReview, report: reportReview } = useReviews(spot.id);
  const { trackEvent } = useAnalytics();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async () => {
    const name = getLocalized(spot as any, 'name', lang);
    if (navigator.share) {
      await navigator.share({ title: name as string, text: storyText, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast(lang === 'ko' ? '링크 복사됨!' : 'Link copied!', true);
    }
  };

  const handleStamp = async () => {
    if (isStamped) { showToast(STAMP_MSG.already[lang], false); return; }
    setStampLoading(true);
    const result = await onAddStamp(spot.id, spot.lat, spot.lng);
    setStampLoading(false);
    showToast(STAMP_MSG[result][lang], result === 'success');
    if (result === 'success') trackEvent('stamp_earned', { spot_id: spot.id });
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!userId) return 'error' as const;
    const result = await submitReview(userId, rating, comment);
    if (result === 'ok') trackEvent('review_submitted', { spot_id: spot.id, rating });
    return result;
  };

  const localizedCategoryLabel = (c: string) =>
    lang === 'ko' ? c : ((t as any).categories?.[c] ?? c);

  // Gallery images — use spot.images array if provided, otherwise fall back to single image
  const images: SpotImage[] = spot.images?.length
    ? spot.images
    : [{ src: spot.image }];

  const rateLabel = rate === 1 ? '1x' : rate === 1.5 ? '1.5x' : '0.75x';

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-background min-h-screen"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-bold text-white ${toast.ok ? 'bg-primary' : 'bg-red-500'}`}
          >
            {toast.ok ? <CheckCheck size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col">
        {/* Photo Gallery */}
        <div className="relative h-[400px]">
          <PhotoGallery
            images={images}
            alt={getLocalized(spot as any, 'name', lang) as string}
            className="h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => setView('home')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
              aria-label={lang === 'ko' ? '뒤로 가기' : 'Back'}
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
              aria-label={lang === 'ko' ? '공유하기' : 'Share'}
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => onToggleFavorite(spot.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md text-white transition-all ${isFavorite ? 'bg-red-500/80 hover:bg-red-500' : 'bg-black/20 hover:bg-black/40'}`}
              aria-label={isFavorite ? (lang === 'ko' ? '즐겨찾기 해제' : 'Remove favorite') : (lang === 'ko' ? '즐겨찾기' : 'Add to favorites')}
              aria-pressed={isFavorite}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Stamp button */}
          <div className="absolute bottom-16 right-4 z-20">
            <button
              onClick={handleStamp}
              disabled={stampLoading || isStamped}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md transition-all ${
                isStamped
                  ? 'bg-primary text-white'
                  : 'bg-white/90 text-primary hover:bg-white active:scale-95'
              } disabled:opacity-70`}
              aria-label={lang === 'ko' ? '방문 인증 (도장)' : 'Check-in stamp'}
            >
              {isStamped ? <CheckCheck size={15} /> : <Stamp size={15} className={stampLoading ? 'animate-bounce' : ''} />}
              {isStamped
                ? (lang === 'ko' ? '인증 완료' : lang === 'en' ? 'Stamped' : lang === 'zh' ? '已认证' : '認証済み')
                : stampLoading
                  ? (lang === 'ko' ? '위치 확인 중...' : lang === 'en' ? 'Checking...' : lang === 'zh' ? '确认中...' : '確認中...')
                  : (lang === 'ko' ? '방문 인증' : lang === 'en' ? 'Check In' : lang === 'zh' ? '访问认证' : '訪問認証')}
            </button>
          </div>
        </div>

        <div className="relative -mt-12 bg-background rounded-t-[40px] pt-10 px-5 flex flex-col gap-10">
          {/* Name + categories */}
          <section>
            <h2 className="text-4xl font-bold text-primary leading-tight">
              {spot.id}. {getLocalized(spot as any, 'name', lang)}
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {spot.categories.map(c => (
                <span key={c} className="px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-semibold">
                  #{localizedCategoryLabel(c)}
                </span>
              ))}
            </div>
          </section>

          {/* Info grid */}
          <section className="grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-outline mb-1 font-bold">{t.detailAddress}</p>
                <p className="text-sm font-medium">{getLocalized(spot as any, 'address', lang)}</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center">
                <Clock size={18} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs text-outline font-bold">{t.detailHours}</p>
                <p className="text-xs font-medium mt-1">{getLocalized(spot as any, 'hours', lang)}</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center">
                <Ticket size={18} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs text-outline font-bold">{t.detailFee}</p>
                <p className="text-xs font-medium mt-1">{getLocalized(spot as any, 'fee', lang)}</p>
              </div>
            </div>
            <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                <Bus className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-xs text-outline mb-1 font-bold">{t.detailTransit}</p>
                <p className="text-sm font-medium">{getLocalized(spot as any, 'transit', lang)}</p>
              </div>
            </div>
            <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                <Timer className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-xs text-outline mb-1 font-bold">{t.detailDuration}</p>
                <p className="text-sm font-medium">{getLocalized(spot as any, 'duration', lang)}</p>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="bg-primary text-on-primary p-6 rounded-[32px] shadow-premium relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" /> {t.detailHighlights}
            </h3>
            <ul className="space-y-4">
              {(getLocalized(spot as any, 'highlights', lang) as string[]).map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-secondary-container mt-1 shrink-0" />
                  <span className="text-sm font-medium opacity-90">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quiz CTA */}
          {quizData && (
            <section>
              <button
                onClick={onQuizOpen}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isQuizCompleted
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-primary bg-primary/5 hover:bg-primary/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-primary">
                      {isQuizCompleted ? t.quizCompleted ?? '퀴즈 완료' : t.quizBtn ?? '퀴즈 도전'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {isQuizCompleted
                        ? `${quizScore} / ${quizData.questions.length} ${lang === 'ko' ? '점' : lang === 'en' ? 'pts' : lang === 'zh' ? '分' : '点'}`
                        : `${quizData.questions.length} ${lang === 'ko' ? '문제' : lang === 'en' ? 'questions' : lang === 'zh' ? '道题' : '問'}`
                      }
                    </p>
                  </div>
                </div>
                {isQuizCompleted ? (
                  <span className="text-2xl">{quizScore === quizData.questions.length ? '🏆' : quizScore >= 2 ? '🎉' : '😊'}</span>
                ) : (
                  <span className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-full">
                    {lang === 'ko' ? '시작' : lang === 'en' ? 'Start' : lang === 'zh' ? '开始' : '開始'}
                  </span>
                )}
              </button>
            </section>
          )}

          {/* Story + TTS */}
          <section className="mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">{t.detailStory}</h3>
              {ttsSupported && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={cycleRate}
                    className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant/40 transition-colors min-w-[44px] justify-center"
                    aria-label={`${TTS_LABEL[lang].rate}: ${rateLabel}`}
                  >
                    <Gauge size={11} /> {rateLabel}
                  </button>
                  <button
                    onClick={speaking ? stop : speak}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all min-w-[80px] justify-center ${
                      speaking ? 'bg-red-500 text-white' : 'bg-primary text-white'
                    } active:scale-95`}
                    aria-label={speaking ? TTS_LABEL[lang].stop : TTS_LABEL[lang].play}
                    aria-pressed={speaking}
                  >
                    {speaking ? <Square size={12} /> : <Play size={12} />}
                    {speaking ? TTS_LABEL[lang].stop : TTS_LABEL[lang].play}
                  </button>
                </div>
              )}
            </div>
            <div className="relative p-6 pt-10">
              <Quote className="absolute top-0 left-0 text-surface-variant scale-[3] opacity-50 -translate-x-2 translate-y-2" />
              <p className="text-on-surface-variant font-medium leading-relaxed italic">{storyText}</p>
            </div>
          </section>

          {/* Reviews */}
          {supabaseConfigured && (
            <>
              <ReviewForm
                lang={lang}
                userId={userId}
                onSubmit={handleReviewSubmit}
                onLoginRequest={onLoginRequest}
              />
              <ReviewList
                lang={lang}
                reviews={reviews}
                rating={spotRating}
                loading={reviewsLoading}
                currentUserId={userId}
                onReport={id => reportReview(id, userId!)}
              />
            </>
          )}

          {/* Nearby POI */}
          <PoiList spotId={spot.id} spotLat={spot.lat} spotLng={spot.lng} lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}
