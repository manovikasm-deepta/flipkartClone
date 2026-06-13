import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, MapPin, Bookmark, Trash2, Zap, Lock } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart } from '@/store/slices/cartSlice';
import { setBuyNowItem, clearBuyNow } from '@/store/slices/checkoutSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addressService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import RatingStars from '@/components/common/RatingStars';
import toast from 'react-hot-toast';
import styles from './Cart.module.css';

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, summary, loading } = useSelector((s) => s.cart);

  const [addresses, setAddresses]     = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showModal, setShowModal]       = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    addressService.getAddresses()
      .then((r) => {
        const addrs = r.data || [];
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) || addrs[0];
        if (def) setSelectedAddr(def);
      })
      .catch(() => {});
  }, [dispatch]);

  async function handleQtyChange(itemId, quantity) {
    const res = await dispatch(updateCartItem({ itemId, quantity }));
    if (!updateCartItem.fulfilled.match(res)) toast.error('Failed to update quantity');
  }

  async function handleRemove(itemId) {
    const res = await dispatch(removeFromCart(itemId));
    if (removeFromCart.fulfilled.match(res)) toast('Item removed from cart');
    else toast.error('Failed to remove item');
  }

  async function handleSaveForLater(item) {
    const wishRes = await dispatch(toggleWishlist(item.product.id));
    if (toggleWishlist.fulfilled.match(wishRes)) {
      await dispatch(removeFromCart(item.id));
      toast('Saved to wishlist');
    } else {
      toast.error('Failed to save');
    }
  }

  function handleBuyNow(item) {
    dispatch(setBuyNowItem({ product: item.product, quantity: item.quantity }));
    navigate('/checkout');
  }

  function handlePlaceOrder() {
    dispatch(clearBuyNow());
    navigate('/checkout');
  }

  const hasItems = items.length > 0;

  return (
    <div className={styles.page}>
      {/* Address modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Select Delivery Address</span>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              {addresses.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)' }}>
                  No saved addresses. Add one during checkout.
                </p>
              )}
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.addrCard} ${selectedAddr?.id === addr.id ? styles.addrCardActive : ''}`}
                  onClick={() => { setSelectedAddr(addr); setShowModal(false); }}
                >
                  <div className={styles.addrCardRow}>
                    <input type="radio" readOnly checked={selectedAddr?.id === addr.id} style={{ marginTop: 3 }} />
                    <div className={styles.addrInfo}>
                      <div className={styles.addrName}>
                        {addr.name}
                        <span className={styles.typeBadge}>{addr.type}</span>
                      </div>
                      <div className={styles.addrLine}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr.city}, {addr.state} – {addr.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {!hasItems && !loading ? (
          /* ── Empty cart ── */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><ShoppingCart size={80} strokeWidth={1} /></div>
            <div className={styles.emptyTitle}>Your cart is empty!</div>
            <div className={styles.emptySub}>Add items to it now.</div>
            <Link to="/products" className={styles.shopNowBtn}>Shop Now</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* ── Left column ── */}
            <div className={styles.leftCol}>
              {/* Delivery address bar */}
              <div className={styles.deliveryBar}>
                <MapPin size={16} color="var(--fk-blue)" />
                <span className={styles.deliveryLabel}>Deliver to:</span>
                {selectedAddr ? (
                  <>
                    <span className={styles.deliveryName}>{selectedAddr.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--fk-text-secondary)', marginLeft: 4 }}>
                      – {selectedAddr.pincode}
                    </span>
                  </>
                ) : (
                  <span className={styles.deliveryName}>{user?.name || 'Add address'}</span>
                )}
                <button className={styles.changeBtn} onClick={() => setShowModal(true)}>
                  Change
                </button>
              </div>

              {/* Cart items */}
              {items.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  {/* Thumbnail */}
                  <div className={styles.thumbWrap}>
                    <Link to={`/product/${item.product?.id}`}>
                      <img
                        src={item.product?.thumbnail || `https://picsum.photos/seed/${item.id}/80`}
                        alt={item.product?.name}
                        className={styles.thumb}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/80`; }}
                      />
                    </Link>
                  </div>

                  {/* Body */}
                  <div className={styles.itemBody}>
                    <Link to={`/product/${item.product?.id}`} className={styles.itemName}>
                      {item.product?.name}
                    </Link>
                    {item.product?.brand && (
                      <span className={styles.itemBrand}>{item.product.brand}</span>
                    )}

                    {item.product?.rating > 0 && (
                      <div><RatingStars rating={item.product.rating} reviewCount={item.product.reviewCount} size="sm" /></div>
                    )}

                    {/* Qty selector */}
                    <div className={styles.qtyRow}>
                      <span className={styles.qtyLabel}>Qty:</span>
                      <select
                        className={styles.qtySelect}
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div className={styles.priceRow}>
                      {item.product?.discountPct > 0 && (
                        <span className={styles.discountPct}>↓{Math.round(item.product.discountPct)}%</span>
                      )}
                      {item.product?.mrp > item.product?.sellingPrice && (
                        <span className={styles.mrp}>{inr(item.product.mrp)}</span>
                      )}
                      <span className={styles.price}>{inr(item.product?.sellingPrice)}</span>
                    </div>

                    {/* Actions */}
                    <div className={styles.itemActions}>
                      <button className={`${styles.actionBtn}`} onClick={() => handleSaveForLater(item)}>
                        <Bookmark size={13} /> Save for Later
                      </button>
                      <div className={styles.actionSep} />
                      <button className={`${styles.actionBtn} ${styles.removeBtn}`} onClick={() => handleRemove(item.id)}>
                        <Trash2 size={13} /> Remove
                      </button>
                      <div className={styles.actionSep} />
                      <button className={`${styles.actionBtn} ${styles.buyBtn}`} onClick={() => handleBuyNow(item)}>
                        <Zap size={13} /> Buy this now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right column: price panel ── */}
            <div className={styles.rightCol}>
              <div className={styles.pricePanel}>
                <div className={styles.pricePanelTitle}>Price Details</div>
                <div className={styles.pricePanelBody}>
                  <div className={styles.priceDetail}>
                    <span>Price ({summary.itemCount || items.length} items)</span>
                    <span>{inr(summary.totalMrp)}</span>
                  </div>
                  <div className={styles.priceDetail}>
                    <span>Discount</span>
                    <span className={styles.priceDetailGreen}>−{inr(summary.totalDiscount)}</span>
                  </div>
                  <div className={styles.priceDetail}>
                    <span>Delivery Charges</span>
                    <span className={styles.priceDetailGreen}>Free</span>
                  </div>
                  <hr className={styles.priceDivider} />
                  <div className={`${styles.priceDetail} ${styles.priceDetailBold}`}>
                    <span>Total Amount</span>
                    <span>{inr(summary.totalAmount)}</span>
                  </div>

                  {summary.totalDiscount > 0 && (
                    <div className={styles.savingsBanner}>
                      🎉 You will save {inr(summary.totalDiscount)} on this order!
                    </div>
                  )}
                </div>

                <div className={styles.trustRow}>
                  <Lock size={12} /> Safe and Secure payments. Easy returns.
                </div>

                <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
