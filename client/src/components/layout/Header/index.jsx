import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/store/slices/authSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { setWishlistIds } from '@/store/slices/wishlistSlice';
import {
  Search, ShoppingCart, User, ChevronDown,
  Package, MapPin, LogOut, UserCircle, Heart,
} from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const dispatch          = useDispatch();
  const navigate          = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const cartCount         = useSelector((s) => s.cart.itemCount);
  const wishlistCount     = useSelector((s) => s.wishlist.productIds.length);
  const [query, setQuery]       = useState('');
  const [showUserDrop, setShowUserDrop] = useState(false);
  const [showMoreDrop, setShowMoreDrop] = useState(false);
  const userDropRef = useRef(null);
  const moreDropRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setShowUserDrop(false);
      if (moreDropRef.current && !moreDropRef.current.contains(e.target)) setShowMoreDrop(false);
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
    setShowUserDrop(false);
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.mainBar}>
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>
              Flipkart<span className={styles.logoPlus}>+</span>
            </span>
            <span className={styles.logoSub}>Explore <span style={{ color: '#ffe51f' }}>Plus</span></span>
          </Link>

          {/* Search */}
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

          {/* Nav actions — order: User/Login | More | Cart */}
          <nav className={styles.navActions}>
            {/* Login / Account */}
            {isLoggedIn ? (
              <div className={styles.dropdownWrap} ref={userDropRef}>
                <button className={styles.navBtn} onClick={() => setShowUserDrop((v) => !v)}>
                  <div className={styles.navBtnIcon}>
                    <User size={16} />
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={13} />
                  </div>
                </button>
                {showUserDrop && (
                  <div className={styles.dropdown}>
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setShowUserDrop(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setShowUserDrop(false)}>
                      <Heart size={15} /> Wishlist
                      {wishlistCount > 0 && <span className={styles.dropBadge}>{wishlistCount}</span>}
                    </Link>
                    <Link to="/addresses" className={styles.dropdownItem} onClick={() => setShowUserDrop(false)}>
                      <MapPin size={15} /> Saved Addresses
                    </Link>
                    <div className={styles.dropdownSep} />
                    <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={styles.navBtn}>
                <div className={styles.navBtnIcon}>
                  <UserCircle size={16} />
                </div>
                <span>Login</span>
              </Link>
            )}

            {/* More */}
            <div className={styles.dropdownWrap} ref={moreDropRef}>
              <button className={styles.navBtn} onClick={() => setShowMoreDrop((v) => !v)}>
                <div className={styles.navBtnIcon}>
                  <span>More</span>
                  <ChevronDown size={13} />
                </div>
              </button>
              {showMoreDrop && (
                <div className={styles.dropdown} style={{ right: 0 }}>
                  <a href="#" className={styles.dropdownItem} onClick={(e) => e.preventDefault()}>
                    Gift Cards
                  </a>
                  <a href="#" className={styles.dropdownItem} onClick={(e) => e.preventDefault()}>
                    Help Centre
                  </a>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className={styles.navBtn} style={{ position: 'relative' }}>
              <div className={styles.navBtnIcon}>
                <ShoppingCart size={18} />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
