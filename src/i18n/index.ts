import { Lang } from '@/types';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export const translations = { ko, en, zh, ja };

export type Translation = typeof ko;

export const getLocalized = (obj: Record<string, any>, key: string, lang: Lang): any => {
  if (lang === 'ko') return obj[key];
  return obj[`${key}_${lang}`] ?? obj[key];
};

export { ko, en, zh, ja };
