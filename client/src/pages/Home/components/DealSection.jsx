import { Link } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';

function isLightColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0,2), 16);
  const g = parseInt(c.substring(2,4), 16);
  const b = parseInt(c.substring(4,6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

export default function DealSection({ title, color = '#2096ff', products = [], slug = '' }) {
  if (!products.length) return null;
  const light = isLightColor(color);
  const textColor = light ? '#212121' : '#fff';
  const viewAllBg = light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: 'var(--fk-shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{
        background: color,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{
          color: textColor,
          fontWeight: 800,
          fontSize: 22,
          margin: 0,
        }}>
          {title}
        </h2>
        <Link
          to={`/products${slug ? `?category=${slug}` : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: textColor,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            background: viewAllBg,
            padding: '6px 16px',
            borderRadius: 3,
            transition: 'background 0.15s',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}
        >
          View All →
        </Link>
      </div>

      {/* Product grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        background: 'var(--fk-border-light)',
      }}>
        {products.slice(0, 4).map((p) => (
          <div key={p.id} style={{ background: '#fff' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
