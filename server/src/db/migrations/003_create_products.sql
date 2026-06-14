CREATE TABLE IF NOT EXISTS products (
  id             BIGSERIAL      PRIMARY KEY,
  public_id      UUID           NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  category_id    BIGINT         NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name           VARCHAR(255)   NOT NULL,
  slug           VARCHAR(300)   NOT NULL UNIQUE,
  description    TEXT,
  specifications JSONB,
  brand          VARCHAR(100),
  mrp            NUMERIC(10, 2) NOT NULL CHECK (mrp > 0),
  selling_price  NUMERIC(10, 2) NOT NULL CHECK (selling_price > 0
                                                AND selling_price <= mrp),
  discount_pct   NUMERIC(5, 2)  GENERATED ALWAYS AS
                   (ROUND((mrp - selling_price) / mrp * 100, 2)) STORED,
  in_stock       BOOLEAN        DEFAULT TRUE,
  rating         NUMERIC(2, 1)  DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count   INTEGER        DEFAULT 0,
  is_featured    BOOLEAN        DEFAULT FALSE,
  badge          VARCHAR(50),
  created_at     TIMESTAMPTZ    DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    DEFAULT NOW()
);
CREATE INDEX idx_products_public_id   ON products(public_id);
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_in_stock    ON products(in_stock);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_fts         ON products
  USING gin(to_tsvector('english', name));
