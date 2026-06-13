import { useState, useEffect } from 'react';
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
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.css';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const { isLoggedIn } = useAuth();
  const productIds    = useSelector((s) => s.wishlist.productIds);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('description');
  const [qty, setQty]         = useState(1);

  useEffect(() => {
    setLoading(true);
    productService.getById(productId)
      .then((r) => setProduct(r.data))
      .catch(() => { toast.error('Product not found'); navigate('/products'); })
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

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
      <div className={styles.container}>
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
    </div>
  );
}
