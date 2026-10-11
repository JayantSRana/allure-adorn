import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { Product, Collection, Review } from '@/types';

export async function POST() {
  const db = await ensureDatabase();
  
  if (db.products.length > 0) {
    return NextResponse.json({ message: 'Already seeded' });
  }

  const products: Product[] = [
    {
      id: 'p-001',
      slug: 'classic-gold-hoops',
      name: 'Classic Gold Hoops',
      description_short: 'Timeless elegance for every occasion',
      description_long: 'Exquisitely crafted hoops that add a subtle touch of glamour to both everyday and special looks.',
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
      collection_ids: ['c-001'],
      tags: ['gold earrings', 'anti tarnish', 'classic'],
      rating_avg: 4.8,
      rating_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p-002',
      slug: 'delicate-chain-necklace',
      name: 'Delicate Chain Necklace',
      description_short: 'Grace in every link',
      description_long: 'A refined piece designed to layer beautifully or wear alone.',
      category: 'NECKLACES',
      price: 3499,
      cost_price: 1500,
      images: ['/reference/WhatsApp Image 2026-10-02 at 8.06.34 PM.jpeg'],
      size_options: [],
      stock: 40,
      is_anti_tarnish: true,
      is_new_arrival: true,
      is_bestseller: false,
      collection_ids: ['c-001'],
      tags: ['necklace', 'anti tarnish', 'delicate'],
      rating_avg: 4.7,
      rating_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const collections: Collection[] = [
    {
      id: 'c-001',
      name: 'The Allure Edit',
      description: 'Our signature collection of timeless pieces',
      hero_image: '/reference/WhatsApp Image 2026-10-02 at 8.06.35 PM.jpeg',
      product_ids: products.map(p => p.id),
      season: 'Year Round',
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const reviews: Review[] = [
    {
      id: 'r-001',
      product_id: 'p-001',
      customer_name: 'Priya S.',
      customer_phone: '9876543210',
      rating: 5,
      title: 'Beautiful!',
      body: 'Love the quality and finish.',
      images: [],
      is_verified_purchase: false,
      is_approved: false,
      created_at: new Date().toISOString(),
    },
  ];

  db.products = products;
  db.collections = collections;
  db.reviews = reviews;
  await writeDatabase(db);

  return NextResponse.json({ success: true, products: products.length, collections: collections.length });
}
