import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const CDN = 'https://static-assets-web.flixcart.com/apex-static/images/svgs/L1Nav';

const CATEGORY_CONFIG = {
  fashion: {
    name: 'Fashion',
    tagline: 'Up to 80% Off on Top Brands',
    gradient: 'linear-gradient(120deg, #fce4ec 0%, #f8bbd0 60%, #fce4ec 100%)',
    accent: '#c2185b',
    icon: 'fashion',
    subs: ['Tops & T-Shirts', 'Jeans', 'Dresses', 'Footwear', 'Accessories', 'Kurtas & Suits', 'Sarees', 'Men Shirts', 'Sports Wear', 'Ethnic Wear'],
    sections: ['Trending Now', 'Top Brands', 'New Arrivals'],
  },
  mobiles: {
    name: 'Mobiles',
    tagline: 'Best Smartphones at Best Prices',
    gradient: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 60%, #e3f2fd 100%)',
    accent: '#1565c0',
    icon: 'mobiles',
    subs: ['Smartphones', 'Budget Phones', 'Mid-Range', 'Flagship', 'iPhones', 'Chargers', 'Cases & Covers', 'Screen Guards', 'Power Banks'],
    sections: ['Best Sellers', 'Under ₹15,000', 'Premium Picks'],
  },
  electronics: {
    name: 'Electronics',
    tagline: 'Latest Gadgets at Unbeatable Prices',
    gradient: 'linear-gradient(120deg, #e8eaf6 0%, #c5cae9 60%, #e8eaf6 100%)',
    accent: '#283593',
    icon: 'electronics',
    subs: ['Laptops', 'Headphones', 'Cameras', 'Speakers', 'Smart Watches', 'Keyboards', 'Monitors', 'Tablets'],
    sections: ['Top Picks', 'Work from Home', 'Gaming Gear'],
  },
  beauty: {
    name: 'Beauty',
    tagline: 'Skincare, Haircare & More',
    gradient: 'linear-gradient(120deg, #fdf6ec 0%, #ffe0b2 60%, #fdf6ec 100%)',
    accent: '#e65100',
    icon: 'beauty',
    subs: ['Skincare', 'Haircare', 'Fragrances', 'Makeup', 'Nail Care', 'Men Grooming', 'Sunscreen', 'Serums'],
    sections: ['Bestsellers', 'New Launches', 'Skin Essentials'],
  },
  'home-kitchen': {
    name: 'Home & Kitchen',
    tagline: 'Make Your Home Beautiful',
    gradient: 'linear-gradient(120deg, #fff3e0 0%, #ffe0b2 60%, #fff3e0 100%)',
    accent: '#e65100',
    icon: 'home-final',
    subs: ['Bedding', 'Kitchen Tools', 'Decor', 'Storage', 'Lighting', 'Curtains', 'Cushions', 'Wall Art'],
    sections: ['Home Essentials', 'Kitchen Must-Haves', 'Room Decor'],
  },
  appliances: {
    name: 'Appliances',
    tagline: 'Top Brands · Best Offers',
    gradient: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 60%, #e0f7fa 100%)',
    accent: '#00838f',
    icon: 'tv',
    subs: ['TVs', 'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Microwaves', 'Chimneys', 'Fans', 'Geysers'],
    sections: ['Bestsellers', 'Energy Efficient', 'Premium Range'],
  },
  sports: {
    name: 'Sports & Fitness',
    tagline: 'Gear Up for Your Active Life',
    gradient: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 60%, #e8f5e9 100%)',
    accent: '#2e7d32',
    icon: 'sport',
    subs: ['Exercise Equipment', 'Yoga', 'Cricket', 'Football', 'Badminton', 'Running Shoes', 'Sportswear', 'Cycles'],
    sections: ['Top Picks', 'Fitness Essentials', 'Outdoor Sports'],
  },
  books: {
    name: 'Books & Media',
    tagline: 'Explore Worlds Through Books',
    gradient: 'linear-gradient(120deg, #ede7f6 0%, #d1c4e9 60%, #ede7f6 100%)',
    accent: '#6a1b9a',
    icon: 'books',
    subs: ['Fiction', 'Non-Fiction', 'Self Help', 'Children', 'Academic', 'Comics', 'Biographies', 'eBooks'],
    sections: ['Bestsellers', 'New Arrivals', 'Award Winners'],
  },
};

const FALLBACK_CONFIG = {
  name: 'Products',
  tagline: 'Best Deals for You',
  gradient: 'linear-gradient(120deg, #f5f5f5 0%, #eeeeee 100%)',
  accent: '#2874f0',
  icon: 'all',
  subs: [],
  sections: ['All Products'],
};

export default function CategoryHomePage({ category }) {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[category] || { ...FALLBACK_CONFIG, name: category };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.list({ category, limit: 20, sort: 'rating_desc' })
      .then((r) => setProducts(r.data?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  const chunks = [];
  for (let i = 0; i < products.length; i += 5) {
    chunks.push(products.slice(i, i + 5));
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>

      {/* Category Banner */}
      <div style={{
        background: config.gradient,
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '24px 52px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <img
                src={`${CDN}/${config.icon}.svg`}
                alt={config.name}
                style={{ width: 44, height: 44, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h1 style={{ fontSize: 28, fontWeight: 800, color: config.accent, margin: 0 }}>
                {config.name}
              </h1>
            </div>
            <p style={{ fontSize: 16, color: '#555', margin: '0 0 16px', fontWeight: 500 }}>
              {config.tagline}
            </p>
            <Link
              to={`/products?category=${category}`}
              style={{
                display: 'inline-block',
                background: config.accent,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                padding: '8px 22px',
                borderRadius: 2,
                textDecoration: 'none',
              }}
            >
              Browse All →
            </Link>
          </div>
          <div style={{ fontSize: 80, lineHeight: 1, opacity: 0.15 }}>
            {config.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Sub-category chips */}
      {config.subs.length > 0 && (
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
            padding: '10px 16px', gap: 8,
          }}>
            {config.subs.map((sub) => (
              <button
                key={sub}
                onClick={() => navigate(`/products?category=${category}&search=${encodeURIComponent(sub)}`)}
                style={{
                  flexShrink: 0,
                  padding: '6px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 20,
                  background: '#fff',
                  fontSize: 13,
                  color: '#212121',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                  transition: 'all 0.12s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = config.accent;
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = config.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.color = '#212121';
                  e.target.style.borderColor = '#e0e0e0';
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product sections */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4px 0 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {loading ? (
          <div style={{ background: '#fff', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            <SkeletonLoader variant="card" count={5} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ background: '#fff', padding: 40, textAlign: 'center', borderRadius: 4 }}>
            <p style={{ color: '#878787', marginBottom: 16 }}>No products found in this category.</p>
            <Link
              to="/products"
              style={{ color: '#2874f0', fontWeight: 600, textDecoration: 'none' }}
            >
              Browse All Products →
            </Link>
          </div>
        ) : (
          chunks.map((chunk, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Section header */}
              <div style={{
                background: config.accent,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 54,
              }}>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 20, margin: 0 }}>
                  {config.sections?.[i] || config.name}
                </h2>
                <Link
                  to={`/products?category=${category}`}
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.18)',
                    borderRadius: 2,
                  }}
                >
                  VIEW ALL →
                </Link>
              </div>

              {/* Products grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(chunk.length, 5)}, 1fr)`,
                gap: 1,
                background: '#f0f0f0',
              }}>
                {chunk.map((p) => (
                  <div key={p.id} style={{ background: '#fff' }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
