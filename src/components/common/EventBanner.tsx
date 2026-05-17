import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Lang } from '@/types';

interface EventItem {
  id: string;
  title: string;
  title_en?: string;
  title_zh?: string;
  title_ja?: string;
  startDate: string;
  endDate: string;
  spotId: number;
  emoji: string;
  url: string | null;
}

interface Props {
  lang: Lang;
  onSpotClick: (id: number) => void;
}

const BTN: Record<Lang, string> = { ko: '자세히 보기', en: 'Learn more', zh: '查看详情', ja: '詳しく見る' };

export default function EventBanner({ lang, onSpotClick }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/events.json')
      .then(r => r.json())
      .then((data: EventItem[]) => {
        const today = new Date().toISOString().slice(0, 10);
        setEvents(data.filter(e => e.startDate <= today && today <= e.endDate));
      })
      .catch(() => {});
  }, []);

  const visible = events.filter(e => !dismissed.has(e.id));
  if (visible.length === 0) return null;

  const getTitle = (e: EventItem) =>
    lang === 'ko' ? e.title
    : lang === 'en' ? (e.title_en ?? e.title)
    : lang === 'zh' ? (e.title_zh ?? e.title)
    : (e.title_ja ?? e.title);

  return (
    <div className="space-y-2 mb-4">
      {visible.map(e => (
        <div key={e.id} className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{e.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800 truncate">{getTitle(e)}</p>
            <button
              onClick={() => onSpotClick(e.spotId)}
              className="text-xs text-amber-600 font-semibold hover:underline mt-0.5"
            >
              {BTN[lang]}
            </button>
          </div>
          <button
            onClick={() => setDismissed(prev => new Set(prev).add(e.id))}
            className="w-6 h-6 flex items-center justify-center text-amber-400 hover:text-amber-600 shrink-0"
            aria-label="닫기"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
