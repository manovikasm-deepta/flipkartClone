import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { wishlistService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import toast from 'react-hot-toast';
import styles from './Wishlist.module.css';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistService.getWishlist()
      .then((r) => setItems(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleMoveToCart(item) {
    const [addRes] = await Promise.all([
      dispatch(addToCart({ productId: item.product.id, quantity: 1 })),
    ]);

    if (addToCart.fulfilled.match(addRes)) {
      await dispatch(toggleWishlist(item.product.id));
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success('Moved to cart');
    } else {
      toast.error('Failed to move to cart');
    }
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fk-text-secondary)' }}>
        Loading wishlist…
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
          My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Heart size={64} strokeWidth={1} /></div>
            <div className={styles.emptyTitle}>Your wishlist is empty</div>
            <div className={styles.emptySub}>Save items you love to your wishlist. Review them anytime and move to cart.</div>
            <Link to="/products" className={styles.exploreBtn}>Explore Products</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemWrap}>
                <div className={styles.cardWrap}>
                  <ProductCard product={item.product} showWishlist={false} />
                </div>
                <button
                  className={styles.moveBtn}
                  onClick={() => handleMoveToCart(item)}
                >
                  <ShoppingCart size={14} />
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
