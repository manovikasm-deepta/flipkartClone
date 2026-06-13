import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const SLIDES = [
  {
    id: 1,
    bg: '#fff8e1',
    textColor: '#212121',
    accentColor: '#e65100',
    tag: 'BIG BILLION DAYS',
    tagBg: '#e65100',
    title: 'Apple iPhone 15 Pro',
    subtitle: 'Up to 11% Off',
    extra: 'Starting ₹1,19,900',
    cta: 'Buy Now',
    href: '/products?category=mobiles',
    img: 'https://loremflickr.com/340/280/iphone?lock=1',
    gradient: 'linear-gradient(120deg, #fff8e1 0%, #ffe0b2 100%)',
  },
  {
    id: 2,
    bg: '#fce4ec',
    textColor: '#212121',
    accentColor: '#c2185b',
    tag: 'FASHION FIESTA',
    tagBg: '#c2185b',
    title: 'Back to Campus',
    subtitle: 'Up to 80% Off',
    extra: 'Top Brands · All Styles',
    cta: 'Explore Fashion',
    href: '/products?category=fashion',
    img: 'https://loremflickr.com/340/280/fashion?lock=1',
    gradient: 'linear-gradient(120deg, #fce4ec 0%, #f8bbd0 100%)',
  },
  {
    id: 3,
    bg: '#e3f2fd',
    textColor: '#212121',
    accentColor: '#1565c0',
    tag: 'BESTSELLER',
    tagBg: '#1565c0',
    title: 'Sony WH-1000XM5',
    subtitle: 'Up to 29% Off',
    extra: 'Noise Cancelling Headphones',
    cta: 'Shop Now',
    href: '/products?category=electronics',
    img: 'https://loremflickr.com/340/280/headphones?lock=1',
    gradient: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 100%)',
  },
  {
    id: 4,
    bg: '#e8f5e9',
    textColor: '#212121',
    accentColor: '#2e7d32',
    tag: 'HOT DEAL',
    tagBg: '#2e7d32',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Up to 19% Off',
    extra: '200MP Camera · S Pen Included',
    cta: 'Buy Now',
    href: '/products?category=mobiles',
    img: 'https://loremflickr.com/340/280/smartphone?lock=2',
    gradient: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
  },
  {
    id: 5,
    bg: '#ede7f6',
    textColor: '#212121',
    accentColor: '#6a1b9a',
    tag: 'SUPER DEALS',
    tagBg: '#6a1b9a',
    title: 'Bestselling Books',
    subtitle: 'Starting ₹199',
    extra: 'Atomic Habits · Sapiens & more',
    cta: 'Browse Books',
    href: '/products?category=books',
    img: 'https://loremflickr.com/340/280/book?lock=1',
    gradient: 'linear-gradient(120deg, #ede7f6 0%, #d1c4e9 100%)',
  },
];

export default function HeroBanner() {
  return (
    <div>
      <style>{`
        .hero-swiper .swiper-pagination-bullet {
          background: rgba(0,0,0,0.25); opacity: 1; width: 7px; height: 7px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #2874f0; width: 18px; border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 10px;
        }
      `}</style>
      <Swiper
        className="hero-swiper"
        style={{ background: '#fff' }}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={500}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Outer: page background — no colour bleeds to the sides */}
            <div style={{
              background: '#fff',
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Inner: gradient confined to content width */}
              <div style={{
                width: '100%',
                maxWidth: 1280,
                height: '100%',
                background: slide.gradient,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                boxSizing: 'border-box',
                borderRadius: 4,
              }}>
              {/* decorative circles */}
              <div style={{
                position: 'absolute', right: -60, top: -60,
                width: 340, height: 340,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', right: 40, bottom: -80,
                width: 200, height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                pointerEvents: 'none',
              }} />
                {/* Left — text */}
                <div style={{ flex: '0 0 auto', maxWidth: 380 }}>
                  <span style={{
                    display: 'inline-block',
                    background: slide.tagBg,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 2,
                    letterSpacing: 1,
                    marginBottom: 12,
                  }}>
                    {slide.tag}
                  </span>

                  <h2 style={{
                    color: slide.textColor,
                    fontSize: 'clamp(22px, 2.4vw, 36px)',
                    fontWeight: 800,
                    margin: '0 0 6px',
                    lineHeight: 1.15,
                  }}>
                    {slide.title}
                  </h2>

                  <p style={{
                    color: slide.accentColor,
                    fontSize: 'clamp(15px, 1.6vw, 22px)',
                    fontWeight: 700,
                    margin: '0 0 4px',
                  }}>
                    {slide.subtitle}
                  </p>

                  <p style={{
                    color: '#555',
                    fontSize: 13,
                    margin: '0 0 20px',
                  }}>
                    {slide.extra}
                  </p>

                  <Link
                    to={slide.href}
                    style={{
                      display: 'inline-block',
                      background: slide.accentColor,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '10px 28px',
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
                  width: 'clamp(180px, 28vw, 280px)',
                  height: 240,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img
                    src={slide.img}
                    alt={slide.title}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.18))',
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
