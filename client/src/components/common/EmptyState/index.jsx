import styles from './EmptyState.module.css';

export default function EmptyState({ title, description, actionText, onAction, icon: Icon }) {
  return (
    <div className={styles.wrap}>
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon size={40} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionText && onAction && (
        <button className={styles.cta} onClick={onAction}>{actionText}</button>
      )}
    </div>
  );
}
