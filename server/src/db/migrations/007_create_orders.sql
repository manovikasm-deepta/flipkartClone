CREATE TABLE orders (
  id               BIGSERIAL      PRIMARY KEY,
  public_id        UUID           NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  order_number     VARCHAR(20)    NOT NULL UNIQUE,
  user_id          BIGINT         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  address_id       BIGINT         REFERENCES addresses(id) ON DELETE SET NULL,
  delivery_name    VARCHAR(100),
  delivery_phone   VARCHAR(15),
  delivery_line1   VARCHAR(255),
  delivery_line2   VARCHAR(255),
  delivery_city    VARCHAR(100),
  delivery_state   VARCHAR(100),
  delivery_pincode VARCHAR(10),
  status           VARCHAR(30)    NOT NULL DEFAULT 'PLACED'
                     CHECK (status IN ('PLACED','CONFIRMED','SHIPPED',
                                       'DELIVERED','CANCELLED')),
  payment_method   VARCHAR(30)    DEFAULT 'COD'
                     CHECK (payment_method IN ('COD','UPI','CARD','EMI')),
  payment_status   VARCHAR(20)    DEFAULT 'PENDING'
                     CHECK (payment_status IN ('PENDING','PAID',
                                               'FAILED','REFUNDED')),
  subtotal         NUMERIC(12, 2) NOT NULL,
  discount_total   NUMERIC(12, 2) DEFAULT 0,
  delivery_fee     NUMERIC(8,  2) DEFAULT 0,
  total_amount     NUMERIC(12, 2) NOT NULL,
  placed_at        TIMESTAMPTZ    DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    DEFAULT NOW()
);
CREATE INDEX idx_orders_public_id ON orders(public_id);
CREATE INDEX idx_orders_user_id   ON orders(user_id);
CREATE INDEX idx_orders_number    ON orders(order_number);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);
