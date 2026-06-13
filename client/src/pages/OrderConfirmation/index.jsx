import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/api';
import toast from 'react-hot-toast';
import styles from './OrderConfirmation.module.css';

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function getEstDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(orderId)
      .then((r) => setOrder(r.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  function copyOrderId() {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber).then(() => toast.success('Copied!'));
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--fk-text-secondary)' }}>
        Loading…
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Success hero */}
        <div className={styles.hero}>
          <div className={styles.checkWrap}>
            <CheckCircle size={42} color="#2e7d32" strokeWidth={1.5} />
          </div>
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successSub}>
            Thank you for shopping with Flipkart. Your order has been confirmed.
          </p>

          {user?.email && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#e8f5e9',
              border: '1px solid #c8e6c9',
              borderRadius: 20,
              padding: '6px 16px',
              marginBottom: 8,
              fontSize: 13,
              color: '#2e7d32',
            }}>
              <Mail size={14} />
              Confirmation sent to <strong style={{ marginLeft: 4 }}>{user.email}</strong>
            </div>
          )}

          <div className={styles.orderIdRow}>
            <span className={styles.orderIdLabel}>Order ID:</span>
            <span className={styles.orderIdVal}>{order.orderNumber}</span>
            <button className={styles.copyBtn} onClick={copyOrderId} title="Copy order ID">
              <Copy size={14} />
            </button>
          </div>

          <div className={styles.deliveryEst}>
            🚚 Estimated delivery:&nbsp;
            <span className={styles.deliveryEstGreen}>{getEstDelivery()}</span>
          </div>
        </div>

        {/* Order items */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Order Items</div>
          <div className={styles.cardBody}>
            {(order.items || []).map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <img
                  src={item.productImage || `https://picsum.photos/seed/${item.id}/56`}
                  alt={item.productName}
                  className={styles.summaryThumb}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/56`; }}
                />
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryName}>{item.productName}</div>
                  <div className={styles.summaryMeta}>
                    {item.productBrand && `${item.productBrand} · `}Qty: {item.quantity}
                  </div>
                </div>
                <div className={styles.summaryPrice}>{inr(item.lineTotal)}</div>
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
            <span>Total Amount</span>
            <span>{inr(order.totalAmount)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <Link to="/" className={styles.continueShopping}>Continue Shopping</Link>
          <Link to="/orders" className={styles.viewOrders}>View All Orders</Link>
        </div>
      </div>
    </div>
  );
}
