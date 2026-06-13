import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart } from '@/store/slices/cartSlice';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isLoggedIn } = useAuth();
  const { items, summary, loading } = useSelector((s) => s.cart);

  useEffect(() => {
    if (isLoggedIn) dispatch(fetchCart());
  }, [isLoggedIn, dispatch]);

  async function handleQty(item, newQty) {
    if (newQty < 1) {
      await dispatch(removeFromCart(item.id));
      return;
    }
    const res = await dispatch(updateCartItem({ itemId: item.id, quantity: newQty }));
    if (!updateCartItem.fulfilled.match(res)) toast.error('Failed to update');
  }

  async function handleRemove(item) {
    const res = await dispatch(removeFromCart(item.id));
    if (removeFromCart.fulfilled.match(res)) toast('Removed from cart');
  }

  if (loading && !items.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--fk-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: 'var(--fk-page-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={72} style={{ color: '#ccc', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your cart is empty!</h2>
          <p style={{ color: 'var(--fk-text-secondary)', marginBottom: 24 }}>Add items to begin checkout</p>
          <Link to="/products" style={{ background: 'var(--fk-blue)', color: '#fff', padding: '10px 32px', borderRadius: 4, fontWeight: 600 }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Cart items */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--fk-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: 18, fontWeight: 600 }}>My Cart ({summary.itemCount || items.length})</h1>
              </div>

              {items.map((item) => (
                <div key={item.id} style={{ padding: '20px', borderBottom: '1px solid var(--fk-border-light)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <Link to={`/product/${item.product?.id}`} style={{ flexShrink: 0 }}>
                    <img
                      src={item.product?.thumbnail || `https://picsum.photos/seed/${item.id}/100/100`}
                      alt={item.product?.name}
                      style={{ width: 100, height: 100, objectFit: 'contain', background: '#f5f5f5', borderRadius: 4 }}
                    />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.product?.id}`} style={{ fontSize: 14, fontWeight: 500, color: 'var(--fk-text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.product?.name}
                    </Link>
                    {item.product?.brand && <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)', marginTop: 2 }}>{item.product.brand}</p>}
                    {!item.product?.inStock && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Out of stock</p>}

                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--fk-border)', borderRadius: 4 }}>
                        <button onClick={() => handleQty(item, item.quantity - 1)} style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', background: 'none' }}><Minus size={14} /></button>
                        <span style={{ padding: '4px 12px', fontWeight: 600, fontSize: 14 }}>{item.quantity}</span>
                        <button onClick={() => handleQty(item, item.quantity + 1)} style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', background: 'none' }}><Plus size={14} /></button>
                      </div>
                      <button onClick={() => handleRemove(item)} style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{inr(item.product?.sellingPrice * item.quantity)}</div>
                    {Number(item.product?.discountPct) > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--fk-price-green)', marginTop: 2 }}>
                        {Math.round(item.product.discountPct)}% off
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ padding: '16px 20px' }}>
                <button
                  onClick={() => navigate('/checkout')}
                  style={{ float: 'right', background: 'var(--fk-place-order)', color: '#fff', padding: '14px 40px', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: 'var(--fk-page-bg)', borderBottom: '1px solid var(--fk-border-light)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fk-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Price Details</h3>
              </div>
              <div style={{ padding: '20px' }}>
                {[
                  { label: `Price (${summary.itemCount || items.length} items)`, value: inr(summary.totalMrp || 0), color: 'inherit' },
                  { label: 'Discount',   value: `−${inr(summary.totalDiscount || 0)}`, color: 'var(--fk-price-green)' },
                  { label: 'Delivery Charges', value: summary.deliveryFee === 0 ? 'FREE' : inr(summary.deliveryFee || 0), color: 'var(--fk-price-green)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14 }}>
                    <span>{label}</span>
                    <span style={{ color }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed var(--fk-border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                  <span>Total Amount</span>
                  <span>{inr(summary.totalAmount || 0)}</span>
                </div>
                {(summary.totalDiscount || 0) > 0 && (
                  <p style={{ marginTop: 12, fontSize: 13, color: 'var(--fk-price-green)', fontWeight: 500 }}>
                    You will save {inr(summary.totalDiscount)} on this order
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
