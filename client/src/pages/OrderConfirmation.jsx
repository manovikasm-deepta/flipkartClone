import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { orderService } from '@/services/api';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) { navigate('/'); return; }
    orderService.getOrderById(orderId)
      .then((r) => setOrder(r.data))
      .catch(() => navigate('/orders'));
  }, [orderId, navigate]);

  if (!order) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--fk-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: 'var(--fk-shadow-md)', overflow: 'hidden' }}>
          {/* Success header */}
          <div style={{ background: '#e8f5e9', padding: '32px 24px', textAlign: 'center' }}>
            <CheckCircle size={64} style={{ color: '#388e3c', margin: '0 auto 12px' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2e7d32', marginBottom: 6 }}>Order Placed Successfully!</h1>
            <p style={{ color: '#558b2f', fontSize: 14 }}>
              Order <strong>{order.orderNumber}</strong> has been placed.
            </p>
          </div>

          <div style={{ padding: 24 }}>
            {/* Delivery info */}
            <div style={{ background: 'var(--fk-page-bg)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', marginBottom: 4 }}>Expected delivery to</p>
              <p style={{ fontWeight: 600 }}>{order.delivery.name}</p>
              <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', lineHeight: 1.6 }}>
                {order.delivery.line1}, {order.delivery.city} – {order.delivery.pincode}
              </p>
            </div>

            {/* Order items */}
            <div style={{ borderTop: '1px solid var(--fk-border-light)', paddingTop: 16, marginBottom: 16 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName}
                      style={{ width: 52, height: 52, objectFit: 'contain', background: 'var(--fk-page-bg)', borderRadius: 4 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{item.productName}</p>
                    <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>Qty: {item.quantity} × {inr(item.sellingPrice)}</p>
                  </div>
                  <span style={{ fontWeight: 600 }}>{inr(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: '1px solid var(--fk-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 24 }}>
              <span>Total Paid</span>
              <span>{inr(order.totalAmount)}</span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to={`/orders/${order.id}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', border: '2px solid var(--fk-blue)', borderRadius: 4, color: 'var(--fk-blue)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                <Package size={16} /> Track Order
              </Link>
              <Link to="/"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', background: 'var(--fk-blue)', borderRadius: 4, color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                <ShoppingBag size={16} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
