import { Lang } from '@/types';
import { useWeather } from '@/hooks/useWeather';

const LABEL: Record<Lang, string> = {
  ko: '금천구 현재 날씨',
  en: 'Geumcheon-gu Weather',
  zh: '衿川区当前天气',
  ja: '衿川区の現在の天気',
};

interface Props {
  lang: Lang;
}

export default function WeatherWidget({ lang }: Props) {
  const weather = useWeather(lang);
  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-2.5 text-sm">
      <span className="text-2xl leading-none" aria-hidden="true">{weather.emoji}</span>
      <div>
        <p className="text-[10px] text-outline font-bold">{LABEL[lang]}</p>
        <p className="font-bold text-on-surface">
          {weather.temp}°C
          <span className="ml-1 text-on-surface-variant font-normal">{weather.label}</span>
        </p>
      </div>
    </div>
  );
}
