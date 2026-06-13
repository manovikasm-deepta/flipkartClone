import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Heart, Trash2 } from 'lucide-react';
import { wishlistService } from '@/services/api';
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromWishlist as removeId } from '@/store/slices/wishlistSlice';
import ProductCard from '@/components/common/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  function load() {
    setLoading(true);
    wishlistService.getWishlist()
      .then((r) => setItems(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handleRemove(item) {
    try {
      await wishlistService.removeFromWishlist(item.product.id);
      dispatch(removeId(item.product.id));
      setItems((prev) => prev.filter((w) => w.id !== item.id));
      toast('Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleMoveToCart(item) {
    if (!item.product.inStock) { toast.error('Product is out of stock'); return; }
    const res = await dispatch(addToCart({ productId: item.product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(res)) {
      await handleRemove(item);
      toast.success('Moved to cart');
    } else {
      toast.error(res.payload || 'Failed to add to cart');
    }
  }

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
      <SkeletonLoader variant="card" count={8} />
    </div>
  );

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>My Wishlist ({items.length})</h1>

        {!items.length ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save items you love and find them here anytime."
            actionText="Discover Products"
            onAction={() => navigate('/products')}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {items.map((item) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <ProductCard product={{ ...item.product, id: item.product.id }} showWishlist={false} />
                <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, display: 'flex', gap: 4, padding: '0 8px' }}>
                  <button onClick={() => handleMoveToCart(item)}
                    style={{ flex: 1, fontSize: 11, fontWeight: 600, padding: '6px 4px', background: 'var(--fk-add-to-cart)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Move to Cart
                  </button>
                  <button onClick={() => handleRemove(item)}
                    style={{ padding: '6px 8px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
