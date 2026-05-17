import { useCallback, useEffect, useRef, useState } from 'react';
import { Lang } from '@/types';

const LANG_CODE: Record<Lang, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

export function useSpeech(text: string, lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState<0.75 | 1 | 1.5>(1);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported) return;
    stop();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_CODE[lang];
    utter.rate = rate;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [text, lang, rate, stop, supported]);

  const cycleRate = useCallback(() => {
    setRate(r => (r === 1 ? 1.5 : r === 1.5 ? 0.75 : 1));
  }, []);

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  return { speak, stop, speaking, rate, cycleRate, supported };
}
