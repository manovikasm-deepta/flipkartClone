CREATE TABLE addresses (
  id          BIGSERIAL    PRIMARY KEY,
  public_id   UUID         NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(15)  NOT NULL,
  line1       VARCHAR(255) NOT NULL,
  line2       VARCHAR(255),
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  pincode     VARCHAR(10)  NOT NULL,
  type        VARCHAR(20)  DEFAULT 'HOME'
                CHECK (type IN ('HOME','WORK','OTHER')),
  is_default  BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_addresses_public_id ON addresses(public_id);
CREATE INDEX idx_addresses_user_id   ON addresses(user_id);
