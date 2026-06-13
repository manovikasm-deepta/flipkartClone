import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className={styles.wrap} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous"
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
