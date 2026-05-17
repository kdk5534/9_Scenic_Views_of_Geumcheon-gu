import { Flag, User } from 'lucide-react';
import { Lang } from '@/types';
import StarRating from './StarRating';
import type { Review, SpotRating } from '@/hooks/useReviews';

const COPY: Record<Lang, { title: string; empty: string; report: string; avg: string; total: string }> = {
  ko: { title: '방문자 리뷰', empty: '아직 리뷰가 없어요. 첫 번째 리뷰를 남겨주세요!', report: '신고', avg: '평균', total: '건' },
  en: { title: 'Visitor Reviews', empty: 'No reviews yet. Be the first!', report: 'Report', avg: 'avg', total: 'reviews' },
  zh: { title: '游客评论', empty: '暂无评论，成为第一个评论者吧！', report: '举报', avg: '均', total: '条' },
  ja: { title: '訪問者レビュー', empty: 'まだレビューはありません。最初のレビューを書きましょう！', report: '通報', avg: '平均', total: '件' },
};

interface Props {
  lang: Lang;
  reviews: Review[];
  rating: SpotRating | null;
  loading: boolean;
  currentUserId: string | null;
  onReport: (reviewId: string) => void;
}

export default function ReviewList({ lang, reviews, rating, loading, currentUserId, onReport }: Props) {
  const c = COPY[lang];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary">{c.title}</h3>
        {rating && rating.review_count > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-bold text-on-surface">
            <StarRating value={Math.round(rating.avg_rating)} readOnly size={14} />
            <span>{rating.avg_rating} {c.avg}</span>
            <span className="text-outline font-normal">({rating.review_count}{c.total})</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-sm text-on-surface-variant text-center py-6 bg-surface-container-low rounded-2xl border border-outline-variant/40">
          {c.empty}
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map(rev => {
            const name = rev.profiles?.username ?? 'Anonymous';
            const avatar = rev.profiles?.avatar_url;
            const dateStr = new Date(rev.created_at).toLocaleDateString(
              lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US'
            );
            return (
              <div key={rev.id} className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {avatar
                      ? <img src={avatar} alt="" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                      : <div className="w-6 h-6 rounded-full bg-secondary-container/50 flex items-center justify-center"><User size={12} /></div>
                    }
                    <span className="text-xs font-bold text-on-surface">{name}</span>
                    <span className="text-[10px] text-outline">{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={rev.rating} readOnly size={12} />
                    {currentUserId && currentUserId !== rev.user_id && (
                      <button
                        onClick={() => onReport(rev.id)}
                        className="text-[10px] text-outline hover:text-red-500 transition-colors flex items-center gap-0.5"
                        aria-label={c.report}
                      >
                        <Flag size={10} /> {c.report}
                      </button>
                    )}
                  </div>
                </div>
                {rev.comment && <p className="text-sm text-on-surface-variant leading-relaxed">{rev.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
