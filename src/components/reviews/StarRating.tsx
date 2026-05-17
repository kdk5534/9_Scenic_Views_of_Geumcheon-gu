import { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({ value, onChange, size = 20, readOnly = false }: Props) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5" role="group" aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          aria-label={`${n}점`}
          className={readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
        >
          <Star
            size={size}
            className={
              n <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-outline-variant'
            }
          />
        </button>
      ))}
    </div>
  );
}
