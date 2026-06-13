import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { orderService } from '@/services/api';
import toast from 'react-hot-toast';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [order,  setOrder]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id)
      .then((r) => setOrder(r.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--fk-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!order) return null;

  const stepIdx = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px' }}>
        <button onClick={() => navigate('/orders')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fk-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Order header */}
        <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', padding: '20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>Order #{order.orderNumber}</h1>
              <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', marginTop: 4 }}>
                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Status stepper */}
          {!isCancelled ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {STEPS.map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: i <= stepIdx ? 'var(--fk-blue)' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                    {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < stepIdx ? 'var(--fk-blue)' : '#e0e0e0' }} />}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {STEPS.map((step) => (
                  <span key={step} style={{ fontSize: 11, color: 'var(--fk-text-secondary)', textTransform: 'capitalize', textAlign: 'center' }}>{step.toLowerCase()}</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: 4, fontWeight: 600, fontSize: 13, marginBottom: 16 }}>
              Order Cancelled
            </div>
          )}

          {/* Items */}
          <div style={{ borderTop: '1px solid var(--fk-border-light)' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--fk-border-light)' }}>
                {item.productImage && (
                  <img src={item.productImage} alt={item.productName}
                    style={{ width: 64, height: 64, objectFit: 'contain', background: 'var(--fk-page-bg)', borderRadius: 4 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{item.productName}</p>
                  {item.productBrand && <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>{item.productBrand}</p>}
                  <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)', marginTop: 4 }}>Qty: {item.quantity} × {inr(item.sellingPrice)}</p>
                </div>
                <span style={{ fontWeight: 700 }}>{inr(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ paddingTop: 16 }}>
            {[
              { label: 'Subtotal',  value: inr(order.subtotal),      color: 'inherit' },
              { label: 'Discount',  value: `−${inr(order.discountTotal)}`, color: 'var(--fk-price-green)' },
              { label: 'Delivery',  value: Number(order.deliveryFee) === 0 ? 'FREE' : inr(order.deliveryFee), color: 'var(--fk-price-green)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: 'var(--fk-text-secondary)' }}>{label}</span>
                <span style={{ color }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed var(--fk-border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
              <span>Total</span><span>{inr(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address + payment */}
        <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', padding: 20 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Delivery Address</h2>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{order.delivery?.name}</p>
          <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', lineHeight: 1.6 }}>
            {order.delivery?.line1}{order.delivery?.line2 ? `, ${order.delivery.line2}` : ''}<br />
            {order.delivery?.city}, {order.delivery?.state} – {order.delivery?.pincode}<br />
            {order.delivery?.phone}
          </p>
          <p style={{ fontSize: 12, color: 'var(--fk-text-muted)', marginTop: 12 }}>
            Payment: <strong>{order.paymentMethod}</strong> · Status: <strong>{order.paymentStatus}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
