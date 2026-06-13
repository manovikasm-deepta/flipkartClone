-- Update product images with category-appropriate loremflickr photos
-- Run once against existing DB: node src/db/seed.js  (or node -e "require('./src/db/seed')")

-- Step 1: clear all existing images
DELETE FROM product_images;

-- Step 2: insert correct images per product slug
INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, v.url, p.name, v.display_order
FROM products p
JOIN (VALUES
  -- ── Electronics ─────────────────────────────────────────────────────
  ('sony-wh-1000xm5-wireless-headphones',          'https://loremflickr.com/600/600/headphones?lock=1',  0),
  ('sony-wh-1000xm5-wireless-headphones',          'https://loremflickr.com/600/600/headphones?lock=2',  1),
  ('sony-wh-1000xm5-wireless-headphones',          'https://loremflickr.com/600/600/headphones?lock=3',  2),

  ('lg-55-4k-oled-smart-tv',                       'https://loremflickr.com/600/600/television?lock=1',  0),
  ('lg-55-4k-oled-smart-tv',                       'https://loremflickr.com/600/600/television?lock=2',  1),
  ('lg-55-4k-oled-smart-tv',                       'https://loremflickr.com/600/600/television?lock=3',  2),

  ('canon-eos-r50-mirrorless-camera',              'https://loremflickr.com/600/600/camera?lock=1',      0),
  ('canon-eos-r50-mirrorless-camera',              'https://loremflickr.com/600/600/camera?lock=2',      1),
  ('canon-eos-r50-mirrorless-camera',              'https://loremflickr.com/600/600/camera?lock=3',      2),

  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://loremflickr.com/600/600/laptop?lock=1',      0),
  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://loremflickr.com/600/600/laptop?lock=2',      1),
  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://loremflickr.com/600/600/laptop?lock=3',      2),

  ('bose-quietcomfort-45-headphones',              'https://loremflickr.com/600/600/headphones?lock=4',  0),
  ('bose-quietcomfort-45-headphones',              'https://loremflickr.com/600/600/headphones?lock=5',  1),
  ('bose-quietcomfort-45-headphones',              'https://loremflickr.com/600/600/headphones?lock=6',  2),

  ('philips-43-fhd-smart-led-tv',                  'https://loremflickr.com/600/600/television?lock=4',  0),
  ('philips-43-fhd-smart-led-tv',                  'https://loremflickr.com/600/600/television?lock=5',  1),

  ('jbl-charge-5-portable-speaker',                'https://loremflickr.com/600/600/speaker?lock=1',     0),
  ('jbl-charge-5-portable-speaker',                'https://loremflickr.com/600/600/speaker?lock=2',     1),

  -- ── Mobiles ──────────────────────────────────────────────────────────
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://loremflickr.com/600/600/smartphone?lock=1',  0),
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://loremflickr.com/600/600/smartphone?lock=2',  1),
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://loremflickr.com/600/600/smartphone?lock=3',  2),

  ('apple-iphone-15-pro-128gb',                    'https://loremflickr.com/600/600/iphone?lock=1',      0),
  ('apple-iphone-15-pro-128gb',                    'https://loremflickr.com/600/600/iphone?lock=2',      1),
  ('apple-iphone-15-pro-128gb',                    'https://loremflickr.com/600/600/iphone?lock=3',      2),
  ('apple-iphone-15-pro-128gb',                    'https://loremflickr.com/600/600/iphone?lock=4',      3),

  ('oneplus-12-5g-256gb-silky-black',              'https://loremflickr.com/600/600/smartphone?lock=4',  0),
  ('oneplus-12-5g-256gb-silky-black',              'https://loremflickr.com/600/600/smartphone?lock=5',  1),

  ('xiaomi-14-pro-5g-512gb',                       'https://loremflickr.com/600/600/smartphone?lock=6',  0),
  ('xiaomi-14-pro-5g-512gb',                       'https://loremflickr.com/600/600/smartphone?lock=7',  1),

  ('realme-narzo-70-pro-5g-128gb',                 'https://loremflickr.com/600/600/smartphone?lock=8',  0),
  ('realme-narzo-70-pro-5g-128gb',                 'https://loremflickr.com/600/600/smartphone?lock=9',  1),

  ('motorola-edge-50-pro-5g-256gb',                'https://loremflickr.com/600/600/smartphone?lock=10', 0),
  ('motorola-edge-50-pro-5g-256gb',                'https://loremflickr.com/600/600/smartphone?lock=11', 1),

  ('vivo-v30-pro-5g-256gb',                        'https://loremflickr.com/600/600/smartphone?lock=12', 0),
  ('vivo-v30-pro-5g-256gb',                        'https://loremflickr.com/600/600/smartphone?lock=13', 1),

  -- ── Fashion ──────────────────────────────────────────────────────────
  ('allen-solly-men-slim-fit-formal-shirt-white',  'https://loremflickr.com/600/600/shirt?lock=1',       0),
  ('allen-solly-men-slim-fit-formal-shirt-white',  'https://loremflickr.com/600/600/shirt?lock=2',       1),

  ('w-women-aline-kurta-set-navy-blue',            'https://loremflickr.com/600/600/kurta?lock=1',       0),
  ('w-women-aline-kurta-set-navy-blue',            'https://loremflickr.com/600/600/kurta?lock=2',       1),

  ('levis-men-511-slim-fit-jeans-dark-blue',       'https://loremflickr.com/600/600/jeans?lock=1',       0),
  ('levis-men-511-slim-fit-jeans-dark-blue',       'https://loremflickr.com/600/600/jeans?lock=2',       1),

  ('fabindia-women-handblock-print-kurta',         'https://loremflickr.com/600/600/kurta?lock=3',       0),
  ('fabindia-women-handblock-print-kurta',         'https://loremflickr.com/600/600/kurta?lock=4',       1),

  ('nike-men-air-max-270-running-shoes-black',     'https://loremflickr.com/600/600/sneakers?lock=1',    0),
  ('nike-men-air-max-270-running-shoes-black',     'https://loremflickr.com/600/600/sneakers?lock=2',    1),
  ('nike-men-air-max-270-running-shoes-black',     'https://loremflickr.com/600/600/sneakers?lock=3',    2),

  ('hm-men-oversized-tshirt-black',                'https://loremflickr.com/600/600/tshirt?lock=1',      0),
  ('hm-men-oversized-tshirt-black',                'https://loremflickr.com/600/600/tshirt?lock=2',      1),

  ('global-desi-women-printed-wrap-maxi-dress',    'https://loremflickr.com/600/600/dress?lock=1',       0),
  ('global-desi-women-printed-wrap-maxi-dress',    'https://loremflickr.com/600/600/dress?lock=2',       1),

  -- ── Home & Furniture ─────────────────────────────────────────────────
  ('durian-engineered-wood-study-table',           'https://loremflickr.com/600/600/table?lock=1',       0),
  ('durian-engineered-wood-study-table',           'https://loremflickr.com/600/600/table?lock=2',       1),

  ('solimo-6-piece-kitchen-storage-canister-set',  'https://loremflickr.com/600/600/kitchen?lock=1',     0),
  ('solimo-6-piece-kitchen-storage-canister-set',  'https://loremflickr.com/600/600/kitchen?lock=2',     1),

  ('hindware-moonbeam-15l-storage-water-heater',   'https://loremflickr.com/600/600/bathroom?lock=1',    0),
  ('hindware-moonbeam-15l-storage-water-heater',   'https://loremflickr.com/600/600/bathroom?lock=2',    1),

  ('wakefit-orthopaedic-memory-foam-mattress-queen','https://loremflickr.com/600/600/mattress?lock=1',   0),
  ('wakefit-orthopaedic-memory-foam-mattress-queen','https://loremflickr.com/600/600/mattress?lock=2',   1),

  ('milton-thermosteel-flip-lid-flask-1000ml',     'https://loremflickr.com/600/600/flask?lock=1',       0),
  ('milton-thermosteel-flip-lid-flask-1000ml',     'https://loremflickr.com/600/600/flask?lock=2',       1),

  ('godrej-interio-slimline-3-door-wardrobe',      'https://loremflickr.com/600/600/wardrobe?lock=1',    0),
  ('godrej-interio-slimline-3-door-wardrobe',      'https://loremflickr.com/600/600/wardrobe?lock=2',    1),

  ('prestige-iris-750w-mixer-grinder-4-jars',      'https://loremflickr.com/600/600/blender?lock=1',     0),
  ('prestige-iris-750w-mixer-grinder-4-jars',      'https://loremflickr.com/600/600/blender?lock=2',     1),

  -- ── Books ────────────────────────────────────────────────────────────
  ('atomic-habits-james-clear-paperback',          'https://loremflickr.com/600/600/book?lock=1',        0),
  ('atomic-habits-james-clear-paperback',          'https://loremflickr.com/600/600/book?lock=2',        1),

  ('psychology-of-money-morgan-housel',            'https://loremflickr.com/600/600/book?lock=3',        0),
  ('psychology-of-money-morgan-housel',            'https://loremflickr.com/600/600/book?lock=4',        1),

  ('rich-dad-poor-dad-robert-kiyosaki',            'https://loremflickr.com/600/600/book?lock=5',        0),
  ('rich-dad-poor-dad-robert-kiyosaki',            'https://loremflickr.com/600/600/book?lock=6',        1),

  ('wings-of-fire-apj-abdul-kalam',                'https://loremflickr.com/600/600/book?lock=7',        0),
  ('wings-of-fire-apj-abdul-kalam',                'https://loremflickr.com/600/600/book?lock=8',        1),

  ('alchemist-paulo-coelho-special-edition',       'https://loremflickr.com/600/600/book?lock=9',        0),
  ('alchemist-paulo-coelho-special-edition',       'https://loremflickr.com/600/600/book?lock=10',       1),

  ('sapiens-brief-history-humankind-harari',       'https://loremflickr.com/600/600/book?lock=11',       0),
  ('sapiens-brief-history-humankind-harari',       'https://loremflickr.com/600/600/book?lock=12',       1),

  -- ── Sports ───────────────────────────────────────────────────────────
  ('yonex-nanoray-7000i-badminton-racket',         'https://loremflickr.com/600/600/badminton?lock=1',   0),
  ('yonex-nanoray-7000i-badminton-racket',         'https://loremflickr.com/600/600/badminton?lock=2',   1),

  ('cosco-synthetic-volleyball-official',          'https://loremflickr.com/600/600/volleyball?lock=1',  0),
  ('cosco-synthetic-volleyball-official',          'https://loremflickr.com/600/600/volleyball?lock=2',  1),

  ('nivia-storm-football-size-5',                  'https://loremflickr.com/600/600/football?lock=1',    0),
  ('nivia-storm-football-size-5',                  'https://loremflickr.com/600/600/football?lock=2',    1),

  ('decathlon-kalenji-run-dry-mens-tshirt',        'https://loremflickr.com/600/600/running?lock=1',     0),
  ('decathlon-kalenji-run-dry-mens-tshirt',        'https://loremflickr.com/600/600/running?lock=2',     1),

  ('boldfit-gym-gloves-wrist-support',             'https://loremflickr.com/600/600/gym?lock=1',         0),
  ('boldfit-gym-gloves-wrist-support',             'https://loremflickr.com/600/600/gym?lock=2',         1),

  ('strauss-adjustable-yoga-mat-6mm',              'https://loremflickr.com/600/600/yoga?lock=1',        0),
  ('strauss-adjustable-yoga-mat-6mm',              'https://loremflickr.com/600/600/yoga?lock=2',        1),

  -- ── Beauty ───────────────────────────────────────────────────────────
  ('mamaearth-vitamin-c-face-wash-100ml',          'https://loremflickr.com/600/600/skincare?lock=1',    0),
  ('mamaearth-vitamin-c-face-wash-100ml',          'https://loremflickr.com/600/600/skincare?lock=2',    1),

  ('lakme-absolute-matte-melt-liquid-lip',         'https://loremflickr.com/600/600/lipstick?lock=1',    0),
  ('lakme-absolute-matte-melt-liquid-lip',         'https://loremflickr.com/600/600/lipstick?lock=2',    1),

  ('ordinary-niacinamide-10-zinc-30ml',            'https://loremflickr.com/600/600/serum?lock=1',       0),
  ('ordinary-niacinamide-10-zinc-30ml',            'https://loremflickr.com/600/600/serum?lock=2',       1),

  ('forest-essentials-moisturiser-sandalwood-spf25','https://loremflickr.com/600/600/moisturiser?lock=1',0),
  ('forest-essentials-moisturiser-sandalwood-spf25','https://loremflickr.com/600/600/moisturiser?lock=2',1),

  ('biotique-bio-walnut-bark-shampoo-650ml',       'https://loremflickr.com/600/600/shampoo?lock=1',     0),
  ('biotique-bio-walnut-bark-shampoo-650ml',       'https://loremflickr.com/600/600/shampoo?lock=2',     1),

  ('minimalist-alpha-arbutin-ha-serum-30ml',       'https://loremflickr.com/600/600/serum?lock=3',       0),
  ('minimalist-alpha-arbutin-ha-serum-30ml',       'https://loremflickr.com/600/600/serum?lock=4',       1),

  ('plum-green-tea-pore-cleansing-face-wash',      'https://loremflickr.com/600/600/facewash?lock=1',    0),
  ('plum-green-tea-pore-cleansing-face-wash',      'https://loremflickr.com/600/600/facewash?lock=2',    1),

  -- ── Toys ─────────────────────────────────────────────────────────────
  ('lego-classic-creative-bricks-900-pieces',      'https://loremflickr.com/600/600/lego?lock=1',        0),
  ('lego-classic-creative-bricks-900-pieces',      'https://loremflickr.com/600/600/lego?lock=2',        1),

  ('funskool-hasbro-monopoly-classic',             'https://loremflickr.com/600/600/boardgame?lock=1',   0),
  ('funskool-hasbro-monopoly-classic',             'https://loremflickr.com/600/600/boardgame?lock=2',   1),

  ('hot-wheels-20-car-gift-pack-assorted',         'https://loremflickr.com/600/600/toy?lock=1',         0),
  ('hot-wheels-20-car-gift-pack-assorted',         'https://loremflickr.com/600/600/toy?lock=2',         1),

  ('okplay-baby-walker-musical-twinkle-star',      'https://loremflickr.com/600/600/baby?lock=1',        0),
  ('okplay-baby-walker-musical-twinkle-star',      'https://loremflickr.com/600/600/baby?lock=2',        1),

  ('skillmatics-guess-in-10-animals',              'https://loremflickr.com/600/600/toy?lock=3',         0),
  ('skillmatics-guess-in-10-animals',              'https://loremflickr.com/600/600/toy?lock=4',         1),

  ('kurio-smart-android-kids-tablet-10inch',       'https://loremflickr.com/600/600/tablet?lock=1',      0),
  ('kurio-smart-android-kids-tablet-10inch',       'https://loremflickr.com/600/600/tablet?lock=2',      1)

) AS v(slug, url, display_order) ON v.slug = p.slug;
