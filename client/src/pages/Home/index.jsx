import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/api';
import HeroBanner from './components/HeroBanner';
import DealSection from './components/DealSection';
import HorizontalScrollSection from './components/HorizontalScrollSection';
import CategoryHomePage from './components/CategoryHomePage';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import styles from './Home.module.css';

const SECTION_COLORS = ['#2874f0', '#e65100', '#2e7d32'];

function DefaultHome() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    productService.getFeatured()
      .then((r) => setSections(r.data?.sections || []))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div className={styles.page}>
      <div className={styles.heroWrap}>
        <HeroBanner />
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.skeletonGrid}>
            <SkeletonLoader variant="card" count={8} />
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorBox}>
            <p style={{ color: 'var(--fk-text-secondary)', marginBottom: 12 }}>{error}</p>
            <button
              onClick={load}
              style={{
                background: 'var(--fk-blue)', color: '#fff', border: 'none',
                borderRadius: 4, padding: '8px 20px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && sections.map((section, i) => (
          <DealSection
            key={section.slug || i}
            title={section.title}
            color={SECTION_COLORS[i % SECTION_COLORS.length]}
            products={section.products}
            slug={section.slug}
          />
        ))}

        {!loading && !error && sections.length > 0 && (
          <HorizontalScrollSection
            title="You May Also Like"
            products={sections[sections.length - 1].products}
            viewAllHref={`/products?category=${sections[sections.length - 1].slug}`}
            color={SECTION_COLORS[sections.length % SECTION_COLORS.length]}
          />
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || null;

  return activeCategory
    ? <CategoryHomePage category={activeCategory} />
    : <DefaultHome />;
}
