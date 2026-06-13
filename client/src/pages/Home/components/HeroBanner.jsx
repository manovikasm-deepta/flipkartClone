import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SLIDES = [
  {
    id: 1,
    bg: '#0d1b47',
    tag: 'BIG BILLION DAYS',
    tagColor: '#ffe11a',
    title: 'Apple iPhone 15 Pro',
    subtitle: 'Up to 11% Off',
    extra: 'Starting ₹1,19,900',
    cta: 'Buy Now',
    href: '/products?category=mobiles',
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=420&h=300&fit=crop&auto=format',
    imgBg: 'radial-gradient(circle at 60% 50%, #1a3a8f 0%, #0d1b47 70%)',
  },
  {
    id: 2,
    bg: '#1a1a2e',
    tag: 'BESTSELLER',
    tagColor: '#ffe11a',
    title: 'Sony WH-1000XM5',
    subtitle: 'Up to 29% Off',
    extra: 'Noise Cancelling Headphones',
    cta: 'Shop Now',
    href: '/products?category=electronics',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=420&h=300&fit=crop&auto=format',
    imgBg: 'radial-gradient(circle at 65% 50%, #2d2d60 0%, #1a1a2e 70%)',
  },
  {
    id: 3,
    bg: '#880e4f',
    tag: 'FASHION FIESTA',
    tagColor: '#fff176',
    title: 'Nike Air Max 270',
    subtitle: 'Up to 31% Off',
    extra: 'Top Running Shoes',
    cta: 'Explore Now',
    href: '/products?category=fashion',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=420&h=300&fit=crop&auto=format',
    imgBg: 'radial-gradient(circle at 65% 50%, #c2185b 0%, #880e4f 70%)',
  },
  {
    id: 4,
    bg: '#004d40',
    tag: 'HOT DEAL',
    tagColor: '#b9f6ca',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Up to 19% Off',
    extra: '200MP Camera · S Pen Included',
    cta: 'Buy Now',
    href: '/products?category=mobiles',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=420&h=300&fit=crop&auto=format',
    imgBg: 'radial-gradient(circle at 65% 50%, #00695c 0%, #004d40 70%)',
  },
  {
    id: 5,
    bg: '#4a148c',
    tag: 'SUPER DEALS',
    tagColor: '#e1bee7',
    title: 'Bestselling Books',
    subtitle: 'Starting ₹199',
    extra: 'Atomic Habits · Sapiens & more',
    cta: 'Browse Books',
    href: '/products?category=books',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=420&h=300&fit=crop&auto=format',
    imgBg: 'radial-gradient(circle at 65% 50%, #6a1b9a 0%, #4a148c 70%)',
  },
];

export default function HeroBanner() {
  return (
    <div style={{ overflow: 'hidden', boxShadow: 'var(--fk-shadow-sm)' }}>
      <style>{`
        .hero-swiper .swiper-pagination-bullet { background: rgba(255,255,255,0.5); opacity: 1; width: 8px; height: 8px; }
        .hero-swiper .swiper-pagination-bullet-active { background: #fff; width: 20px; border-radius: 4px; }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev { color: rgba(255,255,255,0.7); transform: scale(0.7); }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover { color: #fff; }
      `}</style>
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        speed={500}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div style={{
              background: slide.bg,
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* full-width bg glow on the right */}
              <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: '55%',
                background: slide.imgBg,
                pointerEvents: 'none',
                zIndex: 1,
              }} />

              {/* inner: constrained width, flex row */}
              <div style={{
                width: '100%',
                maxWidth: 1280,
                padding: '0 52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
                height: '100%',
              }}>
                {/* Left — text */}
                <div style={{ flex: '0 0 auto', maxWidth: 340 }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.15)',
                    color: slide.tagColor,
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 10px',
                    borderRadius: 2,
                    letterSpacing: 1.2,
                    marginBottom: 10,
                  }}>
                    {slide.tag}
                  </span>

                  <h2 style={{
                    color: '#fff',
                    fontSize: 'clamp(18px, 2.2vw, 28px)',
                    fontWeight: 800,
                    margin: '0 0 4px',
                    lineHeight: 1.2,
                  }}>
                    {slide.title}
                  </h2>

                  <p style={{
                    color: slide.tagColor,
                    fontSize: 'clamp(14px, 1.6vw, 20px)',
                    fontWeight: 700,
                    margin: '0 0 4px',
                  }}>
                    {slide.subtitle}
                  </p>

                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 13,
                    margin: '0 0 16px',
                  }}>
                    {slide.extra}
                  </p>

                  <Link
                    to={slide.href}
                    style={{
                      display: 'inline-block',
                      background: '#fff',
                      color: '#212121',
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '8px 22px',
                      borderRadius: 2,
                      textDecoration: 'none',
                      letterSpacing: 0.3,
                    }}
                  >
                    {slide.cta}
                  </Link>
                </div>

                {/* Right — product image */}
                <div style={{
                  flex: '0 0 auto',
                  width: 'clamp(160px, 28vw, 260px)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={slide.img}
                    alt={slide.title}
                    style={{
                      height: '85%',
                      width: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
                    }}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
