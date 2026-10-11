import PolicyPage from '@/components/store/PolicyPage';

export const metadata = { title: 'Shipping | Allure Adorn' };

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping"
      intro="We ship across India and worldwide, with every order packed with care."
      sections={[
        { heading: 'Dispatch Time', body: 'In-stock orders are dispatched within 2–4 business days. Made-to-order and customised pieces may take 7–10 business days.' },
        { heading: 'Domestic Shipping (India)', body: 'Free shipping on all orders above ₹3,000. Orders below this are charged a flat ₹150. Delivery typically takes 4–7 business days depending on your location.' },
        { heading: 'International Shipping', body: 'We ship to Canada, Australia, the UK, Russia and many more countries. International shipping rates and timelines are calculated at checkout. Duties and taxes, if any, are payable by the recipient.' },
        { heading: 'Tracking', body: 'Once your order ships, you will receive a tracking number and courier details by email and on your order tracking page.' },
      ]}
    />
  );
}
