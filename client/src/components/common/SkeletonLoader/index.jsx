import styles from './SkeletonLoader.module.css';

function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage} />
      <div className={styles.cardBody}>
        <div className={styles.cardLine} style={{ width: '85%' }} />
        <div className={styles.cardLine} style={{ width: '70%' }} />
        <div className={styles.cardLineShort} />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className={styles.list}>
      <div className={styles.listImage} />
      <div className={styles.listBody}>
        <div className={styles.cardLine} style={{ width: '80%' }} />
        <div className={styles.cardLine} style={{ width: '60%' }} />
        <div className={styles.cardLineShort} />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className={styles.detail}>
      <div className={styles.detailImage} />
      <div className={styles.cardLine} style={{ width: '90%' }} />
      <div className={styles.cardLine} style={{ width: '60%' }} />
      <div className={styles.cardLine} style={{ width: '40%' }} />
    </div>
  );
}

function TextSkeleton() {
  return <div className={styles.text} />;
}

export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className={styles.grid}>
        {items.map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }
  if (variant === 'list')   return <>{items.map((_, i) => <ListSkeleton   key={i} />)}</>;
  if (variant === 'detail') return <>{items.map((_, i) => <DetailSkeleton key={i} />)}</>;
  return <>{items.map((_, i) => <TextSkeleton key={i} />)}</>;
}
