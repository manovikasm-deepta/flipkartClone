# Flipkart Clone — Full Stack E-Commerce Platform

A production-grade, feature-complete e-commerce web application modelled after Flipkart.com, built with React 18, Node.js/Express, and PostgreSQL.

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://flipkart-clone-beta-two.vercel.app |
| Backend API | https://flipkart-clone-api-nine.vercel.app/api |
| Health check | https://flipkart-clone-api-nine.vercel.app/api/health |

**Demo credentials:** `demo@flipkart.com` / `Demo@1234`

> The demo user is auto-logged in when no token is present, so browsing and adding to cart works immediately without signing in.

---

## Features

### Core
- [x] Product listing with search, filter (category, rating, price range), and sort
- [x] Product detail page — image gallery, lightbox, specs table, description tabs
- [x] Shopping cart — quantity control, save-for-later, buy-now per item
- [x] 3-step checkout — address selection, order summary, payment method
- [x] Order placement with full DB transaction and price snapshot
- [x] Order confirmation with animated success state and copyable order ID
- [x] Order history — collapsible cards with status badges
- [x] Wishlist — add/remove, move to cart
- [x] User authentication — register, login, JWT, password strength indicator
- [x] Address management — CRUD, default promotion on delete

### Design & UX
- [x] Flipkart design tokens (brand blue, cart orange, buy-now red)
- [x] Hero banner carousel (Swiper) with 5 themed slides, 9:2 aspect ratio
- [x] Category tiles with emoji icons, horizontal scroll
- [x] Deal sections with colored headers fetched from API
- [x] Horizontal scroll product section with arrow navigation
- [x] CSS Modules + CSS custom properties — zero Tailwind class sprawl in components
- [x] Skeleton loaders, empty states, toast notifications
- [x] Fully responsive — 4-col desktop → 2-col tablet → 1-col mobile
- [x] Sticky product detail image section, fixed mobile CTA bar

### API & Backend
- [x] Strict layered architecture: routes → controllers → services → DB
- [x] UUID public IDs — internal bigint IDs never exposed
- [x] camelCase serialization on all responses
- [x] Standard envelope: `{ success, data, message }` / `{ success, data: { items, pagination }, message }`
- [x] Full-text search via PostgreSQL `tsvector`
- [x] JSONB specs column on products
- [x] `INSERT ON CONFLICT` upsert for cart (race-condition safe)
- [x] 7-step DB transaction for order placement
- [x] Rate limiting, CORS, helmet, `asyncHandler`, `AppError`

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite 5 | SPA, lightning-fast HMR and builds |
| State | Redux Toolkit | Global cart, auth, wishlist, checkout |
| Routing | React Router v6 | `createBrowserRouter`, protected routes |
| Styling | CSS Modules + Custom Properties | Scoped styles, Flipkart design tokens |
| UI extras | Swiper 11, Lucide React, React Hook Form | Carousel, icons, form validation |
| Backend | Node.js 20 + Express 4 | REST API, middleware pipeline |
| Database | PostgreSQL 16 | Relational data, FTS, JSONB |
| Auth | JWT (jsonwebtoken) + bcrypt | Stateless auth, 12-round password hashing |
| HTTP | Axios | Request interceptors, auth token injection |
| Testing | Jest + Supertest | Server integration tests |
| Frontend Deploy | Vercel | CDN-distributed static hosting, SPA rewrites |
| Backend Deploy | Render | Persistent Node.js web service |
| DB Deploy | Render PostgreSQL | Managed database with daily backups |
| CI/CD | GitHub Actions | Lint, test, build, deploy pipeline |

---

## Architecture

### Monorepo Structure

```
flipkart-clone/              ← npm workspace root (concurrently)
├── client/                  ← React 18 + Vite SPA
└── server/                  ← Express REST API
```

### Dual-ID Pattern

Every entity has two identifiers:
- **Internal** `id` (bigint, auto-increment) — used for all SQL joins. Never leaves the server.
- **Public** `public_id` (UUID v4, `gen_random_uuid()`) — the only ID exposed in API responses and URLs.

This prevents enumeration attacks and keeps integer performance for joins.

### Order Placement Transaction (7 steps)

```
BEGIN
  1. Resolve & verify address ownership (UUID → bigint)
  2. Fetch cart items, assert inStock for each
  3. Calculate subtotal and discount totals
  4. Generate order number: FK-{year}-{padded-seq}
  5. INSERT into orders RETURNING *
  6. INSERT into order_items (price snapshot at time of purchase)
  7. DELETE cart_items WHERE user_id = $1
COMMIT   (or ROLLBACK on any error)
```

Price snapshots in `order_items` mean order history is immutable even if product prices change later.

### Cart Race Condition Safety

```sql
INSERT INTO cart_items (user_id, product_id, quantity)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, product_id)
DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
             updated_at = now();
```

Two concurrent "Add to Cart" requests always produce one row with the correct combined quantity.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | Registered users. `public_id` UUID, `password_hash` bcrypt, `role` enum |
| `categories` | Product categories with `slug`, `icon_url` |
| `products` | Core product data — `selling_price`, `mrp`, `discount_pct` GENERATED ALWAYS AS, `specs` JSONB, FTS `search_vector` |
| `product_images` | Multi-image gallery per product, `display_order` |
| `addresses` | Delivery addresses, `is_default` flag with cascade-promote on delete |
| `cart_items` | `(user_id, product_id)` unique constraint enables upsert |
| `orders` | Order header — `order_number`, `status` enum, `payment_method`, `total_amount` |
| `order_items` | Price snapshot per line: `product_name`, `selling_price`, `mrp`, `quantity`, `line_total` |
| `wishlists` | `(user_id, product_id)` unique — simple join table |

---

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/flipkart-clone.git
cd flipkart-clone

npm install                # root devDependencies (concurrently)
cd client && npm install   # React app
cd ../server && npm install # Express API
```

### 2. Environment Setup

```bash
cp server/.env.example server/.env
# Open server/.env and set:
#   DATABASE_URL — your local PostgreSQL connection string
#   JWT_SECRET   — any 32+ character random string

cp client/.env.example client/.env.local
# Open client/.env.local and set:
#   VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
# Create the development database
createdb flipkart_dev
# or: psql -U postgres -c "CREATE DATABASE flipkart_dev;"

# Run all 9 migrations (creates tables)
npm run migrate

# Seed with 50 products across 8 categories + demo user
npm run seed

# Re-seed from scratch
cd server && node src/db/seed.js --reset
```

### 4. Run Development

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# API docs: http://localhost:5000/api/health
```

### Docker Alternative

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# DB:       localhost:5433
```

---

## Deployment

### Required GitHub Actions Secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Vercel dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `team_6bXzC8B815868CQWqvcagAmz` |
| `VERCEL_PROJECT_ID_CLIENT` | `prj_KSow1Ja17JfcMAmu0CE7p1NB9nTv` |
| `VERCEL_PROJECT_ID_SERVER` | `prj_hJGAKSsGkYQC0Xv18keD0D1Ztz5s` |

### Frontend — Vercel

1. Import GitHub repo on [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL` → `https://flipkart-clone-api-nine.vercel.app/api`
4. Deploy — Vercel auto-detects Vite and runs `npm run build`

**SPA routing** is handled by `client/vercel.json` — all paths rewrite to `/index.html`.

### Backend — Vercel (Serverless)

1. Import same GitHub repo on [vercel.com/new](https://vercel.com/new)
2. **Root Directory**: `server`
3. **Build Command**: `npm ci`
4. **Start Command**: `node server.js`
5. **Environment Variables** — copy from `server/.env.example` and fill values:
   - `DATABASE_URL` — from your Render PostgreSQL instance
   - `JWT_SECRET` — strong random string (32+ chars)
   - `NODE_ENV=production`
   - `CLIENT_URL` — your Vercel frontend URL
6. Deploy

### Database — Render PostgreSQL

1. **New PostgreSQL** → choose Free tier
2. Copy the **Internal Database URL** to the backend service's `DATABASE_URL`
3. Open **Shell** in the Render dashboard and run:
   ```bash
   npm run migrate && npm run seed
   ```

---

## API Reference

All endpoints are prefixed `/api`. Auth-required endpoints need `Authorization: Bearer <token>`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account, returns `{ user, token }` |
| POST | `/auth/login` | — | Returns `{ user, token }` |
| GET | `/auth/me` | ✓ | Get current user profile |
| GET | `/auth/default-user` | — | Auto-login demo user (no credentials needed) |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | — | List with filter/sort/pagination |
| GET | `/products/featured` | — | Homepage sections |
| GET | `/products/:id` | — | Product detail by public UUID |

**Query params for `GET /products`:** `category`, `search`, `sort` (`price_asc`, `price_desc`, `rating_desc`, `discount_desc`, `created_at_desc`), `minPrice`, `maxPrice`, `rating`, `page`, `limit`

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | ✓ | Get cart with price summary |
| POST | `/cart` | ✓ | Add item (`{ productId, quantity }`) |
| PATCH | `/cart/:itemId` | ✓ | Update quantity |
| DELETE | `/cart/:itemId` | ✓ | Remove item |
| DELETE | `/cart` | ✓ | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | ✓ | Place order (`{ addressId, paymentMethod }`) |
| GET | `/orders` | ✓ | Order history |
| GET | `/orders/:id` | ✓ | Order detail |

### Addresses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/addresses` | ✓ | List saved addresses |
| POST | `/addresses` | ✓ | Add address |
| PATCH | `/addresses/:id` | ✓ | Update address |
| PATCH | `/addresses/:id/default` | ✓ | Set as default |
| DELETE | `/addresses/:id` | ✓ | Delete (promotes next as default) |

### Wishlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wishlist` | ✓ | Full wishlist items |
| GET | `/wishlist/ids` | ✓ | Product UUID array (for heart icons) |
| POST | `/wishlist` | ✓ | Add product |
| DELETE | `/wishlist/:productId` | ✓ | Remove product |

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | — | All categories |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Server status + DB ping |

---

## Testing

```bash
# Run all server tests (requires TEST_DATABASE_URL or local PostgreSQL)
npm test

# Run with coverage
cd server && npx jest --coverage
```

Tests use **Jest + Supertest** against a real PostgreSQL test database. The `app.js` module exports the Express app without calling `listen()`, enabling clean Supertest integration.

---

## Project Structure

```
flipkart-clone/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Lint, test, build on every push
│       └── deploy.yml       # Deploy to Render + Vercel on main
├── client/                  # React 18 + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       ├── tokens.css      # CSS custom properties (design tokens)
│   │   │       └── global.css      # Resets, Inter font, thin scrollbar
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge/
│   │   │   │   ├── EmptyState/
│   │   │   │   ├── Pagination/
│   │   │   │   ├── PriceBlock/
│   │   │   │   ├── ProductCard/
│   │   │   │   ├── RatingStars/
│   │   │   │   └── SkeletonLoader/
│   │   │   ├── home/
│   │   │   │   ├── CategoryNav.jsx
│   │   │   │   └── FeaturedProducts.jsx
│   │   │   └── layout/
│   │   │       ├── Header/
│   │   │       └── Footer/
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   │   └── components/
│   │   │   │       ├── AddressStep.jsx
│   │   │   │       ├── OrderSummaryStep.jsx
│   │   │   │       ├── PaymentStep.jsx
│   │   │   │       └── StepIndicator.jsx
│   │   │   ├── Home/
│   │   │   │   └── components/
│   │   │   │       ├── CategoryTiles.jsx
│   │   │   │       ├── DealSection.jsx
│   │   │   │       ├── HeroBanner.jsx
│   │   │   │       └── HorizontalScrollSection.jsx
│   │   │   ├── Login/
│   │   │   ├── NotFound/
│   │   │   ├── OrderConfirmation/
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── OrderHistory/
│   │   │   ├── ProductDetail/
│   │   │   │   └── components/
│   │   │   │       ├── CTAButtons.jsx
│   │   │   │       ├── ImageGrid.jsx
│   │   │   │       └── SpecsTable.jsx
│   │   │   ├── ProductListing/
│   │   │   │   └── components/
│   │   │   │       ├── FilterSidebar.jsx
│   │   │   │       └── SortBar.jsx
│   │   │   ├── Signup/
│   │   │   └── Wishlist/
│   │   ├── services/
│   │   │   └── api.js          # Axios instance + 7 service objects
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── checkoutSlice.js
│   │   │       └── wishlistSlice.js
│   │   ├── App.jsx             # createBrowserRouter, protected routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # pg Pool singleton
│   │   ├── controllers/        # HTTP layer only
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   ├── addressController.js
│   │   │   └── wishlistController.js
│   │   ├── db/
│   │   │   ├── migrate.js
│   │   │   ├── seed.js
│   │   │   ├── migrations/     # 001–009 SQL files
│   │   │   └── seeds/          # 01–03 SQL files
│   │   ├── middleware/
│   │   │   ├── auth.js         # { authenticate } JWT middleware
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── index.js        # Router aggregator
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── addresses.js
│   │   │   ├── wishlist.js
│   │   │   └── health.js
│   │   ├── services/           # SQL layer only
│   │   │   ├── authService.js
│   │   │   ├── cartService.js
│   │   │   ├── categoryService.js
│   │   │   ├── orderService.js
│   │   │   ├── productService.js
│   │   │   ├── addressService.js
│   │   │   └── wishlistService.js
│   │   ├── utils/
│   │   │   ├── AppError.js     # Operational error class
│   │   │   ├── asyncHandler.js
│   │   │   └── formatResponse.js
│   │   └── app.js              # Express app (no listen)
│   ├── server.js               # Entry point (calls listen)
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── package.json               # Root workspace + concurrently scripts
```

---

## Assumptions & Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Default user auto-login** | Calling `GET /auth/default-user` on app load when no token exists lets evaluators browse and shop without manually creating an account |
| **Stock is a boolean flag** | `in_stock` does not decrement on purchase — real inventory management is out of scope |
| **Payment is simulated** | No Razorpay/Stripe integration — payment methods are stored but no charge is made |
| **Images from picsum.photos** | No S3/Cloudinary setup required. Product images use seeded `picsum.photos` URLs |
| **Free delivery on all orders** | `delivery_fee = 0` for simplicity; discount math is exact |
| **JWT stateless, no refresh** | 7-day expiry; refresh tokens and logout blocklisting are not implemented |
| **Single DB region** | Render Free tier PostgreSQL in a single region; no read replicas |

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client (5173) + server (5000) concurrently |
| `npm run dev:client` | Start only the Vite dev server |
| `npm run dev:server` | Start only the Express server with nodemon |
| `npm run build:client` | Production Vite build → `client/dist/` |
| `npm run migrate` | Run pending SQL migrations |
| `npm run seed` | Seed database with sample data |
| `npm run lint` | ESLint both client and server |
| `npm test` | Run Jest + Supertest server tests |
| `docker-compose up --build` | Full stack via Docker |

