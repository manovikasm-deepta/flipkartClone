import styles from '../ProductDetail.module.css';

export default function SpecsTable({ specs }) {
  if (!specs || typeof specs !== 'object') {
    return <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)' }}>No specifications available.</p>;
  }

  const entries = Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && v !== '');

  if (!entries.length) {
    return <p style={{ fontSize: 13, color: 'var(--fk-text-secondary)' }}>No specifications available.</p>;
  }

  return (
    <table className={styles.specsTable}>
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key}>
            <td className={styles.specsKey}>{key}</td>
            <td className={styles.specsVal}>
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
