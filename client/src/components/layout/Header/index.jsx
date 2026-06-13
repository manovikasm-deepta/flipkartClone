import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/store/slices/authSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { setWishlistIds } from '@/store/slices/wishlistSlice';
import {
  Search, ShoppingCart, User, ChevronDown, Heart,
  Package, MapPin, LogOut, UserCircle,
} from 'lucide-react';
import styles from './Header.module.css';

const CATEGORIES = [
  { label: 'For You',         slug: '',              icon: '⭐' },
  { label: 'Mobiles',         slug: 'mobiles',       icon: '📱' },
  { label: 'Fashion',         slug: 'fashion',       icon: '👗' },
  { label: 'Electronics',     slug: 'electronics',   icon: '💻' },
  { label: 'Beauty',          slug: 'beauty',        icon: '💄' },
  { label: 'Home',            slug: 'home',          icon: '🏠' },
  { label: 'Appliances',      slug: 'appliances',    icon: '🧲' },
  { label: 'Toys',            slug: 'toys',          icon: '🎮' },
  { label: 'Sports',          slug: 'sports-fitness',icon: '🏃' },
  { label: 'Books',           slug: 'books-media',   icon: '📚' },
  { label: 'Furniture',       slug: 'furniture',     icon: '🛋️' },
  { label: 'Auto Acc.',       slug: 'auto-accessories',icon: '🚗' },
  { label: 'Food & H.',       slug: 'food-health',   icon: '🍎' },
  { label: '2 Wheelers',      slug: 'two-wheelers',  icon: '🏍️' },
];

export default function Header() {
  const dispatch         = useDispatch();
  const navigate         = useNavigate();
  const [params]         = useSearchParams();
  const { user, isLoggedIn } = useAuth();
  const cartCount        = useSelector((s) => s.cart.itemCount);
  const wishlistCount    = useSelector((s) => s.wishlist.productIds.length);
  const [query, setQuery]     = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef(null);

  const activeCategory = params.get('category') || '';

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(clearCartState());
    dispatch(setWishlistIds([]));
    setShowDrop(false);
    navigate('/');
  }

  function navToCategory(slug) {
    if (slug) navigate(`/products?category=${slug}`);
    else navigate('/products');
  }

  return (
    <header className={styles.header}>
      {/* ── Main bar ─────────────────────────────────────────── */}
      <div className={styles.mainBar}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>
              Flipkart<span className={styles.logoPlus}>+</span>
            </span>
            <span className={styles.logoSub}>Explore <span style={{ color: '#ffe51f' }}>Plus</span></span>
          </Link>

          <div className={styles.searchWrap}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <Search size={20} />
              </button>
            </form>
          </div>

          <nav className={styles.navActions}>
            {/* Wishlist */}
            <Link to="/wishlist" className={styles.navBtn}>
              <div className={styles.navBtnIcon}>
                <Heart size={18} />
              </div>
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div className={styles.dropdownWrap} ref={dropRef}>
                <button
                  className={styles.navBtn}
                  onClick={() => setShowDrop((v) => !v)}
                >
                  <div className={styles.navBtnIcon}>
                    <User size={18} />
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={14} />
                  </div>
                </button>
                {showDrop && (
                  <div className={styles.dropdown}>
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setShowDrop(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setShowDrop(false)}>
                      <Heart size={15} /> Wishlist
                    </Link>
                    <Link to="/addresses" className={styles.dropdownItem} onClick={() => setShowDrop(false)}>
                      <MapPin size={15} /> Saved Addresses
                    </Link>
                    <div className={styles.dropdownSep} />
                    <button
                      className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                      onClick={handleLogout}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={styles.navBtn}>
                <div className={styles.navBtnIcon}>
                  <UserCircle size={18} />
                </div>
                <span>Login</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className={styles.navBtn}>
              <div className={styles.navBtnIcon} style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Category bar ─────────────────────────────────────── */}
      <div className={styles.catBar}>
        <ul className={styles.catList}>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <button
                className={`${styles.catItem} ${activeCategory === cat.slug ? styles.catItemActive : ''}`}
                onClick={() => navToCategory(cat.slug)}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catLabel}>{cat.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
