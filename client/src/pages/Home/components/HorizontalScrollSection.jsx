import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';

const CARD_WIDTH = 190;
const SCROLL_AMOUNT = CARD_WIDTH * 4;

export default function HorizontalScrollSection({ title = 'You May Also Like', products = [], viewAllHref = '/products' }) {
  const scrollRef = useRef(null);

  if (!products.length) return null;

  function slide(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' });
    }
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: 'var(--fk-shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--fk-border-light)',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, color: 'var(--fk-text-primary)', margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to={viewAllHref} style={{ fontSize: 13, color: 'var(--fk-blue)', fontWeight: 600, textDecoration: 'none' }}>
            View All →
          </Link>
          <button
            onClick={() => slide(-1)}
            style={{
              width: 32, height: 32, border: '1px solid var(--fk-border)', borderRadius: 50,
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => slide(1)}
            style={{
              width: 32, height: 32, border: '1px solid var(--fk-border)', borderRadius: 50,
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          gap: 1,
          background: 'var(--fk-border-light)',
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              width: CARD_WIDTH,
              flexShrink: 0,
              scrollSnapAlign: 'start',
              background: '#fff',
            }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
