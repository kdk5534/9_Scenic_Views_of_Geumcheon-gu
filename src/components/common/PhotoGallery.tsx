import { useRef, useState } from 'react';
import { SpotImage, Season } from '@/types';

const SEASON_LABEL: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  fall: '가을',
  winter: '겨울',
  night: '야경',
  all: '',
};

const SEASON_COLOR: Record<Season, string> = {
  spring: 'bg-pink-400',
  summer: 'bg-green-500',
  fall: 'bg-orange-500',
  winter: 'bg-blue-400',
  night: 'bg-indigo-700',
  all: 'bg-gray-400',
};

interface Props {
  images: SpotImage[];
  alt: string;
  className?: string;
}

export default function PhotoGallery({ images, alt, className = '' }: Props) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    setCurrent(i);
    scrollRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    const idx = Math.round(scrollRef.current.scrollLeft / w);
    setCurrent(idx);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar h-full"
        aria-label={alt}
        role="region"
      >
        {images.map((img, i) => (
          <div key={i} className="snap-center shrink-0 w-full h-full relative">
            <img
              src={img.src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {img.season && img.season !== 'all' && (
              <span className={`absolute top-3 left-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${SEASON_COLOR[img.season]}`}>
                {SEASON_LABEL[img.season]}
              </span>
            )}
            {img.credit && (
              <span className="absolute bottom-2 right-2 text-[9px] text-white/70 bg-black/30 px-1.5 py-0.5 rounded">
                © {img.credit}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators — only when > 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" aria-hidden="true">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${i === current ? 'bg-white w-4 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`}
              aria-label={`사진 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
