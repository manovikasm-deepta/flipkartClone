import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import Badge from '../Badge';
import PriceBlock from '../PriceBlock';
import RatingStars from '../RatingStars';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, showWishlist = true }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isLoggedIn } = useAuth();
  const productIds = useSelector((s) => s.wishlist.productIds);
  const isWishlisted = productIds.includes(product.id);

  async function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please login to save items'); navigate('/login'); return; }
    const res = await dispatch(toggleWishlist(product.id));
    if (toggleWishlist.fulfilled.match(res)) {
      toast(res.payload.action === 'added' ? 'Saved to wishlist' : 'Removed from wishlist');
    } else {
      toast.error('Something went wrong');
    }
  }

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please login to add to cart'); navigate('/login'); return; }
    const res = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(res)) toast.success('Added to cart');
    else toast.error(res.payload || 'Failed to add to cart');
  }

  const badge = product.badge ? product.badge.toLowerCase().replace(/\s+/g, '') : null;
  const badgeVariant =
    badge?.includes('bestsell') ? 'bestseller' :
    badge?.includes('hot')      ? 'hotdeal'    :
    badge?.includes('super')    ? 'superdeals' : 'default';

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {product.badge && (
          <div className={styles.badgeWrap}>
            <Badge text={product.badge} variant={badgeVariant} />
          </div>
        )}
        {showWishlist && (
          <button className={styles.wishlistBtn} onClick={handleWishlist} aria-label="Toggle wishlist">
            <Heart
              size={16}
              className={isWishlisted ? styles.heartFilled : styles.heartEmpty}
            />
          </button>
        )}
        <img
          src={product.thumbnail || `https://picsum.photos/seed/${product.slug || product.id}/300/400`}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {!product.inStock && <div className={styles.outOfStock}>Out of Stock</div>}
      </div>

      <div className={styles.body}>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <h3 className={styles.name}>{product.name}</h3>

        {(product.rating > 0 || product.reviewCount > 0) && (
          <div className={styles.ratingRow}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        )}

        <div className={styles.priceRow}>
          <PriceBlock
            mrp={product.mrp}
            sellingPrice={product.sellingPrice}
            discountPct={product.discountPct}
            size="sm"
          />
        </div>

        {product.inStock && (
          <button className={styles.addBtn} onClick={handleAddToCart}>
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
