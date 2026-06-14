CREATE TABLE IF NOT EXISTS product_images (
  id            BIGSERIAL    PRIMARY KEY,
  public_id     UUID         NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  product_id    BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url           TEXT         NOT NULL,
  alt_text      VARCHAR(200),
  display_order SMALLINT     NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  width         INTEGER,
  height        INTEGER,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW(),
  CONSTRAINT uq_product_image_order
    UNIQUE (product_id, display_order)
    DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX idx_product_images_public_id  ON product_images(public_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_order
  ON product_images(product_id, display_order ASC);
