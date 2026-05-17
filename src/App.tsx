import { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { View, Lang, Recommendation } from '@/types';
import { translations, getLocalized } from '@/i18n';
import { spots } from '@/data';
import { buildRecommendations } from '@/services/recommend';
import { useFavorites } from '@/hooks/useFavorites';
import { useStamps } from '@/hooks/useStamps';
import { useQuiz } from '@/hooks/useQuiz';
import { useBadges } from '@/hooks/useBadges';
import { useAuth } from '@/hooks/useAuth';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useUrlSync, pathToState } from '@/hooks/useUrlSync';
import { useSeoMeta } from '@/hooks/useSeoMeta';
import { useAnalytics } from '@/hooks/useAnalytics';
import QuizModal, { type QuizData } from '@/components/quiz/QuizModal';

import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import AppFooter from '@/components/layout/AppFooter';
import FaqWidget from '@/components/common/FaqWidget';
import AuthModal from '@/components/auth/AuthModal';
import DemoModal from '@/components/common/DemoModal';

import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

const ListPage = lazy(() => import('@/pages/ListPage'));
const DetailPage = lazy(() => import('@/pages/DetailPage'));
const RecommendPage = lazy(() => import('@/pages/RecommendPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const RouteMapPage = lazy(() => import('@/pages/RouteMapPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const StampsPage = lazy(() => import('@/pages/StampsPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const BadgesPage = lazy(() => import('@/pages/BadgesPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const MapView = lazy(() =>
  import('@/components/map/MapView').then(m => ({ default: m.default }))
);

function PageSpinner({ hint }: { hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3" aria-live="polite" aria-label="로딩 중">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      {hint && <p className="text-xs text-outline">{hint}</p>}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-surface-container-low animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-sm text-outline">지도 불러오는 중...</p>
      </div>
    </div>
  );
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? '';

export default function App() {
  const [view, setView] = useState<View>(() => pathToState(window.location.pathname).view);
  const [lang, setLang] = useState<Lang>('ko');
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(() => pathToState(window.location.pathname).spotId);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quizModalSpotId, setQuizModalSpotId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(() => !sessionStorage.getItem('demo_seen'));

  const [who, setWho] = useState('');
  const [time, setTime] = useState('');
  const [prefs, setPrefs] = useState<string[]>([]);

  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { stamps, isStamped, addStamp, totalCount: stampCount, isComplete } = useStamps();
  const quiz = useQuiz();
  const badges = useBadges(stamps.map(s => s.id), quiz.completedCount, quiz.perfectCount, quiz.isCompleted);
  const auth = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    fetch('/quizzes.json').then(r => r.json()).then(setQuizzes).catch(() => {});
  }, []);

  useCloudSync(auth.user);
  useUrlSync(view, selectedSpotId, setView, setSelectedSpotId);

  const selectedSpot = spots.find(s => s.id === selectedSpotId) ?? null;
  useSeoMeta(view, selectedSpot, lang);

  const t = translations[lang];

  const handleSpotClick = (id: number) => {
    setSelectedSpotId(id);
    setView('detail');
    trackEvent('spot_click', { spot_id: id });
  };

  const handleRecommend = () => {
    if (!who || !time || prefs.length === 0) {
      alert(lang === 'ko' ? '모든 항목을 선택해주세요.' : 'Please select all items.');
      return;
    }
    setIsLoading(true);
    setView('results');
    trackEvent('recommend_submit', { who, time });
    setTimeout(() => {
      setResults(buildRecommendations(spots, who, time, prefs, lang));
      setIsLoading(false);
    }, 800);
  };

  const handleRetry = () => {
    setWho(''); setTime(''); setPrefs([]); setResults([]);
    setView('recommend');
  };

  const handleSetView = (v: View) => {
    setView(v);
    trackEvent('nav', { view: v });
  };

  const isAdmin = ADMIN_EMAIL
    ? auth.user?.email === ADMIN_EMAIL
    : false;

  const resultSpots = results.map(r => spots.find(s => s.id === r.id)).filter(Boolean) as typeof spots;

  return (
    <div className="min-h-screen bg-background pb-20 max-w-2xl mx-auto shadow-xl flex flex-col">
      <Header
        lang={lang} setLang={setLang} t={t}
        auth={auth}
        onLogin={() => setAuthModalOpen(true)}
        onLogout={auth.signOut}
      />

      <main className="flex-grow" id="main-content">
        <Suspense fallback={view === 'map' ? <MapSkeleton /> : <PageSpinner />}>
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <HomePage key="home" spots={spots} lang={lang} t={t} setView={handleSetView} onSpotClick={handleSpotClick} />
            )}
            {view === 'recommend' && (
              <RecommendPage
                key="recommend"
                lang={lang} t={t}
                who={who} setWho={setWho}
                time={time} setTime={setTime}
                prefs={prefs} setPrefs={setPrefs}
                onSubmit={handleRecommend}
              />
            )}
            {view === 'results' && (
              <ResultsPage
                key="results"
                spots={spots} lang={lang} t={t}
                results={results} isLoading={isLoading}
                onSpotClick={handleSpotClick}
                onRetry={handleRetry}
                setView={handleSetView}
              />
            )}
            {view === 'route' && (
              <RouteMapPage
                key="route"
                spots={resultSpots} lang={lang} t={t}
                setView={handleSetView}
                onSpotClick={handleSpotClick}
              />
            )}
            {view === 'list' && (
              <ListPage key="list" spots={spots} lang={lang} t={t} onSpotClick={handleSpotClick} />
            )}
            {view === 'detail' && selectedSpot && (
              <DetailPage
                key="detail"
                spot={selectedSpot} lang={lang} t={t}
                setView={handleSetView}
                isFavorite={isFavorite(selectedSpot.id)}
                onToggleFavorite={toggleFavorite}
                isStamped={isStamped(selectedSpot.id)}
                onAddStamp={addStamp}
                userId={auth.user?.id ?? null}
                onLoginRequest={() => setAuthModalOpen(true)}
                quizData={quizzes.find(q => q.spotId === selectedSpot.id) ?? null}
                isQuizCompleted={quiz.isCompleted(selectedSpot.id)}
                quizScore={quiz.getScore(selectedSpot.id)}
                onQuizOpen={() => setQuizModalSpotId(selectedSpot.id)}
              />
            )}
            {view === 'map' && (
              <div key="map" className="animate-in fade-in duration-500">
                <MapView spots={spots} lang={lang} onSpotClick={handleSpotClick} t={t} />
              </div>
            )}
            {view === 'favorites' && (
              <FavoritesPage
                key="favorites"
                spots={spots} favorites={favorites} lang={lang} t={t}
                onSpotClick={handleSpotClick}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {view === 'stamps' && (
              <StampsPage
                key="stamps"
                spots={spots} lang={lang}
                stamps={stamps} isComplete={isComplete}
                onSpotClick={handleSpotClick}
                setView={handleSetView}
                unlockedBadgeCount={badges.filter(b => b.unlocked).length}
              />
            )}
            {view === 'badges' && (
              <BadgesPage
                key="badges"
                badges={badges}
                lang={lang}
                setView={handleSetView}
              />
            )}
            {view === 'admin' && (
              <AdminPage key="admin" setView={handleSetView} isAdmin={isAdmin} />
            )}
            {view === 'legal' && (
              <LegalPage key="legal" lang={lang} setView={handleSetView} />
            )}
            {view === 'notfound' && (
              <NotFoundPage key="notfound" lang={lang} setView={handleSetView} />
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Footer — visible on non-detail pages */}
      {!['detail', 'map', 'route'].includes(view) && (
        <AppFooter lang={lang} setView={handleSetView} />
      )}

      <BottomNav
        active={view === 'badges' ? 'stamps' : view}
        setView={handleSetView} t={t}
        favCount={favorites.length}
        stampCount={stampCount}
      />

      {/* Quiz Modal */}
      {quizModalSpotId !== null && (() => {
        const qData = quizzes.find(q => q.spotId === quizModalSpotId);
        const qSpot = spots.find(s => s.id === quizModalSpotId);
        if (!qData || !qSpot) return null;
        return (
          <QuizModal
            quiz={qData}
            lang={lang}
            spotName={getLocalized(qSpot as any, 'name', lang) as string}
            open={true}
            onClose={() => setQuizModalSpotId(null)}
            onComplete={(score) => {
              quiz.saveResult(quizModalSpotId, score);
              trackEvent('quiz_complete', { spot_id: quizModalSpotId, score });
              setQuizModalSpotId(null);
            }}
          />
        );
      })()}

      <FaqWidget lang={lang} />

      <DemoModal
        open={showDemoModal}
        lang={lang}
        onClose={() => {
          sessionStorage.setItem('demo_seen', 'true');
          setShowDemoModal(false);
        }}
      />

      <AuthModal
        lang={lang}
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogle={async () => {
          await auth.signInWithGoogle();
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
