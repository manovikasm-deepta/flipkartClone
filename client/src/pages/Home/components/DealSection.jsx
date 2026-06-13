import { Link } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';

export default function DealSection({ title, color = '#2096ff', products = [], slug = '' }) {
  if (!products.length) return null;

  const isLight = (() => {
    const c = color.replace('#', '');
    const r = parseInt(c.substring(0,2), 16);
    const g = parseInt(c.substring(2,4), 16);
    const b = parseInt(c.substring(4,6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 170;
  })();

  const textColor = isLight ? '#212121' : '#fff';

  return (
    <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        background: color,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 54,
      }}>
        <h2 style={{ color: textColor, fontWeight: 700, fontSize: 20, margin: 0 }}>
          {title}
        </h2>
        <Link
          to={`/products${slug ? `?category=${slug}` : ''}`}
          style={{
            color: textColor,
            fontSize: 18,
            fontWeight: 700,
            textDecoration: 'none',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `2px solid ${textColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
          }}
        >
          →
        </Link>
      </div>

      {/* Products row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1,
        background: '#f0f0f0',
      }}>
        {products.slice(0, 5).map((p) => (
          <div key={p.id} style={{ background: '#fff' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
