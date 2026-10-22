export type ProductCategory =
  | 'JEWELLERY'
  | 'BANGLES'
  | 'EARRINGS'
  | 'NECKLACES'
  | 'RINGS'
  | 'HOME_DECOR'
  | 'CANDLES'
  | 'VASES'
  | 'WALL_ART'
  | 'TABLESCAPE';

export type RoomType =
  | 'LIVING'
  | 'BEDROOM'
  | 'DINING'
  | 'KITCHEN'
  | 'BATHROOM'
  | 'OFFICE';

export type PaymentMethod =
  | 'RAZORPAY_UPI'
  | 'RAZORPAY_CARD'
  | 'RAZORPAY_NETBANKING'
  | 'RAZORPAY_WALLET'
  | 'COD';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type RefundStatus = 'NONE' | 'NEEDS_REFUND' | 'REFUNDED' | 'PARTIAL';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  cost_price: number;
  qty: number;
  total: number;
  total_cost: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: Address;
  billing_address?: Address;
  items: OrderItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  discount_code?: string;
  shipping_fee: number;
  total_amount: number;
  total_cost: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: OrderStatus;
  tracking_number?: string;
  courier?: string;
  notes?: string;
  admin_notes?: string;
  refund_status: RefundStatus;
  refund_amount: number;
  refund_reason?: string;
  refund_notes?: string;
  status_history: StatusHistoryEntry[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description_short: string;
  description_long: string;
  category: ProductCategory;
  sub_category?: string;
  price: number;
  compare_at_price?: number;
  cost_price: number;
  images: string[];
  hover_image?: string;
  material?: string;
  finish?: string;
  colour?: string;
  care_instructions?: string;
  size_options: string[];
  stock: number;
  is_anti_tarnish: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  collection_ids: string[];
  tags: string[];
  rating_avg: number;
  rating_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  dimensions?: string;
  weight?: number;
  fragile?: boolean;
  room_type?: RoomType;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  hero_image: string;
  product_ids: string[];
  season?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  wishlist: string[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface SystemSettings {
  store_open: boolean;
  admin_pin: string;
  staff_pin: string;
  cod_enabled: boolean;
  discount_enabled: boolean;
  discount_percent: number;
  discount_code?: string;
  free_shipping_threshold: number;
  shipping_fee_flat: number;
  international_shipping_enabled: boolean;
  google_sheets_webhook_url?: string;
  google_sheets_spreadsheet_id?: string;
  google_sheets_spreadsheet_name?: string;
  google_sheets_last_synced?: string;
  whatsapp_number?: string;
  instagram_handle?: string;
  announcement_bar_text?: string;
  announcement_bar_enabled: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  is_handled: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

export type SectionType =
  | 'HERO_SLIDESHOW'
  | 'CATEGORY_SHOWCASE'
  | 'NEW_ARRIVALS'
  | 'BESTSELLERS'
  | 'FEATURED_COLLECTION'
  | 'BRAND_PROMISE'
  | 'HOME_DECOR_SHOWCASE'
  | 'PROMO_BANNER'
  | 'CUSTOM_PRODUCT_GRID'
  | 'INSTAGRAM_FEED'
  | 'REVIEWS_SHOWCASE'
  | 'SERVICE_STRIP'
  | 'NEWSLETTER';

export interface HeroSlideItem {
  id: string;
  image: string;
  eyebrow: string;
  headline: string;
  sub: string;
  primary_cta_text?: string;
  primary_cta_href?: string;
  secondary_cta_text?: string;
  secondary_cta_href?: string;
  is_active?: boolean;
}

export interface CategoryCardItem {
  id: string;
  label: string;
  href: string;
  tagline: string;
  img: string;
  is_active?: boolean;
}

export type ServiceIconName =
  | 'Globe'
  | 'Package'
  | 'MousePointerClick'
  | 'Headphones'
  | 'ShieldCheck'
  | 'Sparkles'
  | 'Truck'
  | 'Heart'
  | 'Award';

export interface ServiceBadgeItem {
  id: string;
  icon: ServiceIconName;
  title: string;
  text: string;
  is_active?: boolean;
}

export interface HomepageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  is_enabled: boolean;
  order: number;
  config: {
    slides?: HeroSlideItem[];
    category_cards?: CategoryCardItem[];
    service_badges?: ServiceBadgeItem[];
    limit?: number;
    cta_text?: string;
    cta_href?: string;
    collection_id?: string;
    body_text?: string;
    image?: string;
    theme?: 'ivory' | 'champagne' | 'burgundy' | 'charcoal';
    badge_text?: string;
    instagram_images?: string[];
    instagram_url?: string;
    filter_category?: ProductCategory;
    product_ids?: string[];
  };
}

export interface Database {
  products: Product[];
  collections: Collection[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  settings: SystemSettings;
  sections: HomepageSection[];
}

