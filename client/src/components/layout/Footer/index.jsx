import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const LINKS = [
  {
    heading: 'About',
    items: [
      { label: 'Contact Us', to: '/' },
      { label: 'About Us', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Flipkart Stories', to: '/' },
      { label: 'Press', to: '/' },
    ],
  },
  {
    heading: 'Help',
    items: [
      { label: 'Payments', to: '/' },
      { label: 'Shipping', to: '/' },
      { label: 'Cancellation & Returns', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Report Infringement', to: '/' },
    ],
  },
  {
    heading: 'Policy',
    items: [
      { label: 'Return Policy', to: '/' },
      { label: 'Terms of Use', to: '/' },
      { label: 'Security', to: '/' },
      { label: 'Privacy', to: '/' },
      { label: 'Sitemap', to: '/' },
    ],
  },
  {
    heading: 'Social',
    items: [
      { label: 'Facebook', to: '/' },
      { label: 'Twitter', to: '/' },
      { label: 'YouTube', to: '/' },
      { label: 'Instagram', to: '/' },
    ],
  },
];

const PAYMENT = ['Visa', 'Mastercard', 'UPI', 'Net Banking', 'EMI', 'COD'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {LINKS.map((col) => (
          <div key={col.heading} className={styles.col}>
            <h4>{col.heading}</h4>
            <ul>
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.paymentRow}>
        {PAYMENT.map((p) => (
          <span key={p} className={styles.payTag}>{p}</span>
        ))}
      </div>

      <div className={styles.bottom}>
        © 2007–{new Date().getFullYear()} Flipkart.com — Demo Clone built with React &amp; Node.js
      </div>
    </footer>
  );
}
