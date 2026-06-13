import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './CategoryNav.module.css';

const FK_SVG = (name) => `https://static-assets-web.flixcart.com/apex-static/images/svgs/L1Nav/${name}.svg`;

const NAV_ITEMS = [
  {
    label: 'For You', icon: FK_SVG('home'), slug: null,
    sub: [],
  },
  {
    label: 'Fashion', icon: FK_SVG('fashion'), slug: 'fashion',
    sub: [
      { label: "Men's Clothing", search: 'men' },
      { label: "Women's Clothing", search: 'women' },
      { label: 'Footwear', search: 'shoes' },
      { label: 'Accessories', search: null },
      { label: 'Kids Fashion', search: null },
      { label: 'Innerwear', search: null },
    ],
  },
  {
    label: 'Mobiles', icon: FK_SVG('mobiles'), slug: 'mobiles',
    sub: [
      { label: 'Smartphones', search: null },
      { label: 'Feature Phones', search: null },
      { label: 'Mobile Accessories', search: null },
      { label: 'Tablets', search: null },
      { label: 'Smart Watches', search: null },
    ],
  },
  {
    label: 'Beauty', icon: FK_SVG('beauty'), slug: 'beauty',
    sub: [
      { label: 'Skincare', search: 'face' },
      { label: 'Haircare', search: 'shampoo' },
      { label: 'Fragrances', search: null },
      { label: 'Makeup', search: 'lip' },
      { label: 'Men Grooming', search: null },
    ],
  },
  {
    label: 'Electronics', icon: FK_SVG('electronics'), slug: 'electronics',
    sub: [
      { label: 'Laptops', search: 'laptop' },
      { label: 'Headphones', search: 'headphone' },
      { label: 'Cameras', search: 'camera' },
      { label: 'Smart Speakers', search: 'speaker' },
      { label: 'Accessories', search: null },
    ],
  },
  {
    label: 'Home', icon: FK_SVG('home'), slug: 'home-furniture',
    sub: [
      { label: 'Bedding', search: 'mattress' },
      { label: 'Kitchen Tools', search: 'kitchen' },
      { label: 'Decor', search: null },
      { label: 'Furniture', search: 'table' },
      { label: 'Lighting', search: null },
    ],
  },
  {
    label: 'Toys & Baby', icon: FK_SVG('toy'), slug: 'toys',
    sub: [
      { label: 'Toys', search: null },
      { label: 'Baby Gear', search: 'baby' },
      { label: 'Baby Clothing', search: 'baby' },
      { label: 'Stationery', search: null },
    ],
  },
  {
    label: 'Sports', icon: FK_SVG('sport'), slug: 'sports',
    sub: [
      { label: 'Exercise Equipment', search: 'gym' },
      { label: 'Outdoor Sports', search: null },
      { label: 'Team Sports', search: 'football' },
      { label: 'Sportswear', search: 'running' },
    ],
  },
  {
    label: 'Books', icon: FK_SVG('books'), slug: 'books',
    sub: [
      { label: 'Books', search: null },
      { label: 'eBooks', search: null },
      { label: 'Music', search: null },
      { label: 'Movies', search: null },
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
    } else {
      navigate(`/?category=${slug}`);
    }
  }

  function handleSubClick(parentSlug, searchTerm) {
    setHoveredIdx(null);
    const params = new URLSearchParams();
    if (parentSlug) params.set('category', parentSlug);
    if (searchTerm) params.set('search', searchTerm);
    navigate(`/products?${params.toString()}`);
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
                  <img src={item.icon} alt="" className={styles.iconImg} loading="lazy" />
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
                  onClick={() => handleSubClick(hoveredItem.slug, sub.search)}
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
