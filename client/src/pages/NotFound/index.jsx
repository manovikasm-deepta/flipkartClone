import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      background: 'var(--fk-page-bg)',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      padding: '40px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 80, fontWeight: 900, color: 'var(--fk-blue)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--fk-text-primary)', margin: 0 }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 15, color: 'var(--fk-text-secondary)', maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            background: 'var(--fk-blue)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 4,
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          Go to Home
        </Link>
        <Link
          to="/products"
          style={{
            border: '1px solid var(--fk-blue)',
            color: 'var(--fk-blue)',
            padding: '12px 28px',
            borderRadius: 4,
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
