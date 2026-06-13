import { Link, useNavigate }                            from 'react-router-dom';
import { ShoppingCart, Search, LogOut, Package,
         ChevronDown, Heart }                           from 'lucide-react';
import { useState, useRef, useEffect }                  from 'react';
import { useDispatch, useSelector }                     from 'react-redux';
import { useAuth }                                      from '@/hooks/useAuth';
import { logout }                                       from '@/store/slices/authSlice';

export default function Header() {
  const dispatch                         = useDispatch();
  const navigate                         = useNavigate();
  const { user, isAuthenticated }        = useAuth();
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const [query,    setQuery]    = useState('');
  const [dropdown, setDropdown] = useState(false);
  const dropRef                 = useRef(null);

  useEffect(() => {
    function outside(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false); }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header style={{ background: '#2874f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 56 }}>

        {/* ── Logo ─────────────────────────────────────── */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 4 }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{ color: '#fff', fontStyle: 'italic', fontWeight: 700, fontSize: 20 }}>Flipkart</div>
            <div style={{ color: '#ffe11a', fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontStyle: 'italic' }}>Explore</span>
              <span style={{ fontStyle: 'italic', fontWeight: 600 }}>Plus</span>
              <span>✦</span>
            </div>
          </div>
        </Link>

        {/* ── Search ───────────────────────────────────── */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 664 }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: 2, height: 36, overflow: 'hidden' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0 14px', fontSize: 14, color: '#212121', fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              style={{ background: '#fff', border: 'none', borderLeft: '1px solid #f0f0f0', padding: '0 16px', cursor: 'pointer', color: '#2874f0', display: 'flex', alignItems: 'center' }}
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* ── Right nav ────────────────────────────────── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto', flexShrink: 0 }}>

          {isAuthenticated ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdown((v) => !v)}
                style={{ background: '#fff', color: '#2874f0', border: 'none', borderRadius: 2, padding: '5px 12px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                {user?.name?.split(' ')[0] || 'Account'}
                <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: 220, zIndex: 200, overflow: 'hidden' }}>
                  <Link to="/orders"   onClick={() => setDropdown(false)} style={dropLink}><Package size={16} /> My Orders</Link>
                  <Link to="/wishlist" onClick={() => setDropdown(false)} style={dropLink}><Heart size={16} />   Wishlist</Link>
                  <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
                  <button onClick={() => { dispatch(logout()); setDropdown(false); navigate('/'); }} style={{ ...dropLink, color: '#ff4343', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ background: '#fff', color: '#2874f0', borderRadius: 2, padding: '5px 20px', fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Login
            </Link>
          )}

          <a href="#" style={{ color: '#fff', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', fontWeight: 500 }}>
            Become a Seller
          </a>

          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', textDecoration: 'none' }}>
            <span style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -7, background: '#ff6161', color: '#fff', borderRadius: 10, minWidth: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

const dropLink = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 16px', fontSize: 14, color: '#212121', textDecoration: 'none',
};
