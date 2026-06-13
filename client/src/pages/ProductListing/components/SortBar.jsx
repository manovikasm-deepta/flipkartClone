import styles from '../ProductListing.module.css';

const SORT_OPTIONS = [
  { label: 'Popularity',          value: 'rating_desc' },
  { label: 'Price -- Low to High', value: 'price_asc' },
  { label: 'Price -- High to Low', value: 'price_desc' },
  { label: 'Newest First',        value: 'created_at_desc' },
  { label: 'Discount',            value: 'discount_desc' },
];

export default function SortBar({ sort, pagination = {}, onSortChange }) {
  const { total = 0 } = pagination;

  return (
    <div className={styles.sortBar}>
      <span className={styles.sortLabel}>Sort By</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.sortBtn} ${sort === opt.value ? styles.sortBtnActive : ''}`}
          onClick={() => onSortChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      {total > 0 && (
        <span className={styles.resultCount} style={{ marginLeft: 'auto', fontSize: 13, color: '#878787', whiteSpace: 'nowrap' }}>
          {total.toLocaleString()} results
        </span>
      )}
    </div>
  );
}
