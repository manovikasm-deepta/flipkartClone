import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SLIDES = [
  {
    id: 1,
    title: 'Big Billion Days',
    subtitle: 'Up to 80% off on Electronics & Mobiles',
    cta: 'Shop Electronics',
    href: '/products?category=electronics',
    bg: 'linear-gradient(130deg, #0d1b47 0%, #1a237e 40%, #2874f0 100%)',
    tag: '🔥 Limited Time',
    tagColor: '#ffe51f',
  },
  {
    id: 2,
    title: 'Fashion Fiesta',
    subtitle: 'Top brands at jaw-dropping prices',
    cta: 'Explore Fashion',
    href: '/products?category=fashion',
    bg: 'linear-gradient(130deg, #880e4f 0%, #c2185b 50%, #f06292 100%)',
    tag: '👗 New Arrivals',
    tagColor: '#fff176',
  },
  {
    id: 3,
    title: 'Appliance Sale',
    subtitle: 'Upgrade your home this season',
    cta: 'Shop Appliances',
    href: '/products?category=appliances',
    bg: 'linear-gradient(130deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
    tag: '🏠 Home Upgrade',
    tagColor: '#b9f6ca',
  },
  {
    id: 4,
    title: 'Book Marathon',
    subtitle: 'Knowledge at unbeatable prices',
    cta: 'Browse Books',
    href: '/products?category=books',
    bg: 'linear-gradient(130deg, #4a148c 0%, #6a1b9a 50%, #9c27b0 100%)',
    tag: '📚 Best Sellers',
    tagColor: '#e1bee7',
  },
  {
    id: 5,
    title: 'Super Deals',
    subtitle: 'Discounts you can\'t ignore — every category',
    cta: 'All Offers',
    href: '/products',
    bg: 'linear-gradient(130deg, #e65100 0%, #f57c00 50%, #ffa726 100%)',
    tag: '💥 Today Only',
    tagColor: '#fff9c4',
  },
];

export default function HeroBanner() {
  return (
    <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: 'var(--fk-shadow-sm)' }}>
      <style>{`
        .hero-swiper .swiper-pagination-bullet { background: rgba(255,255,255,0.6); opacity: 1; }
        .hero-swiper .swiper-pagination-bullet-active { background: #fff; }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev { color: rgba(255,255,255,0.8); }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after { font-size: 20px; }
      `}</style>
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        speed={600}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              style={{
                background: slide.bg,
                aspectRatio: '9/2',
                display: 'flex',
                alignItems: 'center',
                padding: '0 60px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <div style={{
                position: 'absolute', right: -60, top: -60,
                width: 380, height: 380,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', right: 40, bottom: -80,
                width: 220, height: 220,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
                {/* Tag chip */}
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(0,0,0,0.25)',
                  color: slide.tagColor,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 20,
                  marginBottom: 10,
                  letterSpacing: 0.4,
                }}>
                  {slide.tag}
                </span>

                <h1 style={{
                  color: '#fff',
                  fontSize: 'clamp(22px, 3vw, 40px)',
                  fontWeight: 800,
                  margin: '0 0 6px',
                  lineHeight: 1.15,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  {slide.title}
                </h1>

                <p style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 'clamp(12px, 1.5vw, 17px)',
                  margin: '0 0 18px',
                }}>
                  {slide.subtitle}
                </p>

                <Link
                  to={slide.href}
                  style={{
                    display: 'inline-block',
                    background: '#fff',
                    color: '#333',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '10px 24px',
                    borderRadius: 4,
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {slide.cta} →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
