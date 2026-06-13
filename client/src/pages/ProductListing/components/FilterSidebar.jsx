import { useState, useEffect } from 'react';
import { categoryService } from '@/services/api';
import styles from '../ProductListing.module.css';

const RATINGS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
  { label: '1★ & above', value: '1' },
];

export default function FilterSidebar({
  activeCategory,
  activeRating,
  activeBrands = [],
  minPrice,
  maxPrice,
  brands = [],
  onCategoryChange,
  onRatingChange,
  onBrandChange,
  onPriceChange,
  onClear,
}) {
  const [categories, setCategories] = useState([]);
  const [localMin, setLocalMin]     = useState(minPrice ?? '');
  const [localMax, setLocalMax]     = useState(maxPrice ?? '');

  useEffect(() => {
    categoryService.getAll()
      .then((r) => setCategories(r.data?.categories || r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { setLocalMin(minPrice ?? ''); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice ?? ''); }, [maxPrice]);

  function handlePriceGo(e) {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  }

  const hasFilters = activeCategory || activeRating || activeBrands.length > 0 || minPrice || maxPrice;
  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name || activeCategory;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterCard}>

        {/* Header */}
        <div className={styles.filterHeader}>
          <span className={styles.filterHeaderTitle}>Filters</span>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={onClear}>CLEAR ALL</button>
          )}
        </div>

        {/* Category section */}
        {activeCategory ? (
          <div className={styles.filterSection}>
            <p className={styles.filterSectionTitle}>Category</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontSize: 13, color: '#2874f0', fontWeight: 600 }}>
                {activeCategoryName}
              </span>
              <button
                onClick={() => onCategoryChange('')}
                style={{ fontSize: 11, color: '#878787', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                ✕ Change
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.filterSection}>
            <p className={styles.filterSectionTitle}>Categories</p>
            {categories.map((cat) => (
              <label key={cat.id} className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={activeCategory === cat.slug}
                  onChange={() => onCategoryChange(activeCategory === cat.slug ? '' : cat.slug)}
                />
                <span className={`${styles.checkLabel} ${activeCategory === cat.slug ? styles.checkLabelActive : ''}`}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Brand filter — multi-select, shown when brands are available */}
        {brands.length > 0 && (
          <div className={styles.filterSection}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p className={styles.filterSectionTitle} style={{ margin: 0 }}>Brand</p>
              {activeBrands.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={() => onBrandChange('')}
                  style={{ fontSize: 11 }}
                >
                  Clear ({activeBrands.length})
                </button>
              )}
            </div>
            {brands.map((b) => (
              <label key={b} className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={activeBrands.includes(b)}
                  onChange={() => onBrandChange(b)}
                />
                <span className={`${styles.checkLabel} ${activeBrands.includes(b) ? styles.checkLabelActive : ''}`}>
                  {b}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Customer Ratings */}
        <div className={styles.filterSection}>
          <p className={styles.filterSectionTitle}>Customer Ratings</p>
          {RATINGS.map(({ label, value }) => (
            <label key={value} className={styles.checkRow}>
              <input
                type="radio"
                name="rating"
                className={styles.checkbox}
                checked={activeRating === value}
                onChange={() => onRatingChange(activeRating === value ? '' : value)}
              />
              <span className={`${styles.checkLabel} ${activeRating === value ? styles.checkLabelActive : ''}`}>
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Price */}
        <div className={styles.filterSection}>
          <p className={styles.filterSectionTitle}>Price</p>
          <form onSubmit={handlePriceGo}>
            <div className={styles.priceInputs}>
              <input
                className={styles.priceInput}
                type="number"
                placeholder="Min"
                min={0}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
              />
              <span style={{ fontSize: 12, color: '#878787' }}>to</span>
              <input
                className={styles.priceInput}
                type="number"
                placeholder="Max"
                min={0}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.goBtn} style={{ marginTop: 8, width: '100%' }}>
              Go
            </button>
          </form>
        </div>

      </div>
    </aside>
  );
}
