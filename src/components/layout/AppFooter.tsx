import { Lang, View } from '@/types';

interface Props {
  lang: Lang;
  setView: (v: View) => void;
}

const LABELS: Record<Lang, { privacy: string; terms: string; feedback: string }> = {
  ko: { privacy: '개인정보처리방침', terms: '이용약관', feedback: '피드백 보내기' },
  en: { privacy: 'Privacy', terms: 'Terms', feedback: 'Send Feedback' },
  zh: { privacy: '隐私政策', terms: '服务条款', feedback: '发送反馈' },
  ja: { privacy: 'プライバシー', terms: '利用規約', feedback: 'フィードバック' },
};

export default function AppFooter({ lang, setView }: Props) {
  const l = LABELS[lang];

  return (
    <footer className="mt-8 pb-2 px-5 border-t border-outline-variant/40 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-outline">
        <button
          onClick={() => setView('legal')}
          className="hover:text-primary transition-colors"
        >
          {l.privacy}
        </button>
        <span>·</span>
        <button
          onClick={() => setView('legal')}
          className="hover:text-primary transition-colors"
        >
          {l.terms}
        </button>
        <span>·</span>
        <a
          href="mailto:kdk5534@gmail.com?subject=금천9경 피드백"
          className="hover:text-primary transition-colors"
        >
          {l.feedback}
        </a>
      </div>
      <p className="text-center text-[9px] text-outline/60 mt-1.5">
        © 2026 금천 9경 가이드 v1.0 · 금천구청 공식 서비스 아님
      </p>
    </footer>
  );
}
