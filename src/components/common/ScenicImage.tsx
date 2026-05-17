import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  categories?: string[];
  fallbackSrc?: string;
  eager?: boolean; // set true for above-the-fold hero images
}

const getEmoji = (categories: string[]) => {
  const cats = categories.join(',');
  if (cats.includes('자연')) return '🏔️';
  if (cats.includes('역사')) return '🏛️';
  if (cats.includes('예술')) return '🎨';
  if (cats.includes('체험')) return '👣';
  return '📍';
};

export default function ScenicImage({ src, alt, className, categories = [], fallbackSrc, eager = false }: Props) {
  const [errorCount, setErrorCount] = useState(0);

  if (errorCount >= (fallbackSrc ? 2 : 1)) {
    return (
      <div className={`flex flex-col items-center justify-center bg-surface-container-high ${className}`}>
        <span className="text-4xl mb-2">{getEmoji(categories)}</span>
        <span className="text-[10px] text-outline px-2 text-center font-medium leading-tight">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={errorCount === 0 ? src : fallbackSrc}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setErrorCount(prev => prev + 1)}
    />
  );
}
