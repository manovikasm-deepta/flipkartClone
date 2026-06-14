import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPaymentMethod, setConfirmationEmail, resetCheckout } from '@/store/slices/checkoutSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { orderService } from '@/services/api';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from '../Checkout.module.css';

const PAY_OPTIONS = [
  { value: 'UPI',        label: 'UPI',                   sub: 'Pay by any UPI app' },
  { value: 'CARD',       label: 'Credit / Debit / ATM Card', sub: 'Visa, Mastercard, Rupay' },
  { value: 'EMI',        label: 'EMI',                   sub: 'Credit Card EMI' },
  { value: 'COD',        label: 'Cash on Delivery',      sub: 'Pay when your order arrives' },
];

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function PaymentStep({ priceDetails }) {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const paymentMethod      = useSelector((s) => s.checkout.paymentMethod);
  const selectedAddressId  = useSelector((s) => s.checkout.selectedAddressId);
  const reduxBuyNow        = useSelector((s) => s.checkout.buyNowItem);
  const confirmationEmail  = useSelector((s) => s.checkout.confirmationEmail);
  const cartItems          = useSelector((s) => s.cart.items);
  const [placing, setPlacing] = useState(false);

  // Defensive: if Redux was reset after a hard reload, fall back to sessionStorage directly
  const buyNowItem = reduxBuyNow || (() => {
    try { return JSON.parse(sessionStorage.getItem('fk_buy_now')); } catch { return null; }
  })();

  async function handlePlaceOrder() {
    if (!selectedAddressId) { toast.error('No delivery address selected'); return; }
    if (!buyNowItem && cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before placing an order.');
      return;
    }
    setPlacing(true);
    try {
      const payload = { addressId: selectedAddressId, paymentMethod, confirmationEmail };
      if (buyNowItem) {
        const productId = buyNowItem?.product?.id;
        if (!productId) {
          toast.error('Product details missing. Please go back and try again.');
          setPlacing(false);
          return;
        }
        payload.buyNowItem = { productId, quantity: buyNowItem.quantity || 1 };
      }
      const r = await orderService.placeOrder(payload);
      const order = r.data;
      if (!buyNowItem) dispatch(clearCartState());
      dispatch(resetCheckout());
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Payment</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.payOptions}>
          {PAY_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.payOption} ${paymentMethod === opt.value ? styles.payOptionActive : ''}`}
              onClick={() => dispatch(setPaymentMethod(opt.value))}
            >
              <input
                type="radio"
                readOnly
                checked={paymentMethod === opt.value}
                style={{ flexShrink: 0 }}
              />
              <div>
                <div className={styles.payOptionLabel}>{opt.label}</div>
                <div className={styles.payOptionSub}>{opt.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* UPI: mock QR */}
        {paymentMethod === 'UPI' && (
          <div style={{ marginTop: 16 }}>
            <div className={styles.qrBox}>
              <div style={{ fontSize: 32 }}>&#9638;</div>
              <span>Scan QR to pay</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>
              Open any UPI app and scan the QR code above to complete payment of{' '}
              <strong>{inr(priceDetails?.totalAmount)}</strong>.
            </p>
          </div>
        )}

        {/* COD: confirmation */}
        {paymentMethod === 'COD' && (
          <div className={styles.codInfo}>
            You will pay <strong>{inr(priceDetails?.totalAmount)}</strong> in cash when your order arrives at your doorstep.
          </div>
        )}

        {/* Email confirmation — shown here for cart checkout users */}
        <div style={{
          background: '#e8f5e9', border: '1px solid #c8e6c9',
          borderRadius: 4, padding: '10px 14px', marginTop: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Mail size={14} style={{ color: '#2e7d32', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>
              Order confirmation email:
            </span>
          </div>
          <input
            type="email"
            value={confirmationEmail}
            onChange={(e) => dispatch(setConfirmationEmail(e.target.value))}
            placeholder="Enter email to receive order confirmation"
            style={{
              width: '100%', border: '1px solid #c8e6c9', borderRadius: 3,
              padding: '7px 10px', fontSize: 13, outline: 'none',
              boxSizing: 'border-box', background: '#fff',
            }}
          />
        </div>

        <button
          className={styles.placeOrderBtn}
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? 'Placing Order…' : `Place Order  •  ${inr(priceDetails?.totalAmount)}`}
        </button>
      </div>
    </div>
  );
}
