import { Link, useNavigate } from 'react-router-dom';
import { Heart }             from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist }    from '@/store/slices/wishlistSlice';
import { useAuth }           from '@/hooks/useAuth';
import toast                 from 'react-hot-toast';
import styles                from './ProductCard.module.css';

const inr = (n) =>
  Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function ProductCard({ product, showWishlist = true }) {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const { isLoggedIn } = useAuth();
  const productIds   = useSelector((s) => s.wishlist.productIds);
  const isWishlisted = productIds.includes(product.id);

  async function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please login to save items'); navigate('/login'); return; }
    const res = await dispatch(toggleWishlist(product.id));
    if (toggleWishlist.fulfilled.match(res)) {
      toast(res.payload.action === 'added' ? 'Saved to wishlist' : 'Removed from wishlist');
    }
  }

  const hasDiscount   = product.discountPct > 0 && product.mrp > product.sellingPrice;
  const reviewFormatted = product.reviewCount
    ? Number(product.reviewCount).toLocaleString('en-IN')
    : null;

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      {/* ── Image ──────────────────────────────────── */}
      <div className={styles.imageWrap}>
        <img
          src={product.thumbnail || `https://picsum.photos/seed/${product.slug || product.id}/400/400`}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />

        {!product.inStock && (
          <div className={styles.outOfStock}>Out of Stock</div>
        )}

        {/* Rating badge — bottom left of image */}
        {product.rating > 0 && (
          <div className={styles.ratingBadge}>
            <span>{Number(product.rating).toFixed(1)}</span>
            <span className={styles.star}>★</span>
            {reviewFormatted && (
              <>
                <span className={styles.ratingDivider}>|</span>
                <span>{reviewFormatted}</span>
              </>
            )}
          </div>
        )}

        {/* Wishlist heart */}
        {showWishlist && (
          <button className={styles.wishlistBtn} onClick={handleWishlist} aria-label="Toggle wishlist">
            <Heart
              size={16}
              className={isWishlisted ? styles.heartFilled : styles.heartEmpty}
            />
          </button>
        )}

        {/* Flipkart Assured badge */}
        {product.badge?.toLowerCase().includes('assured') && (
          <img
            src="https://static-assets-web.flixcart.com/apex-static/images/logos/fk-plus-logo.png"
            alt="Flipkart Assured"
            className={styles.assuredBadge}
          />
        )}
      </div>

      {/* ── Body ───────────────────────────────────── */}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.priceRow}>
          <span className={styles.sellingPrice}>{inr(product.sellingPrice)}</span>
          {hasDiscount && (
            <>
              <span className={styles.mrp}>{inr(product.mrp)}</span>
              <span className={styles.discount}>{Math.round(product.discountPct)}% off</span>
            </>
          )}
        </div>

        <p className={styles.upiOffer}>with UPI offer + more</p>
      </div>
    </Link>
  );
}
