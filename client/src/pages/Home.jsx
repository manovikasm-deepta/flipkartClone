import HeroBanner       from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <HeroBanner />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <FeaturedProducts />
      </div>
    </div>
  );
}
