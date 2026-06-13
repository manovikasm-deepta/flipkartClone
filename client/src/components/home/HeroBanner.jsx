import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link }                 from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const SLIDES = [
  {
    id: 1,
    title:    'Big Billion Days',
    subtitle: 'Up to 80% off on Electronics',
    cta:      'Shop Now',
    href:     '/products?category=electronics',
    bg:       'from-blue-900 to-blue-600',
    img:      'https://picsum.photos/seed/electronics-banner/900/400',
  },
  {
    id: 2,
    title:    'Mobile Bonanza',
    subtitle: 'Latest 5G Smartphones at Lowest Prices',
    cta:      'Explore Mobiles',
    href:     '/products?category=mobiles',
    bg:       'from-purple-900 to-purple-600',
    img:      'https://picsum.photos/seed/mobiles-banner/900/400',
  },
  {
    id: 3,
    title:    'Fashion Festival',
    subtitle: 'Top brands. Unbeatable deals.',
    cta:      'Shop Fashion',
    href:     '/products?category=fashion',
    bg:       'from-pink-900 to-pink-600',
    img:      'https://picsum.photos/seed/fashion-banner/900/400',
  },
];

export default function HeroBanner() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="w-full rounded-b-lg overflow-hidden"
    >
      {SLIDES.map((slide) => (
        <SwiperSlide key={slide.id}>
          <Link to={slide.href}>
            <div className={`relative bg-gradient-to-r ${slide.bg} h-48 md:h-72 flex items-center`}>
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative z-10 px-10 text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow">{slide.title}</h2>
                <p className="mt-2 text-base md:text-xl">{slide.subtitle}</p>
                <span className="mt-4 inline-block bg-amber-400 text-gray-900 font-bold px-6 py-2 rounded hover:bg-amber-300 transition-colors">
                  {slide.cta}
                </span>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
