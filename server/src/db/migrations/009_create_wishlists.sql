CREATE TABLE wishlists (
  id          BIGSERIAL   PRIMARY KEY,
  public_id   UUID        NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  BIGINT      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlist_public_id ON wishlists(public_id);
CREATE INDEX idx_wishlist_user_id   ON wishlists(user_id);
