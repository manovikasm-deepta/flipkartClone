import { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';

export default function ImageGrid({ images = [], thumbnail, productName, isWishlisted, onWishlist }) {
  const allImages = images.length
    ? [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : thumbnail
    ? [{ url: thumbnail, displayOrder: 0 }]
    : [];

  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { setActive(0); }, [images]);

  const primaryUrl = allImages[active]?.url || thumbnail || `https://picsum.photos/seed/${productName}/400`;

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <>
      <div style={{
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        padding: '16px 12px',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>

          {/* Vertical thumbnail strip */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 56, flexShrink: 0 }}>
              {allImages.slice(0, 6).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: 56,
                    height: 56,
                    border: active === i ? '2px solid #2874f0' : '2px solid #e0e0e0',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 4,
                    background: '#fff',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.1s',
                  }}
                  onMouseEnter={(e) => { if (active !== i) e.currentTarget.style.borderColor = '#2874f0'; }}
                  onMouseLeave={(e) => { if (active !== i) e.currentTarget.style.borderColor = '#e0e0e0'; }}
                >
                  <img
                    src={img.url}
                    alt={`${productName} view ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${productName}${i}/80`; }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Main image */}
          <div
            onClick={() => setLightbox(true)}
            style={{
              flex: 1,
              height: 520,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-in',
              position: 'relative',
              padding: '0 8px',
            }}
          >
            <img
              src={primaryUrl}
              alt={productName}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${productName}/400`; }}
            />

            {/* Wishlist button */}
            {onWishlist && (
              <button
                onClick={(e) => { e.stopPropagation(); onWishlist(); }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 16,
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#e53e3e' : 'none'}
                  color={isWishlisted ? '#e53e3e' : '#888'}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.82)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <img
            src={primaryUrl}
            alt={productName}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 4,
              background: '#fff',
              padding: 12,
            }}
          />
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}
