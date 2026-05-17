import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle2, Circle, Share2, Download, Award } from 'lucide-react';
import { Spot, Lang, View } from '@/types';
import { getLocalized } from '@/i18n';
import ScenicImage from '@/components/common/ScenicImage';

interface StampEntry { id: number; visitedAt: string; }

interface Props {
  spots: Spot[];
  lang: Lang;
  stamps: StampEntry[];
  isComplete: boolean;
  onSpotClick: (id: number) => void;
  setView: (v: View) => void;
  unlockedBadgeCount: number;
}

const LABELS: Record<Lang, { title: string; sub: string; complete: string; completeSub: string; share: string; download: string; visited: string; notVisited: string }> = {
  ko: { title: '9경 도장깨기', sub: '9개 명소를 모두 방문해 금천 탐험가가 되어보세요!', complete: '🎉 금천 9경 정복 완료!', completeSub: '모든 명소를 방문했습니다. 배지를 공유해보세요!', share: '배지 공유하기', download: '배지 저장하기', visited: '방문 완료', notVisited: '미방문' },
  en: { title: '9 Scenic Stamp Rally', sub: 'Visit all 9 spots to become a Geumcheon Explorer!', complete: '🎉 All 9 Scenic Spots Conquered!', completeSub: 'You visited every spot. Share your badge!', share: 'Share Badge', download: 'Save Badge', visited: 'Visited', notVisited: 'Not yet' },
  zh: { title: '9景集章活动', sub: '游遍9个景点，成为金川探险家！', complete: '🎉 金川9景全部完成！', completeSub: '您已访问所有景点，快来分享您的徽章吧！', share: '分享徽章', download: '保存徽章', visited: '已访问', notVisited: '未访问' },
  ja: { title: '9景スタンプラリー', sub: '9つのスポットをすべて訪れて衿川探検家になろう！', complete: '🎉 衿川9景コンプリート！', completeSub: 'すべてのスポットを訪れました。バッジをシェアしましょう！', share: 'バッジをシェア', download: 'バッジを保存', visited: '訪問済み', notVisited: '未訪問' },
};

const drawBadge = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // 배경
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, '#1b4332');
  grad.addColorStop(1, '#012d1d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
  ctx.fill();

  // 외곽 링
  ctx.strokeStyle = '#86af99';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 10, 0, Math.PI * 2);
  ctx.stroke();

  // 텍스트
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `bold ${w * 0.08}px sans-serif`;
  ctx.fillText('금천 9경', w / 2, h * 0.38);
  ctx.font = `bold ${w * 0.13}px sans-serif`;
  ctx.fillStyle = '#d4edda';
  ctx.fillText('정복 완료', w / 2, h * 0.55);
  ctx.font = `${w * 0.06}px sans-serif`;
  ctx.fillStyle = '#86af99';
  ctx.fillText('Geumcheon 9 Scenic', w / 2, h * 0.68);
  ctx.font = `bold ${w * 0.07}px sans-serif`;
  ctx.fillStyle = '#ffd700';
  ctx.fillText('★ ★ ★ ★ ★ ★ ★ ★ ★', w / 2, h * 0.80);
};

export default function StampsPage({ spots, lang, stamps, isComplete, onSpotClick, setView, unlockedBadgeCount }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const l = LABELS[lang];
  const stampedIds = new Set(stamps.map(s => s.id));

  const handleShare = async () => {
    if (canvasRef.current) {
      drawBadge(canvasRef.current);
      canvasRef.current.toBlob(async blob => {
        if (!blob) return;
        if (navigator.share) {
          await navigator.share({ title: l.complete, files: [new File([blob], 'geumcheon-badge.png', { type: 'image/png' })] });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'geumcheon-badge.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    drawBadge(canvasRef.current);
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geumcheon-badge.png';
    a.click();
  };

  return (
    <motion.div
      key="stamps"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 pt-8 pb-4"
    >
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary" size={26} />
            <h2 className="text-2xl font-bold text-primary">{l.title}</h2>
          </div>
          <button
            onClick={() => setView('badges')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Award size={13} />
            {lang === 'ko' ? `배지 ${unlockedBadgeCount}` : lang === 'en' ? `Badges ${unlockedBadgeCount}` : lang === 'zh' ? `徽章 ${unlockedBadgeCount}` : `バッジ ${unlockedBadgeCount}`}
          </button>
        </div>
        <p className="text-sm text-on-surface-variant">{l.sub}</p>
        <div className="mt-3 bg-surface-container-low rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stampedIds.size / 9) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-outline mt-1 text-right font-bold">{stampedIds.size} / 9</p>
      </div>

      {/* 완주 배지 */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-primary text-on-primary rounded-3xl p-6 text-center shadow-premium"
          >
            <canvas ref={canvasRef} width={300} height={300} className="hidden" />
            <p className="text-xl font-bold mb-1">{l.complete}</p>
            <p className="text-sm opacity-80 mb-4">{l.completeSub}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-bold transition-all"
              >
                <Share2 size={15} /> {l.share}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-bold transition-all"
              >
                <Download size={15} /> {l.download}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 도장 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {spots.map(spot => {
          const stamped = stampedIds.has(spot.id);
          const entry = stamps.find(s => s.id === spot.id);
          return (
            <motion.article
              key={spot.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSpotClick(spot.id)}
              className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                stamped ? 'border-primary shadow-md' : 'border-outline-variant opacity-70'
              }`}
            >
              <div className="relative aspect-square">
                <ScenicImage
                  src={spot.image}
                  alt={getLocalized(spot as any, 'name', lang)}
                  categories={spot.categories}
                  className={`w-full h-full object-cover transition-all ${stamped ? '' : 'grayscale'}`}
                />
                <div className={`absolute inset-0 flex items-center justify-center ${stamped ? 'bg-primary/20' : 'bg-black/40'}`}>
                  {stamped
                    ? <CheckCircle2 size={32} className="text-white drop-shadow" />
                    : <Circle size={32} className="text-white/60" />
                  }
                </div>
                <div className="absolute top-1.5 left-1.5 bg-black/50 rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{spot.id}</span>
                </div>
              </div>
              <div className="p-2 bg-white">
                <p className="text-[10px] font-bold text-primary truncate">
                  {getLocalized(spot as any, 'name', lang)}
                </p>
                <p className={`text-[9px] mt-0.5 font-medium ${stamped ? 'text-primary' : 'text-outline'}`}>
                  {stamped
                    ? `${l.visited} ${entry ? new Date(entry.visitedAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric' }) : ''}`
                    : l.notVisited
                  }
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
