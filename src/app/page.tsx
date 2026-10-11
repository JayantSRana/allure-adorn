import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-light text-brand-charcoal mb-6 leading-tight">
              Adornment, made to be remembered.
            </h2>
            <p className="text-lg text-brand-charcoal/80 mb-8">
              Timeless jewellery and home decor, crafted with quiet luxury and restraint.
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button variant="primary">SHOP JEWELLERY</Button>
              </Link>
              <Link href="/bangles">
                <Button variant="secondary">EXPLORE BANGLES</Button>
              </Link>
            </div>
          </div>
          <div className="aspect-[4/5] bg-brand-champagne rounded-sm flex items-center justify-center">
            <p className="text-brand-charcoal/50 text-sm tracking-wider">EDITORIAL IMAGE</p>
          </div>
        </div>
      </section>

      <section className="bg-brand-champagne/40 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-light text-center mb-12">Discover Your Adornment</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Jewellery', 'Bangles', 'Earrings', 'Necklaces', 'Rings', 'Home Decor'].map((cat) => (
              <div key={cat} className="aspect-square bg-brand-ivory border border-brand-champagne flex items-center justify-center hover:border-brand-gold transition-colors cursor-pointer">
                <p className="text-xs tracking-widest">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-light mb-8">New Arrivals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] bg-brand-champagne mb-4"></div>
                <h4 className="text-sm mb-1">Product Name</h4>
                <p className="text-sm text-brand-burgundy">₹2,499</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
