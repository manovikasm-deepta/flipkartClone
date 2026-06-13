import { Link } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';

export default function DealSection({ title, color = '#2874f0', products = [], slug = '' }) {
  if (!products.length) return null;

  const cardBg     = `${color}22`;   // ~13% opacity tint
  const cardBorder = `${color}55`;   // ~33% opacity border

  return (
    <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #f0f0f0', overflow: 'hidden' }}>

      {/* Plain header — no background colour */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <h2 style={{ color: '#212121', fontWeight: 700, fontSize: 20, margin: 0 }}>
          {title}
        </h2>
        <Link
          to={`/products${slug ? `?category=${slug}` : ''}`}
          style={{ color: '#2874f0', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Products row — each card gets a light colour tint */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(products.length, 4)}, 1fr)`,
        gap: 12,
        padding: '16px',
      }}>
        {products.slice(0, 5).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            cardStyle={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          />
        ))}
      </div>
    </div>
  );
}
