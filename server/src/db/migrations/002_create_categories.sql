CREATE TABLE categories (
  id         BIGSERIAL    PRIMARY KEY,
  public_id  UUID         NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  name       VARCHAR(100) NOT NULL UNIQUE,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  icon_url   TEXT,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_categories_public_id ON categories(public_id);
CREATE INDEX idx_categories_slug      ON categories(slug);
