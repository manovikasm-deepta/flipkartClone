import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';

export default function FeaturedProducts() {
  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    productService.getFeatured()
      .then((r) => setSections(r.data?.sections || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader variant="card" count={10} />;

  return (
    <>
      {sections.map((section) => (
        <section key={section.slug} style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', padding: '16px 16px 4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fk-text-primary)' }}>{section.title}</h2>
            <Link
              to={`/products?category=${section.slug}`}
              style={{ background: 'var(--fk-blue)', color: '#fff', padding: '8px 20px', borderRadius: 4, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
            >
              VIEW ALL →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
            {section.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
