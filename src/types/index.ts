export type Lang = 'ko' | 'en' | 'zh' | 'ja';
export type View = 'home' | 'recommend' | 'results' | 'list' | 'detail' | 'map' | 'favorites' | 'stamps' | 'route' | 'admin' | 'badges' | 'legal' | 'notfound';
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'night' | 'all';

export interface SpotImage {
  src: string;
  credit?: string;
  season?: Season;
}

export interface PoiItem {
  name: string;
  name_en?: string;
  name_zh?: string;
  name_ja?: string;
  type: 'restaurant' | 'cafe' | 'convenience' | 'parking' | 'restroom' | 'transport';
  lat: number;
  lng: number;
  kakaoUrl?: string;
}

export interface Recommendation {
  id: number;
  reason: string;
}

export interface Spot {
  id: number;
  name: string;
  name_en?: string;
  name_zh?: string;
  name_ja?: string;
  image: string;
  categories: string[];
  categories_en?: string[];
  categories_zh?: string[];
  categories_ja?: string[];
  recommendFor: string[];
  address: string;
  address_en?: string;
  address_zh?: string;
  address_ja?: string;
  hours: string;
  hours_en?: string;
  hours_zh?: string;
  hours_ja?: string;
  fee: string;
  fee_en?: string;
  fee_zh?: string;
  fee_ja?: string;
  transit: string;
  transit_en?: string;
  transit_zh?: string;
  transit_ja?: string;
  duration: string;
  duration_en?: string;
  duration_zh?: string;
  duration_ja?: string;
  highlights: string[];
  highlights_en?: string[];
  highlights_zh?: string[];
  highlights_ja?: string[];
  story: string;
  story_en?: string;
  story_zh?: string;
  story_ja?: string;
  lat: number;
  lng: number;
  closed_note?: string;
  images?: SpotImage[];
}
