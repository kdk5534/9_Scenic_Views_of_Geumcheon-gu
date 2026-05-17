import { useMemo } from 'react';

export type BadgeId =
  | `quiz_${number}`       // quiz_1 ~ quiz_9: 각 명소 퀴즈 완료
  | 'quiz_all'             // 9경 퀴즈 전체 완료
  | 'quiz_perfect'         // 9경 퀴즈 전체 만점
  | 'stamp_all'            // 9경 도장 완주
  | 'season_spring'        // 봄: 안양천 도장 (3/25~4/15)
  | 'season_fall'          // 가을: 시흥행궁 도장 (10/25~11/20)
  | 'night_owl';           // 야경 3곳 도장 (2·4·7경)

export interface Badge {
  id: BadgeId;
  emoji: string;
  name: { ko: string; en: string; zh: string; ja: string };
  desc: { ko: string; en: string; zh: string; ja: string };
  unlocked: boolean;
}

function isSpring() {
  const d = new Date(); const m = d.getMonth() + 1; const day = d.getDate();
  return (m === 3 && day >= 25) || (m === 4 && day <= 15);
}
function isFall() {
  const d = new Date(); const m = d.getMonth() + 1; const day = d.getDate();
  return (m === 10 && day >= 25) || (m === 11 && day <= 20);
}

const NIGHT_VIEW_SPOTS = [2, 4, 7];

export function useBadges(
  stamps: number[],
  quizCompletedCount: number,
  quizPerfectCount: number,
  quizIsCompleted: (id: number) => boolean,
) {
  return useMemo<Badge[]>(() => {
    const stampSet = new Set(stamps);
    const allStamped = stamps.length === 9;
    const nightOwl = NIGHT_VIEW_SPOTS.every(id => stampSet.has(id));

    const badges: Badge[] = [
      // 명소별 퀴즈 배지 (9개)
      ...[1,2,3,4,5,6,7,8,9].map<Badge>(id => ({
        id: `quiz_${id}` as BadgeId,
        emoji: '🎓',
        name: { ko: `${id}경 퀴즈 완료`, en: `Spot ${id} Quiz`, zh: `第${id}景测验完成`, ja: `第${id}景クイズ完了` },
        desc: { ko: `${id}경 퀴즈를 완료했어요!`, en: `Completed Spot ${id} quiz!`, zh: `完成了第${id}景测验！`, ja: `第${id}景のクイズをクリア！` },
        unlocked: quizIsCompleted(id),
      })),
      // 전체 퀴즈 완료
      {
        id: 'quiz_all',
        emoji: '🏅',
        name: { ko: '9경 퀴즈 마스터', en: 'Quiz Master', zh: '测验大师', ja: 'クイズマスター' },
        desc: { ko: '9경 퀴즈를 모두 완료했어요!', en: 'Completed all 9 spot quizzes!', zh: '完成了全部9景测验！', ja: '全9景のクイズをクリア！' },
        unlocked: quizCompletedCount === 9,
      },
      // 전체 퀴즈 만점
      {
        id: 'quiz_perfect',
        emoji: '🌟',
        name: { ko: '퀴즈 퍼펙트', en: 'Quiz Perfect', zh: '测验全满分', ja: 'クイズパーフェクト' },
        desc: { ko: '9경 퀴즈 모두 만점!', en: 'Got perfect scores on all 9 quizzes!', zh: '所有9景测验满分！', ja: '全9景クイズで満点！' },
        unlocked: quizPerfectCount === 9,
      },
      // 도장 완주
      {
        id: 'stamp_all',
        emoji: '🏆',
        name: { ko: '금천 9경 완주', en: '9 Scenic Spots Complete', zh: '9景全程完成', ja: '9景完全制覇' },
        desc: { ko: '금천구 9경을 모두 방문했어요!', en: 'Visited all 9 scenic spots!', zh: '参观了全部9个景点！', ja: '9景すべてを訪問！' },
        unlocked: allStamped,
      },
      // 봄 시즌
      {
        id: 'season_spring',
        emoji: '🌸',
        name: { ko: '벚꽃 나들이', en: 'Cherry Blossom Walk', zh: '樱花踏青', ja: '桜散策' },
        desc: { ko: '벚꽃 시즌에 안양천을 방문했어요!', en: 'Visited Anyangcheon during cherry blossom season!', zh: '樱花季参观了安养川！', ja: '桜シーズンに安養川を訪問！' },
        unlocked: isSpring() && stampSet.has(2),
      },
      // 가을 시즌
      {
        id: 'season_fall',
        emoji: '🍂',
        name: { ko: '은행나무 단풍', en: 'Ginkgo Autumn', zh: '银杏秋叶', ja: '銀杏紅葉' },
        desc: { ko: '단풍 시즌에 시흥행궁을 방문했어요!', en: 'Visited Siheung Haenggung during autumn foliage!', zh: '红叶季参观了始兴行宫！', ja: '紅葉シーズンに始興行宮を訪問！' },
        unlocked: isFall() && stampSet.has(6),
      },
      // 야경 올빼미
      {
        id: 'night_owl',
        emoji: '🌃',
        name: { ko: '야경 올빼미', en: 'Night Owl', zh: '夜猫子', ja: '夜景フクロウ' },
        desc: { ko: '야경 명소 3곳(2·4·7경)을 모두 방문했어요!', en: 'Visited all 3 night view spots (2·4·7)!', zh: '参观了全部3个夜景景点(2·4·7景)！', ja: '夜景スポット3か所(2·4·7景)を全部訪問！' },
        unlocked: nightOwl,
      },
    ];

    return badges;
  }, [stamps, quizCompletedCount, quizPerfectCount, quizIsCompleted]);
}
