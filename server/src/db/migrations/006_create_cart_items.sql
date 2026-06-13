CREATE TABLE cart_items (
  id          BIGSERIAL    PRIMARY KEY,
  public_id   UUID         NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER      NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW(),
  CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id)
);
CREATE INDEX idx_cart_public_id ON cart_items(public_id);
CREATE INDEX idx_cart_user_id   ON cart_items(user_id);
