import PolicyPage from '@/components/store/PolicyPage';

export const metadata = { title: 'Returns & Exchange | Allure Adorn' };

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Exchange"
      intro="We want you to love your Allure Adorn pieces. If something isn't right, we're here to help."
      sections={[
        { heading: 'Return Window', body: 'Returns are accepted within 7 days of delivery for unused items in their original packaging with tags intact.' },
        { heading: 'Non-Returnable Items', body: 'Pierced earrings, customised or made-to-order pieces, and sale items are non-returnable for hygiene and quality reasons.' },
        { heading: 'How to Return', body: 'Message us on WhatsApp or email orders@allureadorn.com with your order number and reason. We will guide you through the process.' },
        { heading: 'Refunds', body: 'Once your return is received and inspected, refunds are processed to the original payment method within 5–7 business days. Shipping charges are non-refundable.' },
        { heading: 'Exchanges', body: 'Exchanges are subject to stock availability. Any price difference is payable or refundable at the time of exchange.' },
      ]}
    />
  );
}
