import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { productService } from '@/services/api';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';
import ImageGrid from './components/ImageGrid';
import CTAButtons from './components/CTAButtons';
import SpecsTable from './components/SpecsTable';
import RatingStars from '@/components/common/RatingStars';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import ProductCard from '@/components/common/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.css';

const RECENT_KEY = 'fk_recently_viewed';
const MAX_RECENT = 8;

function saveRecentlyViewed(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const filtered = existing.filter((x) => x !== id);
    const updated  = [id, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (e) { /* ignore storage errors */ }
}

function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
}

const ROW_ARROW = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
  width: 32, height: 32, border: '1px solid #e0e0e0', borderRadius: '50%',
  background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function HorizontalProductRow({ title, products }) {
  const scrollRef = useRef(null);
  if (!products.length) return null;
  const CARD = 228;
  const btn = { width: 28, height: 28, border: '1px solid #e0e0e0', borderRadius: '50%', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, color: '#212121', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => scrollRef.current?.scrollBy({ left: -CARD * 3, behavior: 'smooth' })} style={btn} aria-label="Scroll left">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => scrollRef.current?.scrollBy({ left: CARD * 3, behavior: 'smooth' })} style={btn} aria-label="Scroll right">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', gap: 12, padding: '12px 16px', background: '#fff' }}>
        {products.map((p) => (
          <div key={p.id} style={{ width: CARD, flexShrink: 0 }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const { isLoggedIn } = useAuth();
  const productIds    = useSelector((s) => s.wishlist.productIds);

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('description');
  const [qty, setQty]                 = useState(1);
  const [similar, setSimilar]         = useState([]);
  const [recentProds, setRecentProds] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTab('description');
    productService.getById(productId)
      .then((r) => {
        const p = r.data;
        setProduct(p);
        saveRecentlyViewed(productId);

        // load similar products (same category, exclude self)
        if (p?.category?.slug) {
          productService.list({ category: p.category.slug, limit: 12, sort: 'rating_desc' })
            .then((res) => setSimilar((res.data?.items || []).filter((x) => x.id !== productId)))
            .catch(() => {});
        }

        // load recently viewed (from localStorage, excluding current)
        const recentIds = getRecentlyViewed().filter((id) => id !== productId);
        if (recentIds.length) {
          Promise.all(recentIds.slice(0, 6).map((id) => productService.getById(id).then((r2) => r2.data).catch(() => null)))
            .then((items) => setRecentProds(items.filter(Boolean)));
        }
      })
      .catch(() => { toast.error('Product not found'); navigate('/products'); })
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId, navigate]);

  async function handleWishlist() {
    if (!isLoggedIn) { toast.error('Please login to save items'); navigate('/login'); return; }
    const res = await dispatch(toggleWishlist(product.id));
    if (toggleWishlist.fulfilled.match(res)) {
      toast(res.payload.action === 'added' ? 'Saved to wishlist' : 'Removed from wishlist');
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '24px auto', padding: '0 16px' }}>
        <SkeletonLoader variant="detail" />
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = productIds.includes(product.id);

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ paddingBottom: 8 }}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span className={styles.breadSep}>/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </Link>
              <span className={styles.breadSep}>/</span>
            </>
          )}
          <span style={{ color: 'var(--fk-text-primary)' }}>
            {product.name.length > 60 ? `${product.name.slice(0, 60)}…` : product.name}
          </span>
        </nav>

        <div className={styles.layout}>
          {/* Left: Images */}
          <div className={styles.imageSection}>
            <ImageGrid
              images={product.images || []}
              thumbnail={product.thumbnail}
              productName={product.name}
              isWishlisted={isWishlisted}
              onWishlist={handleWishlist}
            />
          </div>

          {/* Right: Info */}
          <div className={styles.infoSection}>
            {product.brand && <p className={styles.brandName}>{product.brand}</p>}
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            {(product.rating > 0 || product.reviewCount > 0) && (
              <div className={styles.ratingRow}>
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className={styles.reviewText}>
                  {Number(product.reviewCount || 0).toLocaleString()} Ratings
                </span>
              </div>
            )}

            {/* Price */}
            <div className={styles.priceBlock}>
              {product.discountPct > 0 && (
                <div className={styles.discountBadge}>
                  ↓{Math.round(product.discountPct)}% off
                </div>
              )}
              <div className={styles.priceRow}>
                <span className={styles.sellingPrice}>{inr(product.sellingPrice)}</span>
                {product.mrp > product.sellingPrice && (
                  <span className={styles.mrp}>M.R.P. {inr(product.mrp)}</span>
                )}
              </div>
              <p className={styles.deliveryTag}>✓ Free Delivery</p>
            </div>

            {/* Quantity */}
            {product.inStock && (
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Quantity:</span>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <CTAButtons product={product} quantity={qty} />

            {/* Tabs */}
            <div className={styles.tabs}>
              {['description', 'specifications'].map((t) => (
                <button
                  key={t}
                  className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {tab === 'description' ? (
                <p>{product.description || 'No description available.'}</p>
              ) : (
                <SpecsTable specs={product.specifications} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
          <HorizontalProductRow title="Similar Products" products={similar} />
        </div>
      )}

      {/* Recently Viewed */}
      {recentProds.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 24px' }}>
          <HorizontalProductRow title="Recently Viewed" products={recentProds} />
        </div>
      )}
    </div>
  );
}
