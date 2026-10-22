# Allure Adorn

Luxury e-commerce storefront + admin portal for **Allure Adorn** — a boutique
jewellery and home-decor label.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide React
- **Data:** Upstash Redis cloud database with automatic local file fallback (`data/db.json`), seeded from `src/lib/seed-catalog.ts` & `src/lib/seed-sections.ts`
- **Sections CMS:** Full Homepage Section & Item builder accessible at `/admin/content`
- **Realtime:** Node `EventEmitter` bus over SSE (`src/lib/realtime.ts`)

## Getting Started

```bash
npm install
cp .env.example .env.local   # Configure Upstash Redis credentials
npm run dev                  # http://localhost:3000
```

## Build & Run (Standalone / Production)

```bash
npm run build
npm run start
```

## Deployment (AI Studio / Cloud Run / Container)

This application is configured for standalone container deployment (`output: 'standalone'`).

```bash
# Build & run Docker container (defaults to port 8080)
docker build -t allure-adorn .
docker run -p 8080:8080 --env-file .env.local allure-adorn
```

For persistent database storage across container/instance restarts, Upstash Redis is connected via:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Admin Portal

1. Visit `/admin`
2. Enter the PIN: **`0314`** (configurable in Admin → Settings)
3. Sessions last 12h (httpOnly cookie, `allure_admin_auth`)

The portal covers:
- **Website & Sections (`/admin/content`):** Reorder, toggle, add, remove, and customize homepage sections, hero slides, category cards, service badges, and banners.
- **Dashboard & Analytics:** Revenue, COGS, gross profit, margin, AOV, top products.
- **Orders Ledger:** Order statuses, fulfill, cancel, refund, tracking numbers.
- **Inbox:** Contact inquiries and newsletter subscribers.
- **Products & Inventory:** Jewelry and home decor catalog CRUD with image upload.
- **Collections & Home Decor:** Seasonal curations and room-based collections.
- **Reviews:** Customer review moderation with phone verification.
- **Discounts & Settings:** Coupons, shipping fees, COD, announcement bar, WhatsApp number.

## Key Routes

- Storefront: `/`, `/shop`, `/bangles`, `/home-decor`, `/collections/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/order/[orderId]`, `/track`, `/wishlist`
- CMS pages: `/about`, `/care`, `/contact`, `/shipping`, `/returns`, `/privacy`, `/terms`, `/faqs`
- Admin: `/admin`, `/admin/content`, `/admin/orders`, `/admin/products`, `/admin/settings`

## Environment Variables

See `.env.example`. Supply real values in `.env.local`:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
