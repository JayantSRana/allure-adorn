export default function Footer() {
  return (
    <footer className="bg-brand-burgundy text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-8">ALLURE ADORN</h2>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="/shop" className="hover:opacity-80 transition-opacity">SHOP</a>
            <a href="/about" className="hover:opacity-80 transition-opacity">ABOUT</a>
            <a href="/contact" className="hover:opacity-80 transition-opacity">CONTACT</a>
            <a href="/care" className="hover:opacity-80 transition-opacity">CARE GUIDE</a>
          </div>
          <p className="mt-8 text-sm opacity-80">© 2026 Allure Adorn. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
