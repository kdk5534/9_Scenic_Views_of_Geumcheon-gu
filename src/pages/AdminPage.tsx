import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ArrowLeft, ShieldAlert } from 'lucide-react';
import { supabase, isConfigured } from '@/lib/supabase';
import { View } from '@/types';
import StarRating from '@/components/reviews/StarRating';

interface PendingReview {
  id: string;
  spot_id: number;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { username: string | null };
}

interface Props {
  setView: (v: View) => void;
  isAdmin: boolean;
}

const SPOT_NAMES: Record<number, string> = {
  1: '호암산과 호압사', 2: '안양천(벚꽃길)', 3: '오미생태공원',
  4: '금천체육공원 전망대', 5: '금천G밸리와 순이의 집', 6: '시흥행궁전시관과 은행나무',
  7: '금천폭포공원', 8: '금천뮤지컬센터', 9: '서서울미술관',
};

export default function AdminPage({ setView, isAdmin }: Props) {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('approved', false)
      .order('created_at');
    setReviews((data ?? []) as PendingReview[]);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id: string) => {
    if (!supabase) return;
    await supabase.from('reviews').update({ approved: true }).eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const reject = async (id: string) => {
    if (!supabase) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 px-6 text-center">
        <ShieldAlert size={48} className="text-outline-variant" />
        <p className="text-on-surface-variant font-medium">관리자만 접근할 수 있습니다.</p>
        <button onClick={() => setView('home')} className="text-primary font-bold text-sm">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="px-5 pt-8">
        <p className="text-sm text-on-surface-variant">Supabase가 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <motion.div
      key="admin"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-5 pt-6 pb-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setView('home')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
          aria-label="뒤로"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h2 className="text-xl font-bold text-primary">리뷰 검토 ({reviews.length})</h2>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-center text-on-surface-variant py-16">검토 대기 중인 리뷰가 없습니다.</p>
      )}

      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-primary">{SPOT_NAMES[rev.spot_id]}</span>
                <span className="text-[10px] text-outline ml-2">{rev.profiles?.username ?? 'Anonymous'}</span>
                <span className="text-[10px] text-outline ml-2">{new Date(rev.created_at).toLocaleDateString('ko-KR')}</span>
              </div>
              <StarRating value={rev.rating} readOnly size={12} />
            </div>
            {rev.comment && <p className="text-sm text-on-surface-variant mb-3">{rev.comment}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => approve(rev.id)}
                className="flex items-center gap-1 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <Check size={12} /> 승인
              </button>
              <button
                onClick={() => reject(rev.id)}
                className="flex items-center gap-1 text-xs font-bold bg-red-500 text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <X size={12} /> 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
