import { useState } from 'react';
import { X } from 'lucide-react';
import { Lang, View } from '@/types';

const COPY: Record<Lang, { title: string; sub: string; btn: string }> = {
  ko: { title: '🌸 안양천 벚꽃 시즌!', sub: '지금 바로 벚꽃십리길을 걸어보세요.', btn: '2경 보기' },
  en: { title: '🌸 Cherry Blossom Season!', sub: 'Walk the Anyangcheon Cherry Trail now.', btn: 'View Spot 2' },
  zh: { title: '🌸 安养川樱花季！', sub: '现在就去走一走樱花十里路吧。', btn: '查看第2景' },
  ja: { title: '🌸 安養川 桜シーズン！', sub: '今すぐ桜十里道を歩いてみましょう。', btn: '第2景を見る' },
};

function isCherryBlossomSeason(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return (month === 3 && day >= 25) || (month === 4 && day <= 15);
}

interface Props {
  lang: Lang;
  onSpotClick: (id: number) => void;
  setView: (v: View) => void;
}

export default function CherryBlossomBanner({ lang, onSpotClick }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !isCherryBlossomSeason()) return null;

  const c = COPY[lang];
  return (
    <div className="relative bg-gradient-to-r from-pink-100 to-rose-50 border border-pink-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
      <div className="flex-1">
        <p className="font-bold text-sm text-rose-700">{c.title}</p>
        <p className="text-xs text-rose-500 mt-0.5">{c.sub}</p>
        <button
          onClick={() => onSpotClick(2)}
          className="mt-2 text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-full hover:bg-rose-600 transition-colors active:scale-95"
        >
          {c.btn}
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-rose-400 hover:text-rose-600"
        aria-label="닫기"
      >
        <X size={14} />
      </button>
    </div>
  );
}
