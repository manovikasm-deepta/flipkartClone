import { Link, useNavigate }              from 'react-router-dom';
import { ShoppingCart, Heart, Search,
         User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect }    from 'react';
import { useSelector }                    from 'react-redux';
import { useAuth }                        from '@/hooks/useAuth';

export default function Header() {
  const navigate           = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const cartCount          = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount      = useSelector((s) => s.wishlist.productIds.length);
  const [query, setQuery]  = useState('');
  const [dropdown, setDropdown] = useState(false);
  const dropRef            = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <span className="text-white font-bold text-xl tracking-tight italic">
            Flipkart
            <span className="text-amber-300 text-xs font-normal normal-case ml-0.5">clone</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full pl-4 pr-10 py-2 rounded text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-blue-600 hover:text-blue-800"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-1 ml-auto">
          <Link
            to="/wishlist"
            className="relative flex flex-col items-center px-3 py-1 text-white hover:bg-blue-700 rounded transition-colors"
          >
            <Heart size={20} />
            <span className="text-xs">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex flex-col items-center px-3 py-1 text-white hover:bg-blue-700 rounded transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdown((v) => !v)}
                className="flex flex-col items-center px-3 py-1 text-white hover:bg-blue-700 rounded transition-colors"
              >
                <User size={20} />
                <span className="flex items-center gap-0.5 text-xs">
                  {user?.name?.split(' ')[0]}
                  <ChevronDown size={12} />
                </span>
              </button>
              {dropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg border py-1 z-50">
                  <Link
                    to="/orders"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={16} /> My Orders
                  </Link>
                  <button
                    onClick={() => { signOut(); setDropdown(false); navigate('/'); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center px-3 py-1 text-white hover:bg-blue-700 rounded transition-colors"
            >
              <User size={20} />
              <span className="text-xs">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
