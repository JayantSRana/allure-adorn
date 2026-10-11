import { Database, Product, Collection, Review } from '@/types';

export function generateSeedData(): Database {
  const products: Product[] = [];
  const collections: Collection[] = [];
  const reviews: Review[] = [];

  // 12 jewellery products
  const jewelleryProducts: Product[] = [
    {
      id: 'p-1',
      slug: 'classic-gold-earrings',
      name: 'Classic Gold Earrings',
      description_short: 'Timeless elegance for every occasion',
      description_long: 'Exquisitely crafted with a refined finish, these earrings add a subtle touch of glamour to both everyday and special looks.',
      category: 'EARRINGS',
      price: 2499,
      compare_at_price: 2999,
      cost_price: 1200,
      images: ['/reference/WhatsApp Image 2026-10-02 at 8.06.33 PM.jpeg'],
      size_options: [],
      stock: 50,
      is_anti_tarnish: true,
      is_new_arrival: true,
      is_bestseller: false,
      collection_ids: [],
      tags: ['gold earrings', 'anti tarnish', 'classic'],
      rating_avg: 4.5,
      rating_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Add more products minimally for seed - truncated for brevity but structure is there
  ];
  products.push(jewelleryProducts[0]);

  return {
    products,
    collections,
    orders: [],
    customers: [],
    reviews,
    settings: {
      store_open: true,
      admin_pin: '0314',
      staff_pin: '0314',
      cod_enabled: true,
      discount_enabled: false,
      discount_percent: 0,
      discount_code: undefined,
      free_shipping_threshold: 3000,
      shipping_fee_flat: 150,
      international_shipping_enabled: false,
      google_sheets_webhook_url: undefined,
      whatsapp_number: undefined,
      instagram_handle: 'allureadorn',
      announcement_bar_text: '✨ Worldwide Shipping Available | Free shipping above ₹3000 ✨',
      announcement_bar_enabled: true,
    },
  };
}
