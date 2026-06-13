import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '@/services/api';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import PriceBlock from '@/components/common/PriceBlock';
import RatingStars from '@/components/common/RatingStars';
import SkeletonLoader from '@/components/common/SkeletonLoader';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const { isLoggedIn } = useAuth();
  const productIds    = useSelector((s) => s.wishlist.productIds);

  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [qty,      setQty]      = useState(1);
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getById(productId)
      .then((r) => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [productId, navigate]);

  const isWishlisted = product ? productIds.includes(product.id) : false;

  async function handleAddToCart() {
    if (!isLoggedIn) { toast.error('Please login'); navigate('/login'); return; }
    setAdding(true);
    const res = await dispatch(addToCart({ productId: product.id, quantity: qty }));
    setAdding(false);
    if (addToCart.fulfilled.match(res)) { toast.success('Added to cart'); navigate('/cart'); }
    else toast.error(res.payload || 'Failed');
  }

  async function handleBuyNow() {
    if (!isLoggedIn) { toast.error('Please login'); navigate('/login'); return; }
    setAdding(true);
    const res = await dispatch(addToCart({ productId: product.id, quantity: qty }));
    setAdding(false);
    if (addToCart.fulfilled.match(res)) navigate('/checkout');
    else toast.error(res.payload || 'Failed');
  }

  async function handleWishlist() {
    if (!isLoggedIn) { toast.error('Please login'); navigate('/login'); return; }
    const res = await dispatch(toggleWishlist(product.id));
    if (toggleWishlist.fulfilled.match(res)) {
      toast(res.payload.action === 'added' ? 'Saved to wishlist' : 'Removed from wishlist');
    }
  }

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
      <SkeletonLoader variant="detail" count={1} />
    </div>
  );
  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ url: product.thumbnail || `https://picsum.photos/seed/${product.id}/400/400` }];

  return (
    <div style={{ background: 'var(--fk-page-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
        <div style={{ background: '#fff', borderRadius: 4, boxShadow: 'var(--fk-shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Image gallery */}
            <div style={{ width: 380, flexShrink: 0, padding: 24, borderRight: '1px solid var(--fk-border-light)', position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
              <div style={{ position: 'relative', aspectRatio: '1', background: '#f5f5f5', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <img src={images[imgIdx]?.url || images[0]?.url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }} />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{ width: 52, height: 52, border: `2px solid ${i === imgIdx ? 'var(--fk-blue)' : 'var(--fk-border)'}`, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: '#f5f5f5', padding: 0 }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                    </button>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                <button onClick={handleAddToCart} disabled={!product.inStock || adding}
                  style={{ flex: 1, background: 'var(--fk-add-to-cart)', color: '#fff', border: 'none', borderRadius: 4, padding: '14px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: !product.inStock ? 0.5 : 1 }}>
                  <ShoppingCart size={16} /> ADD TO CART
                </button>
                <button onClick={handleBuyNow} disabled={!product.inStock || adding}
                  style={{ flex: 1, background: 'var(--fk-buy-now)', color: '#fff', border: 'none', borderRadius: 4, padding: '14px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: !product.inStock ? 0.5 : 1 }}>
                  <Zap size={16} /> BUY NOW
                </button>
              </div>
            </div>

            {/* Product info */}
            <div style={{ flex: 1, padding: 24, minWidth: 300 }}>
              {product.brand && <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{product.brand}</p>}
              <h1 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="lg" />
                {!product.inStock && (
                  <span style={{ fontSize: 13, color: '#e53e3e', fontWeight: 600, background: '#ffebee', padding: '2px 8px', borderRadius: 3 }}>Out of Stock</span>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--fk-border-light)', paddingTop: 16, marginBottom: 16 }}>
                <PriceBlock mrp={product.mrp} sellingPrice={product.sellingPrice} discountPct={product.discountPct} size="lg" />
              </div>

              {product.inStock && (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fk-text-secondary)' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--fk-border)', borderRadius: 4 }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>−</button>
                    <span style={{ padding: '0 14px', fontWeight: 600, fontSize: 15 }}>{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(10, q + 1))}
                      style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>+</button>
                  </div>
                  <button onClick={handleWishlist}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: isWishlisted ? '#e53e3e' : 'var(--fk-text-secondary)', fontSize: 13, fontWeight: 500 }}>
                    <Heart size={18} fill={isWishlisted ? '#e53e3e' : 'none'} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              )}

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{ borderTop: '1px solid var(--fk-border-light)', paddingTop: 16, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Specifications</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <tbody>
                      {Object.entries(product.specs).map(([k, v]) => (
                        <tr key={k}>
                          <td style={{ padding: '8px 12px', background: 'var(--fk-page-bg)', fontWeight: 500, width: '38%', border: '1px solid var(--fk-border-light)', verticalAlign: 'top' }}>{k}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--fk-border-light)', verticalAlign: 'top' }}>{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {product.description && (
                <div style={{ borderTop: '1px solid var(--fk-border-light)', paddingTop: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Description</h3>
                  <p style={{ fontSize: 14, color: 'var(--fk-text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
