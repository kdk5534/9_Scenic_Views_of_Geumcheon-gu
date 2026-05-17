import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Lang, View } from '@/types';

interface Props {
  lang: Lang;
  setView: (v: View) => void;
}

const TAB_LABELS: Record<Lang, [string, string]> = {
  ko: ['개인정보처리방침', '이용약관'],
  en: ['Privacy Policy', 'Terms of Service'],
  zh: ['隐私政策', '服务条款'],
  ja: ['プライバシーポリシー', '利用規約'],
};

const BACK_LABEL: Record<Lang, string> = {
  ko: '홈으로',
  en: 'Back',
  zh: '返回',
  ja: '戻る',
};

function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
      <section>
        <h3 className="font-bold text-on-surface mb-2">1. 수집하는 개인정보</h3>
        <p>본 서비스는 다음 정보를 수집합니다:</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li><strong>로컬 저장 데이터</strong>: 즐겨찾기, 방문 도장, 퀴즈 결과 (기기 내 localStorage에만 저장, 서버 미전송)</li>
          <li><strong>위치 정보</strong>: 방문 인증 시 일시적으로 수집, 인증 완료 후 즉시 파기 (서버 미전송)</li>
          <li><strong>소셜 로그인 시</strong>: 이메일, 프로필 사진(Supabase Auth를 통한 Google OAuth)</li>
          <li><strong>리뷰 작성 시</strong>: 별점, 텍스트 내용 (Supabase에 저장)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">2. 개인정보 이용 목적</h3>
        <ul className="list-disc ml-4 space-y-1">
          <li>방문 인증 및 도장깨기 서비스 제공</li>
          <li>사용자 맞춤 추천 서비스 개선</li>
          <li>리뷰 등록 및 관리</li>
          <li>서비스 품질 개선을 위한 익명 통계 분석 (Vercel Analytics)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">3. 보유 및 이용 기간</h3>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>로컬 데이터</strong>: 사용자가 브라우저 데이터를 삭제할 때까지</li>
          <li><strong>계정 데이터</strong>: 탈퇴 요청 후 30일 이내 삭제</li>
          <li><strong>리뷰 데이터</strong>: 서비스 종료 시 또는 삭제 요청 시까지</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">4. 제3자 제공</h3>
        <p>수집된 개인정보는 원칙적으로 제3자에게 제공하지 않습니다. 다만, 서비스 운영을 위해 다음 업체를 활용합니다:</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li><strong>Supabase</strong>: 사용자 인증 및 리뷰 데이터 저장 (미국 소재)</li>
          <li><strong>Vercel</strong>: 서비스 호스팅 및 익명 방문 통계</li>
          <li><strong>Open-Meteo</strong>: 날씨 정보 API (개인정보 미전송)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">5. 이용자 권리</h3>
        <p>이용자는 언제든지 개인정보 조회, 수정, 삭제를 요청할 수 있습니다.</p>
        <p className="mt-1">문의: <a href="mailto:kdk5534@gmail.com" className="text-primary underline">kdk5534@gmail.com</a></p>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">6. 쿠키 및 로컬스토리지</h3>
        <p>본 서비스는 별도 쿠키를 사용하지 않으며, 기기 내 localStorage를 통해 사용자 설정과 기록을 저장합니다. 이 데이터는 서버로 전송되지 않습니다.</p>
      </section>

      <p className="text-xs text-outline pt-4 border-t border-outline-variant">시행일: 2026년 5월 17일</p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
      <section>
        <h3 className="font-bold text-on-surface mb-2">제1조 (목적)</h3>
        <p>본 약관은 금천 9경 가이드 앱(이하 "서비스")의 이용 조건 및 절차, 이용자와 운영자의 권리·의무에 관한 사항을 규정합니다.</p>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">제2조 (서비스 내용)</h3>
        <p>서비스는 다음을 제공합니다:</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>금천구 9개 경관 명소 정보 제공</li>
          <li>맞춤형 명소 추천</li>
          <li>GPS 기반 방문 인증 (도장깨기)</li>
          <li>다국어 오디오 가이드 (Web Speech API)</li>
          <li>명소별 퀴즈 및 배지 수집</li>
          <li>이용자 리뷰 작성 (로그인 필요)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">제3조 (이용자 의무)</h3>
        <ul className="list-disc ml-4 space-y-1">
          <li>타인의 권리를 침해하는 리뷰 또는 콘텐츠를 등록하지 않아야 합니다.</li>
          <li>허위 정보 또는 욕설을 포함한 콘텐츠를 등록하지 않아야 합니다.</li>
          <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">제4조 (서비스 변경 및 중단)</h3>
        <p>운영자는 서비스의 내용을 변경하거나 중단할 수 있으며, 이로 인한 손해에 대해 책임지지 않습니다. 중요한 변경이 있을 경우 서비스 내 공지를 통해 안내합니다.</p>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">제5조 (면책 조항)</h3>
        <ul className="list-disc ml-4 space-y-1">
          <li>본 서비스는 금천구청의 공식 서비스가 아닙니다.</li>
          <li>명소 정보(운영시간, 입장료 등)는 변동될 수 있으며, 방문 전 공식 채널을 통한 확인을 권장합니다.</li>
          <li>날씨 정보는 Open-Meteo API 제공 데이터이며, 정확성을 보장하지 않습니다.</li>
          <li>GPS 기반 위치 인증의 오차로 인한 불편에 대해 책임지지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-on-surface mb-2">제6조 (준거법)</h3>
        <p>본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 운영자 주소지 관할 법원을 제1심 관할로 합니다.</p>
      </section>

      <p className="text-xs text-outline pt-4 border-t border-outline-variant">시행일: 2026년 5월 17일</p>
    </div>
  );
}

export default function LegalPage({ lang, setView }: Props) {
  const [tab, setTab] = useState<0 | 1>(0);
  const tabs = TAB_LABELS[lang];

  return (
    <motion.div
      key="legal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 pt-8 pb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setView('home')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-variant/40 transition-colors"
          aria-label={BACK_LABEL[lang]}
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <h2 className="text-xl font-bold text-primary">{tabs[tab]}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-surface-container-low rounded-2xl p-1">
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => setTab(i as 0 | 1)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === i ? 'bg-background text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 ? <PrivacyContent /> : <TermsContent />}
    </motion.div>
  );
}
