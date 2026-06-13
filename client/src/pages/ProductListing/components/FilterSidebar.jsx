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
  minPrice,
  maxPrice,
  onCategoryChange,
  onRatingChange,
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

  const hasFilters = activeCategory || activeRating || minPrice || maxPrice;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterCard}>

        {/* ── Header ────────────────────────────── */}
        <div className={styles.filterHeader}>
          <span className={styles.filterHeaderTitle}>Filters</span>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={onClear}>CLEAR ALL</button>
          )}
        </div>

        {/* ── Categories ────────────────────────── */}
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

        {/* ── Customer Ratings ──────────────────── */}
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

        {/* ── Price ─────────────────────────────── */}
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
