import { Spot, Lang, Recommendation } from '@/types';
import { translations } from '@/i18n';

export const WHO_VALUES = ['혼자', '연인', '가족', '친구'];
export const TIME_VALUES = ['1~2시간', '반나절', '하루 종일'];
export const PREF_VALUES = ['자연·산책', '역사·문화', '야경', '예술·공연', '체험·교육'];

// ─── 조합형 템플릿: intro + body + cta ─────────────────────────────────────
// 각 파트 10개 이상 → 1,000가지 이상 조합 가능

type TemplateParts = {
  intros: ((who: string, time: string) => string)[];
  bodies: ((spotName: string, prefs: string[]) => string)[];
  ctas: (() => string)[];
};

const PARTS: Record<Lang, TemplateParts> = {
  ko: {
    intros: [
      (w, t) => `${w}와(과) 함께하는 ${t} 코스로 안성맞춤입니다.`,
      (w, t) => `${t} 동안 ${w}과(와) 특별한 추억을 만들기 좋은 곳이에요.`,
      (w, t) => `${w} 여행자에게 딱 맞는 ${t} 일정입니다.`,
      (w, t) => `${t} 일정으로 ${w}과(와) 함께하면 더욱 특별해집니다.`,
      (w, t) => `금천구에서 ${w}과(와) ${t}을(를) 보내기 최고의 선택입니다.`,
      (w, t) => `${w} 방문객에게 강력 추천하는 ${t} 코스예요.`,
      (w, t) => `${t}을(를) 알차게 보내고 싶은 ${w}에게 딱입니다.`,
      (w, t) => `${w}과(와) 함께라면 ${t} 코스가 더욱 빛납니다.`,
      (w, t) => `${t} 여정을 시작하는 ${w}에게 꼭 추천드립니다.`,
      (w, t) => `${w} 방문 코스 중 ${t}에 어울리는 최고의 장소입니다.`,
    ],
    bodies: [
      (sn, p) => `${sn}은(는) ${p.join(', ')} 테마와 완벽하게 어울립니다.`,
      (sn, p) => `${p.join(', ')} 취향이라면 ${sn}을(를) 놓치지 마세요.`,
      (sn, p) => `${sn}에서 ${p.join(', ')}의 매력을 한껏 느껴보세요.`,
      (sn, p) => `${p.join(', ')}를 좋아하는 분이라면 ${sn}이(가) 최고입니다.`,
      (sn, p) => `${sn}은(는) ${p.join(', ')} 테마 명소 중 손꼽히는 곳입니다.`,
      (sn, p) => `${p.join(', ')} 경험을 원한다면 ${sn}이(가) 정답입니다.`,
      (sn, p) => `${sn}에서 ${p.join(', ')} 감성을 마음껏 즐겨보세요.`,
      (sn, p) => `${p.join(', ')} 테마를 좋아하신다면 ${sn}은(는) 필수 방문지입니다.`,
      (sn, p) => `${sn}은(는) ${p.join(', ')} 분야에서 금천구 대표 명소입니다.`,
      (sn, p) => `${p.join(', ')}의 묘미를 ${sn}에서 직접 경험해보세요.`,
    ],
    ctas: [
      () => `방문 전 운영시간을 꼭 확인하세요!`,
      () => `사진 찍기 좋은 포토 스팟도 가득합니다.`,
      () => `대중교통으로 편하게 오실 수 있어요.`,
      () => `계절마다 다른 매력이 있으니 여러 번 방문해보세요.`,
      () => `근처 맛집과 함께 일정을 짜보시면 더욱 좋습니다.`,
      () => `도장깨기 미션도 함께 즐겨보세요!`,
      () => `무료 입장이라 부담 없이 들를 수 있답니다.`,
      () => `날씨 좋은 날 방문하시면 더욱 만족스러울 거예요.`,
      () => `금천 9경 완주 배지 획득에 도전해보세요!`,
      () => `가이드와 함께라면 더 깊이 있는 여행이 될 거예요.`,
    ],
  },

  en: {
    intros: [
      (w, t) => `Perfect for a ${t} outing with your ${w}.`,
      (w, t) => `A great way to spend ${t} with your ${w} in Geumcheon-gu.`,
      (w, t) => `Ideal ${t} destination for ${w} visitors.`,
      (w, t) => `Make your ${t} unforgettable with your ${w}.`,
      (w, t) => `Top recommendation for ${w} travelers on a ${t} schedule.`,
      (w, t) => `Planning a ${t} trip with your ${w}? This is the spot.`,
      (w, t) => `For ${w} exploring Geumcheon-gu in ${t}, look no further.`,
      (w, t) => `A ${t} adventure with your ${w} starts here.`,
      (w, t) => `${w} visitors love this ${t} itinerary pick.`,
      (w, t) => `Maximize your ${t} in Geumcheon-gu with your ${w}.`,
    ],
    bodies: [
      (sn, p) => `${sn} perfectly matches your interest in ${p.join(', ')}.`,
      (sn, p) => `If you love ${p.join(', ')}, ${sn} is a must-visit.`,
      (sn, p) => `Experience the best of ${p.join(', ')} at ${sn}.`,
      (sn, p) => `${sn} is Geumcheon-gu's top spot for ${p.join(', ')}.`,
      (sn, p) => `${p.join(', ')} enthusiasts will fall in love with ${sn}.`,
      (sn, p) => `For an authentic ${p.join(', ')} experience, ${sn} delivers.`,
      (sn, p) => `${sn} stands out as a premier ${p.join(', ')} destination.`,
      (sn, p) => `Fans of ${p.join(', ')} consistently rate ${sn} as a highlight.`,
      (sn, p) => `${sn} captures the essence of ${p.join(', ')} in Geumcheon.`,
      (sn, p) => `Don't miss ${sn} if ${p.join(', ')} is on your list.`,
    ],
    ctas: [
      () => `Check operating hours before your visit!`,
      () => `Great photo opportunities await you there.`,
      () => `Easy to access by public transport.`,
      () => `Each season brings a different charm — come back often!`,
      () => `Pair it with nearby restaurants for a full day out.`,
      () => `Try the stamp rally challenge while you're there!`,
      () => `Free admission — no excuse not to visit!`,
      () => `Best enjoyed on a clear day.`,
      () => `Collect all 9 scenic spot badges!`,
      () => `A guided tour will make your visit even richer.`,
    ],
  },

  zh: {
    intros: [
      (w, t) => `非常适合和${w}共度${t}时光。`,
      (w, t) => `在金川区与${w}一起度过充实${t}的绝佳选择。`,
      (w, t) => `${w}旅行者的${t}行程首选。`,
      (w, t) => `和${w}一起，让${t}时光变得更加特别。`,
      (w, t) => `金川区${t}行程中，强烈推荐${w}游客前往。`,
      (w, t) => `计划${t}旅行的${w}，这里就是最佳目的地。`,
      (w, t) => `${w}游客探索金川区${t}旅程的不二之选。`,
      (w, t) => `与${w}共同开启${t}的精彩冒险。`,
      (w, t) => `${w}游客对这条${t}路线赞不绝口。`,
      (w, t) => `充分利用${t}时间，与${w}一起探索金川区。`,
    ],
    bodies: [
      (sn, p) => `${sn}与${p.join(', ')}主题完美契合。`,
      (sn, p) => `喜欢${p.join(', ')}的话，${sn}是必去之处。`,
      (sn, p) => `在${sn}尽情体验${p.join(', ')}的魅力。`,
      (sn, p) => `${sn}是金川区${p.join(', ')}类型的代表性景点。`,
      (sn, p) => `热衷于${p.join(', ')}的旅行者一定会爱上${sn}。`,
      (sn, p) => `想要体验正宗${p.join(', ')}氛围，${sn}是不错的选择。`,
      (sn, p) => `${sn}作为${p.join(', ')}目的地备受好评。`,
      (sn, p) => `${p.join(', ')}爱好者都将${sn}列为必访地点。`,
      (sn, p) => `${sn}完美诠释了金川的${p.join(', ')}特色。`,
      (sn, p) => `若您的清单上有${p.join(', ')}，千万别错过${sn}。`,
    ],
    ctas: [
      () => `参观前请确认营业时间！`,
      () => `这里有很多适合拍照的地点。`,
      () => `乘坐公共交通非常方便。`,
      () => `每个季节都有不同魅力，欢迎多次造访。`,
      () => `搭配附近美食，打造一日完美行程。`,
      () => `顺便挑战集章活动吧！`,
      () => `免费入场，随时都可以轻松前往。`,
      () => `天气晴朗时前往，体验更佳。`,
      () => `挑战集齐金川9景全部印章！`,
      () => `有导游带领，旅行将更加充实。`,
    ],
  },

  ja: {
    intros: [
      (w, t) => `${w}と一緒に${t}を過ごすのにぴったりです。`,
      (w, t) => `衿川区で${w}と充実した${t}を過ごす絶好の機会です。`,
      (w, t) => `${w}旅行者の${t}コースに強くおすすめします。`,
      (w, t) => `${w}と共に過ごす${t}が一層特別になります。`,
      (w, t) => `衿川区の${t}旅行で${w}に最もおすすめのスポットです。`,
      (w, t) => `${t}旅行を計画中の${w}に、まさにここがベストです。`,
      (w, t) => `${w}が衿川区を探索する${t}コースの決定版。`,
      (w, t) => `${w}との${t}の冒険をここから始めましょう。`,
      (w, t) => `${w}旅行者から高評価を集める${t}コースです。`,
      (w, t) => `${w}と共に衿川区の${t}を最大限楽しみましょう。`,
    ],
    bodies: [
      (sn, p) => `${sn}は${p.join(', ')}のテーマと完璧にマッチします。`,
      (sn, p) => `${p.join(', ')}がお好きなら、${sn}は外せません。`,
      (sn, p) => `${sn}で${p.join(', ')}の魅力を存分に体感してください。`,
      (sn, p) => `${sn}は衿川区を代表する${p.join(', ')}スポットです。`,
      (sn, p) => `${p.join(', ')}ファンなら必ず${sn}を気に入るはずです。`,
      (sn, p) => `本格的な${p.join(', ')}体験には${sn}が最適です。`,
      (sn, p) => `${sn}は${p.join(', ')}の目的地として高い評価を受けています。`,
      (sn, p) => `${p.join(', ')}愛好家が${sn}を必訪リストに挙げています。`,
      (sn, p) => `${sn}は衿川の${p.join(', ')}の魅力を凝縮した場所です。`,
      (sn, p) => `${p.join(', ')}に興味があるなら、${sn}をお見逃しなく。`,
    ],
    ctas: [
      () => `訪問前に営業時間をご確認ください！`,
      () => `素晴らしいフォトスポットが満載です。`,
      () => `公共交通機関でのアクセスも便利です。`,
      () => `季節ごとに異なる魅力があるので、ぜひ何度も訪れてみてください。`,
      () => `近くのグルメスポットと組み合わせて計画を立てると◎。`,
      () => `スタンプラリーチャレンジも一緒に楽しんでみましょう！`,
      () => `無料入場なので気軽に立ち寄れます。`,
      () => `晴れた日に訪れると、より満足度が高いですよ。`,
      () => `衿川9景コンプリートバッジを目指してみましょう！`,
      () => `ガイドと一緒だとより深い体験ができます。`,
    ],
  },
};

// ─── 계절·시간대 감지 ────────────────────────────────────────────────────────

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
};

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
};

// ─── 스코어링 ────────────────────────────────────────────────────────────────

const scoreSpot = (spot: Spot, who: string, time: string, prefs: string[]): number => {
  let score = 0;
  const season = getSeason();
  const tod = getTimeOfDay();

  if (spot.recommendFor?.includes(who)) score += 10;
  prefs.forEach(p => { if (spot.categories.includes(p)) score += 5; });
  if (spot.duration.includes(time.split(' ')[0])) score += 3;

  // 봄 + 안양천 벚꽃길
  if (season === 'spring' && spot.id === 2) score += 5;
  // 저녁/밤 + 야경 카테고리
  if ((tod === 'evening' || tod === 'night') && spot.categories.includes('야경')) score += 5;
  // 여름 + 자연 (시원한 곳)
  if (season === 'summer' && spot.categories.includes('자연·산책')) score += 2;
  // 가을 + 역사 (단풍+문화)
  if (season === 'autumn' && spot.categories.includes('역사·문화')) score += 2;

  return score;
};

// ─── 문장 조합기 ─────────────────────────────────────────────────────────────

const buildSentence = (lang: Lang, who: string, time: string, prefs: string[], spotName: string, seed: number): string => {
  const parts = PARTS[lang];
  const n = parts.intros.length;
  const i = seed % n;
  const j = (seed + 3) % parts.bodies.length;
  const k = (seed + 7) % parts.ctas.length;
  return `${parts.intros[i](who, time)} ${parts.bodies[j](spotName, prefs)} ${parts.ctas[k]()}`;
};

// ─── 공개 API ────────────────────────────────────────────────────────────────

export const buildRecommendations = (
  spots: Spot[],
  who: string,
  time: string,
  prefs: string[],
  lang: Lang,
): Recommendation[] => {
  const t = translations[lang];

  const localWho = t.whoItems[WHO_VALUES.indexOf(who)] ?? who;
  const localTime = t.timeItems[TIME_VALUES.indexOf(time)] ?? time;
  const localPrefs = prefs.map(p => t.prefItems[PREF_VALUES.indexOf(p)] ?? p);

  const scored = spots
    .map(spot => ({ spot, score: scoreSpot(spot, who, time, prefs) }))
    .sort((a, b) => b.score - a.score);

  // 상위 5개 중 변동성 있게 3개 선택 (매 호출마다 다른 조합)
  const top5 = scored.slice(0, 5);
  const jitter = Date.now() % top5.length;
  const shuffled = [...top5.slice(jitter), ...top5.slice(0, jitter)];
  const top3 = shuffled.slice(0, 3).sort((a, b) => b.score - a.score);

  // 문장 seed: 초 단위 → 분마다 새로운 조합
  const seed = Math.floor(Date.now() / 60000);

  return top3.map(({ spot }, idx) => {
    const spotName = (spot as any)[`name_${lang}`] ?? spot.name;
    return {
      id: spot.id,
      reason: buildSentence(lang, localWho, localTime, localPrefs, spotName, seed + idx),
    };
  });
};
