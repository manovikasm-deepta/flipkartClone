import { useDispatch } from 'react-redux';
import { Truck } from 'lucide-react';
import { setStep } from '@/store/slices/checkoutSlice';
import styles from '../Checkout.module.css';

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function OrderSummaryStep({ displayItems, selectedAddress }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Order Summary</span>
      </div>
      <div className={styles.cardBody}>
        {/* Selected address */}
        {selectedAddress && (
          <div className={styles.selectedAddrBox}>
            <div className={styles.selectedAddrTitle}>
              <span>Delivering to</span>
              <button className={styles.changeLink} onClick={() => dispatch(setStep(1))}>CHANGE</button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{selectedAddress.name}</div>
            <div style={{ fontSize: 13, color: 'var(--fk-text-secondary)', lineHeight: 1.4 }}>
              {selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}, {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}
            </div>
          </div>
        )}

        {/* Items */}
        {displayItems.map((item) => (
          <div key={item.id} className={styles.summaryItem}>
            <img
              src={item.product?.thumbnail || `https://picsum.photos/seed/${item.id}/56`}
              alt={item.product?.name}
              className={styles.summaryThumb}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/56`; }}
            />
            <div className={styles.summaryItemInfo}>
              <div className={styles.summaryItemName}>{item.product?.name}</div>
              <div className={styles.summaryItemQty}>Qty: {item.quantity}</div>
            </div>
            <div className={styles.summaryItemPrice}>
              {inr((item.product?.sellingPrice || 0) * item.quantity)}
            </div>
          </div>
        ))}

        {/* Delivery tag */}
        <div className={styles.deliveryTag}>
          <Truck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Delivery by {getDeliveryDate()}, <strong>Free</strong>
        </div>

        <button
          className={styles.continueBtn}
          onClick={() => dispatch(setStep(3))}
          disabled={!selectedAddress}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
