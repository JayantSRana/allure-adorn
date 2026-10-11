import PolicyPage from '@/components/store/PolicyPage';

export const metadata = { title: 'Terms of Service | Allure Adorn' };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="By using our website and placing an order, you agree to the following terms."
      sections={[
        { heading: 'Orders', body: 'All orders are subject to availability and confirmation of payment. We reserve the right to cancel any order suspected of fraud or error.' },
        { heading: 'Pricing', body: 'Prices are listed in Indian Rupees and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices without notice.' },
        { heading: 'Product Descriptions', body: 'We make every effort to describe and photograph our products accurately. Colours may vary slightly due to screen settings.' },
        { heading: 'Intellectual Property', body: 'All content on this site, including images, text and design, is the property of Allure Adorn and may not be reproduced without permission.' },
        { heading: 'Governing Law', body: 'These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of Indian courts.' },
      ]}
    />
  );
}
