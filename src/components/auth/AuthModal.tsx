import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Lang } from '@/types';

const COPY: Record<Lang, { title: string; sub: string; google: string; skip: string; notice: string }> = {
  ko: { title: '로그인', sub: '로그인하면 리뷰 작성과 데이터 클라우드 동기화가 가능합니다.', google: 'Google로 계속하기', skip: '로그인 없이 계속', notice: '로그인 없이도 즐겨찾기·도장깨기를 이용할 수 있습니다.' },
  en: { title: 'Sign In', sub: 'Sign in to write reviews and sync your data to the cloud.', google: 'Continue with Google', skip: 'Continue without signing in', notice: 'Favorites and stamps work without an account.' },
  zh: { title: '登录', sub: '登录后可撰写评论并同步数据到云端。', google: '使用Google继续', skip: '不登录继续', notice: '不登录也可使用收藏和盖章功能。' },
  ja: { title: 'ログイン', sub: 'ログインするとレビューの投稿とデータのクラウド同期ができます。', google: 'Googleで続ける', skip: 'ログインせずに続ける', notice: 'お気に入り・スタンプはアカウントなしでも使えます。' },
};

interface Props {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  onGoogle: () => void;
}

export default function AuthModal({ lang, open, onClose, onGoogle }: Props) {
  const c = COPY[lang];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[120] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[130] bg-background rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
              aria-label="닫기"
            >
              <X size={18} className="text-on-surface-variant" />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-2">{c.title}</h2>
            <p className="text-sm text-on-surface-variant mb-6">{c.sub}</p>

            <button
              onClick={onGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-outline-variant hover:bg-surface-container transition-colors font-bold text-sm active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {c.google}
            </button>

            <p className="text-xs text-outline text-center mt-4">{c.notice}</p>
            <button
              onClick={onClose}
              className="w-full mt-3 py-2 text-xs text-on-surface-variant hover:text-primary font-medium transition-colors"
            >
              {c.skip}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
