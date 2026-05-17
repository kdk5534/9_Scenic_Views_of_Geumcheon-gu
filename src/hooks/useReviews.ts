import { useCallback, useEffect, useState } from 'react';
import { supabase, isConfigured } from '@/lib/supabase';

export interface Review {
  id: string;
  user_id: string;
  spot_id: number;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { username: string | null; avatar_url: string | null };
}

export interface SpotRating {
  avg_rating: number;
  review_count: number;
}

export function useReviews(spotId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<SpotRating | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: revData }, { data: ratingData }] = await Promise.all([
      supabase
        .from('reviews')
        .select('*, profiles(username, avatar_url)')
        .eq('spot_id', spotId)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('spot_ratings')
        .select('avg_rating, review_count')
        .eq('spot_id', spotId)
        .maybeSingle(),
    ]);
    setReviews((revData ?? []) as Review[]);
    setRating(ratingData as SpotRating | null);
    setLoading(false);
  }, [spotId]);

  useEffect(() => { fetch(); }, [fetch]);

  const submit = async (userId: string, rating: number, comment: string): Promise<'ok' | 'error'> => {
    if (!supabase) return 'error';
    const { error } = await supabase
      .from('reviews')
      .insert({ user_id: userId, spot_id: spotId, rating, comment });
    if (error) return 'error';
    await fetch();
    return 'ok';
  };

  const report = async (reviewId: string, reporterId: string): Promise<void> => {
    if (!supabase) return;
    await supabase.from('reports').insert({ review_id: reviewId, reporter_id: reporterId, reason: 'user_report' });
  };

  return { reviews, rating, loading, submit, report, isConfigured };
}
