import { Star } from 'lucide-react';

export default function StarRating({ rating, reviewCount, showCount = true }) {
  const stars  = Math.round(rating * 2) / 2;
  const filled = Math.floor(stars);
  const half   = stars % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < filled
                ? 'text-amber-400 fill-amber-400'
                : i === filled && half
                ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300 fill-gray-100'
            }
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{Number(rating).toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-gray-400">
          ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
        </span>
      )}
    </div>
  );
}
