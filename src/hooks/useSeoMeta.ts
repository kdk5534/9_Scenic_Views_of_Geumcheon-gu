import { useEffect } from 'react';
import { Lang, View, Spot } from '@/types';
import { getLocalized } from '@/i18n';

const BASE_TITLE = '금천 9경 가이드';
const BASE_DESC = '금천구의 아름다운 9개 명소를 탐방하는 스마트 가이드. 추천 코스, 지도, 스탬프 투어를 즐겨보세요.';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setJsonLd(data: object) {
  let el = document.getElementById('json-ld') as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = 'json-ld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSeoMeta(view: View, spot: Spot | null, lang: Lang) {
  useEffect(() => {
    if (view === 'detail' && spot) {
      const name = getLocalized(spot as any, 'name', lang) as string;
      const desc = getLocalized(spot as any, 'story', lang) as string;
      document.title = `${name} · ${BASE_TITLE}`;
      setMeta('description', desc.slice(0, 160));
      setMeta('og:title', `${name} · ${BASE_TITLE}`, 'property');
      setMeta('og:description', desc.slice(0, 200), 'property');
      setMeta('og:image', `${window.location.origin}${spot.image}`, 'property');
      setMeta('og:url', window.location.href, 'property');

      // Schema.org TouristAttraction
      setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name,
        description: desc,
        url: window.location.href,
        image: `${window.location.origin}${spot.image}`,
        address: { '@type': 'PostalAddress', addressLocality: '서울특별시 금천구', addressCountry: 'KR' },
        geo: { '@type': 'GeoCoordinates', latitude: spot.lat, longitude: spot.lng },
        touristType: spot.categories.join(', '),
      });
    } else {
      document.title = BASE_TITLE;
      setMeta('description', BASE_DESC);
      setMeta('og:title', BASE_TITLE, 'property');
      setMeta('og:description', BASE_DESC, 'property');
      setMeta('og:image', `${window.location.origin}/spot1.jpg`, 'property');
      setMeta('og:url', window.location.origin, 'property');
      setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BASE_TITLE,
        url: window.location.origin,
        description: BASE_DESC,
        inLanguage: ['ko', 'en', 'zh', 'ja'],
      });
    }
  }, [view, spot, lang]);
}
