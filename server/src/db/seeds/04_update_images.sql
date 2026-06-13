-- Update product images with category-appropriate Unsplash photos
-- Run once against existing DB: node -e "require('./src/db/seed');" or psql directly

-- Step 1: clear all existing images
DELETE FROM product_images;

-- Step 2: insert correct images per product slug
INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, v.url, p.name, v.display_order
FROM products p
JOIN (VALUES
  -- ── Electronics ─────────────────────────────────────────────────────
  ('sony-wh-1000xm5-wireless-headphones',          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format', 0),
  ('sony-wh-1000xm5-wireless-headphones',          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&auto=format', 1),
  ('sony-wh-1000xm5-wireless-headphones',          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&auto=format', 2),

  ('lg-55-4k-oled-smart-tv',                       'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&h=600&fit=crop&auto=format', 0),
  ('lg-55-4k-oled-smart-tv',                       'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop&auto=format', 1),
  ('lg-55-4k-oled-smart-tv',                       'https://images.unsplash.com/photo-1461151304267-38535e780ab2?w=600&h=600&fit=crop&auto=format', 2),

  ('canon-eos-r50-mirrorless-camera',              'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop&auto=format', 0),
  ('canon-eos-r50-mirrorless-camera',              'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&h=600&fit=crop&auto=format', 1),
  ('canon-eos-r50-mirrorless-camera',              'https://images.unsplash.com/photo-1625938145744-533726ca4c41?w=600&h=600&fit=crop&auto=format', 2),

  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format', 0),
  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600&h=600&fit=crop&auto=format', 1),
  ('hp-pavilion-15-i5-13th-gen-laptop',            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format', 2),

  ('bose-quietcomfort-45-headphones',              'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&auto=format', 0),
  ('bose-quietcomfort-45-headphones',              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format', 1),
  ('bose-quietcomfort-45-headphones',              'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&auto=format', 2),

  ('philips-43-fhd-smart-led-tv',                  'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop&auto=format', 0),
  ('philips-43-fhd-smart-led-tv',                  'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&h=600&fit=crop&auto=format', 1),

  ('jbl-charge-5-portable-speaker',                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&auto=format', 0),
  ('jbl-charge-5-portable-speaker',                'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Mobiles ──────────────────────────────────────────────────────────
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&auto=format', 0),
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&h=600&fit=crop&auto=format', 1),
  ('samsung-galaxy-s24-ultra-5g-256gb',            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop&auto=format', 2),

  ('apple-iphone-15-pro-128gb',                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&auto=format', 0),
  ('apple-iphone-15-pro-128gb',                    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=600&fit=crop&auto=format', 1),
  ('apple-iphone-15-pro-128gb',                    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop&auto=format', 2),
  ('apple-iphone-15-pro-128gb',                    'https://images.unsplash.com/photo-1560507074-b9eb43a5a993?w=600&h=600&fit=crop&auto=format', 3),

  ('oneplus-12-5g-256gb-silky-black',              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&auto=format', 0),
  ('oneplus-12-5g-256gb-silky-black',              'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop&auto=format', 1),

  ('xiaomi-14-pro-5g-512gb',                       'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop&auto=format', 0),
  ('xiaomi-14-pro-5g-512gb',                       'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&h=600&fit=crop&auto=format', 1),

  ('realme-narzo-70-pro-5g-128gb',                 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop&auto=format', 0),
  ('realme-narzo-70-pro-5g-128gb',                 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&auto=format', 1),

  ('motorola-edge-50-pro-5g-256gb',                'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop&auto=format', 0),
  ('motorola-edge-50-pro-5g-256gb',                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop&auto=format', 1),

  ('vivo-v30-pro-5g-256gb',                        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&h=600&fit=crop&auto=format', 0),
  ('vivo-v30-pro-5g-256gb',                        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Fashion ──────────────────────────────────────────────────────────
  ('allen-solly-men-slim-fit-formal-shirt-white',  'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&h=600&fit=crop&auto=format', 0),
  ('allen-solly-men-slim-fit-formal-shirt-white',  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop&auto=format', 1),

  ('w-women-aline-kurta-set-navy-blue',            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=600&fit=crop&auto=format', 0),
  ('w-women-aline-kurta-set-navy-blue',            'https://images.unsplash.com/photo-1617091934403-460e17b3d1bf?w=600&h=600&fit=crop&auto=format', 1),

  ('levis-men-511-slim-fit-jeans-dark-blue',       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&auto=format', 0),
  ('levis-men-511-slim-fit-jeans-dark-blue',       'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=600&fit=crop&auto=format', 1),

  ('fabindia-women-handblock-print-kurta',         'https://images.unsplash.com/photo-1617091934403-460e17b3d1bf?w=600&h=600&fit=crop&auto=format', 0),
  ('fabindia-women-handblock-print-kurta',         'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=600&fit=crop&auto=format', 1),

  ('nike-men-air-max-270-running-shoes-black',     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format', 0),
  ('nike-men-air-max-270-running-shoes-black',     'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&auto=format', 1),
  ('nike-men-air-max-270-running-shoes-black',     'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&auto=format', 2),

  ('hm-men-oversized-tshirt-black',                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format', 0),
  ('hm-men-oversized-tshirt-black',                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&auto=format', 1),

  ('global-desi-women-printed-wrap-maxi-dress',    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop&auto=format', 0),
  ('global-desi-women-printed-wrap-maxi-dress',    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Home & Furniture ─────────────────────────────────────────────────
  ('durian-engineered-wood-study-table',           'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop&auto=format', 0),
  ('durian-engineered-wood-study-table',           'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format', 1),

  ('solimo-6-piece-kitchen-storage-canister-set',  'https://images.unsplash.com/photo-1556909114-44e3e9399a2b?w=600&h=600&fit=crop&auto=format', 0),
  ('solimo-6-piece-kitchen-storage-canister-set',  'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=600&h=600&fit=crop&auto=format', 1),

  ('hindware-moonbeam-15l-storage-water-heater',   'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop&auto=format', 0),
  ('hindware-moonbeam-15l-storage-water-heater',   'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=600&fit=crop&auto=format', 1),

  ('wakefit-orthopaedic-memory-foam-mattress-queen','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop&auto=format', 0),
  ('wakefit-orthopaedic-memory-foam-mattress-queen','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop&auto=format', 1),

  ('milton-thermosteel-flip-lid-flask-1000ml',     'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=600&fit=crop&auto=format', 0),
  ('milton-thermosteel-flip-lid-flask-1000ml',     'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format', 1),

  ('godrej-interio-slimline-3-door-wardrobe',      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=600&fit=crop&auto=format', 0),
  ('godrej-interio-slimline-3-door-wardrobe',      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format', 1),

  ('prestige-iris-750w-mixer-grinder-4-jars',      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format', 0),
  ('prestige-iris-750w-mixer-grinder-4-jars',      'https://images.unsplash.com/photo-1556909114-44e3e9399a2b?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Books ────────────────────────────────────────────────────────────
  ('atomic-habits-james-clear-paperback',          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&auto=format', 0),
  ('atomic-habits-james-clear-paperback',          'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&h=600&fit=crop&auto=format', 1),

  ('psychology-of-money-morgan-housel',            'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=600&fit=crop&auto=format', 0),
  ('psychology-of-money-morgan-housel',            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&auto=format', 1),

  ('rich-dad-poor-dad-robert-kiyosaki',            'https://images.unsplash.com/photo-1476275466078-4cdc8a5a6e46?w=600&h=600&fit=crop&auto=format', 0),
  ('rich-dad-poor-dad-robert-kiyosaki',            'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&h=600&fit=crop&auto=format', 1),

  ('wings-of-fire-apj-abdul-kalam',                'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop&auto=format', 0),
  ('wings-of-fire-apj-abdul-kalam',                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format', 1),

  ('alchemist-paulo-coelho-special-edition',       'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format', 0),
  ('alchemist-paulo-coelho-special-edition',       'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop&auto=format', 1),

  ('sapiens-brief-history-humankind-harari',       'https://images.unsplash.com/photo-1509883488717-6f2fa89edf79?w=600&h=600&fit=crop&auto=format', 0),
  ('sapiens-brief-history-humankind-harari',       'https://images.unsplash.com/photo-1476275466078-4cdc8a5a6e46?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Sports ───────────────────────────────────────────────────────────
  ('yonex-nanoray-7000i-badminton-racket',         'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop&auto=format', 0),
  ('yonex-nanoray-7000i-badminton-racket',         'https://images.unsplash.com/photo-1615628734060-18e6f1c05bf4?w=600&h=600&fit=crop&auto=format', 1),

  ('cosco-synthetic-volleyball-official',          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=600&fit=crop&auto=format', 0),
  ('cosco-synthetic-volleyball-official',          'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=600&fit=crop&auto=format', 1),

  ('nivia-storm-football-size-5',                  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=600&fit=crop&auto=format', 0),
  ('nivia-storm-football-size-5',                  'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&h=600&fit=crop&auto=format', 1),

  ('decathlon-kalenji-run-dry-mens-tshirt',        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format', 0),
  ('decathlon-kalenji-run-dry-mens-tshirt',        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format', 1),

  ('boldfit-gym-gloves-wrist-support',             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&auto=format', 0),
  ('boldfit-gym-gloves-wrist-support',             'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format', 1),

  ('strauss-adjustable-yoga-mat-6mm',              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&auto=format', 0),
  ('strauss-adjustable-yoga-mat-6mm',              'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Beauty ───────────────────────────────────────────────────────────
  ('mamaearth-vitamin-c-face-wash-100ml',          'https://images.unsplash.com/photo-1556228852-6d35a585d2d6?w=600&h=600&fit=crop&auto=format', 0),
  ('mamaearth-vitamin-c-face-wash-100ml',          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&auto=format', 1),

  ('lakme-absolute-matte-melt-liquid-lip',         'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format', 0),
  ('lakme-absolute-matte-melt-liquid-lip',         'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop&auto=format', 1),

  ('ordinary-niacinamide-10-zinc-30ml',            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format', 0),
  ('ordinary-niacinamide-10-zinc-30ml',            'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&h=600&fit=crop&auto=format', 1),

  ('forest-essentials-moisturiser-sandalwood-spf25','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&auto=format', 0),
  ('forest-essentials-moisturiser-sandalwood-spf25','https://images.unsplash.com/photo-1556228852-6d35a585d2d6?w=600&h=600&fit=crop&auto=format', 1),

  ('biotique-bio-walnut-bark-shampoo-650ml',       'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&auto=format', 0),
  ('biotique-bio-walnut-bark-shampoo-650ml',       'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&auto=format', 1),

  ('minimalist-alpha-arbutin-ha-serum-30ml',       'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&h=600&fit=crop&auto=format', 0),
  ('minimalist-alpha-arbutin-ha-serum-30ml',       'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format', 1),

  ('plum-green-tea-pore-cleansing-face-wash',      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&auto=format', 0),
  ('plum-green-tea-pore-cleansing-face-wash',      'https://images.unsplash.com/photo-1556228852-6d35a585d2d6?w=600&h=600&fit=crop&auto=format', 1),

  -- ── Toys ─────────────────────────────────────────────────────────────
  ('lego-classic-creative-bricks-900-pieces',      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format', 0),
  ('lego-classic-creative-bricks-900-pieces',      'https://images.unsplash.com/photo-1616585734132-59e4c6d50c31?w=600&h=600&fit=crop&auto=format', 1),

  ('funskool-hasbro-monopoly-classic',             'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&auto=format', 0),
  ('funskool-hasbro-monopoly-classic',             'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&h=600&fit=crop&auto=format', 1),

  ('hot-wheels-20-car-gift-pack-assorted',         'https://images.unsplash.com/photo-1558981852-426c349548d5?w=600&h=600&fit=crop&auto=format', 0),
  ('hot-wheels-20-car-gift-pack-assorted',         'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format', 1),

  ('okplay-baby-walker-musical-twinkle-star',      'https://images.unsplash.com/photo-1515488042361-ee00e63fe59d?w=600&h=600&fit=crop&auto=format', 0),
  ('okplay-baby-walker-musical-twinkle-star',      'https://images.unsplash.com/photo-1590004845575-cc18b13f2f80?w=600&h=600&fit=crop&auto=format', 1),

  ('skillmatics-guess-in-10-animals',              'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&h=600&fit=crop&auto=format', 0),
  ('skillmatics-guess-in-10-animals',              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&auto=format', 1),

  ('kurio-smart-android-kids-tablet-10inch',       'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=600&fit=crop&auto=format', 0),
  ('kurio-smart-android-kids-tablet-10inch',       'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&auto=format', 1)

) AS v(slug, url, display_order) ON v.slug = p.slug;
