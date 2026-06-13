import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './CategoryNav.module.css';

const CDN = 'https://static-assets-web.flixcart.com/apex-static/images/svgs/L1Nav';

const NAV_ITEMS = [
  {
    label: 'For You', icon: 'all', slug: null,
    sub: [],
  },
  {
    label: 'Fashion', icon: 'fashion', slug: 'fashion',
    sub: [
      { label: "Men's Clothing", slug: 'fashion' },
      { label: "Women's Clothing", slug: 'fashion' },
      { label: 'Footwear', slug: 'fashion' },
      { label: 'Accessories', slug: 'fashion' },
      { label: 'Kids Fashion', slug: 'fashion' },
      { label: 'Innerwear', slug: 'fashion' },
    ],
  },
  {
    label: 'Mobiles', icon: 'mobiles', slug: 'mobiles',
    sub: [
      { label: 'Smartphones', slug: 'mobiles' },
      { label: 'Feature Phones', slug: 'mobiles' },
      { label: 'Mobile Accessories', slug: 'mobiles' },
      { label: 'Tablets', slug: 'mobiles' },
      { label: 'Smart Watches', slug: 'electronics' },
    ],
  },
  {
    label: 'Beauty', icon: 'beauty', slug: 'beauty',
    sub: [
      { label: 'Skincare', slug: 'beauty' },
      { label: 'Haircare', slug: 'beauty' },
      { label: 'Fragrances', slug: 'beauty' },
      { label: 'Makeup', slug: 'beauty' },
      { label: 'Men Grooming', slug: 'beauty' },
    ],
  },
  {
    label: 'Electronics', icon: 'electronics', slug: 'electronics',
    sub: [
      { label: 'Laptops', slug: 'electronics' },
      { label: 'Headphones', slug: 'electronics' },
      { label: 'Cameras', slug: 'electronics' },
      { label: 'Smart Speakers', slug: 'electronics' },
      { label: 'Accessories', slug: 'electronics' },
    ],
  },
  {
    label: 'Home', icon: 'home-final', slug: 'home-kitchen',
    sub: [
      { label: 'Bedding', slug: 'home-kitchen' },
      { label: 'Kitchen Tools', slug: 'home-kitchen' },
      { label: 'Decor', slug: 'home-kitchen' },
      { label: 'Storage', slug: 'home-kitchen' },
      { label: 'Lighting', slug: 'home-kitchen' },
    ],
  },
  {
    label: 'Appliances', icon: 'tv', slug: 'appliances',
    sub: [
      { label: 'TVs', slug: 'appliances' },
      { label: 'Refrigerators', slug: 'appliances' },
      { label: 'Washing Machines', slug: 'appliances' },
      { label: 'Air Conditioners', slug: 'appliances' },
      { label: 'Microwave Ovens', slug: 'appliances' },
    ],
  },
  {
    label: 'Toys, baby..', icon: 'toy', slug: 'toys',
    sub: [
      { label: 'Toys', slug: 'toys' },
      { label: 'Baby Gear', slug: 'toys' },
      { label: 'Baby Clothing', slug: 'toys' },
      { label: 'Stationery', slug: 'toys' },
    ],
  },
  {
    label: 'Food & Health', icon: 'food', slug: 'food',
    sub: [
      { label: 'Nutrition', slug: 'food' },
      { label: 'Organic Food', slug: 'food' },
      { label: 'Health Devices', slug: 'food' },
      { label: 'Ayurveda', slug: 'food' },
    ],
  },
  {
    label: 'Auto Accessories', icon: 'auto-acc', slug: 'auto',
    sub: [
      { label: 'Car Accessories', slug: 'auto' },
      { label: 'Bike Accessories', slug: 'auto' },
      { label: 'Car Care', slug: 'auto' },
    ],
  },
  {
    label: '2 Wheelers', icon: 'auto-new', slug: '2-wheelers',
    sub: [
      { label: 'Bikes', slug: '2-wheelers' },
      { label: 'Scooters', slug: '2-wheelers' },
      { label: 'Electric Vehicles', slug: '2-wheelers' },
    ],
  },
  {
    label: 'Sports & Fitness', icon: 'sport', slug: 'sports',
    sub: [
      { label: 'Exercise Equipment', slug: 'sports' },
      { label: 'Outdoor Sports', slug: 'sports' },
      { label: 'Team Sports', slug: 'sports' },
      { label: 'Sportswear', slug: 'sports' },
    ],
  },
  {
    label: 'Books & Media', icon: 'books', slug: 'books',
    sub: [
      { label: 'Books', slug: 'books' },
      { label: 'eBooks', slug: 'books' },
      { label: 'Music', slug: 'books' },
      { label: 'Movies', slug: 'books' },
    ],
  },
  {
    label: 'Furniture', icon: 'furniture', slug: 'furniture',
    sub: [
      { label: 'Sofas', slug: 'furniture' },
      { label: 'Beds & Mattresses', slug: 'furniture' },
      { label: 'Study Tables', slug: 'furniture' },
      { label: 'Wardrobes', slug: 'furniture' },
    ],
  },
];

export default function CategoryNav() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();
  const activeSlug     = searchParams.get('category') || null;
  const isHome         = location.pathname === '/';

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const leaveTimer = useRef(null);
  const navRef = useRef(null);

  function handleClick(slug) {
    setHoveredIdx(null);
    if (!slug) {
      navigate('/');
    } else if (isHome) {
      navigate(`/?category=${slug}`);
    } else {
      navigate(`/products?category=${slug}`);
    }
  }

  function handleMouseEnter(idx) {
    clearTimeout(leaveTimer.current);
    setHoveredIdx(idx);
  }

  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => setHoveredIdx(null), 180);
  }

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const hoveredItem = hoveredIdx !== null ? NAV_ITEMS[hoveredIdx] : null;

  return (
    <div className={styles.wrapper} ref={navRef}>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          {NAV_ITEMS.map((item, idx) => {
            const isActive = item.slug === null
              ? isHome && !activeSlug
              : activeSlug === item.slug;
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item.slug)}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
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

      {/* Mega-menu dropdown */}
      {hoveredItem && hoveredItem.sub.length > 0 && (
        <div
          className={styles.megaMenu}
          onMouseEnter={() => clearTimeout(leaveTimer.current)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.megaInner}>
            <p className={styles.megaTitle}>{hoveredItem.label}</p>
            <div className={styles.megaGrid}>
              {hoveredItem.sub.map((sub) => (
                <button
                  key={sub.label}
                  className={styles.megaItem}
                  onClick={() => {
                    setHoveredIdx(null);
                    if (isHome) navigate(`/?category=${sub.slug}`);
                    else navigate(`/products?category=${sub.slug}`);
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
