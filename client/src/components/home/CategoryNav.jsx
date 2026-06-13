import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '@/services/api';

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAll()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', padding: '16px 0' }}>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 4, padding: '0 8px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', minWidth: 80, border: 'none', background: 'none', cursor: 'pointer', gap: 6 }}
          >
            {cat.iconUrl && (
              <img src={cat.iconUrl} alt={cat.name}
                style={{ width: 48, height: 48, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fk-text-primary)', textAlign: 'center', whiteSpace: 'nowrap' }}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
