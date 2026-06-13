import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const CATEGORY_CONFIG = {
  fashion: {
    name: 'Fashion',
    tagline: 'Up to 80% Off on Top Brands',
    accent: '#c2185b',
    subs: ['Tops & T-Shirts', 'Jeans', 'Dresses', 'Footwear', 'Accessories', 'Kurtas & Suits', 'Sarees', 'Men Shirts', 'Sports Wear', 'Ethnic Wear'],
    sections: ['Trending Now', 'Top Brands', 'New Arrivals'],
  },
  mobiles: {
    name: 'Mobiles',
    tagline: 'Best Smartphones at Best Prices',
    accent: '#1565c0',
    subs: ['Smartphones', 'Budget Phones', 'Mid-Range', 'Flagship', 'iPhones', 'Chargers', 'Cases & Covers', 'Screen Guards', 'Power Banks'],
    sections: ['Best Sellers', 'Top Brands', 'Premium Picks'],
  },
  electronics: {
    name: 'Electronics',
    tagline: 'Latest Gadgets at Unbeatable Prices',
    accent: '#283593',
    subs: ['Laptops', 'Headphones', 'Cameras', 'Speakers', 'Smart Watches', 'Keyboards', 'Monitors', 'Tablets'],
    sections: ['Top Picks', 'Top Brands', 'Gaming Gear'],
  },
  beauty: {
    name: 'Beauty',
    tagline: 'Skincare, Haircare & More',
    accent: '#e65100',
    subs: ['Skincare', 'Haircare', 'Fragrances', 'Makeup', 'Nail Care', 'Men Grooming', 'Sunscreen', 'Serums'],
    sections: ['Bestsellers', 'Top Brands', 'Skin Essentials'],
  },
  'home-kitchen': {
    name: 'Home & Kitchen',
    tagline: 'Make Your Home Beautiful',
    accent: '#e65100',
    subs: ['Bedding', 'Kitchen Tools', 'Decor', 'Storage', 'Lighting', 'Curtains', 'Cushions', 'Wall Art'],
    sections: ['Home Essentials', 'Top Brands', 'Room Decor'],
  },
  appliances: {
    name: 'Appliances',
    tagline: 'Top Brands · Best Offers',
    accent: '#00838f',
    subs: ['TVs', 'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Microwaves', 'Chimneys', 'Fans', 'Geysers'],
    sections: ['Bestsellers', 'Top Brands', 'Premium Range'],
  },
  sports: {
    name: 'Sports & Fitness',
    tagline: 'Gear Up for Your Active Life',
    accent: '#2e7d32',
    subs: ['Exercise Equipment', 'Yoga', 'Cricket', 'Football', 'Badminton', 'Running Shoes', 'Sportswear', 'Cycles'],
    sections: ['Top Picks', 'Top Brands', 'Outdoor Sports'],
  },
  books: {
    name: 'Books & Media',
    tagline: 'Explore Worlds Through Books',
    accent: '#6a1b9a',
    subs: ['Fiction', 'Non-Fiction', 'Self Help', 'Children', 'Academic', 'Comics', 'Biographies', 'eBooks'],
    sections: ['Bestsellers', 'Top Brands', 'Award Winners'],
  },
};

const FALLBACK_CONFIG = {
  name: 'Products',
  tagline: 'Best Deals for You',
  accent: '#2874f0',
  subs: [],
  sections: ['All Products'],
};

const BRAND_GRADIENTS = [
  'linear-gradient(135deg, #FFF176 0%, #FFD54F 100%)',
  'linear-gradient(135deg, #FFCC80 0%, #FF8A65 100%)',
  'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)',
  'linear-gradient(135deg, #90CAF9 0%, #42A5F5 100%)',
  'linear-gradient(135deg, #F48FB1 0%, #EC407A 100%)',
  'linear-gradient(135deg, #CE93D8 0%, #AB47BC 100%)',
];

export default function CategoryHomePage({ category }) {
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

  // Build brand map: first product per brand
  const brandMap = {};
  for (const p of products) {
    if (p.brand && !brandMap[p.brand]) brandMap[p.brand] = p;
  }
  const brandList = Object.entries(brandMap); // [[name, product], ...]

  // Split products into chunks of 5 for non-brand sections
  const nonBrandProducts = products;
  const chunks = [];
  for (let i = 0; i < nonBrandProducts.length; i += 5) {
    chunks.push(nonBrandProducts.slice(i, i + 5));
  }
  if (chunks.length > 1 && chunks[chunks.length - 1].length < 3) {
    const tail = chunks.pop();
    chunks[chunks.length - 1] = [...chunks[chunks.length - 1], ...tail];
  }

  const sections = config.sections?.length ? config.sections : [config.name];
  // brand section index — skip its chunk slot when assigning chunks to other sections
  const brandSectionIdx = sections.indexOf('Top Brands');

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 12px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ background: '#fff', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, borderRadius: 4 }}>
            <SkeletonLoader variant="card" count={5} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ background: '#fff', padding: 40, textAlign: 'center', borderRadius: 4 }}>
            <p style={{ color: '#878787', marginBottom: 16 }}>No products found in this category.</p>
            <Link to="/products" style={{ color: '#2874f0', fontWeight: 600, textDecoration: 'none' }}>
              Browse All Products →
            </Link>
          </div>
        ) : (
          sections.map((sectionTitle, i) => {
            const isBrandSection = sectionTitle === 'Top Brands' && brandList.length > 0;
            // chunk index: brand section consumes no chunk slot; sections after brand shift back by 1
            const chunkIdx = isBrandSection ? -1 : (brandSectionIdx >= 0 && i > brandSectionIdx ? i - 1 : i);
            const chunk = chunkIdx >= 0 ? (chunks[chunkIdx] || chunks[chunks.length - 1] || []) : [];

            return (
              <div key={i} style={{ background: '#fff', borderRadius: 4, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  <h2 style={{ color: '#212121', fontWeight: 700, fontSize: 20, margin: 0 }}>
                    {sectionTitle}
                  </h2>
                  <Link
                    to={`/products?category=${category}`}
                    style={{ color: '#2874f0', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                  >
                    VIEW ALL →
                  </Link>
                </div>

                {isBrandSection ? (
                  /* ── Brand cards grid ── */
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(brandList.length, 3)}, 1fr)`,
                    gap: 12,
                    padding: 16,
                  }}>
                    {brandList.slice(0, 6).map(([brandName, product], bi) => (
                      <Link
                        key={brandName}
                        to={`/products?category=${category}&brand=${encodeURIComponent(brandName)}`}
                        style={{
                          background: BRAND_GRADIENTS[bi % BRAND_GRADIENTS.length],
                          borderRadius: 10,
                          padding: '16px 14px 0',
                          minHeight: 160,
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          textDecoration: 'none',
                        }}
                      >
                        {/* Brand name pill */}
                        <span style={{
                          background: 'rgba(255,255,255,0.9)',
                          borderRadius: 20,
                          padding: '4px 14px',
                          display: 'inline-block',
                          width: 'fit-content',
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#212121',
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          marginBottom: 10,
                        }}>
                          {brandName}
                        </span>

                        {/* Offer text */}
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#212121', lineHeight: 1.15, paddingBottom: 100 }}>
                          Up to {Math.round(product.discountPct || 20)}%<br />Off
                        </div>

                        {/* Product image */}
                        <img
                          src={product.thumbnail || `https://picsum.photos/seed/${product.id}/90`}
                          alt={brandName}
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/90`; }}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 8,
                            width: 100,
                            height: 100,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                          }}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* ── Regular product grid ── */
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(chunk.length, 5)}, 1fr)`,
                    gap: 12,
                    padding: '16px',
                  }}>
                    {chunk.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        cardStyle={{ background: `${config.accent}22`, border: `1px solid ${config.accent}55` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
