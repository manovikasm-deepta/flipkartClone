import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { addToCart } from '@/store/slices/cartSlice';
import { setBuyNowItem } from '@/store/slices/checkoutSlice';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import styles from '../ProductDetail.module.css';

export default function CTAButtons({ product, quantity = 1 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled = !product?.inStock || loading;

  async function handleAddToCart() {
    if (!isLoggedIn) { toast.error('Please login to add to cart'); navigate('/login'); return; }
    setLoading(true);
    const res = await dispatch(addToCart({ productId: product.id, quantity }));
    setLoading(false);
    if (addToCart.fulfilled.match(res)) {
      toast.success('Added to cart');
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } else {
      toast.error(res.payload || 'Failed to add to cart');
    }
  }

  function handleBuyNow() {
    if (!isLoggedIn) { toast.error('Please login to proceed'); navigate('/login'); return; }
    dispatch(setBuyNowItem({ product, quantity }));
    navigate('/checkout');
  }

  if (!product?.inStock) {
    return (
      <div className={styles.outOfStockMsg}>
        <span>✕</span> Currently Out of Stock
      </div>
    );
  }

  return (
    <div className={styles.ctaRow}>
      <button
        className={styles.cartBtn}
        onClick={handleAddToCart}
        disabled={disabled}
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {added ? 'Added!' : 'ADD TO CART'}
      </button>

      <button
        className={styles.buyBtn}
        onClick={handleBuyNow}
        disabled={disabled}
      >
        <Zap size={18} />
        BUY NOW
      </button>
    </div>
  );
}
