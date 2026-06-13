import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/" className="hover:text-white">About Us</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
            <li><Link to="/" className="hover:text-white">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Help</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Payments</Link></li>
            <li><Link to="/" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/" className="hover:text-white">Cancellation & Returns</Link></li>
            <li><Link to="/" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Policy</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Return Policy</Link></li>
            <li><Link to="/" className="hover:text-white">Terms of Use</Link></li>
            <li><Link to="/" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/" className="hover:text-white">Sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2">
            <li><Link to="/products?category=mobiles"    className="hover:text-white">Mobiles</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=fashion"    className="hover:text-white">Fashion</Link></li>
            <li><Link to="/products?category=books"      className="hover:text-white">Books</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Flipkart Clone. Built with React & Node.js.
      </div>
    </footer>
  );
}
