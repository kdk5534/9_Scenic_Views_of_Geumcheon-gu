import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { Lang, View } from '@/types';

interface Props {
  lang: Lang;
  setView: (v: View) => void;
}

const LABELS: Record<Lang, { title: string; sub: string; btn: string }> = {
  ko: { title: '페이지를 찾을 수 없어요', sub: '주소를 다시 확인하거나 홈으로 이동해보세요.', btn: '홈으로 이동' },
  en: { title: 'Page not found', sub: 'Check the URL or go back to the home page.', btn: 'Go Home' },
  zh: { title: '页面未找到', sub: '请检查地址或返回主页。', btn: '前往主页' },
  ja: { title: 'ページが見つかりません', sub: 'URLを確認するかホームに戻ってください。', btn: 'ホームへ' },
};

export default function NotFoundPage({ lang, setView }: Props) {
  const l = LABELS[lang];
  return (
    <motion.div
      key="notfound"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-32 px-8 text-center"
    >
      <p className="text-7xl mb-6">🗺️</p>
      <h2 className="text-2xl font-bold text-primary mb-2">{l.title}</h2>
      <p className="text-sm text-on-surface-variant mb-8">{l.sub}</p>
      <button
        onClick={() => setView('home')}
        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-transform"
      >
        <Home size={16} />
        {l.btn}
      </button>
    </motion.div>
  );
}
