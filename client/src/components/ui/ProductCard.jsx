import { Link }                from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart }          from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { useAuth }            from '@/hooks/useAuth';
import StarRating             from './StarRating';
import toast                  from 'react-hot-toast';

function fmt(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export default function ProductCard({ product }) {
  const dispatch        = useDispatch();
  const { isAuthenticated } = useAuth();
  const wishlistItems   = useSelector((s) => s.wishlist.items);
  const wishlistEntry   = wishlistItems.find((w) => w.product_id === product.id);
  const image           = product.images?.[0]?.url ?? `https://picsum.photos/seed/${product.slug}/400/400`;

  async function handleCartClick(e) {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    const res = await dispatch(addToCart({ product_id: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(res)) toast.success('Added to cart');
    else toast.error(res.payload || 'Failed to add to cart');
  }

  async function handleWishlistClick(e) {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save items'); return; }
    if (wishlistEntry) {
      await dispatch(removeFromWishlist(wishlistEntry.id));
      toast('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(product.id));
      toast.success('Saved to wishlist');
    }
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
          {product.badge}
        </span>
      )}

      <button
        onClick={handleWishlistClick}
        aria-label="Toggle wishlist"
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white shadow hover:bg-gray-50"
      >
        <Heart
          size={16}
          className={wishlistEntry ? 'text-red-500 fill-red-500' : 'text-gray-400'}
        />
      </button>

      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        {product.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
        )}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.review_count} />

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">{fmt(product.selling_price)}</span>
          {Number(product.discount_pct) > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">{fmt(product.mrp)}</span>
              <span className="text-xs font-semibold text-green-600">
                {Math.round(product.discount_pct)}% off
              </span>
            </>
          )}
        </div>

        {!product.in_stock && (
          <p className="text-xs text-red-500 font-medium">Out of stock</p>
        )}

        {product.in_stock && (
          <button
            onClick={handleCartClick}
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded bg-amber-400 hover:bg-amber-500 text-sm font-semibold text-gray-900 transition-colors"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
