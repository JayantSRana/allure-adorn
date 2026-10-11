# Allure Adorn

Luxury e-commerce storefront + admin portal for **Allure Adorn** — a boutique
jewellery and home-decor label.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide React
- **Data:** file-backed store (`data/db.json`) with an optional Upstash Redis/KV
  REST layer, seeded from `src/lib/seed-catalog.ts`
- **Realtime:** Node `EventEmitter` bus over SSE (`src/lib/realtime.ts`)

## Getting Started

```bash
npm install
cp .env.example .env.local   # optional — sensible defaults are used otherwise
npm run dev                  # http://localhost:3000
```

## Build & run (production)

```bash
npm run build
npm run start
```

## Admin portal

1. Visit `/admin`
2. Enter the demo PIN: **`0314`**
3. Sessions last 12h (httpOnly cookie, `allure_admin_auth`)

The portal covers: dashboard/analytics (revenue, COGS, gross profit, margin,
AOV), orders ledger (filters, fulfil/cancel/refund, notes), an **Inbox** for
contact enquiries and newsletter subscribers, products & inventory,
collections, home-decor, reviews moderation, discounts & fees, and settings.

### Demo data

The dashboard is driven by **real orders only**. To populate it for a walkthrough
without faking storefront reviews, open **Admin → Dashboard → “Seed demo orders”**
(POST `/api/admin/demo-orders`). Every sample order is tagged
`admin_notes: "DEMO DATA"` and can be removed again with one click.

## Demo behaviour (clearly labelled placeholders)

| Area | Demo behaviour |
| --- | --- |
| Online payment | Simulated — order is marked `PAID` immediately (no Razorpay keys). COD is real. |
| Product cost price | Estimated (`price × 0.45`) until real costs are supplied — affects margin reporting only. |
| Reviews | Customers can submit reviews on any product; each waits for **admin approval** and is auto-labelled "Verified" only when the phone number matches a paid order. The storefront shows approved reviews only — never faked. |
| Wishlist | Saved in the browser (localStorage) at `/wishlist`; the header heart shows a live count. |
| Imagery | Real photography curated from the client's own catalogue PDFs. |

## Sharing the demo

For a quick, account-free shareable link from your machine, a Cloudflare/ngrok
tunnel works well:

```bash
# with ngrok installed and configured
ngrok http 3000
```

For a permanent URL, deploy to Vercel:

```bash
vercel login
vercel --prod
```

> The realtime SSE bus is per-process. On a multi-instance host (e.g. Vercel
> serverless), swap `src/lib/realtime.ts` for Redis pub/sub or Upstash.

## Key routes

- Storefront: `/`, `/shop`, `/bangles`, `/home-decor`,
  `/collections/[slug]`, `/product/[slug]`, `/cart`, `/checkout`,
  `/order/[orderId]`, `/track`, `/wishlist`
- CMS pages: `/about`, `/care`, `/contact`, `/shipping`, `/returns`,
  `/privacy`, `/terms`, `/faqs`
- Admin: `/admin` (PIN-gated)

## Environment variables

See `.env.example`. All are optional for local demo; supply real values for
production (Razorpay, Upstash/KV, VAPID keys, Google Sheets webhook, email).
