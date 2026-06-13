import styles from '../ProductListing.module.css';

const SORT_OPTIONS = [
  { label: 'Popularity',          value: 'rating_desc' },
  { label: 'Price — Low to High', value: 'price_asc' },
  { label: 'Price — High to Low', value: 'price_desc' },
  { label: 'Newest First',        value: 'created_at_desc' },
  { label: 'Discount',            value: 'discount_desc' },
];

export default function SortBar({ sort, pagination = {}, page = 1, onSortChange }) {
  const { total = 0, limit = 20 } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className={styles.sortBar}>
      <span className={styles.resultCount}>
        {total > 0 ? `Showing ${from}–${to} of ${total.toLocaleString()} results` : 'No results'}
      </span>
      <span className={styles.sortLabel}>Sort By:</span>
      <div className={styles.sortOptions}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.sortBtn} ${sort === opt.value ? styles.sortBtnActive : ''}`}
            onClick={() => onSortChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
