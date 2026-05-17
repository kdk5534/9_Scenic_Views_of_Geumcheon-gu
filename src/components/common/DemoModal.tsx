import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';
import type { Lang } from '@/types';

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

export default function DemoModal({ open, onClose, lang }: DemoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-surface rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-outline hover:bg-surface-container rounded-full transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-on-surface mb-2">
                {lang === 'ko' ? '안내 말씀' : 'Notice'}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                {lang === 'ko'
                  ? "본 서비스는 '공공부문 AI 챔피언 및 거점리더 역량강화 교육' 과정의 최종 과제 제출용으로 개발된 데모 시스템입니다. 실제 상용 서비스가 아니오니 기능 체험과 둘러보기 용도로 편하게 이용해 주시기 바랍니다."
                  : "This service is a demo system developed for the final assignment submission of the 'Public Sector AI Champion and Hub Leader Capacity Building' course. It is not a commercial service, so please feel free to browse and experience its features."
                }
              </p>
              
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  {lang === 'ko' ? '확인했습니다' : 'I understand'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
