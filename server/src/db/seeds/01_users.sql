-- password: Demo@1234  →  bcrypt hash (cost 12)
INSERT INTO users (name, email, password_hash, phone, is_default)
VALUES (
  'Demo User',
  'demo@flipkart.com',
  '$2a$12$WPynz/OWZY4Mg9sIaGRObOquE42jecdAKgsd54U/zBNXWRA5AUYNO',
  '9876543210',
  TRUE
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO addresses (user_id, name, phone, line1, line2, city, state, pincode, type, is_default)
SELECT
  u.id,
  'Demo User',
  '9876543210',
  'Flat 4B, Sunshine Apartments, Banjara Hills',
  'Road No. 12',
  'Hyderabad',
  'Telangana',
  '500034',
  'HOME',
  TRUE
FROM users u
WHERE u.email = 'demo@flipkart.com'
ON CONFLICT DO NOTHING;
