import styles from './RatingStars.module.css';

function fmtCount(n) {
  if (!n) return '';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function RatingStars({ rating, reviewCount, size = 'sm' }) {
  if (!rating) return null;
  const isLg = size === 'lg';
  return (
    <div className={styles.wrap}>
      <span className={`${styles.pill} ${isLg ? styles.pillLg : ''}`}>
        {Number(rating).toFixed(1)}
        <svg viewBox="0 0 20 20" className={isLg ? styles.starIconLg : styles.starIcon}>
          <path d="M10 1l2.39 4.84L18 6.73l-4 3.9.94 5.5L10 13.77l-4.94 2.36L6 10.63 2 6.73l5.61-.89z" />
        </svg>
      </span>
      {reviewCount > 0 && (
        <span className={`${styles.count} ${isLg ? styles.countLg : ''}`}>
          ({fmtCount(reviewCount)})
        </span>
      )}
    </div>
  );
}
