import { useState, useEffect } from 'react';
import { categoryService } from '@/services/api';
import styles from '../ProductListing.module.css';

const RATINGS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
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
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    categoryService.getAll()
      .then((r) => setCategories(r.data?.categories || r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  function handlePriceGo(e) {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  }

  const hasFilters = activeCategory || activeRating || minPrice || maxPrice;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterCard}>
        {/* Header */}
        <div className={styles.filterHeader}>
          <span className={styles.filterHeaderTitle}>Filters</span>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={onClear}>
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className={styles.filterSection}>
          <p className={styles.filterSectionTitle}>Category</p>
          <button
            className={`${styles.categoryItem} ${!activeCategory ? styles.categoryItemActive : ''}`}
            onClick={() => onCategoryChange('')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryItem} ${activeCategory === cat.slug ? styles.categoryItemActive : ''}`}
              onClick={() => onCategoryChange(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <div className={styles.filterSection}>
          <p className={styles.filterSectionTitle}>Rating</p>
          {RATINGS.map(({ label, value }) => (
            <label key={value} className={styles.ratingRow}>
              <input
                type="radio"
                name="rating"
                checked={activeRating === value}
                onChange={() => onRatingChange(activeRating === value ? '' : value)}
              />
              <span className={styles.ratingLabel}>
                <span className={styles.starPill}>★ {value}</span>
                &amp; above
              </span>
            </label>
          ))}
          {activeRating && (
            <button className={styles.clearBtn} style={{ marginTop: 4 }} onClick={() => onRatingChange('')}>
              Clear
            </button>
          )}
        </div>

        {/* Price filter */}
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
              <span style={{ fontSize: 12, color: 'var(--fk-text-secondary)' }}>–</span>
              <input
                className={styles.priceInput}
                type="number"
                placeholder="Max"
                min={0}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
              />
              <button type="submit" className={styles.goBtn}>GO</button>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
}
