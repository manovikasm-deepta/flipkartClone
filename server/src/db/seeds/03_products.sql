-- ============================================================
-- 50 Products seeded across 8 categories
-- Images use placeholder CDN URLs (replace with real assets)
-- ============================================================

-- helper: insert products then images in one block
-- Electronics (cat slug: electronics)  ~7 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'electronics')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    'sony-wh-1000xm5-wireless-headphones',
    'Industry-leading noise cancellation with 30-hour battery life and multipoint connection.',
    '{"Battery Life":"30 hours","Driver Size":"30mm","Connectivity":"Bluetooth 5.2","Weight":"250g","Noise Cancellation":"Active","Foldable":"Yes"}',
    'Sony', 34990.00, 24990.00, TRUE, 4.7, 128540, TRUE, 'Bestseller'
  ),
  (
    'LG 55 inch 4K Ultra HD Smart OLED TV',
    'lg-55-4k-oled-smart-tv',
    'OLED evo panel with α9 AI Processor 4K Gen6 for cinema-quality picture and Dolby Atmos sound.',
    '{"Display":"55 inch OLED","Resolution":"3840x2160","HDR":"Dolby Vision, HDR10","OS":"webOS 23","HDMI Ports":"4","Refresh Rate":"120Hz"}',
    'LG', 179990.00, 119990.00, TRUE, 4.5, 34200, TRUE, 'Hot Deal'
  ),
  (
    'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
    'canon-eos-r50-mirrorless-camera',
    '24.2 MP APS-C sensor, Dual Pixel CMOS AF II, 4K video recording and compact lightweight body.',
    '{"Sensor":"24.2 MP APS-C CMOS","Autofocus":"Dual Pixel CMOS AF II","Video":"4K UHD","ISO Range":"100-32000","Battery Life":"300 shots","Weight":"375g"}',
    'Canon', 84995.00, 64995.00, TRUE, 4.6, 18760, TRUE, 'Super Deals'
  ),
  (
    'HP Pavilion 15 Core i5 13th Gen Laptop',
    'hp-pavilion-15-i5-13th-gen-laptop',
    '15.6-inch FHD IPS anti-glare display, Intel Core i5-1335U, 16GB RAM, 512GB SSD, Windows 11.',
    '{"Processor":"Intel Core i5-1335U","RAM":"16 GB DDR4","Storage":"512 GB SSD","Display":"15.6 inch FHD IPS","OS":"Windows 11 Home","Battery":"41 Whr"}',
    'HP', 71990.00, 54990.00, TRUE, 4.3, 22100, FALSE, 'Bestseller'
  ),
  (
    'Bose QuietComfort 45 Bluetooth Headphones',
    'bose-quietcomfort-45-headphones',
    'Wireless noise cancelling headphones with 24-hour battery and comfortable lightweight design.',
    '{"Battery Life":"24 hours","Connectivity":"Bluetooth 5.1","Weight":"238g","Noise Cancellation":"Active","Foldable":"Yes","Microphone":"4 built-in"}',
    'Bose', 32990.00, 21990.00, TRUE, 4.5, 45600, FALSE, NULL
  ),
  (
    'Philips 43PFT6815 Full HD Smart LED TV',
    'philips-43-fhd-smart-led-tv',
    '43 inch Full HD LED TV with Philips Smart TV powered by Android, Dolby Audio and HDR Plus.',
    '{"Display":"43 inch LED","Resolution":"1920x1080","OS":"Android 9","HDMI Ports":"3","USB Ports":"2","Refresh Rate":"60Hz"}',
    'Philips', 39990.00, 26990.00, TRUE, 4.1, 67800, FALSE, NULL
  ),
  (
    'JBL Charge 5 Portable Bluetooth Speaker',
    'jbl-charge-5-portable-speaker',
    'Powerful stereo sound with deep bass, 20-hour battery, IP67 waterproof and USB-C charging.',
    '{"Battery Life":"20 hours","Output Power":"30W","Connectivity":"Bluetooth 5.1","Waterproof":"IP67","Weight":"960g","Charging":"USB-C"}',
    'JBL', 16999.00, 10999.00, FALSE, 4.6, 92340, FALSE, 'Hot Deal'
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Mobiles (cat slug: mobiles)  ~7 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'mobiles')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Samsung Galaxy S24 Ultra 5G 256GB Titanium Black',
    'samsung-galaxy-s24-ultra-5g-256gb',
    'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, 5000mAh battery with 45W charging.',
    '{"Battery":"5000 mAh","Display":"6.8 inch QHD+ Dynamic AMOLED","RAM":"12 GB","Storage":"256 GB","Camera":"200 MP + 12 MP + 10 MP + 50 MP","Processor":"Snapdragon 8 Gen 3"}',
    'Samsung', 134999.00, 109999.00, TRUE, 4.7, 234560, TRUE, 'Bestseller'
  ),
  (
    'Apple iPhone 15 Pro 128GB Natural Titanium',
    'apple-iphone-15-pro-128gb',
    'A17 Pro chip, 48MP main camera with 5x optical zoom, titanium design and USB 3 speed.',
    '{"Battery":"3274 mAh","Display":"6.1 inch Super Retina XDR","RAM":"8 GB","Storage":"128 GB","Camera":"48 MP + 12 MP + 12 MP","Processor":"A17 Pro"}',
    'Apple', 134900.00, 119900.00, TRUE, 4.8, 345670, TRUE, 'Bestseller'
  ),
  (
    'OnePlus 12 5G 256GB Silky Black',
    'oneplus-12-5g-256gb-silky-black',
    'Snapdragon 8 Gen 3, 50MP Hasselblad camera, 5400mAh battery with 100W SUPERVOOC charging.',
    '{"Battery":"5400 mAh","Display":"6.82 inch LTPO AMOLED","RAM":"16 GB","Storage":"256 GB","Camera":"50 MP + 48 MP + 64 MP","Processor":"Snapdragon 8 Gen 3"}',
    'OnePlus', 64999.00, 57999.00, TRUE, 4.5, 189230, TRUE, 'Hot Deal'
  ),
  (
    'Xiaomi 14 Pro 5G 512GB Titanium White',
    'xiaomi-14-pro-5g-512gb',
    'Snapdragon 8 Gen 3, Leica professional optics, 50MP cameras, 4880mAh battery, 120W wired charging.',
    '{"Battery":"4880 mAh","Display":"6.73 inch LTPO AMOLED","RAM":"16 GB","Storage":"512 GB","Camera":"50 MP + 50 MP + 50 MP","Processor":"Snapdragon 8 Gen 3"}',
    'Xiaomi', 74999.00, 64999.00, TRUE, 4.4, 67890, FALSE, NULL
  ),
  (
    'Realme Narzo 70 Pro 5G 128GB Nebula Purple',
    'realme-narzo-70-pro-5g-128gb',
    'MediaTek Dimensity 7050, 50MP Sony IMX890 camera, 5000mAh battery with 67W SUPERVOOC.',
    '{"Battery":"5000 mAh","Display":"6.7 inch Full HD+ AMOLED","RAM":"8 GB","Storage":"128 GB","Camera":"50 MP + 8 MP + 2 MP","Processor":"Dimensity 7050"}',
    'Realme', 24999.00, 18999.00, TRUE, 4.2, 45670, FALSE, 'Super Deals'
  ),
  (
    'Motorola Edge 50 Pro 5G 256GB Luxe Lavender',
    'motorola-edge-50-pro-5g-256gb',
    'Snapdragon 7 Gen 3, 50MP ZEISS optics, 4500mAh battery, 125W TurboPower wired charging.',
    '{"Battery":"4500 mAh","Display":"6.7 inch pOLED","RAM":"12 GB","Storage":"256 GB","Camera":"50 MP + 13 MP + 10 MP","Processor":"Snapdragon 7 Gen 3"}',
    'Motorola', 34999.00, 28999.00, TRUE, 4.3, 23410, FALSE, NULL
  ),
  (
    'Vivo V30 Pro 5G 256GB Peacock Green',
    'vivo-v30-pro-5g-256gb',
    'Snapdragon 7 Gen 3, ZEISS 50MP portrait camera, 5000mAh battery, 80W FlashCharge.',
    '{"Battery":"5000 mAh","Display":"6.78 inch AMOLED","RAM":"12 GB","Storage":"256 GB","Camera":"50 MP + 50 MP + 8 MP","Processor":"Snapdragon 7 Gen 3"}',
    'Vivo', 39999.00, 33999.00, FALSE, 4.1, 15670, FALSE, NULL
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Fashion (cat slug: fashion)  ~7 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'fashion')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Allen Solly Men Slim Fit Formal Shirt White',
    'allen-solly-men-slim-fit-formal-shirt-white',
    'Premium 100% cotton slim fit formal shirt with spread collar, perfect for office wear.',
    '{"Material":"100% Cotton","Fit":"Slim Fit","Sleeve":"Full Sleeve","Collar":"Spread","Wash Care":"Machine Washable","Pattern":"Solid"}',
    'Allen Solly', 1699.00, 849.00, TRUE, 4.3, 87650, FALSE, 'Hot Deal'
  ),
  (
    'W Women A-Line Kurta Set Navy Blue',
    'w-women-aline-kurta-set-navy-blue',
    'Elegant A-line kurta with palazzo pants, ideal for festive and casual occasions.',
    '{"Material":"Viscose Rayon","Fit":"Regular","Sleeve":"3/4 Sleeve","Occasion":"Casual/Festive","Wash Care":"Machine Washable","Set Contents":"Kurta + Palazzo"}',
    'W', 2499.00, 1399.00, TRUE, 4.4, 56780, FALSE, 'Bestseller'
  ),
  (
    'Levi''s Men 511 Slim Fit Jeans Dark Blue',
    'levis-men-511-slim-fit-jeans-dark-blue',
    'Classic 511 slim fit jeans crafted from stretch denim for all-day comfort and style.',
    '{"Material":"99% Cotton 1% Elastane","Fit":"Slim Fit","Rise":"Mid Rise","Closure":"Zip Fly","Wash":"Dark Wash","Style":"511"}',
    'Levi''s', 4499.00, 2699.00, TRUE, 4.5, 123450, TRUE, NULL
  ),
  (
    'Fabindia Women Handblock Print Kurta Multicolor',
    'fabindia-women-handblock-print-kurta',
    'Handcrafted block print kurta in breathable cotton, celebrating Indian artisan tradition.',
    '{"Material":"Pure Cotton","Fit":"Regular","Sleeve":"Full Sleeve","Print":"Hand Block Print","Wash Care":"Gentle Wash","Neckline":"Round Neck"}',
    'Fabindia', 2990.00, 1990.00, TRUE, 4.6, 34560, FALSE, NULL
  ),
  (
    'Nike Men Air Max 270 Running Shoes Black',
    'nike-men-air-max-270-running-shoes-black',
    'Iconic Air Max 270 with large heel Air unit for all-day cushioning and modern style.',
    '{"Material":"Mesh Upper","Sole":"Rubber","Closure":"Lace-Up","Activity":"Running/Casual","Technology":"Max Air","Sizes":"UK 6-12"}',
    'Nike', 12995.00, 8995.00, TRUE, 4.5, 98760, TRUE, 'Bestseller'
  ),
  (
    'H&M Men Oversized Fit T-Shirt Black',
    'hm-men-oversized-tshirt-black',
    'Relaxed oversized cotton jersey T-shirt with dropped shoulders and ribbed collar.',
    '{"Material":"100% Cotton Jersey","Fit":"Oversized","Sleeve":"Short Sleeve","Neckline":"Round Neck","Wash Care":"Machine Washable","Pattern":"Solid"}',
    'H&M', 999.00, 599.00, TRUE, 4.1, 234500, FALSE, 'Super Deals'
  ),
  (
    'Global Desi Women Printed Wrap Maxi Dress',
    'global-desi-women-printed-wrap-maxi-dress',
    'Floral printed wrap maxi dress with adjustable waist tie, perfect for summer outings.',
    '{"Material":"Rayon","Fit":"Wrap Style","Sleeve":"Short Sleeve","Length":"Maxi","Wash Care":"Machine Washable","Pattern":"Floral Print"}',
    'Global Desi', 3299.00, 1649.00, FALSE, 4.2, 45670, FALSE, NULL
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Home & Furniture (cat slug: home-furniture)  ~7 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'home-furniture')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Durian Furnitures Engineered Wood Study Table',
    'durian-engineered-wood-study-table',
    'Spacious study table with storage shelf and drawer, easy assembly, scratch-resistant finish.',
    '{"Material":"Engineered Wood","Dimensions":"120x60x75 cm","Color":"Wenge Brown","Storage":"1 Drawer + 1 Shelf","Assembly":"Self Assembly","Weight Capacity":"50 kg"}',
    'Durian', 18999.00, 9999.00, TRUE, 4.2, 34560, FALSE, 'Hot Deal'
  ),
  (
    'Solimo 6 Piece Kitchen Storage Canister Set',
    'solimo-6-piece-kitchen-storage-canister-set',
    'BPA-free airtight canisters for flour, sugar, spices and dry groceries, dishwasher safe.',
    '{"Material":"Food-Grade Plastic","Pieces":"6","Capacity":"500ml, 1L, 2L (2 each)","BPA Free":"Yes","Dishwasher Safe":"Yes","Color":"Clear with White Lid"}',
    'Solimo', 1299.00, 699.00, TRUE, 4.4, 89450, FALSE, 'Bestseller'
  ),
  (
    'Hindware Moonbeam 15L Storage Water Heater',
    'hindware-moonbeam-15l-storage-water-heater',
    '15L storage geyser with 2000W heating element, ABS body, 5-star energy rating.',
    '{"Capacity":"15 Litres","Wattage":"2000 W","Energy Rating":"5 Star","Tank Material":"SS Inner Tank","Safety":"Multi-Functional Safety Valve","Warranty":"2 Years"}',
    'Hindware', 10499.00, 6999.00, TRUE, 4.3, 56780, TRUE, NULL
  ),
  (
    'Wakefit Orthopaedic Memory Foam Mattress Queen',
    'wakefit-orthopaedic-memory-foam-mattress-queen',
    '6-inch high-density foam mattress with memory foam top layer, 100-night free trial.',
    '{"Size":"Queen (60x72 inches)","Thickness":"6 inches","Layers":"High Density Foam + Memory Foam","Cover":"Knitted Fabric","Trial":"100 nights","Warranty":"10 Years"}',
    'Wakefit', 21999.00, 14499.00, TRUE, 4.6, 123450, TRUE, 'Bestseller'
  ),
  (
    'Milton Thermosteel Flip Lid Flask 1000ml',
    'milton-thermosteel-flip-lid-flask-1000ml',
    'Double-wall insulated stainless steel flask, keeps beverages hot 24 hours or cold 30 hours.',
    '{"Capacity":"1000 ml","Material":"Stainless Steel","Insulation":"24 hr hot / 30 hr cold","Lid":"Flip Lid","BPA Free":"Yes","Dishwasher Safe":"No"}',
    'Milton', 1195.00, 749.00, TRUE, 4.5, 234560, FALSE, NULL
  ),
  (
    'Godrej Interio Slimline 3 Door Wardrobe',
    'godrej-interio-slimline-3-door-wardrobe',
    'Steel body 3-door wardrobe with 4 shelves, 2 drawers and hanging space, anti-rust coating.',
    '{"Material":"Cold Rolled Steel","Doors":"3","Shelves":"4","Drawers":"2","Color":"Pista Green","Dimensions":"132x46x183 cm"}',
    'Godrej', 35990.00, 24990.00, FALSE, 4.1, 18900, FALSE, NULL
  ),
  (
    'Prestige Iris 750W Mixer Grinder 4 Jars',
    'prestige-iris-750w-mixer-grinder-4-jars',
    '750W motor mixer grinder with 4 stainless steel jars, 3-speed control and safe lock system.',
    '{"Power":"750 W","Jars":"4 (Liquidising, Dry Grinding, Chutney, Juicer)","Speed":"3 Speed + Pulse","Motor":"Copper","Warranty":"2 Years","Color":"White/Purple"}',
    'Prestige', 5295.00, 3199.00, TRUE, 4.4, 345670, FALSE, 'Bestseller'
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Books (cat slug: books)  ~6 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'books')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Atomic Habits by James Clear - Paperback',
    'atomic-habits-james-clear-paperback',
    'The life-changing million-copy bestseller on building good habits and breaking bad ones.',
    '{"Author":"James Clear","Publisher":"Random House Business","Pages":"319","Language":"English","ISBN":"9781847941831","Edition":"1st"}',
    'Random House', 1999.00, 499.00, TRUE, 4.8, 456780, TRUE, 'Bestseller'
  ),
  (
    'The Psychology of Money by Morgan Housel',
    'psychology-of-money-morgan-housel',
    'Timeless lessons on wealth, greed and happiness in 19 short stories about how people think about money.',
    '{"Author":"Morgan Housel","Publisher":"Jaico Publishing","Pages":"256","Language":"English","ISBN":"9788119099818","Edition":"Indian Reprint"}',
    'Jaico', 499.00, 299.00, TRUE, 4.7, 234560, FALSE, 'Bestseller'
  ),
  (
    'Rich Dad Poor Dad by Robert T. Kiyosaki',
    'rich-dad-poor-dad-robert-kiyosaki',
    'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not — 25th Anniversary Edition.',
    '{"Author":"Robert T. Kiyosaki","Publisher":"Manjul Publishing","Pages":"336","Language":"English","ISBN":"9788183220804","Edition":"25th Anniversary"}',
    'Manjul', 595.00, 349.00, TRUE, 4.6, 345670, FALSE, NULL
  ),
  (
    'Wings of Fire by A.P.J. Abdul Kalam',
    'wings-of-fire-apj-abdul-kalam',
    'Autobiography of India''s Missile Man and former President, an inspiring journey from Rameswaram to Rashtrapati Bhavan.',
    '{"Author":"A.P.J. Abdul Kalam","Publisher":"Universities Press","Pages":"196","Language":"English","ISBN":"9788173710964","Edition":"Revised"}',
    'Universities Press', 225.00, 160.00, TRUE, 4.8, 500000, TRUE, 'Bestseller'
  ),
  (
    'The Alchemist by Paulo Coelho - Special Edition',
    'alchemist-paulo-coelho-special-edition',
    'A fable about following your dream — the world''s most read Portuguese-language book ever published.',
    '{"Author":"Paulo Coelho","Publisher":"HarperCollins","Pages":"208","Language":"English","ISBN":"9780062315007","Edition":"Special Edition"}',
    'HarperCollins', 499.00, 279.00, TRUE, 4.7, 389450, FALSE, NULL
  ),
  (
    'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
    'sapiens-brief-history-humankind-harari',
    'A sweeping narrative of human history from the Stone Age through the twenty-first century.',
    '{"Author":"Yuval Noah Harari","Publisher":"Vintage Books","Pages":"443","Language":"English","ISBN":"9780099590088","Edition":"Paperback"}',
    'Vintage', 699.00, 399.00, FALSE, 4.7, 278900, FALSE, 'Hot Deal'
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Sports (cat slug: sports)  ~6 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'sports')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Yonex Nanoray 7000I Badminton Racket',
    'yonex-nanoray-7000i-badminton-racket',
    'Ultra-thin shaft with Nanocell Neo technology for quick attack, ideal for intermediate players.',
    '{"Weight":"85g (±3g)","Shaft":"Graphite","Balance":"Head Light","Max Tension":"24 lbs","Grip Size":"G4","Colour":"Cyan/Black"}',
    'Yonex', 3490.00, 1999.00, TRUE, 4.4, 123450, FALSE, 'Bestseller'
  ),
  (
    'Cosco Synthetic Volleyball Official Size',
    'cosco-synthetic-volleyball-official',
    'Synthetic leather 18-panel machine-stitched volleyball for indoor and outdoor play.',
    '{"Material":"Synthetic Leather","Panels":"18","Circumference":"65-67 cm","Weight":"260-280 g","Bladder":"Rubber","Size":"Official/5"}',
    'Cosco', 1299.00, 799.00, TRUE, 4.2, 56780, FALSE, NULL
  ),
  (
    'Nivia Storm Football Size 5',
    'nivia-storm-football-size-5',
    '32-panel machine-stitched PVC football with butyl bladder for superior air retention.',
    '{"Material":"PVC","Panels":"32","Size":"5","Bladder":"Butyl","Weight":"420-445 g","Stitching":"Machine"}',
    'Nivia', 999.00, 649.00, TRUE, 4.3, 89450, FALSE, NULL
  ),
  (
    'Decathlon Kalenji Run Dry+ Men Running T-Shirt',
    'decathlon-kalenji-run-dry-mens-tshirt',
    'Lightweight breathable running tee with Dry+ moisture-wicking technology for long runs.',
    '{"Material":"100% Polyester","Technology":"Dry+ Moisture Wicking","Fit":"Slim","Sleeve":"Short","Wash Care":"Machine Washable","Activity":"Running"}',
    'Kalenji', 599.00, 399.00, TRUE, 4.5, 234560, TRUE, 'Super Deals'
  ),
  (
    'Boldfit Gym Gloves with Wrist Support',
    'boldfit-gym-gloves-wrist-support',
    'Half-finger workout gloves with padded palm and velcro wrist wrap for heavy lifting.',
    '{"Material":"Leather + Neoprene","Type":"Half Finger","Size":"S/M/L/XL","Feature":"Wrist Wrap Support","Activity":"Weightlifting","Gender":"Unisex"}',
    'Boldfit', 999.00, 499.00, TRUE, 4.3, 145670, FALSE, NULL
  ),
  (
    'Strauss Adjustable Yoga Mat with Strap 6mm',
    'strauss-adjustable-yoga-mat-6mm',
    'Anti-slip NBR foam yoga mat with alignment lines, shoulder strap and carrying bag.',
    '{"Material":"NBR Foam","Thickness":"6 mm","Dimensions":"183x61 cm","Anti-Slip":"Yes","Accessories":"Carry Strap + Bag","Weight":"800g"}',
    'Strauss', 1299.00, 799.00, FALSE, 4.4, 78900, FALSE, NULL
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Beauty (cat slug: beauty)  ~7 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'beauty')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'Mamaearth Vitamin C Face Wash 100ml',
    'mamaearth-vitamin-c-face-wash-100ml',
    'Brightening face wash with Vitamin C and turmeric for glowing skin, free from harmful chemicals.',
    '{"Volume":"100 ml","Skin Type":"All Skin Types","Key Ingredients":"Vitamin C, Turmeric","Free From":"Sulphate, Paraben","pH":"5.5","Cruelty Free":"Yes"}',
    'Mamaearth', 299.00, 174.00, TRUE, 4.4, 456780, FALSE, 'Bestseller'
  ),
  (
    'Lakme Absolute Matte Melt Liquid Lip Colour',
    'lakme-absolute-matte-melt-liquid-lip',
    'Long-wear liquid matte lip colour that dries to a velvety matte finish in 12 shades.',
    '{"Volume":"6 ml","Finish":"Matte","Longevity":"8 Hours","Shade Range":"12 Shades","Free From":"Paraben","Moisturising":"Yes"}',
    'Lakme', 699.00, 449.00, TRUE, 4.3, 234560, FALSE, NULL
  ),
  (
    'The Ordinary Niacinamide 10% + Zinc 1% 30ml',
    'ordinary-niacinamide-10-zinc-30ml',
    'High-strength niacinamide serum to reduce blemishes and balance sebum activity.',
    '{"Volume":"30 ml","Key Ingredients":"Niacinamide 10%, Zinc 1%","Skin Type":"Oily/Combination/Blemish-Prone","Free From":"Alcohol, Silicone","Vegan":"Yes","Cruelty Free":"Yes"}',
    'The Ordinary', 1090.00, 699.00, TRUE, 4.6, 345670, TRUE, 'Hot Deal'
  ),
  (
    'Forest Essentials Facial Moisturiser Sandalwood SPF25',
    'forest-essentials-moisturiser-sandalwood-spf25',
    'Ayurvedic day cream with sandalwood and SPF 25, blending ancient wisdom with modern skincare.',
    '{"Volume":"50 ml","SPF":"25 PA++","Key Ingredients":"Sandalwood, Rose Water, Aloe Vera","Skin Type":"Normal/Dry","Free From":"Paraben, Mineral Oil","Made In":"India"}',
    'Forest Essentials', 2950.00, 1950.00, TRUE, 4.5, 89450, FALSE, NULL
  ),
  (
    'Biotique Bio Walnut Bark Volumizing Shampoo 650ml',
    'biotique-bio-walnut-bark-shampoo-650ml',
    'Organic walnut bark shampoo that adds volume and body to fine, limp hair with each wash.',
    '{"Volume":"650 ml","Hair Type":"Fine/Limp","Key Ingredients":"Walnut Bark, Bhringraj","Free From":"Sulphate, Paraben","Vegan":"Yes","Cruelty Free":"Yes"}',
    'Biotique', 575.00, 349.00, TRUE, 4.2, 123450, FALSE, NULL
  ),
  (
    'Minimalist Alpha Arbutin 2% + HA Serum 30ml',
    'minimalist-alpha-arbutin-ha-serum-30ml',
    'Brightening serum combining alpha arbutin and hyaluronic acid for even skin tone and hydration.',
    '{"Volume":"30 ml","Key Ingredients":"Alpha Arbutin 2%, Hyaluronic Acid","Skin Type":"All Skin Types","Free From":"Alcohol, Paraben","Vegan":"Yes","Cruelty Free":"Yes"}',
    'Minimalist', 599.00, 389.00, TRUE, 4.5, 234560, FALSE, 'Bestseller'
  ),
  (
    'Plum Green Tea Pore Cleansing Face Wash 100ml',
    'plum-green-tea-pore-cleansing-face-wash',
    'Mattifying green tea face wash for oily skin that deep-cleanses pores without over-drying.',
    '{"Volume":"100 ml","Skin Type":"Oily/Combination","Key Ingredients":"Green Tea, Glycolic Acid","Free From":"SLS, Paraben","Vegan":"Yes","pH":"5.5"}',
    'Plum', 295.00, 195.00, FALSE, 4.3, 178900, FALSE, NULL
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- Toys (cat slug: toys)  ~6 products
WITH cat AS (SELECT id FROM categories WHERE slug = 'toys')
INSERT INTO products
  (category_id, name, slug, description, specifications, brand,
   mrp, selling_price, in_stock, rating, review_count,
   is_featured, badge)
SELECT cat.id, v.name, v.slug, v.description, v.specifications::jsonb,
       v.brand, v.mrp, v.selling_price, v.in_stock,
       v.rating, v.review_count, v.is_featured, v.badge
FROM cat, (VALUES
  (
    'LEGO Classic Creative Bricks 900 Pieces',
    'lego-classic-creative-bricks-900-pieces',
    '900-piece classic brick set with a rainbow of colours to build anything imaginable, for ages 4+.',
    '{"Pieces":"900","Age":"4+ Years","Material":"ABS Plastic","Dimensions":"37x26x6 cm","Compatible":"All LEGO Sets","Includes":"Instruction Booklet"}',
    'LEGO', 5999.00, 3999.00, TRUE, 4.8, 89450, TRUE, 'Bestseller'
  ),
  (
    'Funskool Hasbro Monopoly Classic Board Game',
    'funskool-hasbro-monopoly-classic',
    'The world''s favourite family property trading game with 8 classic tokens and full-colour game board.',
    '{"Players":"2-8","Age":"8+ Years","Duration":"60-180 min","Tokens":"8 Classic","Language":"English","Includes":"Board, Cards, Dice, Money"}',
    'Funskool', 1799.00, 999.00, TRUE, 4.5, 234560, FALSE, 'Hot Deal'
  ),
  (
    'Hot Wheels 20-Car Gift Pack Assorted',
    'hot-wheels-20-car-gift-pack-assorted',
    '20 die-cast vehicles in 1:64 scale, each with authentic styling — perfect for collectors and racers.',
    '{"Pieces":"20 cars","Scale":"1:64","Material":"Die-Cast Metal","Age":"3+ Years","Track Compatible":"Yes","Packaging":"Gift Box"}',
    'Hot Wheels', 1999.00, 1299.00, TRUE, 4.6, 145670, FALSE, NULL
  ),
  (
    'OK Play Baby Walker Musical Twinkle Star',
    'okplay-baby-walker-musical-twinkle-star',
    'Sturdy push-along baby walker with music, light effects and height-adjustable handle for 9-18 months.',
    '{"Age":"9-18 Months","Weight Capacity":"15 kg","Music":"Yes (3 songs)","Light":"Yes","Material":"Non-Toxic Plastic","Adjustable":"Height adjustable handle"}',
    'OK Play', 3499.00, 1999.00, TRUE, 4.2, 56780, FALSE, NULL
  ),
  (
    'Skillmatics Educational Game Guess in 10 Animals',
    'skillmatics-guess-in-10-animals',
    'Award-winning question card game that develops critical thinking and general knowledge in kids 6+.',
    '{"Players":"2-6","Age":"6-99 Years","Cards":"110+","Duration":"20 min","Language":"English","Educational Focus":"Animals, Critical Thinking"}',
    'Skillmatics', 599.00, 374.00, TRUE, 4.6, 78900, FALSE, 'Bestseller'
  ),
  (
    'Kurio Smart Android Kids Tablet 10 inch',
    'kurio-smart-android-kids-tablet-10inch',
    'Kid-proof Android tablet with parent controls, pre-loaded educational apps and drop-proof case.',
    '{"Display":"10 inch HD","OS":"Android 11 Kids Edition","RAM":"2 GB","Storage":"32 GB","Battery":"5000 mAh","Case":"Drop-proof Silicone"}',
    'Kurio', 14999.00, 9499.00, FALSE, 4.0, 12340, FALSE, NULL
  )
) AS v(name, slug, description, specifications, brand,
       mrp, selling_price, in_stock, rating, review_count,
       is_featured, badge)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Product Images are seeded by 04_update_images.sql
-- ============================================================
