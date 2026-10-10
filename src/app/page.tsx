export default function Home() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-burgundy text-white py-2 text-center text-sm">
        <p className="tracking-wide">✨ Worldwide Shipping Available | Free shipping above ₹3000 ✨</p>
      </div>
      <header className="border-b border-brand-champagne bg-brand-ivory/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-semibold tracking-widest text-brand-charcoal">ALLURE ADORN</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-sm text-brand-charcoal hover:text-brand-burgundy transition-colors">HOME</a>
              <a href="/shop" className="text-sm text-brand-charcoal hover:text-brand-burgundy transition-colors">SHOP</a>
              <a href="/about" className="text-sm text-brand-charcoal hover:text-brand-burgundy transition-colors">ABOUT</a>
              <a href="/contact" className="text-sm text-brand-charcoal hover:text-brand-burgundy transition-colors">CONTACT</a>
            </nav>
          </div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-light text-brand-charcoal mb-6">Adornment, made to be remembered.</h2>
          <p className="text-lg text-brand-charcoal/80 mb-8">Timeless pieces for modern elegance</p>
          <div className="flex gap-4 justify-center">
            <a href="/shop" className="bg-brand-burgundy text-white px-8 py-3 text-sm tracking-wider hover:bg-opacity-90 transition-all">
              SHOP JEWELLERY
            </a>
            <a href="/bangles" className="border border-brand-burgundy text-brand-burgundy px-8 py-3 text-sm tracking-wider hover:bg-brand-burgundy hover:text-white transition-all">
              EXPLORE BANGLES
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
