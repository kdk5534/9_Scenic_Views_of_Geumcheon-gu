import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const FAV_KEY = 'geumcheon_favorites';
const STAMP_KEY = 'geumcheon_stamps';
const SYNCED_KEY = 'cloud_synced_uid';

export function useCloudSync(user: User | null) {
  useEffect(() => {
    if (!supabase || !user) return;
    const alreadySynced = localStorage.getItem(SYNCED_KEY) === user.id;
    if (alreadySynced) return;

    const favIds: number[] = JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
    const stampIds: number[] = JSON.parse(localStorage.getItem(STAMP_KEY) ?? '[]');

    const upsertFavorites = favIds.map(spot_id =>
      supabase!.from('favorites').upsert({ user_id: user.id, spot_id })
    );
    const upsertStamps = stampIds.map(spot_id =>
      supabase!.from('stamps').upsert({ user_id: user.id, spot_id })
    );

    Promise.all([...upsertFavorites, ...upsertStamps])
      .then(() => localStorage.setItem(SYNCED_KEY, user.id))
      .catch(() => {});
  }, [user]);
}
