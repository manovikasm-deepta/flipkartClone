import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';

const CARD_WIDTH = 228;
const SCROLL_AMOUNT = CARD_WIDTH * 4;

export default function HorizontalScrollSection({ title = 'You May Also Like', products = [], viewAllHref = '/products', color = '#2874f0' }) {
  const scrollRef = useRef(null);

  if (!products.length) return null;

  const cardBg     = `${color}22`;
  const cardBorder = `${color}55`;

  function slide(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' });
    }
  }

  const btnStyle = {
    width: 28, height: 28,
    border: '1px solid #e0e0e0',
    borderRadius: '50%',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
      {/* Header — arrows in header, not floating on sides */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, color: '#212121', margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to={viewAllHref} style={{ fontSize: 13, color: '#2874f0', fontWeight: 700, textDecoration: 'none' }}>
            VIEW ALL →
          </Link>
          <button onClick={() => slide(-1)} style={btnStyle} aria-label="Scroll left">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => slide(1)} style={btnStyle} aria-label="Scroll right">
            <ChevronRight size={14} />
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
          gap: 12,
          padding: '12px 16px',
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{ width: CARD_WIDTH, flexShrink: 0, scrollSnapAlign: 'start' }}
          >
            <ProductCard product={p} cardStyle={{ background: cardBg, border: `1px solid ${cardBorder}` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
