import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import { Lang } from '@/types';

interface FaqItem {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
  keywords: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    keywords: ['비', '우천', '실내', 'rain', 'indoor', '室内', '雨', '室内', '雨'],
    q: { ko: '비 오는 날 갈 만한 곳은?', en: 'Where to go on a rainy day?', zh: '下雨天去哪里好？', ja: '雨の日はどこがおすすめ？' },
    a: { ko: '실내 명소인 금천뮤지컬센터(8경), 시흥행궁전시관(6경), 서서울미술관(9경), 순이의 집(5경)을 추천해요!', en: 'Try indoor spots: Geumcheon Musical Center (8th), Siheung Haenggung Hall (6th), West Seoul MoA (9th), or Sooni\'s House (5th)!', zh: '推荐室内景点：金川音乐剧中心（8景）、始兴行宫展示馆（6景）、西首尔美术馆（9景）、顺伊之家（5景）！', ja: '室内スポットをおすすめします：金川ミュージカルセンター(8景)、始興行宮展示館(6景)、西ソウル美術館(9景)、スニの家(5景)！' },
  },
  {
    keywords: ['야경', '밤', 'night', '夜景', '夜'],
    q: { ko: '야경 보기 좋은 곳은?', en: 'Best spots for night views?', zh: '哪里可以看夜景？', ja: '夜景のおすすめスポットは？' },
    a: { ko: '안양천 벚꽃길(2경)의 금천한내교 야경, 금천체육공원 전망대(4경), 금천폭포공원(7경)이 야경 명소예요!', en: 'Anyangcheon Bridge night view (2nd), Geumcheon Sports Park Observatory (4th), and Geumcheon Waterfall Park (7th) are great for night views!', zh: '安养川汉内桥夜景（2景）、金川体育公园观景台（4景）、金川瀑布公园（7景）是夜景名所！', ja: '安養川ハンネ橋の夜景(2景)、金川体育公園展望台(4景)、金川滝公園(7景)が夜景スポットです！' },
  },
  {
    keywords: ['어린이', '아이', '가족', 'child', 'family', '孩子', '家庭', '子供', '家族'],
    q: { ko: '아이와 함께 가기 좋은 곳은?', en: 'Good spots for kids and families?', zh: '适合带孩子去的地方？', ja: '子供連れにおすすめのスポットは？' },
    a: { ko: '오미생태공원(3경)은 자연 체험, 금천폭포공원(7경)은 여름 물놀이, 순이의 집(5경)은 역사 체험으로 아이들이 좋아해요!', en: 'Omi Ecological Park (3rd) for nature, Geumcheon Waterfall Park (7th) for summer water play, and Sooni\'s House (5th) for history!', zh: '五味生态公园（3景）体验自然，金川瀑布公园（7景）夏季戏水，顺伊之家（5景）历史体验，孩子们都很喜欢！', ja: '五味生態公園(3景)は自然体験、金川滝公園(7景)は夏の水遊び、スニの家(5景)は歴史体験で子供に人気！' },
  },
  {
    keywords: ['주차', '차', 'parking', '停车', '駐車'],
    q: { ko: '주차 가능한 곳은?', en: 'Where can I park?', zh: '哪里可以停车？', ja: '駐車できるところは？' },
    a: { ko: '호암산·호압사(1경), 오미생태공원(3경), 금천체육공원(4경), 서서울미술관(9경) 인근에 주차장이 있어요. 대중교통도 편리해요!', en: 'Parking is available near Hoamsan (1st), Omi Park (3rd), Sports Park (4th), and West Seoul MoA (9th). Public transport is also convenient!', zh: '虎岩山·虎压寺（1景）、五味生态公园（3景）、金川体育公园（4景）、西首尔美术馆（9景）附近有停车场，公共交通也很方便！', ja: '虎岩山(1景)、五味生態公園(3景)、体育公園(4景)、西ソウル美術館(9景)近くに駐車場があります。公共交通機関も便利です！' },
  },
  {
    keywords: ['무료', '입장료', '비용', 'free', 'fee', '免费', '無料'],
    q: { ko: '무료로 입장할 수 있는 곳은?', en: 'Which spots are free to enter?', zh: '哪些景点免费入场？', ja: '無料で入れるスポットは？' },
    a: { ko: '9경 모두 기본 무료예요! 금천뮤지컬센터(8경)는 공연에 따라 유료, 서서울미술관(9경)은 특별전이 유료일 수 있어요.', en: 'All 9 spots are free! Geumcheon Musical Center (8th) charges for performances, and West Seoul MoA (9th) may charge for special exhibitions.', zh: '9景全部基本免费！金川音乐剧中心（8景）演出收费，西首尔美术馆（9景）特别展可能收费。', ja: '9景すべて基本無料です！金川ミュージカルセンター(8景)は公演により有料、西ソウル美術館(9景)は特別展が有料の場合があります。' },
  },
  {
    keywords: ['봄', '벚꽃', 'spring', 'cherry', '春', '樱花', '桜'],
    q: { ko: '봄에 벚꽃 볼 수 있는 곳은?', en: 'Where to see cherry blossoms in spring?', zh: '春天去哪里看樱花？', ja: '春に桜が見られる場所は？' },
    a: { ko: '안양천 벚꽃길(2경)이 핵심이에요! 4km에 걸친 벚꽃십리길로 3월 말~4월 초가 절정입니다.', en: 'Anyangcheon Cherry Blossom Trail (2nd) is the highlight! 4km of cherry blossoms peak in late March to early April.', zh: '安养川樱花路（2景）是核心！4公里樱花十里路，3月底至4月初是最佳观赏期。', ja: '安養川桜並木道(2景)がハイライトです！4kmの桜道で3月末〜4月初旬が見ごろです。' },
  },
  {
    keywords: ['역사', 'history', '历史', '歴史'],
    q: { ko: '역사 관련 명소는 어디인가요?', en: 'Which spots have historical significance?', zh: '哪些景点与历史相关？', ja: '歴史に関連したスポットはどこですか？' },
    a: { ko: '호압사(1경, 조선 태조), 시흥행궁전시관(6경, 정조대왕 1795년 유숙지), 순이의 집(5경, 구로공단 여성노동자 역사)이 역사 명소예요!', en: 'Hoabsa Temple (1st, Joseon founder Taejo), Siheung Haenggung (6th, King Jeongjo\'s 1795 lodging), and Sooni\'s House (5th, Guro Industrial Complex history)!', zh: '虎压寺（1景，朝鲜太祖）、始兴行宫（6景，正祖1795年宿营地）、顺伊之家（5景，九老工团女工历史）是历史名所！', ja: 'ホアプサ(1景、朝鮮太祖)、始興行宮(6景、正祖1795年宿泊地)、スニの家(5景、九老工団の歴史)が歴史スポットです！' },
  },
  {
    keywords: ['도장', '인증', '스탬프', 'stamp', '印章', '스탬프'],
    q: { ko: '도장깨기는 어떻게 하나요?', en: 'How does the stamp rally work?', zh: '集章活动怎么玩？', ja: 'スタンプラリーはどうやるの？' },
    a: { ko: '각 명소에서 200m 이내에서 상세 페이지의 "방문 인증" 버튼을 누르면 도장이 찍혀요. GPS 위치 권한이 필요해요. 9개 모두 모으면 배지를 받아요!', en: 'At each spot, tap "Check In" on the detail page within 200m. GPS permission is required. Collect all 9 for a badge!', zh: '在每个景点200米范围内，点击详情页的"访问认证"按钮即可盖章。需要GPS位置权限。集齐9个即可获得徽章！', ja: '各スポットから200m以内で詳細ページの「訪問認証」ボタンをタップするとスタンプが押されます。GPS許可が必要です。9個集めるとバッジがもらえます！' },
  },
  {
    keywords: ['추천', '코스', 'recommend', 'course', '推荐', 'おすすめ'],
    q: { ko: 'AI 추천은 어떻게 받나요?', en: 'How do I get AI recommendations?', zh: '如何获得AI推荐？', ja: 'AIおすすめはどうもらえますか？' },
    a: { ko: '하단 탭에서 "추천"을 누르고 동행, 시간, 취향을 선택하면 맞춤형 코스 3개를 추천받을 수 있어요!', en: 'Tap "AI Rec" in the bottom tab, choose your companion, time, and preferences to get 3 personalized course recommendations!', zh: '点击底部标签中的"推荐"，选择同行人、时间和偏好，即可获得3条定制路线推荐！', ja: '下部タブの「おすすめ」をタップして、同行者・時間・好みを選ぶと、3つのカスタマイズコースが提案されます！' },
  },
  {
    keywords: ['화장실', '편의시설', 'restroom', 'toilet', '厕所', 'トイレ'],
    q: { ko: '화장실은 어디에 있나요?', en: 'Where are the restrooms?', zh: '厕所在哪里？', ja: 'トイレはどこにありますか？' },
    a: { ko: '모든 공원형 명소(안양천·오미공원·폭포공원·체육공원)에 공중화장실이 있어요. 실내 시설(미술관·뮤지컬센터 등)도 모두 갖추고 있어요.', en: 'All park spots (Anyangcheon, Omi Park, Waterfall Park, Sports Park) have public restrooms. Indoor facilities also have restrooms.', zh: '所有公园类景点（安养川、五味公园、瀑布公园、体育公园）都有公共厕所。室内设施也都配有卫生间。', ja: 'すべての公園型スポット(安養川・五味公園・滝公園・体育公園)に公衆トイレがあります。室内施設も完備しています。' },
  },
];

interface Props {
  lang: Lang;
}

export default function FaqWidget({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const LABELS = {
    ko: { title: '금천 도우미', sub: '자주 묻는 질문' },
    en: { title: 'Geumcheon Helper', sub: 'Frequently Asked Questions' },
    zh: { title: '金川助手', sub: '常见问题' },
    ja: { title: '衿川ヘルパー', sub: 'よくある質問' },
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-primary text-white rounded-full shadow-premium flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        aria-label="FAQ 도우미"
      >
        <MessageCircle size={22} />
      </button>

      {/* 슬라이드 패널 */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto z-50 bg-background rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-surface-variant">
                <div>
                  <p className="text-lg font-bold text-primary">{LABELS[lang].title}</p>
                  <p className="text-xs text-outline">{LABELS[lang].sub}</p>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* FAQ 리스트 */}
              <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
                {FAQ_ITEMS.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-outline-variant overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-container-low transition-colors"
                      onClick={() => setExpandedIdx(prev => prev === idx ? null : idx)}
                    >
                      <span className="text-sm font-semibold text-primary pr-2">{item.q[lang]}</span>
                      <ChevronDown
                        size={16}
                        className={`text-outline shrink-0 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedIdx === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-surface-variant">
                            {item.a[lang]}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
