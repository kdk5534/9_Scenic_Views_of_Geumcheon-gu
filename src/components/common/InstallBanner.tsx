import { AnimatePresence, motion } from 'motion/react';
import { Download, Share, X } from 'lucide-react';
import { Lang } from '@/types';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const LABELS: Record<Lang, { title: string; iosHint: string; install: string }> = {
  ko: { title: '홈 화면에 추가', iosHint: '아래 공유 버튼을 누른 후 "홈 화면에 추가"를 탭하세요.', install: '설치하기' },
  en: { title: 'Add to Home Screen', iosHint: 'Tap the Share button below, then "Add to Home Screen".', install: 'Install' },
  zh: { title: '添加到主屏幕', iosHint: '点击下方共享按钮，然后选择"添加到主屏幕"。', install: '安装' },
  ja: { title: 'ホーム画面に追加', iosHint: '下の共有ボタンをタップして「ホーム画面に追加」を選択。', install: 'インストール' },
};

interface Props {
  lang: Lang;
}

export default function InstallBanner({ lang }: Props) {
  const { showBanner, isIOS, install, dismiss } = usePWAInstall();
  const l = LABELS[lang];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50"
        >
          <div className="bg-surface-container border border-outline-variant rounded-2xl shadow-premium p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              {isIOS ? <Share size={20} className="text-primary" /> : <Download size={20} className="text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">{l.title}</p>
              {isIOS ? (
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{l.iosHint}</p>
              ) : (
                <button
                  onClick={install}
                  className="mt-1.5 text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                  {l.install}
                </button>
              )}
            </div>
            <button
              onClick={dismiss}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors shrink-0"
              aria-label="닫기"
            >
              <X size={15} className="text-on-surface-variant" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
