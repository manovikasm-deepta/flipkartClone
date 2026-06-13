import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/api';
import ProductCard from '@/components/common/ProductCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import FilterSidebar from './components/FilterSidebar';
import SortBar from './components/SortBar';
import styles from './ProductListing.module.css';

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [pagination, setPagination]     = useState({});
  const [loading, setLoading]           = useState(true);
  const [availableBrands, setAvailableBrands] = useState([]);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';
  const sort     = searchParams.get('sort')     || 'rating_desc';
  const page     = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating   = searchParams.get('rating')   || '';
  const brand    = searchParams.get('brand')    || '';

  // active brands as array (comma-separated in URL)
  const activeBrands = brand ? brand.split(',').filter(Boolean) : [];

  // load products (respects all filters including brand)
  const load = useCallback(() => {
    setLoading(true);
    const params = { sort, page, limit: 20 };
    if (category) params.category = category;
    if (search)   params.search   = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating)   params.rating   = rating;
    if (brand)    params.brand    = brand;

    productService.list(params)
      .then((r) => {
        setProducts(r.data?.items || []);
        setPagination(r.data?.pagination || {});
      })
      .catch(() => {
        setProducts([]);
        setPagination({});
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, page, minPrice, maxPrice, rating, brand]);

  useEffect(() => { load(); }, [load]);

  // load brand list independently (ignoring brand filter) so list stays stable
  useEffect(() => {
    const params = { limit: 200 };
    if (category) params.category = category;
    if (search)   params.search   = search;
    productService.list(params)
      .then((r) => {
        const brands = [...new Set((r.data?.items || []).map((p) => p.brand).filter(Boolean))].sort();
        setAvailableBrands(brands);
      })
      .catch(() => {});
  }, [category, search]);

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, String(value));
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }

  function handleCategoryChange(slug) {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    next.delete('brand');
    next.delete('page');
    setSearchParams(next);
  }

  function handleRatingChange(r) {
    setParam('rating', r);
  }

  function handlePriceChange(min, max) {
    const next = new URLSearchParams(searchParams);
    if (min) next.set('minPrice', min); else next.delete('minPrice');
    if (max) next.set('maxPrice', max); else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  }

  // toggle a single brand in/out of the comma-separated list; pass '' to clear all
  function handleBrandChange(b) {
    const next = new URLSearchParams(searchParams);
    if (!b) {
      next.delete('brand');
    } else {
      const current = next.get('brand') ? next.get('brand').split(',').filter(Boolean) : [];
      const updated = current.includes(b) ? current.filter((x) => x !== b) : [...current, b];
      if (updated.length) next.set('brand', updated.join(','));
      else next.delete('brand');
    }
    next.delete('page');
    setSearchParams(next);
  }

  function handleClear() {
    const next = new URLSearchParams();
    if (search) next.set('search', search);
    setSearchParams(next);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page title for search */}
        {search && (
          <h1 style={{ fontSize: 16, fontWeight: 400, color: 'var(--fk-text-secondary)', marginBottom: 12 }}>
            Search results for&nbsp;
            <strong style={{ color: 'var(--fk-text-primary)' }}>&quot;{search}&quot;</strong>
            {pagination.total != null && (
              <span style={{ marginLeft: 8 }}>({pagination.total.toLocaleString()} items)</span>
            )}
          </h1>
        )}

        <div className={styles.layout}>
          <FilterSidebar
            activeCategory={category}
            activeRating={rating}
            activeBrands={activeBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            brands={availableBrands}
            onCategoryChange={handleCategoryChange}
            onRatingChange={handleRatingChange}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
            onClear={handleClear}
          />

          <div className={styles.main}>
            <SortBar
              sort={sort}
              pagination={pagination}
              page={page}
              onSortChange={(s) => setParam('sort', s)}
            />

            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonLoader key={i} variant="card" count={1} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms."
                actionText="Clear Filters"
                onAction={handleClear}
              />
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div style={{ marginTop: 16 }}>
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.totalPages}
                      onPageChange={(p) => setParam('page', String(p))}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
