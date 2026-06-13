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
      { label: "Men's Clothing", search: "men's clothing" },
      { label: "Women's Clothing", search: "women's clothing" },
      { label: 'Footwear', search: 'footwear' },
      { label: 'Accessories', search: 'accessories' },
      { label: 'Kids Fashion', search: 'kids' },
      { label: 'Innerwear', search: 'innerwear' },
    ],
  },
  {
    label: 'Mobiles', icon: FK_SVG('mobiles'), slug: 'mobiles',
    sub: [
      { label: 'Smartphones', search: 'smartphone' },
      { label: 'Feature Phones', search: 'feature phone' },
      { label: 'Mobile Accessories', search: 'mobile accessories' },
      { label: 'Tablets', search: 'tablet' },
      { label: 'Smart Watches', search: 'smart watch' },
    ],
  },
  {
    label: 'Beauty', icon: FK_SVG('beauty'), slug: 'beauty',
    sub: [
      { label: 'Skincare', search: 'skincare' },
      { label: 'Haircare', search: 'haircare' },
      { label: 'Fragrances', search: 'fragrance' },
      { label: 'Makeup', search: 'makeup' },
      { label: 'Men Grooming', search: 'grooming' },
    ],
  },
  {
    label: 'Electronics', icon: FK_SVG('electronics'), slug: 'electronics',
    sub: [
      { label: 'Laptops', search: 'laptop' },
      { label: 'Headphones', search: 'headphone' },
      { label: 'Cameras', search: 'camera' },
      { label: 'Smart Speakers', search: 'speaker' },
      { label: 'Accessories', search: 'accessories' },
    ],
  },
  {
    label: 'Home', icon: FK_SVG('home'), slug: 'home-furniture',
    sub: [
      { label: 'Bedding', search: 'bedding' },
      { label: 'Kitchen Tools', search: 'kitchen' },
      { label: 'Decor', search: 'decor' },
      { label: 'Furniture', search: 'furniture' },
      { label: 'Lighting', search: 'lighting' },
    ],
  },
  {
    label: 'Toys & Baby', icon: FK_SVG('toy'), slug: 'toys',
    sub: [
      { label: 'Toys', search: 'toy' },
      { label: 'Baby Gear', search: 'baby' },
      { label: 'Baby Clothing', search: 'baby clothing' },
      { label: 'Stationery', search: 'stationery' },
    ],
  },
  {
    label: 'Sports', icon: FK_SVG('sport'), slug: 'sports',
    sub: [
      { label: 'Exercise Equipment', search: 'exercise' },
      { label: 'Outdoor Sports', search: 'outdoor' },
      { label: 'Team Sports', search: 'team sports' },
      { label: 'Sportswear', search: 'sportswear' },
    ],
  },
  {
    label: 'Books', icon: FK_SVG('books'), slug: 'books',
    sub: [
      { label: 'Books', search: 'book' },
      { label: 'eBooks', search: 'ebook' },
      { label: 'Music', search: 'music' },
      { label: 'Movies', search: 'movie' },
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
