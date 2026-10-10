================================================================================
ALLURE ADORN — MASTER BUILD PROMPT
Luxury Jewellery & Home Decor E-Commerce Platform
Version 1.0 | Next.js 14 + TypeScript + Tailwind CSS
================================================================================

You are an expert full-stack engineer and UI/UX designer. Build a
production-ready, elegant, feminine luxury e-commerce platform named
"Allure Adorn" — a boutique jewellery and home decor brand — from scratch
using Next.js 14 (App Router), TypeScript, Tailwind CSS, and Lucide React.

The site must feel like a PREMIUM BOUTIQUE BRAND, NOT an Instagram reseller.
It must be FULLY FUNCTIONAL end-to-end: browsable catalog, cart, checkout,
payment, order tracking, admin dashboard with analytics, inventory, and
content management.

Adhere strictly to the architecture, design system, and business rules below.


================================================================================
1. CORE TECH STACK & DESIGN SYSTEM
================================================================================

- Framework: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React.
- Theme: Feminine luxury boutique — ivory, burgundy, charcoal, antique gold,
  blush.

COLOUR PALETTE (strict ratios — restraint = luxury):
  | Use                  | Colour          | Hex       | Ratio |
  |----------------------|-----------------|-----------|-------|
  | Main background      | Warm Ivory      | #F7F2E8   | 60%   |
  | Main text            | Charcoal        | #171717   | 20%   |
  | Primary brand        | Deep Burgundy   | #6B1F24   | 12%   |
  | Luxury accent        | Antique Gold    | #B08A4A   | 5%    |
  | Soft accent          | Blush           | #F8D7D7   | 3%    |
  | Secondary background | Champagne/Ivory | #EFE5D4   | —     |

  DO NOT use gold everywhere. DO NOT use bright pink. The restraint is what
  makes it look premium.

TYPOGRAPHY (STRICT — max 2 fonts):
  - Headings: Elegant serif — Cormorant Garamond or Playfair Display.
  - Body & UI: Clean sans-serif — Montserrat, Lato, or DM Sans.
  - Logo: The existing Allure Adorn script logo (image asset only — do NOT
    recreate in another font).
  - NEVER use script fonts for body or headings. NO font mixing beyond these
    two families.

BRAND DETAIL SYSTEM:
  - The four-diamond ornament (◆◆◆◆) from the logo becomes a recurring motif:
    section dividers, product cards, footer, loading states, thank-you page,
    favicon.
  - Favicon: "AA" inside a simple gold/charcoal circle.
  - Logo placement: small in header, full in footer, full on packaging
    mockups, "AA" as favicon.

BUTTONS:
  - Primary: Burgundy background, ivory text, slightly rounded (NOT pill).
  - Secondary: Transparent ivory, thin burgundy/gold border.
  - Never bright/neon colours.

DATABASE & PERSISTENCE (production-grade):
  - Dual-layer: Upstash Redis / Vercel KV REST API as primary, with
    auto-syncing local fallback (data/db.json).
  - Robust ensureDatabase(), writeDatabase(), and atomic file locking to
    prevent race conditions.

REAL-TIME COMMUNICATION:
  - SSE route at /api/realtime broadcasting: ORDER_CREATED, ORDER_PAID,
    ORDER_UPDATED, ORDER_SHIPPED, INVENTORY_UPDATED, SETTINGS_UPDATED,
    REVIEW_ADDED.
  - Admin dashboard + customer order tracking update live — no aggressive
    polling.

PUSH NOTIFICATIONS:
  - Web Push API with VAPID keys for new-order alerts to admin/staff device
    (/api/admin/push).
  - Optional audio chime (HTML5 Web Audio API) on /admin/orders when a new
    order lands.

EXTERNAL INTEGRATIONS:
  - Razorpay: UPI QR / Card / Net Banking / Wallet checkout + backend
    signature verification.
  - Google Sheets Webhook: background sync on order creation, status update,
    refunds (for ops team).
  - WhatsApp Click-to-Chat button (deep link) for "Enquire about this piece."
  - Instagram feed embed placeholder for "Follow the Allure."


================================================================================
2. DATA MODELS & TYPES (src/types/index.ts)
================================================================================

Product:
  id, slug, name, description (short + long),
  category ('JEWELLERY' | 'BANGLES' | 'EARRINGS' | 'NECKLACES' | 'RINGS' |
            'HOME_DECOR' | 'CANDLES' | 'VASES' | 'WALL_ART' | 'TABLESCAPE'),
  sub_category, price, compare_at_price (for strikethrough), cost_price,
  images: string[] (4–6 per product), hover_image, material, finish, colour,
  care_instructions, size_options: string[], stock, is_anti_tarnish,
  is_new_arrival, is_bestseller, collection_ids: string[],
  tags: string[] (for search: "gold earrings", "bangles for wedding",
                  "anti tarnish necklace", "kundan"),
  rating_avg, rating_count, is_active, created_at.

Collection:
  id, name (e.g. "The Allure Edit", "The Wedding Edit", "Festive Edit",
  "Everyday Allure", "Bridal Edit", "Statement Edit"), description,
  hero_image, product_ids, season, is_featured.

Order:
  id, order_number (#AA-YYMMDD-####), customer_name, customer_phone
  (validated 10-digit), customer_email, shipping_address (line1, line2,
  city, state, pincode, country), billing_address,
  items: OrderItem[] (product snapshot + qty + price), subtotal,
  discount_percent, discount_amount, discount_code, shipping_fee,
  total_amount, total_cost,
  payment_method ('RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'RAZORPAY_NETBANKING' |
                  'RAZORPAY_WALLET' | 'COD'),
  payment_status ('PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'),
  razorpay_order_id, razorpay_payment_id,
  status ('PENDING_PAYMENT' | 'PAID' | 'PACKED' | 'SHIPPED' | 'DELIVERED' |
          'CANCELLED' | 'RETURNED'),
  tracking_number, courier, notes, admin_notes,
  refund_status, refund_amount, refund_reason,
  status_history: {status, timestamp, note}[], created_at, updated_at.

Customer:
  id, name, phone, email, addresses: Address[], wishlist: string[]
  (product IDs), created_at.

Review:
  id, product_id, customer_name, customer_phone (for verification),
  rating (1–5), title, body, images: string[], is_verified_purchase,
  is_approved (admin moderation), created_at.
  CRITICAL (Riya's fix #4): Only render as "Verified Customer" if the
  reviewer's phone matches a paid order. No fake reviews — if none exist,
  hide the section.

SystemSettings:
  store_open, admin_pin (default '0314'), staff_pin, cod_enabled,
  discount_enabled, discount_percent, discount_code,
  free_shipping_threshold, shipping_fee_flat,
  international_shipping_enabled, google_sheets_webhook_url,
  whatsapp_number, instagram_handle, announcement_bar_text,
  announcement_bar_enabled.

HomeDecor-specific:
  dimensions, weight, fragile, care_instructions,
  room_type ('LIVING' | 'BEDROOM' | 'DINING' | 'KITCHEN' | 'BATHROOM' |
             'OFFICE').


================================================================================
3. CUSTOMER STOREFRONT — DESIGN PRIORITIES
================================================================================

CRITICAL FIXES FROM RIYA'S FEEDBACK (apply throughout):
  1. Products first, text second. Hero must lead with a gorgeous
     product/editorial image, minimal copy.
  2. Smoother, brand-coloured slideshow — use ivory/burgundy/gold transitions,
     no jarring jumps, no random colours.
  3. Consistent product photography — every product card uses same
     ivory/champagne background, clear high-res images, NO watermarks.
  4. Clean fonts — only the two specified families, everywhere.
  5. Simple navigation — reduce to essentials (see §3.3).
  6. Real reviews only — hide section if no verified reviews exist.

--------------------------------------------------------------------------------
3.1 HOMEPAGE (/)
--------------------------------------------------------------------------------

Announcement Bar (thin burgundy strip):
  "✨ Worldwide Shipping Available | Free shipping above ₹____ ✨"
  — small, elegant, dismissible.

Header/Nav:
  - Left: Allure Adorn logo (small).
  - Centre (DESKTOP — simplified per feedback):
      HOME | SHOP | ABOUT | CONTACT
  - Right: ♡ Wishlist | 🔍 Search | 👤 Account | 🛍 Cart (with badge)
  - Mobile: ☰ | Logo | 🛍
  - Shop opens a mega-menu with: Jewellery, Bangles, Earrings, Necklaces,
    Rings, Home Decor, New Arrivals, Collections, Best Sellers.

Hero Section (product-first, per fix #1):
  - 70% visual, 30% text. Large editorial jewellery photograph (model
    wearing earrings/necklace, soft ivory fabric, natural light, plenty of
    negative space).
  - Minimal headline: "Adornment, made to be remembered."
  - One-line subtext.
  - Two buttons: SHOP JEWELLERY (primary burgundy) | EXPLORE BANGLES
    (secondary).
  - Smooth slideshow (3–4 slides) using brand colours only.

Shop by Category: "Discover Your Adornment"
  - Cards for Jewellery, Bangles, Earrings, Necklaces, Rings, Home Decor.
  - Each with lifestyle image + tagline.

New Arrivals: 4-product grid.
  Each card: image (with hover second image), ♡ wishlist, name,
  price (strikethrough if compare_at_price), "Anti-Tarnish" badge if
  applicable, ADD TO CART on hover.

The Allure Edit (Featured Collection):
  - Large editorial image + text, EXPLORE THE COLLECTION button.
  - Rotates seasonally.

Made To Stay Beautiful (Anti-Tarnish section):
  - Close-up jewellery photo + SHOP ANTI-TARNISH.

Home Decor Section: "Adorn Your Space"
  - Parallel section for home decor (candles, vases, wall art, tablescape).

Instagram Section: "Follow the Allure"
  - 6 Instagram-style photos, @allureadorn, FOLLOW US button.

Loved & Adorned (Reviews):
  - 3–4 REAL verified reviews only. Hide if none.

Shipping/Service Strip:
  - Worldwide Shipping (India • Canada • Australia • UK • Russia & more),
    Secure Packaging, Easy Online Ordering, Customer Support.
  - Simple icons.

Newsletter: "A Little More Allure"
  - Elegant, not corporate. JOIN THE ALLURE LIST.

Footer (deep burgundy bg, ivory/gold text):
  - Full logo, SHOP / INFORMATION / CUSTOMER CARE / POLICIES columns,
    social links, © 2026 Allure Adorn.

--------------------------------------------------------------------------------
3.2 BANGLES SPECIAL PAGE (/bangles)
--------------------------------------------------------------------------------

Hero: "Stack Your Story"
  — "From subtle everyday stacks to festive statement combinations."

Categories: Glass, American Diamond, Crystal, Velvet, Metal, Resin,
Festive Sets.

--------------------------------------------------------------------------------
3.3 NAVIGATION (SIMPLIFIED PER FEEDBACK)
--------------------------------------------------------------------------------

Top-level only: Home, Shop, About, Contact.
Everything else lives inside Shop's mega-menu. No clutter.

--------------------------------------------------------------------------------
3.4 PRODUCT PAGE (/product/[slug])
--------------------------------------------------------------------------------

Left:
  - 4–6 images per product (main, close-up, worn on model, side/detail,
    packaging, size reference).
  - Thumbnail strip + zoom.

Right:
  - Name, ★ rating, ₹ price (strikethrough if discounted), short
    description, Material/Finish/Colour/Care, size selector, quantity
    stepper, ADD TO CART, BUY NOW, ♡ Add to Wishlist, WhatsApp enquiry
    button.

Collapsible sections (clean):
  DESCRIPTION | MATERIAL & DETAILS | SIZE & FIT | JEWELLERY CARE |
  SHIPPING | RETURNS & EXCHANGE.

"You may also like" — 4 related products.

--------------------------------------------------------------------------------
3.5 CART DRAWER & CHECKOUT
--------------------------------------------------------------------------------

Slide-over cart:
  - Itemized, quantity steppers, remove, subtotal, "You may also like"
    (3 products).

Checkout:
  - Contact (name, mobile ^[6-9]\d{9}$, email).
  - Delivery (address, city, state, pincode, country).
  - Payment (Razorpay UPI/Card/NetBanking/Wallet, or COD if enabled).
  - Free shipping bar: "Add ₹___ more for free shipping."
  - Order confirmation → /order/[orderId].

--------------------------------------------------------------------------------
3.6 ORDER TRACKING (/order/[orderId] & /track)
--------------------------------------------------------------------------------

Lookup by Order ID or phone.
Stepper: PENDING_PAYMENT → PAID → PACKED → SHIPPED → DELIVERED.
Real-time SSE updates.
Tracking number + courier link once shipped.

--------------------------------------------------------------------------------
3.7 SEARCH
--------------------------------------------------------------------------------

Understands natural queries: "gold earrings", "bangles for wedding",
"anti tarnish necklace", "kundan jewellery".
Fuzzy match on tags + name + category.

--------------------------------------------------------------------------------
3.8 STATIC PAGES
--------------------------------------------------------------------------------

About (/about):
  - "The Story Behind Allure Adorn" — large photo + founder story.
  - Warm, personal, NOT corporate.

Care Guide (/care):
  - "Care For Your Allure" — keep away from perfumes, avoid water/chemicals,
    store separately, wipe gently, dry place. Visually beautiful.

Shipping / Returns / Privacy / Terms / FAQs / Contact.


================================================================================
4. ADMIN PORTAL (/admin)
================================================================================

Gate entire section with Admin PIN (0314) + cookie auth
(allure_admin_auth=true).

--------------------------------------------------------------------------------
A. DASHBOARD & ANALYTICS (/admin)
--------------------------------------------------------------------------------

Date filters: Today, Yesterday, Last 7 Days, This Month, All Time.

Financial rules (strict):
  - Net Revenue = sum total_amount ONLY from orders with
    payment_status === 'PAID'.
    Exclude PENDING_PAYMENT and CANCELLED.
  - COGS = sum of each item's cost_price × qty.
  - Gross Profit = Net Revenue − COGS.
  - Profit Margin = (Gross Profit / Net Revenue) × 100.
  - AOV = Net Revenue / Count of Paid Orders.

Charts:
  - Top 5 best-selling products.
  - Category share (Jewellery vs Bangles vs Home Decor).
  - Hourly order distribution.
  - Repeat-customer rate.

--------------------------------------------------------------------------------
B. ORDERS LEDGER (/admin/orders)
--------------------------------------------------------------------------------

Search by name, phone, order number.
Filters: Status, Payment Status, Category, Refund Status.
"Mark Paid → Pack" button on PENDING_PAYMENT orders (for COD/manual).
Refund management: flag as NEEDS_REFUND / REFUNDED with amount, reason,
  notes.
Snapshot modal: full itemized breakdown, customer details, tracking link,
  delete order.

--------------------------------------------------------------------------------
C. PRODUCTS & INVENTORY (/admin/products)
--------------------------------------------------------------------------------

Full CRUD:
  name, slug, description, images (multi-upload), price, compare_at_price,
  cost_price, stock, material, finish, colour, care, size_options,
  category, sub_category, collections, tags, is_anti_tarnish,
  is_new_arrival, is_bestseller.

Low-stock alerts + bulk stock update.
Same-background photo consistency check (warning if images have
  inconsistent backgrounds).

--------------------------------------------------------------------------------
D. COLLECTIONS MANAGER (/admin/collections)
--------------------------------------------------------------------------------

Create/edit seasonal edits: "The Allure Edit", "Wedding Edit", "Festive
Edit", "Everyday Allure", "Bridal Edit", "Statement Edit".
Assign products, set hero image, toggle featured on homepage.

--------------------------------------------------------------------------------
E. HOME DECOR MANAGER (/admin/home-decor)
--------------------------------------------------------------------------------

Parallel CRUD for home decor with extra fields:
  dimensions, weight, fragile flag, room_type.

--------------------------------------------------------------------------------
F. REVIEWS MODERATION (/admin/reviews)
--------------------------------------------------------------------------------

Approve/reject reviews.
Auto-verify against paid orders (phone match).
Flag fake/spam.
Hide section on homepage if zero approved verified reviews.

--------------------------------------------------------------------------------
G. DISCOUNTS & FEES (/admin/discounts)
--------------------------------------------------------------------------------

Discount codes, launch discount %, free shipping threshold, flat shipping
fee, international shipping toggle, COD toggle.

--------------------------------------------------------------------------------
H. SETTINGS (/admin/settings)
--------------------------------------------------------------------------------

Admin/Staff PINs, Razorpay keys, Google Sheets webhook, WhatsApp number,
Instagram handle, announcement bar text, Upstash Redis sync.


================================================================================
5. UI/UX POLISH RULES (NON-NEGOTIABLE)
================================================================================

  1. Restraint = luxury. Ivory 60%, charcoal 20%, burgundy 12%, gold 5%,
     blush 3%. No exceptions.
  2. Products before prose. Homepage hero shows a product/editorial image
     within the first viewport.
  3. Two fonts max. Serif for headings, sans for body. Logo is an image.
  4. Consistent product photography. Same ivory/champagne background for
     every product. No watermarks. High-res only.
  5. Smooth, brand-coloured transitions. No random pinks, no jarring slides.
  6. Real reviews only. Verified purchases only. Hide section if empty.
  7. The four-diamond motif (◆) appears as: section dividers, card corners,
     footer, loading spinner, thank-you page, packaging mockup, favicon.
  8. Mobile-first. Most traffic comes from Instagram/WhatsApp. Test every
     page at 375px.
  9. Micro-interactions: subtle hover lifts, gold underline on links, soft
     fade-ins on scroll (Framer Motion optional but preferred).
 10. Accessibility: WCAG AA contrast, alt text on every image,
     keyboard-navigable modals.


================================================================================
6. ENVIRONMENT VARIABLES
================================================================================

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:orders@allureadorn.com
GOOGLE_SHEETS_WEBHOOK_URL=
RAZORPAY_KEY_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_INSTAGRAM_HANDLE=allureadorn


================================================================================
7. DELIVERABLES
================================================================================

- Zero TypeScript errors (tsc --noEmit).
- Optimized production build (next build passes).
- All routes functional:
    /, /shop, /product/[slug], /bangles, /home-decor,
    /collections/[slug], /cart, /checkout, /order/[orderId], /track,
    /about, /care, /contact, /admin/*
- Seed data:
    - 12 jewellery products
    - 8 bangles
    - 6 home decor items
    - 3 collections
    - 4 real-looking (but clearly placeholder-flagged) reviews marked
      is_approved: false until admin verifies.
- README with setup, env vars, Razorpay setup, Upstash setup, and
  deployment notes.


================================================================================
FINAL DIRECTIVE
================================================================================

Build this end-to-end. Prioritise the customer-facing polish (photography
consistency, restrained palette, two-font system, product-first hero)
because that's what drives trust and sales — then ensure the admin/analytics
layer is equally production-hardened.

================================================================================
END OF PROMPT
================================================================================