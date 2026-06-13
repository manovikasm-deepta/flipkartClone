import styles from './Badge.module.css';

export default function Badge({ text, variant = 'default' }) {
  const cls = styles[variant] || styles.default;
  return <span className={`${styles.badge} ${cls}`}>{text}</span>;
}
