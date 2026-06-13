CREATE TABLE order_items (
  id             BIGSERIAL      PRIMARY KEY,
  public_id      UUID           NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  order_id       BIGINT         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     BIGINT         REFERENCES products(id) ON DELETE SET NULL,
  product_name   VARCHAR(255)   NOT NULL,
  product_image  TEXT,
  product_brand  VARCHAR(100),
  mrp            NUMERIC(10, 2) NOT NULL,
  selling_price  NUMERIC(10, 2) NOT NULL,
  quantity       INTEGER        NOT NULL CHECK (quantity > 0),
  line_total     NUMERIC(12, 2) NOT NULL GENERATED ALWAYS AS
                   (selling_price * quantity) STORED
);
CREATE INDEX idx_order_items_public_id  ON order_items(public_id);
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
