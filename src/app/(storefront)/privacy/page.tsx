import PolicyPage from '@/components/store/PolicyPage';

export const metadata = { title: 'Privacy Policy | Allure Adorn' };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="Your trust matters to us. This policy explains what information we collect and how we use it."
      sections={[
        { heading: 'Information We Collect', body: 'We collect your name, contact details, delivery address and order information to fulfil your orders. Payment details are processed securely by our payment partner and are never stored by us.' },
        { heading: 'How We Use It', body: 'Your information is used to process orders, provide customer support, send order updates and — only with your consent — share occasional news and offers.' },
        { heading: 'Sharing', body: 'We share only what is necessary with delivery partners and payment providers. We never sell your personal information.' },
        { heading: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting orders@allureadorn.com.' },
        { heading: 'Cookies', body: 'Our site uses minimal cookies to keep your cart and preferences working smoothly.' },
      ]}
    />
  );
}
