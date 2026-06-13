import { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import styles from '../ProductDetail.module.css';

export default function ImageGrid({ images = [], thumbnail, productName, isWishlisted, onWishlist }) {
  const allImages = images.length
    ? [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : thumbnail
    ? [{ url: thumbnail, displayOrder: 0 }]
    : [];

  const [active, setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { setActive(0); }, [images]);

  const primaryUrl = allImages[active]?.url || thumbnail || `https://picsum.photos/seed/${productName}/400`;

  function openLightbox() { setLightbox(true); }
  function closeLightbox() { setLightbox(false); }

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) { if (e.key === 'Escape') closeLightbox(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <>
      <div className={styles.imageGrid}>
        <div className={styles.imageGridInner}>
          {/* Primary image */}
          <div className={styles.primaryWrap} onClick={openLightbox} title="Click to zoom">
            <img
              src={primaryUrl}
              alt={productName}
              className={styles.primaryImg}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${productName}/400`; }}
            />
            {onWishlist && (
              <button
                className={styles.wishlistOverlay}
                onClick={(e) => { e.stopPropagation(); onWishlist(); }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#e53e3e' : 'none'}
                  color={isWishlisted ? '#e53e3e' : '#888'}
                />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`${styles.thumbWrap} ${active === i ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
            >
              <img
                src={img.url}
                alt={`${productName} view ${i + 1}`}
                className={styles.thumbImg}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${productName}${i}/80`; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <img
            src={primaryUrl}
            alt={productName}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}
