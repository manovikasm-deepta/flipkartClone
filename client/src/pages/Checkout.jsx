import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MapPin, Plus, Check } from 'lucide-react';
import { clearCartState } from '@/store/slices/cartSlice';
import { setSelectedAddress, setPaymentMethod, resetCheckout } from '@/store/slices/checkoutSlice';
import { addressService, orderService } from '@/services/api';
import toast from 'react-hot-toast';

function inr(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const PAYMENT_OPTIONS = [
  { value: 'COD',        label: 'Cash on Delivery' },
  { value: 'UPI',        label: 'UPI / QR' },
  { value: 'CARD',       label: 'Credit / Debit Card' },
  { value: 'NETBANKING', label: 'Net Banking' },
];

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const nav       = useNavigate();
  const { items, summary } = useSelector((s) => s.cart);
  const { selectedAddressId, paymentMethod } = useSelector((s) => s.checkout);
  const [addresses,   setAddresses]   = useState([]);
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [placing,     setPlacing]     = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!items.length) { nav('/cart'); return; }
    addressService.getAddresses()
      .then((r) => {
        const addrs = r.data || [];
        setAddresses(addrs);
        if (!selectedAddressId) {
          const def = addrs.find((a) => a.isDefault) || addrs[0];
          if (def) dispatch(setSelectedAddress(def.id));
        }
      })
      .catch(() => {});
  }, [dispatch, items.length, nav, selectedAddressId]);

  async function saveAddress(data) {
    try {
      const r = await addressService.addAddress({ ...data, type: data.type || 'HOME' });
      const newAddr = r.data;
      setAddresses((prev) => [...prev, newAddr]);
      dispatch(setSelectedAddress(newAddr.id));
      setShowNewAddr(false);
      reset();
      toast.success('Address saved');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function placeOrder() {
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const r = await orderService.placeOrder({ addressId: selectedAddressId, paymentMethod });
      const order = r.data;
      dispatch(clearCartState());
      dispatch(resetCheckout());
      nav(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Address section */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', background: 'var(--fk-blue)' }}>
              <h2 style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} /> Delivery Address
              </h2>
            </div>
            <div style={{ padding: 16 }}>
              {addresses.map((addr) => (
                <label key={addr.id} style={{ display: 'flex', gap: 12, padding: '12px', border: `1px solid ${selectedAddressId === addr.id ? 'var(--fk-blue)' : 'var(--fk-border)'}`, borderRadius: 4, marginBottom: 8, cursor: 'pointer', background: selectedAddressId === addr.id ? '#f0f7ff' : '#fff' }}>
                  <input type="radio" name="address" checked={selectedAddressId === addr.id}
                    onChange={() => dispatch(setSelectedAddress(addr.id))} style={{ marginTop: 3 }} />
                  <div style={{ fontSize: 13 }}>
                    <strong>{addr.name}</strong>
                    <span style={{ marginLeft: 8, fontSize: 11, background: '#e8eaf6', color: '#3949ab', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>{addr.type}</span>
                    <p style={{ color: 'var(--fk-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                      {addr.city}, {addr.state} – {addr.pincode}<br />
                      {addr.phone}
                    </p>
                  </div>
                  {selectedAddressId === addr.id && <Check size={16} style={{ color: 'var(--fk-blue)', marginLeft: 'auto', flexShrink: 0 }} />}
                </label>
              ))}

              <button onClick={() => setShowNewAddr((v) => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fk-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                <Plus size={14} /> Add new address
              </button>

              {showNewAddr && (
                <form onSubmit={handleSubmit(saveAddress)} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { name: 'name',    label: 'Full Name',      col: 2, required: true },
                    { name: 'phone',   label: 'Mobile No.',     col: 1, required: true },
                    { name: 'pincode', label: 'Pincode',        col: 1, required: true },
                    { name: 'line1',   label: 'Address',        col: 2, required: true },
                    { name: 'line2',   label: 'Locality (opt)',  col: 2, required: false },
                    { name: 'city',    label: 'City',           col: 1, required: true },
                    { name: 'state',   label: 'State',          col: 1, required: true },
                  ].map(({ name, label, col, required: req }) => (
                    <div key={name} style={{ gridColumn: `span ${col}` }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--fk-text-secondary)', textTransform: 'uppercase' }}>{label}</label>
                      <input {...register(name, req ? { required: `${label} required` } : {})}
                        style={{ width: '100%', border: `1px solid ${errors[name] ? '#e53e3e' : 'var(--fk-border)'}`, borderRadius: 4, padding: '8px 10px', fontSize: 13 }} />
                      {errors[name] && <p style={{ fontSize: 11, color: '#e53e3e', marginTop: 2 }}>{errors[name].message}</p>}
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8 }}>
                    <button type="submit" style={{ background: 'var(--fk-blue)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button type="button" onClick={() => setShowNewAddr(false)} style={{ border: '1px solid var(--fk-border)', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', background: '#fff' }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Payment section */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', background: 'var(--fk-blue)' }}>
              <h2 style={{ color: '#fff', fontWeight: 700 }}>Payment Options</h2>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `1px solid ${paymentMethod === opt.value ? 'var(--fk-blue)' : 'var(--fk-border)'}`, borderRadius: 4, cursor: 'pointer', background: paymentMethod === opt.value ? '#f0f7ff' : '#fff', fontSize: 13 }}>
                  <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                    onChange={() => dispatch(setPaymentMethod(opt.value))} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Order summary */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', position: 'sticky', top: 100 }}>
            <div style={{ padding: '14px 20px', background: 'var(--fk-page-bg)', borderBottom: '1px solid var(--fk-border-light)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fk-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Price Details</h3>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 12 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'var(--fk-text-secondary)' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{item.product?.name}</span>
                    <span>×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--fk-border-light)', paddingTop: 12 }}>
                {[
                  { label: `Price (${summary.itemCount || items.length} items)`, value: inr(summary.totalMrp || 0), color: 'inherit' },
                  { label: 'Discount',         value: `−${inr(summary.totalDiscount || 0)}`, color: 'var(--fk-price-green)' },
                  { label: 'Delivery Charges', value: 'FREE', color: 'var(--fk-price-green)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
                    <span>{label}</span><span style={{ color }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed var(--fk-border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                  <span>Total Amount</span><span>{inr(summary.totalAmount || 0)}</span>
                </div>
              </div>
              <button onClick={placeOrder} disabled={placing}
                style={{ marginTop: 16, width: '100%', background: 'var(--fk-place-order)', color: '#fff', border: 'none', borderRadius: 4, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: placing ? 0.7 : 1 }}>
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
