import Link from 'next/link';

export const metadata = { title: 'Page Not Found | Allure Adorn' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-ivory px-6 text-center">
      <p className="font-serif text-6xl font-light text-brand-burgundy">404</p>
      <div className="my-5 h-px w-16 bg-brand-gold" />
      <h1 className="font-serif text-2xl font-light text-brand-charcoal sm:text-3xl">
        This page has slipped away
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-charcoal/60">
        The page you are looking for may have been moved or no longer exists.
        Let us guide you back to something beautiful.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-brand-burgundy px-7 py-3 text-xs tracking-widest text-white transition hover:bg-brand-charcoal"
        >
          RETURN HOME
        </Link>
        <Link
          href="/shop"
          className="border border-brand-champagne px-7 py-3 text-xs tracking-widest text-brand-charcoal/80 transition hover:border-brand-gold"
        >
          BROWSE THE SHOP
        </Link>
      </div>
    </div>
  );
}
