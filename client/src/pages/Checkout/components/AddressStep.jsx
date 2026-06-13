import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, MapPin, Check } from 'lucide-react';
import { setSelectedAddress, setStep } from '@/store/slices/checkoutSlice';
import { addressService } from '@/services/api';
import toast from 'react-hot-toast';
import styles from '../Checkout.module.css';

const ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'];

export default function AddressStep({ addresses, onAddressesChange }) {
  const dispatch = useDispatch();
  const selectedAddressId = useSelector((s) => s.checkout.selectedAddressId);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  async function saveAddress(data) {
    setSaving(true);
    try {
      const r = await addressService.addAddress({ ...data, type: data.type || 'HOME' });
      const newAddr = r.data;
      onAddressesChange([...addresses, newAddr]);
      dispatch(setSelectedAddress(newAddr.id));
      setShowForm(false);
      reset();
      toast.success('Address saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  }

  function handleContinue() {
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
    dispatch(setStep(2));
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}><MapPin size={16} /> Delivery Address</span>
      </div>
      <div className={styles.cardBody}>
        {addresses.length === 0 && !showForm && (
          <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', marginBottom: 12 }}>
            No saved addresses. Add one below.
          </p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`${styles.addrCard} ${selectedAddressId === addr.id ? styles.addrCardActive : ''}`}
            onClick={() => dispatch(setSelectedAddress(addr.id))}
          >
            <input
              type="radio"
              readOnly
              checked={selectedAddressId === addr.id}
              style={{ marginTop: 3, flexShrink: 0 }}
            />
            <div className={styles.addrDetails}>
              <div className={styles.addrName}>
                {addr.name}
                <span className={styles.typeBadge}>{addr.type}</span>
              </div>
              <div className={styles.addrLine}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} – {addr.pincode}<br />
                {addr.phone}
              </div>
            </div>
            {selectedAddressId === addr.id && (
              <Check size={16} style={{ color: 'var(--fk-blue)', flexShrink: 0, alignSelf: 'flex-start', marginTop: 3 }} />
            )}
          </div>
        ))}

        <button className={styles.addAddrBtn} onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} />
          {showForm ? 'Cancel' : 'Add new address'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit(saveAddress)} className={styles.formGrid}>
            {[
              { name: 'name',    label: 'Full Name',       col: 2, req: true },
              { name: 'phone',   label: 'Mobile Number',   col: 1, req: true },
              { name: 'pincode', label: 'Pincode',         col: 1, req: true },
              { name: 'line1',   label: 'Address',         col: 2, req: true },
              { name: 'line2',   label: 'Locality (opt.)', col: 2, req: false },
              { name: 'city',    label: 'City',            col: 1, req: true },
              { name: 'state',   label: 'State',           col: 1, req: true },
            ].map(({ name, label, col, req }) => (
              <div key={name} className={`${styles.formField} ${col === 2 ? styles.formFieldFull : ''}`}>
                <label className={styles.formLabel}>{label}</label>
                <input
                  {...register(name, req ? { required: `${label} is required` } : {})}
                  className={`${styles.formInput} ${errors[name] ? styles.formInputError : ''}`}
                />
                {errors[name] && <span className={styles.formError}>{errors[name].message}</span>}
              </div>
            ))}

            <div className={styles.formField}>
              <label className={styles.formLabel}>Address Type</label>
              <select {...register('type')} className={styles.formSelect}>
                {ADDRESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className={styles.formBtns}>
              <button
                type="submit"
                disabled={saving}
                className={styles.continueBtn}
                style={{ marginTop: 0, flex: 'none', padding: '8px 20px', width: 'auto', fontSize: 13 }}
              >
                {saving ? 'Saving…' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); reset(); }}
                style={{ padding: '8px 16px', border: '1px solid var(--fk-border)', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button
          className={styles.continueBtn}
          onClick={handleContinue}
          disabled={!selectedAddressId}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
