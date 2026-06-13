import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './CategoryNav.module.css';

const CDN = 'https://static-assets-web.flixcart.com/apex-static/images/svgs/L1Nav';

const NAV_ITEMS = [
  { label: 'For You',          icon: 'all',         slug: null },
  { label: 'Fashion',          icon: 'fashion',     slug: 'fashion' },
  { label: 'Mobiles',          icon: 'mobiles',     slug: 'mobiles' },
  { label: 'Beauty',           icon: 'beauty',      slug: 'beauty' },
  { label: 'Electronics',      icon: 'electronics', slug: 'electronics' },
  { label: 'Home',             icon: 'home-final',  slug: 'home-kitchen' },
  { label: 'Appliances',       icon: 'tv',          slug: 'appliances' },
  { label: 'Toys, baby..',     icon: 'toy',         slug: 'toys' },
  { label: 'Food & Health',    icon: 'food',        slug: 'food' },
  { label: 'Auto Accessories', icon: 'auto-acc',    slug: 'auto' },
  { label: '2 Wheelers',       icon: 'auto-new',    slug: '2-wheelers' },
  { label: 'Sports & Fitness', icon: 'sport',       slug: 'sports' },
  { label: 'Books & Media',    icon: 'books',       slug: 'books' },
  { label: 'Furniture',        icon: 'furniture',   slug: 'furniture' },
];

export default function CategoryNav() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const [searchParams] = useSearchParams();
  const activeSlug    = searchParams.get('category') || null;
  const isHome        = location.pathname === '/';

  function handleClick(slug) {
    if (!slug) navigate('/');
    else navigate(`/products?category=${slug}`);
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.slug === null ? isHome && !activeSlug : activeSlug === item.slug;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item.slug)}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            >
              <div className={`${styles.iconWrap} ${isActive ? styles.iconWrapActive : ''}`}>
                <img
                  src={`${CDN}/${item.icon}.svg`}
                  alt={item.label}
                  className={styles.icon}
                  loading="lazy"
                />
              </div>
              <span className={styles.label}>{item.label}</span>
              {isActive && <span className={styles.activeLine} />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
