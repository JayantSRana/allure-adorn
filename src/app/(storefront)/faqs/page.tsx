import PolicyPage from '@/components/store/PolicyPage';

export const metadata = { title: 'FAQs | Allure Adorn' };

export default function FaqsPage() {
  return (
    <PolicyPage
      title="Frequently Asked Questions"
      sections={[
        { heading: 'Is your jewellery anti-tarnish?', body: 'Many of our pieces are finished with an anti-tarnish coating and clearly labelled. Look for the Anti-Tarnish badge or shop the anti-tarnish filter.' },
        { heading: 'How do I choose a bangle size?', body: 'Bangle sizes are listed as 2.4, 2.6 and 2.8, which refer to the inner diameter in inches. If unsure, size up — our metal and glass bangles can be gently adjusted.' },
        { heading: 'Do you ship internationally?', body: 'Yes. We ship to Canada, Australia, the UK, Russia and many more countries. Rates and timelines are shown at checkout.' },
        { heading: 'What payment methods do you accept?', body: 'We accept UPI, credit and debit cards, net banking and wallets via our secure payment partner, plus Cash on Delivery where available.' },
        { heading: 'How do I track my order?', body: 'Use the Track Order page with your order number or the mobile number you ordered with. You can also follow live updates on your order page.' },
        { heading: 'Can I gift an order?', body: 'Absolutely. Every order arrives in our signature packaging, ready to gift. Add a note at checkout and we will keep it discreet.' },
      ]}
    />
  );
}
