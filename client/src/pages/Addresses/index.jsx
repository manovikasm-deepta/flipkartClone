import { useEffect, useState } from 'react';
import { addressService } from '@/services/api';
import toast from 'react-hot-toast';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BLUE   = '#2874f0';
const TEXT   = '#212121';
const BORDER = '#e0e0e0';
const BG     = '#f1f3f6';

// ─── Blank form state ─────────────────────────────────────────────────────────
const BLANK = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'HOME' };

// ─── Inline-form component ────────────────────────────────────────────────────
function AddressForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || BLANK);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontSize: 14,
    color: TEXT,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: 500,
  };

  const fieldWrap = { marginBottom: 14 };

  const row = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <div style={row}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Full Name *</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Phone *</label>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="10-digit mobile number"
            required
          />
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Address Line 1 *</label>
        <input
          style={inputStyle}
          value={form.line1}
          onChange={(e) => set('line1', e.target.value)}
          placeholder="Flat, House no., Building, Company, Apartment"
          required
        />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Address Line 2</label>
        <input
          style={inputStyle}
          value={form.line2 || ''}
          onChange={(e) => set('line2', e.target.value)}
          placeholder="Area, Colony, Street, Sector, Village (optional)"
        />
      </div>

      <div style={row}>
        <div style={fieldWrap}>
          <label style={labelStyle}>City *</label>
          <input
            style={inputStyle}
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="City"
            required
          />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>State *</label>
          <input
            style={inputStyle}
            value={form.state}
            onChange={(e) => set('state', e.target.value)}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div style={row}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Pincode *</label>
          <input
            style={inputStyle}
            value={form.pincode}
            onChange={(e) => set('pincode', e.target.value)}
            placeholder="6-digit pincode"
            required
          />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Address Type</label>
          <select
            style={{ ...inputStyle, background: '#fff' }}
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '9px 24px',
            background: BLUE,
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 14,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : 'SAVE'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '9px 24px',
            background: '#fff',
            color: BLUE,
            border: `1px solid ${BLUE}`,
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);   // null | address id
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    addressService.getAddresses()
      .then((r) => setAddresses(r.data || []))
      .catch(() => toast.error('Failed to load addresses'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(formData) {
    setSaving(true);
    try {
      const res = await addressService.addAddress(formData);
      setAddresses((prev) => [...prev, res.data]);
      setAddingNew(false);
      toast.success('Address added');
    } catch {
      toast.error('Failed to add address');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id, formData) {
    setSaving(true);
    try {
      const res = await addressService.updateAddress(id, formData);
      setAddresses((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      setEditingId(null);
      toast.success('Address updated');
    } catch {
      toast.error('Failed to update address');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  }

  async function handleSetDefault(id) {
    try {
      await addressService.setDefault(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to set default');
    }
  }

  // ── styles ──────────────────────────────────────────────────────────────────
  const page = {
    minHeight: '100vh',
    background: BG,
    padding: '24px 16px',
  };

  const container = {
    maxWidth: 860,
    margin: '0 auto',
  };

  const pageHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  };

  const pageTitle = {
    fontSize: 20,
    fontWeight: 700,
    color: TEXT,
  };

  const addBtn = {
    padding: '9px 20px',
    background: BLUE,
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  };

  const card = {
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    padding: '18px 20px',
    marginBottom: 14,
  };

  const cardHeader = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  };

  const nameLine = {
    fontWeight: 700,
    fontSize: 15,
    color: TEXT,
    marginBottom: 2,
  };

  const addressText = {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.6,
  };

  const phoneLine = {
    fontSize: 14,
    color: TEXT,
    marginTop: 4,
  };

  const badgeBase = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 3,
    fontSize: 11,
    fontWeight: 700,
    marginRight: 6,
    marginTop: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  };

  const typeBadge = (type) => ({
    ...badgeBase,
    background: '#e3f0ff',
    color: BLUE,
    border: `1px solid #b3d1fb`,
  });

  const defaultBadge = {
    ...badgeBase,
    background: '#e6f9ec',
    color: '#2e7d32',
    border: '1px solid #a5d6a7',
  };

  const actionBtn = (variant) => ({
    padding: '6px 14px',
    borderRadius: 3,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: variant === 'danger'
      ? '1px solid #f44336'
      : `1px solid ${BLUE}`,
    background: '#fff',
    color: variant === 'danger' ? '#f44336' : BLUE,
    marginLeft: 8,
  });

  const emptyState = {
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    padding: '48px 24px',
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
  };

  if (loading) {
    return (
      <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#888', fontSize: 15 }}>Loading addresses…</span>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        {/* Page header */}
        <div style={pageHeader}>
          <h1 style={pageTitle}>Manage Addresses</h1>
          {!addingNew && (
            <button style={addBtn} onClick={() => { setAddingNew(true); setEditingId(null); }}>
              + Add New Address
            </button>
          )}
        </div>

        {/* Add-new form card */}
        {addingNew && (
          <div style={{ ...card, border: `1.5px solid ${BLUE}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 2 }}>
              Add New Address
            </div>
            <AddressForm
              initial={BLANK}
              onSave={handleAdd}
              onCancel={() => setAddingNew(false)}
              saving={saving}
            />
          </div>
        )}

        {/* Address list */}
        {addresses.length === 0 && !addingNew ? (
          <div style={emptyState}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>No saved addresses</div>
            <div>Add a delivery address to get started.</div>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                ...card,
                border: addr.isDefault
                  ? `1.5px solid ${BLUE}`
                  : `1px solid ${BORDER}`,
              }}
            >
              {editingId === addr.id ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 2 }}>
                    Edit Address
                  </div>
                  <AddressForm
                    initial={addr}
                    onSave={(data) => handleUpdate(addr.id, data)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </>
              ) : (
                <>
                  <div style={cardHeader}>
                    {/* Left: address details */}
                    <div style={{ flex: 1 }}>
                      <div style={nameLine}>{addr.name}</div>
                      <div style={addressText}>
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                        {`, ${addr.city}, ${addr.state} – ${addr.pincode}`}
                      </div>
                      <div style={phoneLine}>
                        <strong>Phone:</strong> {addr.phone}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <span style={typeBadge(addr.type)}>{addr.type}</span>
                        {addr.isDefault && (
                          <span style={defaultBadge}>Default</span>
                        )}
                      </div>
                    </div>

                    {/* Right: action buttons */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0, gap: 0 }}>
                      {!addr.isDefault && (
                        <button
                          style={{ ...actionBtn('outline'), marginLeft: 0, color: '#555', borderColor: BORDER }}
                          onClick={() => handleSetDefault(addr.id)}
                          title="Set as default"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        style={actionBtn('outline')}
                        onClick={() => { setEditingId(addr.id); setAddingNew(false); }}
                      >
                        Edit
                      </button>
                      <button
                        style={actionBtn('danger')}
                        onClick={() => handleDelete(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
