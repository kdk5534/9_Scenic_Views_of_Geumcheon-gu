import { useState } from 'react';
import { Send, LogIn } from 'lucide-react';
import { Lang } from '@/types';
import StarRating from './StarRating';

const COPY: Record<Lang, { title: string; placeholder: string; submit: string; needLogin: string; loginBtn: string; submitting: string; thanks: string; error: string; tooLong: string }> = {
  ko: { title: '리뷰 작성', placeholder: '방문 소감을 남겨주세요 (최대 300자)', submit: '등록', needLogin: '리뷰를 남기려면 로그인이 필요합니다.', loginBtn: '로그인', submitting: '등록 중...', thanks: '리뷰가 접수되었습니다. 검토 후 게시됩니다.', error: '오류가 발생했습니다. 다시 시도해주세요.', tooLong: '300자 이내로 작성해주세요.' },
  en: { title: 'Write a Review', placeholder: 'Share your thoughts (max 300 chars)', submit: 'Submit', needLogin: 'Please sign in to write a review.', loginBtn: 'Sign in', submitting: 'Submitting...', thanks: 'Review submitted! It will appear after review.', error: 'An error occurred. Please try again.', tooLong: 'Please keep it under 300 characters.' },
  zh: { title: '撰写评论', placeholder: '分享您的感受 (最多300字)', submit: '提交', needLogin: '请登录后撰写评论。', loginBtn: '登录', submitting: '提交中...', thanks: '评论已提交，审核后将显示。', error: '发生错误，请重试。', tooLong: '请在300字以内。' },
  ja: { title: 'レビューを書く', placeholder: '訪問の感想を書いてください (最大300文字)', submit: '投稿', needLogin: 'レビューを投稿するにはログインが必要です。', loginBtn: 'ログイン', submitting: '投稿中...', thanks: 'レビューを受け付けました。確認後に表示されます。', error: 'エラーが発生しました。再試行してください。', tooLong: '300文字以内で入力してください。' },
};

interface Props {
  lang: Lang;
  userId: string | null;
  onSubmit: (rating: number, comment: string) => Promise<'ok' | 'error'>;
  onLoginRequest: () => void;
}

export default function ReviewForm({ lang, userId, onSubmit, onLoginRequest }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const c = COPY[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || rating === 0) return;
    if (comment.length > 300) { setStatus('error'); return; }
    setStatus('loading');
    const result = await onSubmit(rating, comment);
    setStatus(result === 'ok' ? 'done' : 'error');
    if (result === 'ok') { setRating(0); setComment(''); }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3">
        <p className="text-sm text-on-surface-variant">{c.needLogin}</p>
        <button
          onClick={onLoginRequest}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform shrink-0"
        >
          <LogIn size={12} /> {c.loginBtn}
        </button>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 text-sm font-medium text-primary">
        ✓ {c.thanks}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 space-y-3">
      <p className="text-sm font-bold text-on-surface">{c.title}</p>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={c.placeholder}
        rows={3}
        maxLength={300}
        className="w-full text-sm rounded-xl border border-outline-variant/60 bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
      />
      {comment.length > 280 && (
        <p className="text-[10px] text-outline text-right">{comment.length}/300</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-500">{comment.length > 300 ? c.tooLong : c.error}</p>
      )}
      <button
        type="submit"
        disabled={rating === 0 || status === 'loading'}
        className="flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-4 py-2 rounded-full disabled:opacity-50 active:scale-95 transition-transform ml-auto"
      >
        <Send size={12} />
        {status === 'loading' ? c.submitting : c.submit}
      </button>
    </form>
  );
}
