import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Package } from 'lucide-react';
import { orderService } from '@/services/api';
import styles from './OrderHistory.module.css';

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_MAP = {
  PLACED:    { label: 'Order Placed', cls: styles.statusPlaced },
  CONFIRMED: { label: 'Confirmed',    cls: styles.statusConfirmed },
  SHIPPED:   { label: 'Shipped',      cls: styles.statusShipped },
  DELIVERED: { label: 'Delivered',    cls: styles.statusDelivered },
  CANCELLED: { label: 'Cancelled',    cls: styles.statusCancelled },
};

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery', UPI: 'UPI / QR',
  CARD: 'Credit/Debit Card', NETBANKING: 'Net Banking',
  EMI: 'EMI',
};

export default function OrderHistoryPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderService.getOrders()
      .then((r) => setOrders(r.data?.items || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fk-text-secondary)' }}>
        Loading orders…
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Package size={64} strokeWidth={1} /></div>
            <div className={styles.emptyTitle}>No orders yet</div>
            <div className={styles.emptySub}>Looks like you haven&apos;t ordered anything yet.</div>
            <Link to="/products" className={styles.shopBtn}>Start Shopping</Link>
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] || { label: order.status, cls: '' };
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Header row */}
                <div className={styles.orderHeader} onClick={() => toggleExpand(order.id)}>
                  <div className={styles.orderNum}>Order #{order.orderNumber}</div>
                  <span className={`${styles.statusBadge} ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                  <div className={styles.orderMeta}>{fmtDate(order.placedAt)}</div>
                  <div className={styles.orderTotal}>{inr(order.totalAmount)}</div>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  />
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className={styles.orderBody}>
                    {(order.items || []).map((item) => (
                      <div key={item.id} className={styles.itemRow}>
                        <img
                          src={item.productImage || `https://picsum.photos/seed/${item.id}/56`}
                          alt={item.productName}
                          className={styles.itemThumb}
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/56`; }}
                        />
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName}>{item.productName}</div>
                          <div className={styles.itemMeta}>
                            {item.productBrand && `${item.productBrand} · `}Qty: {item.quantity}
                          </div>
                        </div>
                        <div className={styles.itemPrice}>{inr(item.lineTotal)}</div>
                      </div>
                    ))}

                    <div className={styles.orderFooter}>
                      {order.delivery && (
                        <div className={styles.footerBlock}>
                          <div className={styles.footerLabel}>Delivery Address</div>
                          <div className={styles.footerValue}>
                            {order.delivery.name}<br />
                            {order.delivery.line1}{order.delivery.line2 ? `, ${order.delivery.line2}` : ''}<br />
                            {order.delivery.city}, {order.delivery.state} – {order.delivery.pincode}
                          </div>
                        </div>
                      )}
                      <div className={styles.footerBlock}>
                        <div className={styles.footerLabel}>Payment</div>
                        <div className={styles.footerValue}>
                          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                        </div>
                      </div>
                      <div className={styles.footerBlock}>
                        <div className={styles.footerLabel}>Order Details</div>
                        <div className={styles.footerValue}>
                          <Link to={`/orders/${order.id}`} style={{ color: 'var(--fk-blue)', fontWeight: 600, textDecoration: 'none' }}>
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
