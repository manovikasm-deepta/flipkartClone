import styles from './PriceBlock.module.css';

function inr(n) {
  return Number(n).toLocaleString('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });
}

export default function PriceBlock({ mrp, sellingPrice, discountPct, size = 'md' }) {
  const pct = Number(discountPct);
  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <span className={styles.price}>{inr(sellingPrice)}</span>
      {pct > 0 && (
        <>
          <span className={styles.mrp}>{inr(mrp)}</span>
          <span className={styles.disc}>{Math.round(pct)}% off</span>
        </>
      )}
    </div>
  );
}
