INSERT INTO categories (name, slug, icon_url) VALUES
  ('Electronics',     'electronics',    'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png'),
  ('Mobiles',         'mobiles',        'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png'),
  ('Fashion',         'fashion',        'https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb0d4e21.png'),
  ('Home & Furniture','home-furniture', 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg'),
  ('Books',           'books',          'https://rukminim2.flixcart.com/flap/128/128/image/71050627a56b4693.png'),
  ('Sports',          'sports',         'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90ac.png'),
  ('Beauty',          'beauty',         'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90ac.png'),
  ('Toys',            'toys',           'https://rukminim2.flixcart.com/flap/128/128/image/71050627a56b4693.png')
ON CONFLICT (slug) DO NOTHING;
