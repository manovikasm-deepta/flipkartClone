import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { label: 'For You',     slug: '',             icon: '⭐' },
  { label: 'Mobiles',     slug: 'mobiles',      icon: '📱' },
  { label: 'Electronics', slug: 'electronics',  icon: '💻' },
  { label: 'Fashion',     slug: 'fashion',      icon: '👗' },
  { label: 'Beauty',      slug: 'beauty',       icon: '💄' },
  { label: 'Appliances',  slug: 'appliances',   icon: '🏠' },
  { label: 'Furniture',   slug: 'furniture',    icon: '🪑' },
  { label: 'Books',       slug: 'books',        icon: '📚' },
  { label: 'Toys',        slug: 'toys',         icon: '🎮' },
  { label: 'Sports',      slug: 'sports',       icon: '⚽' },
  { label: 'Grocery',     slug: 'grocery',      icon: '🛒' },
  { label: 'Jewellery',   slug: 'jewellery',    icon: '💍' },
  { label: 'Travel',      slug: 'travel',       icon: '✈️' },
  { label: 'Offers',      slug: 'offers',       icon: '🏷️' },
];

export default function CategoryTiles() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: 'var(--fk-shadow-sm)',
      padding: '12px 0 6px',
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 0,
        scrollbarWidth: 'none',
        padding: '0 8px',
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => navigate(cat.slug ? `/products?category=${cat.slug}` : '/products')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px 12px',
              minWidth: 80,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: 4,
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <span style={{ fontSize: 32, lineHeight: 1, display: 'flex', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
              {cat.icon}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--fk-text-primary)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
