import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { productService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';

const SORT_OPTIONS = [
  { label: 'Newest First',       value: 'created_at_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated',          value: 'rating_desc' },
  { label: 'Highest Discount',   value: 'discount_desc' },
];

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [loading,     setLoading]     = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';
  const sort     = searchParams.get('sort')      || 'created_at_desc';
  const minPrice = searchParams.get('minPrice')  || '';
  const maxPrice = searchParams.get('maxPrice')  || '';
  const inStock  = searchParams.get('inStock')   || '';
  const page     = Number(searchParams.get('page') || 1);

  const load = useCallback(() => {
    setLoading(true);
    const params = { sort, page, limit: 20 };
    if (category) params.category  = category;
    if (search)   params.search    = search;
    if (minPrice) params.minPrice  = minPrice;
    if (maxPrice) params.maxPrice  = maxPrice;
    if (inStock)  params.inStock   = inStock;

    productService.list(params)
      .then((r) => {
        setProducts(r.data?.items ?? []);
        setPagination(r.data?.pagination ?? {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, inStock, page]);

  useEffect(() => { load(); window.scrollTo({ top: 0 }); }, [load]);

  function set(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  }

  const title = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : search ? `Results for "${search}"` : 'All Products';

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fk-text-primary)' }}>{title}</h1>
            {pagination.total !== undefined && (
              <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)', marginTop: 2 }}>
                {pagination.total} products found
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setShowFilters((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px solid var(--fk-border)', borderRadius: 4, background: '#fff', fontSize: 13, cursor: 'pointer' }}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => set('sort', e.target.value)}
              style={{ border: '1px solid var(--fk-border)', borderRadius: 4, padding: '7px 10px', fontSize: 13, background: '#fff', cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{ background: '#fff', borderRadius: 8, padding: '16px', marginBottom: 16, boxShadow: 'var(--fk-shadow-sm)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
            {[
              { label: 'Min Price (₹)', key: 'minPrice', val: minPrice },
              { label: 'Max Price (₹)', key: 'maxPrice', val: maxPrice },
            ].map(({ label, key, val }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4, color: 'var(--fk-text-secondary)' }}>{label}</label>
                <input type="number" value={val} min={0}
                  onChange={(e) => set(key, e.target.value)}
                  style={{ border: '1px solid var(--fk-border)', borderRadius: 4, padding: '6px 10px', width: 120, fontSize: 13 }}
                />
              </div>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={inStock === 'true'} onChange={(e) => set('inStock', e.target.checked ? 'true' : '')} />
              In Stock Only
            </label>
            <button
              onClick={() => { const n = new URLSearchParams(); if (category) n.set('category', category); if (search) n.set('search', search); setSearchParams(n); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#c62828', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={12} /> Clear filters
            </button>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <SkeletonLoader variant="card" count={20} />
        ) : products.length === 0 ? (
          <EmptyState title="No products found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
