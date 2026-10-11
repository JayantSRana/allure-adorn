import { Product, Collection, Review } from '@/types';

const now = new Date().toISOString();

const P = (n: number) => `/products/product-${n}.jpg`;
const E = (n: number) => `/editorial/editorial-${n}.jpg`;

interface SeedInput {
  slug: string;
  name: string;
  category: Product['category'];
  sub_category?: string;
  price: number;
  compare_at_price?: number;
  cost_price: number;
  imgs: number[];
  material: string;
  finish: string;
  colour: string;
  sizes?: string[];
  stock: number;
  anti_tarnish?: boolean;
  new_arrival?: boolean;
  bestseller?: boolean;
  collections?: string[];
  tags: string[];
  short: string;
  long: string;
  dimensions?: string;
  weight?: number;
  fragile?: boolean;
  room_type?: Product['room_type'];
}

function build(items: SeedInput[], prefix: string): Product[] {
  return items.map((it, idx) => ({
    id: `${prefix}-${String(idx + 1).padStart(3, '0')}`,
    slug: it.slug,
    name: it.name,
    description_short: it.short,
    description_long: it.long,
    category: it.category,
    sub_category: it.sub_category,
    price: it.price,
    compare_at_price: it.compare_at_price,
    cost_price: it.cost_price,
    images: it.imgs.map(P),
    hover_image: it.imgs.length > 1 ? P(it.imgs[1]) : P(it.imgs[0]),
    material: it.material,
    finish: it.finish,
    colour: it.colour,
    care_instructions:
      'Keep away from perfume, water and chemicals. Store separately in the pouch provided. Wipe gently with a soft dry cloth.',
    size_options: it.sizes ?? [],
    stock: it.stock,
    is_anti_tarnish: it.anti_tarnish ?? false,
    is_new_arrival: it.new_arrival ?? false,
    is_bestseller: it.bestseller ?? false,
    collection_ids: it.collections ?? [],
    tags: it.tags,
    rating_avg: 0,
    rating_count: 0,
    is_active: true,
    created_at: now,
    updated_at: now,
    dimensions: it.dimensions,
    weight: it.weight,
    fragile: it.fragile,
    room_type: it.room_type,
  }));
}

const JEWELLERY: SeedInput[] = [
  { slug: 'gilded-pearl-drop-earrings', name: 'Gilded Pearl Drop Earrings', category: 'EARRINGS', sub_category: 'Drops', price: 2899, compare_at_price: 3499, cost_price: 1180, imgs: [1, 6, 10], material: 'Brass with freshwater pearl', finish: 'Antique gold', colour: 'Gold / Ivory', sizes: [], stock: 42, anti_tarnish: true, new_arrival: true, bestseller: true, collections: ['col-allure', 'col-wedding'], tags: ['gold earrings', 'pearl', 'anti tarnish', 'wedding', 'drop earrings'], short: 'Luminous pearl drops framed in antique gold.', long: 'A quiet statement. Hand-set freshwater pearls are cradled in a hand-polished antique-gold setting, designed to catch the light as you move. Light enough for all-day wear, refined enough for the aisle.' },
  { slug: 'kundan-heritage-necklace', name: 'Kundan Heritage Necklace', category: 'NECKLACES', sub_category: 'Statement', price: 7499, compare_at_price: 8999, cost_price: 3100, imgs: [2, 7, 11], material: 'Kundan stones, brass base', finish: 'Gold-tone', colour: 'Gold / Pearl', sizes: [], stock: 18, anti_tarnish: true, bestseller: true, collections: ['col-wedding', 'col-festive'], tags: ['kundan jewellery', 'necklace', 'wedding', 'bridal', 'anti tarnish'], short: 'Heirloom kundan work for the bridal moment.', long: 'Inspired by the kundan traditions of Rajasthan, every stone is set by hand into a gold-tone frame. A piece that carries the weight of occasion without ever feeling heavy.' },
  { slug: 'everyday-gold-studs', name: 'Everyday Gold Studs', category: 'EARRINGS', sub_category: 'Studs', price: 1299, cost_price: 520, imgs: [3, 8], material: 'Stainless steel', finish: '18k gold plated', colour: 'Gold', sizes: [], stock: 120, anti_tarnish: true, new_arrival: true, collections: ['col-everyday'], tags: ['gold earrings', 'studs', 'everyday', 'anti tarnish', 'minimal'], short: 'The stud you never take off.', long: 'Understated, featherweight, and built to last. Our anti-tarnish plating keeps them gleaming through workdays, workouts and everything between.' },
  { slug: 'rosewater-statement-necklace', name: 'Rosewater Statement Necklace', category: 'NECKLACES', sub_category: 'Statement', price: 4599, cost_price: 1900, imgs: [4, 9, 12], material: 'Brass, enamel', finish: 'Matte gold', colour: 'Blush / Gold', sizes: [], stock: 27, anti_tarnish: true, collections: ['col-festive', 'col-statement'], tags: ['necklace', 'statement', 'blush', 'anti tarnish', 'festive'], short: 'Soft blush enamel, softly luminous gold.', long: 'A romantic wash of blush enamel set against matte gold. The kind of piece that turns a simple outfit into a considered one.' },
  { slug: 'antique-locket-chain', name: 'Antique Locket Chain', category: 'NECKLACES', sub_category: 'Pendants', price: 2199, compare_at_price: 2599, cost_price: 870, imgs: [5, 10], material: 'Brass', finish: 'Antique gold', colour: 'Gold', sizes: [], stock: 63, anti_tarnish: true, collections: ['col-everyday', 'col-allure'], tags: ['necklace', 'locket', 'antique', 'anti tarnish', 'everyday'], short: 'A tiny keepsake, worn close.', long: 'A delicate locket on a fine chain. Holds what matters most — or simply looks beautiful on its own.' },
  { slug: 'crystal-halo-stud-earrings', name: 'Crystal Halo Stud Earrings', category: 'EARRINGS', sub_category: 'Studs', price: 1899, cost_price: 720, imgs: [6, 1], material: 'Cubic zirconia, brass', finish: 'Rhodium', colour: 'Silver', sizes: [], stock: 55, anti_tarnish: true, new_arrival: true, collections: ['col-wedding'], tags: ['earrings', 'crystal', 'silver', 'anti tarnish', 'wedding'], short: 'A ring of light around a single stone.', long: 'Precision-set cubic zirconia forms a halo that reads as fine diamond. A modern classic for the modern bride.' },
  { slug: 'gilded-leaf-ring', name: 'Gilded Leaf Ring', category: 'RINGS', sub_category: 'Statement', price: 1699, cost_price: 640, imgs: [7, 11], material: 'Brass', finish: 'Antique gold', colour: 'Gold', sizes: ['5', '6', '7', '8', '9'], stock: 48, anti_tarnish: true, collections: ['col-allure'], tags: ['ring', 'gold', 'leaf', 'anti tarnish', 'statement ring'], short: 'A single gilded leaf, wrapped around the finger.', long: 'Cast from a real leaf and finished by hand, each ring is ever so slightly unique — exactly as nature intended.' },
  { slug: 'layered-coin-necklace', name: 'Layered Coin Necklace', category: 'NECKLACES', sub_category: 'Layered', price: 3299, compare_at_price: 3799, cost_price: 1350, imgs: [8, 3], material: 'Stainless steel', finish: 'Gold plated', colour: 'Gold', sizes: [], stock: 34, anti_tarnish: true, bestseller: true, collections: ['col-everyday', 'col-allure'], tags: ['necklace', 'layered', 'coin', 'anti tarnish', 'everyday'], short: 'Two chains, one effortless look.', long: 'A pre-layered pair that sits perfectly every time. No tangling, no fuss — just the layered look, sorted.' },
  { slug: 'emerald-teardrop-earrings', name: 'Emerald Teardrop Earrings', category: 'EARRINGS', sub_category: 'Drops', price: 2699, cost_price: 1080, imgs: [9, 4], material: 'Glass stone, brass', finish: 'Gold-tone', colour: 'Green / Gold', sizes: [], stock: 31, anti_tarnish: true, collections: ['col-festive', 'col-statement'], tags: ['earrings', 'emerald', 'green', 'festive', 'anti tarnish'], short: 'Deep emerald, suspended in gold.', long: 'A faceted glass emerald catches the light with rare depth. Festive, regal, unforgettable.' },
  { slug: 'bridal-pearl-choker', name: 'Bridal Pearl Choker', category: 'NECKLACES', sub_category: 'Choker', price: 5799, compare_at_price: 6799, cost_price: 2400, imgs: [10, 5, 1], material: 'Faux pearls, brass', finish: 'Gold-tone', colour: 'Ivory / Gold', sizes: [], stock: 14, anti_tarnish: true, bestseller: true, collections: ['col-wedding', 'col-bridal'], tags: ['necklace', 'pearl', 'bridal', 'choker', 'wedding', 'anti tarnish'], short: 'A row of pearls, set for the ceremony.', long: 'Classic pearls, individually knotted, finished with a gold-tone clasp. The bridal piece you keep forever.' },
  { slug: 'minimal-signet-ring', name: 'Minimal Signet Ring', category: 'RINGS', sub_category: 'Bands', price: 1499, cost_price: 560, imgs: [11, 7], material: 'Stainless steel', finish: 'Brushed gold', colour: 'Gold', sizes: ['5', '6', '7', '8', '9'], stock: 72, anti_tarnish: true, new_arrival: true, collections: ['col-everyday'], tags: ['ring', 'signet', 'minimal', 'anti tarnish', 'everyday'], short: 'Quiet, architectural, yours.', long: 'A smooth signet with a brushed finish — substantial in the hand, subtle on the eye.' },
  { slug: 'festive-jhumka-earrings', name: 'Festive Jhumka Earrings', category: 'EARRINGS', sub_category: 'Jhumkas', price: 2399, compare_at_price: 2899, cost_price: 940, imgs: [12, 9, 4], material: 'Brass', finish: 'Antique gold', colour: 'Gold', sizes: [], stock: 44, anti_tarnish: true, bestseller: true, collections: ['col-festive', 'col-wedding'], tags: ['earrings', 'jhumka', 'festive', 'wedding', 'anti tarnish'], short: 'The jhumka, reimagined for today.', long: 'Traditional bell silhouette, modern proportions. Light enough to dance in all night.' },
];

const BANGLES: SeedInput[] = [
  { slug: 'glass-bangle-set-of-six', name: 'Glass Bangle Set of Six', category: 'BANGLES', sub_category: 'Glass', price: 899, compare_at_price: 1199, cost_price: 320, imgs: [1, 6], material: 'Glass', finish: 'Glossy', colour: 'Ivory / Burgundy', sizes: ['2.4', '2.6', '2.8'], stock: 90, anti_tarnish: true, new_arrival: true, collections: ['col-everyday', 'col-festive'], tags: ['bangles for wedding', 'glass bangles', 'set', 'festive', 'anti tarnish'], short: 'Six delicate glass bangles, endlessly stackable.', long: 'Traditional glass bangles in a curated palette that layers beautifully with gold or wears alone. Sold as a set of six.' },
  { slug: 'american-diamond-bangle', name: 'American Diamond Bangle', category: 'BANGLES', sub_category: 'American Diamond', price: 2199, compare_at_price: 2699, cost_price: 880, imgs: [2, 7], material: 'Cubic zirconia, brass', finish: 'Rhodium', colour: 'Silver', sizes: ['2.4', '2.6', '2.8'], stock: 38, anti_tarnish: true, bestseller: true, collections: ['col-wedding', 'col-statement'], tags: ['bangles for wedding', 'american diamond', 'bridal', 'anti tarnish'], short: 'A flash of brilliance for the wrist.', long: 'Pavé-set American diamonds wrap a slender frame. The finishing touch on a bridal or evening look.' },
  { slug: 'crystal-frost-bangle-set', name: 'Crystal Frost Bangle Set', category: 'BANGLES', sub_category: 'Crystal', price: 1799, cost_price: 720, imgs: [3, 8], material: 'Crystal, brass', finish: 'Silver-tone', colour: 'Silver / Ivory', sizes: ['2.4', '2.6'], stock: 41, anti_tarnish: true, new_arrival: true, collections: ['col-wedding', 'col-everyday'], tags: ['crystal bangles', 'set', 'wedding', 'anti tarnish'], short: 'Frosted crystal, cool and clear.', long: 'A set of crystal-studded bangles that brings a cool sparkle to warm ivory and blush outfits.' },
  { slug: 'velvet-wrap-bangle', name: 'Velvet Wrap Bangle', category: 'BANGLES', sub_category: 'Velvet', price: 1499, cost_price: 560, imgs: [4, 9], material: 'Velvet, brass', finish: 'Matte', colour: 'Burgundy', sizes: ['2.4', '2.6', '2.8'], stock: 35, anti_tarnish: true, collections: ['col-festive', 'col-statement'], tags: ['velvet bangles', 'burgundy', 'festive', 'statement'], short: 'Burgundy velvet, softly structured.', long: 'A single statement bangle wrapped in deep velvet. Tactile, textural, quietly dramatic.' },
  { slug: 'antique-metal-kada', name: 'Antique Metal Kada', category: 'BANGLES', sub_category: 'Metal', price: 2599, compare_at_price: 3099, cost_price: 1020, imgs: [5, 10], material: 'Brass', finish: 'Antique gold', colour: 'Gold', sizes: ['2.6', '2.8'], stock: 22, anti_tarnish: true, bestseller: true, collections: ['col-statement', 'col-wedding'], tags: ['metal kada', 'bangle', 'antique', 'wedding', 'anti tarnish'], short: 'An heirloom kada, built to be passed down.', long: 'Hand-etched antique-gold kada with the weight and warmth of a family heirloom. A single, powerful statement.' },
  { slug: 'resin-marble-bangle', name: 'Resin Marble Bangle', category: 'BANGLES', sub_category: 'Resin', price: 999, cost_price: 360, imgs: [6, 11], material: 'Resin', finish: 'Glossy', colour: 'Ivory / Gold fleck', sizes: ['2.4', '2.6', '2.8'], stock: 60, anti_tarnish: false, new_arrival: true, collections: ['col-everyday'], tags: ['resin bangles', 'marble', 'everyday', 'minimal'], short: 'Marble-veined resin, impossibly light.', long: 'A featherlight bangle with a marble finish — the everyday piece you will reach for again and again.' },
  { slug: 'gold-stack-bangle-trio', name: 'Gold Stack Bangle Trio', category: 'BANGLES', sub_category: 'Metal', price: 2899, compare_at_price: 3399, cost_price: 1150, imgs: [7, 12], material: 'Stainless steel', finish: '18k gold plated', colour: 'Gold', sizes: ['2.4', '2.6', '2.8'], stock: 40, anti_tarnish: true, bestseller: true, collections: ['col-everyday', 'col-allure'], tags: ['gold bangles', 'stack', 'set', 'anti tarnish', 'everyday'], short: 'Three thin bangles, made to be stacked.', long: 'A trio of fine gold-plated bangles designed to layer, mix and live in. Anti-tarnish so they stay golden.' },
  { slug: 'festive-chooda-set', name: 'Festive Chooda Set', category: 'BANGLES', sub_category: 'Festive Sets', price: 1999, compare_at_price: 2499, cost_price: 780, imgs: [8, 1, 6], material: 'Brass, lac', finish: 'Gold-tone', colour: 'Crimson / Gold', sizes: ['2.4', '2.6', '2.8'], stock: 52, anti_tarnish: true, new_arrival: true, collections: ['col-festive', 'col-wedding'], tags: ['bangles for wedding', 'chooda', 'festive', 'bridal', 'anti tarnish'], short: 'A festive set, ready to celebrate.', long: 'A coordinated set of gold-tone bangles in a festive palette. Designed to be given, worn and remembered.' },
];

const HOME_DECOR: SeedInput[] = [
  { slug: 'amber-blush-candle', name: 'Amber & Blush Candle', category: 'CANDLES', sub_category: 'Scented', price: 1299, compare_at_price: 1599, cost_price: 480, imgs: [9, 13], material: 'Soy wax, ceramic vessel', finish: 'Matte', colour: 'Blush', sizes: [], stock: 80, new_arrival: true, bestseller: true, collections: ['col-home'], tags: ['candle', 'scented', 'home decor', 'gift', 'amber'], short: 'Amber, vanilla and a whisper of rose.', long: 'Hand-poured soy wax in a reusable blush ceramic vessel. Around 45 hours of warm, enveloping burn time.', dimensions: '8cm × 8cm', weight: 320, fragile: true, room_type: 'LIVING' },
  { slug: 'sculpted-ivory-vase', name: 'Sculpted Ivory Vase', category: 'VASES', sub_category: 'Ceramic', price: 2299, cost_price: 890, imgs: [10, 1], material: 'Stoneware ceramic', finish: 'Satin', colour: 'Ivory', sizes: [], stock: 26, bestseller: true, collections: ['col-home'], tags: ['vase', 'home decor', 'ceramic', 'ivory', 'minimal'], short: 'A quiet sculptural form for fresh stems.', long: 'Hand-thrown stoneware with an organic, softened silhouette. Beautiful with flowers, arresting on its own.', dimensions: '22cm × 10cm', weight: 900, fragile: true, room_type: 'DINING' },
  { slug: 'gilded-line-wall-art', name: 'Gilded Line Wall Art', category: 'WALL_ART', sub_category: 'Framed', price: 3499, compare_at_price: 3999, cost_price: 1350, imgs: [11, 2], material: 'Canvas, wood frame', finish: 'Foil detail', colour: 'Ivory / Gold', sizes: [], stock: 19, new_arrival: true, collections: ['col-home', 'col-allure'], tags: ['wall art', 'home decor', 'gold', 'framed', 'gift'], short: 'A single gilded line, framed in oak.', long: 'Minimal abstract line work with a hand-applied gold foil accent. Ships ready to hang.', dimensions: '50cm × 70cm', weight: 1600, fragile: true, room_type: 'BEDROOM' },
  { slug: 'champagne-tablescape-set', name: 'Champagne Tablescape Set', category: 'TABLESCAPE', sub_category: 'Dining', price: 4999, compare_at_price: 5999, cost_price: 1900, imgs: [12, 3], material: 'Stoneware', finish: 'Matte glaze', colour: 'Champagne', sizes: [], stock: 12, bestseller: true, collections: ['col-home'], tags: ['tablescape', 'dinnerware', 'home decor', 'hosting', 'gift'], short: 'Set a table worth lingering at.', long: 'A curated stack of matte-glaze stoneware — plates, bowls and a serving piece — in warm champagne.', dimensions: 'Set of 8', weight: 5200, fragile: true, room_type: 'DINING' },
  { slug: 'brass-arc-bookend', name: 'Brass Arc Bookend', category: 'WALL_ART', sub_category: 'Sculptural', price: 1899, cost_price: 700, imgs: [13, 5], material: 'Solid brass', finish: 'Polished', colour: 'Antique gold', sizes: [], stock: 30, new_arrival: true, collections: ['col-home', 'col-allure'], tags: ['bookend', 'home decor', 'brass', 'gold', 'office'], short: 'An arc of polished brass for your shelf.', long: 'Solid brass, weighted and hand-polished. Functional sculpture for the modern shelf.', dimensions: '12cm × 12cm', weight: 1100, fragile: false, room_type: 'OFFICE' },
  { slug: 'ivory-pillar-candle-trio', name: 'Ivory Pillar Candle Trio', category: 'CANDLES', sub_category: 'Decorative', price: 1499, cost_price: 560, imgs: [1, 4], material: 'Paraffin-free wax', finish: 'Textured', colour: 'Ivory', sizes: [], stock: 48, collections: ['col-home', 'col-everyday'], tags: ['candles', 'home decor', 'ivory', 'gift', 'dining'], short: 'Three sculptural pillars for the table.', long: 'A trio of textured pillar candles in graduated heights. Striking unlit; warm and beautiful lit.', dimensions: '15 / 20 / 25cm', weight: 1200, fragile: true, room_type: 'LIVING' },
];

export const SEED_PRODUCTS: Product[] = [
  ...build(JEWELLERY, 'jwl'),
  ...build(BANGLES, 'bng'),
  ...build(HOME_DECOR, 'hmd'),
];

export const SEED_COLLECTIONS: Collection[] = [
  { id: 'col-allure', name: 'The Allure Edit', description: 'Our signature edit — the pieces we reach for most. Timeless, layerable and quietly luxurious.', hero_image: E(2), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-allure')).map(p => p.id), season: 'All Year', is_featured: true, created_at: now, updated_at: now },
  { id: 'col-wedding', name: 'The Wedding Edit', description: 'For the aisle and everything after. Kundan, pearls and crystal, chosen for the moment you will remember forever.', hero_image: E(23), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-wedding')).map(p => p.id), season: 'Wedding', is_featured: true, created_at: now, updated_at: now },
  { id: 'col-festive', name: 'Festive Edit', description: 'Gold, jhumkas and colour — dressed for celebration.', hero_image: E(13), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-festive')).map(p => p.id), season: 'Festive', is_featured: true, created_at: now, updated_at: now },
  { id: 'col-everyday', name: 'Everyday Allure', description: 'Anti-tarnish, featherweight, made to be worn every single day.', hero_image: E(5), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-everyday')).map(p => p.id), season: 'Everyday', is_featured: false, created_at: now, updated_at: now },
  { id: 'col-bridal', name: 'Bridal Edit', description: 'The complete bridal story, piece by piece.', hero_image: E(30), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-bridal')).map(p => p.id), season: 'Bridal', is_featured: false, created_at: now, updated_at: now },
  { id: 'col-statement', name: 'Statement Edit', description: 'For the days that call for a little more.', hero_image: E(17), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-statement')).map(p => p.id), season: 'Occasion', is_featured: false, created_at: now, updated_at: now },
  { id: 'col-home', name: 'Adorn Your Space', description: 'Home decor to make a house feel considered — candles, vases, art and tablescapes.', hero_image: E(41), product_ids: SEED_PRODUCTS.filter(p => p.collection_ids.includes('col-home')).map(p => p.id), season: 'Home', is_featured: true, created_at: now, updated_at: now },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'rev-001', product_id: 'jwl-001', customer_name: 'Ananya R.', customer_phone: '9812345670', rating: 5, title: 'Even prettier in person', body: 'Wore these for my sister\u2019s sangeet and got so many compliments. Light enough that I forgot I had them on.', images: [], is_verified_purchase: false, is_approved: false, created_at: now },
  { id: 'rev-002', product_id: 'jwl-002', customer_name: 'Meera K.', customer_phone: '9823456781', rating: 5, title: 'Perfect bridal piece', body: 'The kundan work is so neat and it sat beautifully with my lehenga. Felt heirloom quality.', images: [], is_verified_purchase: false, is_approved: false, created_at: now },
  { id: 'rev-003', product_id: 'bng-007', customer_name: 'Divya S.', customer_phone: '9834567892', rating: 4, title: 'Great everyday stack', body: 'Been wearing them daily for a month, no tarnish at all. Wish the set came with a fourth.', images: [], is_verified_purchase: false, is_approved: false, created_at: now },
  { id: 'rev-004', product_id: 'hmd-001', customer_name: 'Ritika M.', customer_phone: '9845678903', rating: 5, title: 'My favourite candle', body: 'Smells warm and expensive without being overpowering. The vessel is gorgeous too.', images: [], is_verified_purchase: false, is_approved: false, created_at: now },
];
