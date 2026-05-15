import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Map as MapIcon, 
  Search, 
  Home, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  ArrowLeft, 
  Share2, 
  Heart,
  Timer,
  Bus,
  Ticket,
  Clock,
  MapPin,
  Quote,
  RefreshCw,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { spots } from './data';

// --- Types ---
type Lang = 'ko' | 'en' | 'zh' | 'ja';
type View = 'home' | 'recommend' | 'results' | 'list' | 'detail' | 'map';

interface Recommendation {
  id: number;
  reason: string;
}

// --- Translations ---
const translations = {
  ko: {
    title: "금천 9경 가이드",
    heroTitle: "금천 9경(景)",
    heroSub: "금천구 대표 명소 9곳을 탐험하세요",
    aiBtn: "AI 맞춤 코스 추천받기",
    navHome: "홈",
    navRecommend: "추천",
    navList: "9경 목록",
    navMap: "지도",
    filterAll: "전체",
    filterNature: "자연",
    filterHistory: "역사",
    filterArt: "예술",
    filterExperience: "체험",
    whoTitle: "누구와 함께?",
    timeTitle: "시간이 얼마나?",
    prefTitle: "어떤 것이 좋아요?",
    prefSub: "중복 선택 가능",
    aiSubmit: "AI 추천 받기",
    resultTitle: "맞춤형 추천 코스",
    resultSub: "선택하신 테마를 바탕으로 코스를 구성했습니다.",
    reRetry: "다시 추천받기",
    viewDetail: "자세히 보기",
    whoItems: ['혼자', '연인', '가족', '친구'],
    timeItems: ['1~2시간', '반나절', '하루 종일'],
    prefItems: ['자연·산책', '역사·문화', '야경', '예술·공연', '체험·교육'],
    detailAddress: "주소",
    detailHours: "운영시간",
    detailFee: "입장료",
    detailTransit: "교통",
    detailDuration: "소요시간",
    detailHighlights: "주요 포인트",
    detailStory: "이야기",
  },
  en: {
    title: "Geumcheon 9 Scenic Spots",
    heroTitle: "The 9 Sceneries",
    heroSub: "Explore the 9 representative landmarks of Geumcheon-gu",
    aiBtn: "Get AI Recommendations",
    navHome: "Home",
    navRecommend: "AI Rec",
    navList: "List",
    navMap: "Map",
    filterAll: "All",
    filterNature: "Nature",
    filterHistory: "History",
    filterArt: "Art",
    filterExperience: "Exp",
    whoTitle: "With whom?",
    timeTitle: "How much time?",
    prefTitle: "What do you like?",
    prefSub: "Multi-select possible",
    aiSubmit: "Get AI Course",
    resultTitle: "AI Personalized Course",
    resultSub: "We've created a course based on your preferences.",
    reRetry: "Try Again",
    viewDetail: "View Detail",
    whoItems: ['Solo', 'Couple', 'Family', 'Friends'],
    timeItems: ['1~2 hours', 'Half day', 'Full day'],
    prefItems: ['Nature', 'History', 'Night View', 'Arts', 'Experience'],
    detailAddress: "Address",
    detailHours: "Hours",
    detailFee: "Fee",
    detailTransit: "Transport",
    detailDuration: "Duration",
    detailHighlights: "Highlights",
    detailStory: "Story",
  },
  zh: {
    title: "金川 9景指南",
    heroTitle: "金川 9景",
    heroSub: "探索金川区9个代表性景点",
    aiBtn: "获取 AI 推荐",
    navHome: "主页",
    navRecommend: "推荐",
    navList: "列表",
    navMap: "地图",
    filterAll: "全部",
    filterNature: "自然",
    filterHistory: "历史",
    filterArt: "艺术",
    filterExperience: "体验",
    whoTitle: "和谁一起？",
    timeTitle: "多少时间？",
    prefTitle: "喜欢什么？",
    prefSub: "可多选",
    aiSubmit: "获取 AI 推荐",
    resultTitle: "AI 定制路线",
    resultSub: "根据您的喜好为您准备了推荐路线。",
    reRetry: "重新推荐",
    viewDetail: "查看详情",
    whoItems: ['独自', '情侣', '家庭', '朋友'],
    timeItems: ['1~2小时', '半天', '一整天'],
    prefItems: ['自然', '历史文化', '夜景', '艺术', '体验'],
    detailAddress: "地址",
    detailHours: "营业时间",
    detailFee: "费用",
    detailTransit: "交通",
    detailDuration: "所需时间",
    detailHighlights: "核心看点",
    detailStory: "故事",
  },
  ja: {
    title: "衿川 9景ガイド",
    heroTitle: "衿川 9景",
    heroSub: "衿川区を代表する9つの名所を探索しましょう",
    aiBtn: "AIおすすめコースを受け取る",
    navHome: "ホーム",
    navRecommend: "おすすめ",
    navList: "一覧",
    navMap: "地図",
    filterAll: "すべて",
    filterNature: "自然",
    filterHistory: "歴史",
    filterArt: "芸術",
    filterExperience: "体験",
    whoTitle: "誰と一緒？",
    timeTitle: "時間はどのくらい？",
    prefTitle: "どんなものが好き？",
    prefSub: "複数選択可能",
    aiSubmit: "AIおすすめを受け取る",
    resultTitle: "AIカスタマイズコース",
    resultSub: "選択したテーマに基づいてコースを構成しました。",
    reRetry: "もう一度おすすめを受ける",
    viewDetail: "詳細を見る",
    whoItems: ['一人', 'カップル', '家族', '友人'],
    timeItems: ['1~2時間', '半日', '一日'],
    prefItems: ['自然', '歴史文化', '夜景', '芸術', '体験'],
    detailAddress: "住所",
    detailHours: "営業時間",
    detailFee: "料金",
    detailTransit: "交通",
    detailDuration: "所要時間",
    detailHighlights: "ハイライト",
    detailStory: "ストーリー",
  }
};

// --- Helper Components ---
const ScenicImage = ({ src, alt, className, categories = [], fallbackSrc }: { src: string, alt: string, className?: string, categories?: string[], fallbackSrc?: string }) => {
  const [errorCount, setErrorCount] = useState(0);

  const getEmoji = () => {
    const cats = categories.join(',');
    if (cats.includes('자연')) return '🏔️';
    if (cats.includes('역사')) return '🏛️';
    if (cats.includes('예술')) return '🎨';
    if (cats.includes('체험')) return '👣';
    return '📍';
  };

  const handleError = () => {
    setErrorCount(prev => prev + 1);
  };

  // If both primary and fallback failed, show emoji
  if (errorCount >= (fallbackSrc ? 2 : 1)) {
    return (
      <div className={`flex flex-col items-center justify-center bg-surface-container-high ${className}`}>
        <span className="text-4xl mb-2">{getEmoji()}</span>
        <span className="text-[10px] text-outline px-2 text-center font-medium leading-tight">{alt}</span>
      </div>
    );
  }

  const currentSrc = errorCount === 0 ? src : fallbackSrc;

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};

const BottomNav = ({ active, setView, t }: { active: View, setView: (v: View) => void, t: any }) => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-white/90 backdrop-blur-md border-t border-outline-variant shadow-sm rounded-t-xl max-w-2xl mx-auto right-0">
    {[
      { id: 'home', icon: Home, label: t.navHome },
      { id: 'recommend', icon: Sparkles, label: t.navRecommend },
      { id: 'list', icon: Compass, label: t.navList },
      { id: 'map', icon: MapIcon, label: t.navMap },
    ].map((item) => (
      <button 
        key={item.id}
        onClick={() => setView(item.id as View)}
        className={`flex flex-col items-center justify-center px-4 py-1 transition-all duration-200 ${
          active === item.id ? 'bg-primary-container text-on-primary-container rounded-full scale-95 shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/30 rounded-lg'
        }`}
      >
        <item.icon size={20} className={active === item.id ? 'fill-current' : ''} />
        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
      </button>
    ))}
  </nav>
);

const Header = ({ lang, setLang, t, onMenuClick }: { lang: Lang, setLang: (l: Lang) => void, t: any, onMenuClick?: () => void }) => (
  <header className="flex justify-between items-center w-full px-5 h-16 z-50 bg-background/95 backdrop-blur-sm sticky top-0 border-b border-outline-variant max-w-2xl mx-auto">
    <button onClick={onMenuClick} className="text-primary p-1">
      <Menu size={24} />
    </button>
    <h1 className="text-lg font-bold text-primary tracking-tight">{t.title}</h1>
    <div className="flex gap-1">
      {(['ko', 'en', 'zh', 'ja'] as Lang[]).map(l => (
        <button 
          key={l}
          onClick={() => setLang(l)}
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lang === l ? 'bg-primary text-white' : 'text-outline hover:text-primary'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  </header>
);

// --- Leaflet Icon Fix ---
function MapView({ spots, lang, handleSpotClick, t }: any) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [37.4570, 126.9002],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    spots.forEach((spot: any) => {
      const name = lang === 'ko' ? spot.name : lang === 'en' ? spot.name_en : lang === 'zh' ? spot.name_zh : spot.name_ja;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:#012d1d;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);">${spot.id}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      L.marker([spot.lat, spot.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 text-center min-w-[120px]">
            <b class="text-sm block mb-2">${name}</b>
            <button 
              onclick="window.__goToSpot(${spot.id})"
              class="bg-primary text-white text-[10px] px-3 py-1 rounded font-bold hover:opacity-90"
            >
              ${t.viewDetail}
            </button>
          </div>
        `);
    });

    mapInstanceRef.current = map;
    
    // Force size check
    setTimeout(() => map.invalidateSize(), 150);

    return () => { 
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); 
        mapInstanceRef.current = null; 
      }
    };
  }, [spots, lang]);

  return (
    <div style={{ 
      position: 'fixed',
      top: '64px',
      bottom: '64px',
      left: 'max(0px, calc(50% - 336px))',
      right: 'max(0px, calc(50% - 336px))',
      width: 'auto',
      maxWidth: '672px',
      margin: '0 auto',
      zIndex: 10,
      background: '#f8f9fa'
    }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Lang>('ko');
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('전체');

  // Form State
  const [who, setWho] = useState('');
  const [time, setTime] = useState('');
  const [prefs, setPrefs] = useState<string[]>([]);

  const whoValues = ['혼자', '연인', '가족', '친구'];
  const timeValues = ['1~2시간', '반나절', '하루 종일'];
  const prefValues = ['자연·산책', '역사·문화', '야경', '예술·공연', '체험·교육'];

  useEffect(() => {
    (window as any).__goToSpot = (id: number) => {
      handleSpotClick(id);
    };
    return () => {
      delete (window as any).__goToSpot;
    };
  }, []);

  const t = translations[lang];

  const listCategories = [
    { label: t.filterAll, value: '전체' },
    { label: t.filterNature, value: '자연·산책' },
    { label: t.filterHistory, value: '역사·문화' },
    { label: t.filterArt, value: '예술·공연' },
    { label: t.filterExperience, value: '체험·교육' },
  ];

  const filteredSpots = activeCategory === '전체' 
    ? spots 
    : spots.filter(s => s.categories.includes(activeCategory));

  const handleSpotClick = (id: number) => {
    setSelectedSpotId(id);
    setView('detail');
  };

  const getLocalizedName = (spot: any) => {
    if (lang === 'en') return spot.name_en;
    if (lang === 'zh') return spot.name_zh;
    if (lang === 'ja') return spot.name_ja;
    return spot.name;
  };

  const handleRecommend = () => {
    if (!who || !time || prefs.length === 0) {
      alert(lang === 'ko' ? "모든 항목을 선택해주세요." : "Please select all items.");
      return;
    }

    setIsLoading(true);
    setView('results');

    const recommendationTemplates: Record<Lang, (who: string, time: string, prefs: string[], spotName: string) => string> = {
      ko: (w, t, p, sn) => `${w}와(과) 함께하는 ${t} 코스로 딱입니다. ${p.join(', ')} 취향을 가진 분들께 ${sn}은(는) 정말 매력적인 장소입니다.`,
      en: (w, t, p, sn) => `Perfect for a ${t} trip with your ${w}. ${sn} is an ideal choice for those who love ${p.join(', ')}.`,
      zh: (w, t, p, sn) => `非常适合和${w}一起度过${t}的时光。${sn}对于喜欢${p.join(', ')}的人来说是完美的选择。`,
      ja: (w, t, p, sn) => `${w}と一緒に過ごす${t}コースにぴったりです。${p.join(', ')}が好きな方にとって、${sn}は最高のスポットです。`
    };

    // Simulate AI analysis delay
    setTimeout(() => {
      // 1. Scoring Logic
      const scoredSpots = spots.map(spot => {
        let score = 0;
        
        // Match Target Audience
        if (spot.recommendFor?.includes(who)) score += 10;
        
        // Match Preferences
        prefs.forEach(p => {
          if (spot.categories.includes(p)) score += 5;
        });

        // Time Matching (Soft bonus)
        if (spot.duration.includes(time.split(' ')[0])) score += 3;

        return { ...spot, score };
      });

      // 2. Sort and Pick Top 3
      const topSpots = scoredSpots
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // 3. Generate Results
      const results = topSpots.map(s => ({
        id: s.id,
        reason: recommendationTemplates[lang](
          translations[lang].whoItems[whoValues.indexOf(who)],
          translations[lang].timeItems[timeValues.indexOf(time)],
          prefs.map(p => translations[lang].prefItems[prefValues.indexOf(p)]),
          getLocalizedName(s)
        )
      }));

      setRecommendationResult(results);
      setIsLoading(false);
    }, 1200); 
  };

  const resetRecommend = () => {
    setWho('');
    setTime('');
    setPrefs([]);
    setRecommendationResult([]);
    setView('recommend');
  };

  return (
    <div className="min-h-screen bg-background pb-20 max-w-2xl mx-auto shadow-xl flex flex-col">
      <Header lang={lang} setLang={setLang} t={t} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-5 pt-8"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-primary mb-2">{t.heroTitle}</h2>
                <p className="text-on-surface-variant text-lg">{t.heroSub}</p>
                <button 
                  onClick={() => setView('recommend')}
                  className="mt-10 bg-primary text-on-primary py-4 px-8 rounded-full shadow-premium hover:bg-primary-container transition-all flex items-center gap-2 mx-auto active:scale-95"
                >
                  <Sparkles size={18} className="text-yellow-400" /> {t.aiBtn}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {spots.map((spot, index) => (
                  <article 
                    key={spot.id} 
                    onClick={() => handleSpotClick(spot.id)}
                    className="bg-white rounded-2xl border border-surface-variant overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <ScenicImage 
                        src={spot.image} 
                        alt={spot.name} 
                        categories={spot.categories} 
                        fallbackSrc={(spot as any).original_image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md rounded-full px-2.5 py-1 text-white text-xs font-bold border border-white/20">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-on-surface truncate">{getLocalizedName(spot)}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'recommend' && (
            <motion.div 
              key="recommend"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 pt-10"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
                  <span className="text-yellow-500">✨</span> {t.aiSubmit.split(' ')[0]} {t.resultTitle}
                </h2>
                <p className="text-on-surface-variant mt-2">{t.heroSub}</p>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-primary mb-4">{t.whoTitle}</h3>
                  <div className="flex flex-wrap gap-2">
                    {t.whoItems.map((item: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setWho(whoValues[idx])}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${who === whoValues[idx] ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-primary mb-4">{t.timeTitle}</h3>
                  <div className="flex flex-wrap gap-2">
                    {t.timeItems.map((item: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setTime(timeValues[idx])}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${time === timeValues[idx] ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'}`}
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
                    {t.prefItems.map((item: string, idx: number) => {
                      const value = prefValues[idx];
                      const isActive = prefs.includes(value);
                      return (
                        <button 
                          key={idx}
                          onClick={() => setPrefs(prev => isActive ? prev.filter(p => p !== value) : [...prev, value])}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${isActive ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 'bg-secondary-container/30 text-primary hover:bg-secondary-container/50'}`}
                        >
                          {isActive && <CheckCircle2 size={14} />} {item}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <button 
                  onClick={handleRecommend}
                  className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold shadow-premium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-10 active:scale-95"
                >
                  {t.aiSubmit} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'results' && (
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
                  <p className="text-on-surface-variant animate-pulse font-medium">AI가 최적의 코스를 찾고 있습니다...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendationResult.map((rec, idx) => {
                    const spot = spots.find(s => s.id === rec.id);
                    if (!spot) return null;
                    return (
                      <article key={spot.id} className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                        <div className="h-48 overflow-hidden">
                          <ScenicImage 
                            src={spot.image} 
                            alt={spot.name} 
                            categories={spot.categories} 
                            fallbackSrc={(spot as any).original_image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{spot.id}경</span>
                            <h3 className="text-xl font-bold text-primary">{getLocalizedName(spot)}</h3>
                          </div>
                          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{rec.reason}</p>
                          <button 
                            onClick={() => handleSpotClick(spot.id)}
                            className="flex items-center gap-1 text-sm font-bold text-primary hover:translate-x-1 transition-transform ml-auto"
                          >
                            {t.viewDetail} <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  
                  <div className="py-10 flex justify-center">
                    <button 
                      onClick={resetRecommend}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-outline-variant text-primary font-bold rounded-xl hover:bg-surface-variant/20 transition-all active:scale-95"
                    >
                      <RefreshCw size={18} /> {t.reRetry}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col"
            >
              <div className="sticky top-16 bg-background/95 backdrop-blur-sm z-30 border-b border-surface-variant px-5 py-4 overflow-x-auto no-scrollbar flex gap-2">
                {listCategories.map((cat) => (
                  <button 
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.value ? 'bg-secondary-container text-on-secondary-container shadow-sm ring-1 ring-secondary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant/50'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-surface-variant">
                {filteredSpots.map((spot) => (
                  <article 
                    key={spot.id} 
                    onClick={() => handleSpotClick(spot.id)}
                    className="flex items-center gap-4 p-5 hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-surface-variant relative shadow-sm">
                      <ScenicImage 
                        src={spot.image} 
                        alt={spot.name} 
                        categories={spot.categories} 
                        fallbackSrc={(spot as any).original_image}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold text-secondary">{spot.id}경</span>
                        <h3 className="text-lg font-bold text-primary">{getLocalizedName(spot)}</h3>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                        {spot.categories.map(c => (
                          <span key={c} className="text-[10px] px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-medium">#{c}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="text-outline-variant group-hover:text-primary transition-colors" />
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'detail' && selectedSpotId !== null && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background min-h-screen"
            >
              {(() => {
                const spot = spots.find(s => s.id === selectedSpotId);
                if (!spot) return null;
                return (
                  <div className="flex flex-col">
                    <div className="relative h-[400px]">
                      <ScenicImage 
                        src={spot.image} 
                        alt={spot.name} 
                        categories={spot.categories} 
                        fallbackSrc={(spot as any).original_image}
                        className="w-full h-full object-cover shadow-2xl" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20"></div>
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <button onClick={() => setView('home')} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"><ArrowLeft size={20} /></button>
                      </div>
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"><Share2 size={20} /></button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"><Heart size={20} /></button>
                      </div>
                    </div>

                    <div className="relative -mt-12 bg-background rounded-t-[40px] pt-10 px-5 flex flex-col gap-10">
                      <section>
                        <h2 className="text-4xl font-bold text-primary leading-tight">{spot.id}. {getLocalizedName(spot)}</h2>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {spot.categories.map(c => <span key={c} className="px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-semibold">#{c}</span>)}
                        </div>
                      </section>

                      <section className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="text-primary" size={20}/>
                          </div>
                          <div>
                            <p className="text-xs text-outline mb-1 font-bold">{t.detailAddress}</p>
                            <p className="text-sm font-medium">{spot.address}</p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex flex-col gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center">
                            <Clock size={18} className="text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-outline font-bold">{t.detailHours}</p>
                            <p className="text-xs font-medium mt-1">{spot.hours}</p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex flex-col gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center">
                            <Ticket size={18} className="text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-outline font-bold">{t.detailFee}</p>
                            <p className="text-xs font-medium mt-1">{spot.fee}</p>
                          </div>
                        </div>
                        <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                            <Bus className="text-secondary" size={20}/>
                          </div>
                          <div>
                            <p className="text-xs text-outline mb-1 font-bold">{t.detailTransit}</p>
                            <p className="text-sm font-medium">{spot.transit}</p>
                          </div>
                        </div>
                        <div className="col-span-2 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                            <Timer className="text-secondary" size={20}/>
                          </div>
                          <div>
                            <p className="text-xs text-outline mb-1 font-bold">{t.detailDuration}</p>
                            <p className="text-sm font-medium">{spot.duration}</p>
                          </div>
                        </div>
                      </section>

                      <section className="bg-primary text-on-primary p-6 rounded-[32px] shadow-premium relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-5 flex items-center gap-2"><Sparkles size={20} className="text-yellow-400" /> {t.detailHighlights}</h3>
                        <ul className="space-y-4">
                          {spot.highlights.map(h => (
                            <li key={h} className="flex items-start gap-3">
                              <CheckCircle2 size={16} className="text-secondary-container mt-1 shrink-0" />
                              <span className="text-sm font-medium opacity-90">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="mb-10">
                        <h3 className="text-xl font-bold text-primary mb-4">{t.detailStory}</h3>
                        <div className="relative p-6 pt-10">
                          <Quote className="absolute top-0 left-0 text-surface-variant scale-[3] opacity-50 -translate-x-2 translate-y-2" />
                          <p className="text-on-surface-variant font-medium leading-relaxed italic">{spot.story}</p>
                        </div>
                      </section>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {view === 'map' && (
            <div className="animate-in fade-in duration-500">
              <MapView 
                spots={spots} 
                lang={lang} 
                handleSpotClick={handleSpotClick} 
                t={t} 
                getLocalizedName={getLocalizedName} 
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav active={view} setView={setView} t={t} />
    </div>
  );
}
