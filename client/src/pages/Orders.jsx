import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderService } from '@/services/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import EmptyState from '@/components/common/EmptyState';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const STATUS_STYLE = {
  PLACED:    { bg: '#e3f2fd', color: '#1565c0' },
  CONFIRMED: { bg: '#ede7f6', color: '#4527a0' },
  SHIPPED:   { bg: '#fff8e1', color: '#e65100' },
  DELIVERED: { bg: '#e8f5e9', color: '#2e7d32' },
  CANCELLED: { bg: '#ffebee', color: '#c62828' },
};

export default function OrderHistoryPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders()
      .then((r) => setOrders(r.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ maxWidth: 860, margin: '24px auto', padding: '0 16px' }}>
      <SkeletonLoader variant="list" count={4} />
    </div>
  );

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>My Orders</h1>

        {!orders.length ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place orders, they will appear here."
            actionText="Start Shopping"
            onAction={() => window.location.href = '/products'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map((order) => {
              const s = STATUS_STYLE[order.status] || { bg: '#f5f5f5', color: '#333' };
              return (
                <div key={order.id} style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 20px', background: 'var(--fk-page-bg)', borderBottom: '1px solid var(--fk-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>ORDER # {order.orderNumber}</span>
                      <span style={{ marginLeft: 16, fontSize: 12, color: 'var(--fk-text-secondary)' }}>
                        {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 3, background: s.bg, color: s.color }}>{order.status}</span>
                      <span style={{ fontWeight: 700 }}>{inr(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px 20px' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: i < order.items.length - 1 ? 12 : 0 }}>
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName}
                            style={{ width: 56, height: 56, objectFit: 'contain', background: 'var(--fk-page-bg)', borderRadius: 4, flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                          {item.productBrand && <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>{item.productBrand}</p>}
                          <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)', marginTop: 2 }}>Qty: {item.quantity} × {inr(item.sellingPrice)}</p>
                        </div>
                        <span style={{ fontWeight: 600, flexShrink: 0 }}>{inr(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 20px', borderTop: '1px solid var(--fk-border-light)', textAlign: 'right' }}>
                    <Link to={`/orders/${order.id}`} style={{ fontSize: 13, color: 'var(--fk-blue)', fontWeight: 600 }}>
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
