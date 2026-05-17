import { useEffect, useState } from 'react';
import { Lang } from '@/types';

const LAT = 37.457;
const LNG = 126.9;
const CACHE_KEY = 'weather_cache_v1';
const CACHE_TTL = 3600 * 1000; // 1 hour

export interface WeatherData {
  temp: number;
  code: number;
  emoji: string;
  label: string;
}

// WMO weather interpretation codes → emoji + multilingual label
const WMO: Record<number, { emoji: string; ko: string; en: string; zh: string; ja: string }> = {
  0:  { emoji: '☀️', ko: '맑음', en: 'Clear', zh: '晴天', ja: '快晴' },
  1:  { emoji: '🌤', ko: '대체로 맑음', en: 'Mostly clear', zh: '大致晴', ja: 'ほぼ晴れ' },
  2:  { emoji: '⛅', ko: '구름 조금', en: 'Partly cloudy', zh: '多云', ja: '曇り時々晴れ' },
  3:  { emoji: '☁️', ko: '흐림', en: 'Overcast', zh: '阴天', ja: '曇り' },
  45: { emoji: '🌫', ko: '안개', en: 'Fog', zh: '雾', ja: '霧' },
  48: { emoji: '🌫', ko: '짙은 안개', en: 'Icy fog', zh: '浓雾', ja: '濃霧' },
  51: { emoji: '🌦', ko: '가는 이슬비', en: 'Light drizzle', zh: '毛毛雨', ja: '霧雨' },
  53: { emoji: '🌦', ko: '이슬비', en: 'Drizzle', zh: '细雨', ja: '小雨' },
  61: { emoji: '🌧', ko: '약한 비', en: 'Slight rain', zh: '小雨', ja: '小雨' },
  63: { emoji: '🌧', ko: '비', en: 'Rain', zh: '雨', ja: '雨' },
  65: { emoji: '🌧', ko: '강한 비', en: 'Heavy rain', zh: '大雨', ja: '大雨' },
  71: { emoji: '🌨', ko: '약한 눈', en: 'Slight snow', zh: '小雪', ja: '小雪' },
  73: { emoji: '❄️', ko: '눈', en: 'Snow', zh: '雪', ja: '雪' },
  80: { emoji: '🌦', ko: '소나기', en: 'Rain shower', zh: '阵雨', ja: 'にわか雨' },
  95: { emoji: '⛈', ko: '천둥번개', en: 'Thunderstorm', zh: '雷暴', ja: '雷雨' },
};

function resolveCode(code: number): typeof WMO[number] {
  if (WMO[code]) return WMO[code];
  // fallback to nearest lower key
  const keys = Object.keys(WMO).map(Number).sort((a, b) => b - a);
  const match = keys.find(k => k <= code);
  return WMO[match ?? 0];
}

export function useWeather(lang: Lang) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, d } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) { setData(d); return; }
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,weathercode&timezone=Asia%2FSeoul`;
    fetch(url)
      .then(r => r.json())
      .then(json => {
        const code: number = json.current?.weathercode ?? 0;
        const temp: number = Math.round(json.current?.temperature_2m ?? 0);
        const info = resolveCode(code);
        const d: WeatherData = { temp, code, emoji: info.emoji, label: info[lang] ?? info.ko };
        setData(d);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), d }));
      })
      .catch(() => {});
  }, [lang]);

  return data;
}
