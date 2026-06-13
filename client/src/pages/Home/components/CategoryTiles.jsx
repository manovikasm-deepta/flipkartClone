import { useNavigate } from 'react-router-dom';

const CDN = 'https://static-assets-web.flixcart.com/apex-static/images/svgs/L1Nav';

const CATEGORIES = [
  { label: 'Mobiles',       slug: 'mobiles',       icon: 'mobiles'      },
  { label: 'Fashion',       slug: 'fashion',       icon: 'fashion'      },
  { label: 'Electronics',   slug: 'electronics',   icon: 'electronics'  },
  { label: 'Home',          slug: 'home-furniture', icon: 'home'        },
  { label: 'Beauty',        slug: 'beauty',        icon: 'beauty'       },
  { label: 'Books',         slug: 'books',         icon: 'books'        },
  { label: 'Sports',        slug: 'sports',        icon: 'sport'        },
  { label: 'Toys & Baby',   slug: 'toys',          icon: 'toy'          },
];

export default function CategoryTiles() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: 'var(--fk-shadow-sm)',
      padding: '16px 0 8px',
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        padding: '0 8px',
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '4px 20px 10px',
              minWidth: 86,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.querySelector('span').style.color = '#2874f0'; }}
            onMouseLeave={(e) => { e.currentTarget.querySelector('span').style.color = '#212121'; }}
          >
            <img
              src={`${CDN}/${cat.icon}.svg`}
              alt={cat.label}
              style={{ width: 64, height: 64, objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#212121',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
              transition: 'color 0.15s',
            }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
