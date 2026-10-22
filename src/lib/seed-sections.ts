import { HomepageSection, SectionType } from '@/types';

export const SEED_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'HERO_SLIDESHOW',
    title: 'Hero Slideshow',
    subtitle: 'Full-bleed rotating hero banners on the homepage',
    is_enabled: true,
    order: 0,
    config: {
      slides: [
        {
          id: 'slide-1',
          image: '/editorial/editorial-2.jpg',
          eyebrow: 'New Season',
          headline: 'Adornment, made to be remembered.',
          sub: 'Timeless jewellery crafted with quiet luxury — designed to be worn now and treasured for years.',
          primary_cta_text: 'SHOP JEWELLERY',
          primary_cta_href: '/shop?category=JEWELLERY',
          secondary_cta_text: 'EXPLORE BANGLES',
          secondary_cta_href: '/bangles',
          is_active: true,
        },
        {
          id: 'slide-2',
          image: '/editorial/editorial-13.jpg',
          eyebrow: 'The Wedding Edit',
          headline: 'For the moments you keep.',
          sub: 'Kundan, pearls and crystal — chosen for the aisle and everything after.',
          primary_cta_text: 'SHOP JEWELLERY',
          primary_cta_href: '/shop?category=JEWELLERY',
          secondary_cta_text: 'EXPLORE BANGLES',
          secondary_cta_href: '/bangles',
          is_active: true,
        },
        {
          id: 'slide-3',
          image: '/editorial/editorial-30.jpg',
          eyebrow: 'Everyday Allure',
          headline: 'Anti-tarnish. Made to stay beautiful.',
          sub: 'Featherweight pieces that keep their glow, day after day.',
          primary_cta_text: 'SHOP JEWELLERY',
          primary_cta_href: '/shop?category=JEWELLERY',
          secondary_cta_text: 'EXPLORE BANGLES',
          secondary_cta_href: '/bangles',
          is_active: true,
        },
      ],
    },
  },
  {
    id: 'sec-categories',
    type: 'CATEGORY_SHOWCASE',
    title: 'Discover Your Adornment',
    subtitle: 'Six worlds of quiet luxury, curated for the way you live.',
    is_enabled: true,
    order: 1,
    config: {
      category_cards: [
        {
          id: 'cat-1',
          label: 'Jewellery',
          href: '/shop?category=JEWELLERY',
          tagline: 'Everyday to heirloom',
          img: '/editorial/editorial-3.jpg',
          is_active: true,
        },
        {
          id: 'cat-2',
          label: 'Bangles',
          href: '/bangles',
          tagline: 'Stack your story',
          img: '/editorial/editorial-8.jpg',
          is_active: true,
        },
        {
          id: 'cat-3',
          label: 'Earrings',
          href: '/shop?category=EARRINGS',
          tagline: 'Light-catching',
          img: '/editorial/editorial-12.jpg',
          is_active: true,
        },
        {
          id: 'cat-4',
          label: 'Necklaces',
          href: '/shop?category=NECKLACES',
          tagline: 'Layer or lead',
          img: '/editorial/editorial-18.jpg',
          is_active: true,
        },
        {
          id: 'cat-5',
          label: 'Rings',
          href: '/shop?category=RINGS',
          tagline: 'Quietly present',
          img: '/editorial/editorial-25.jpg',
          is_active: true,
        },
        {
          id: 'cat-6',
          label: 'Home Decor',
          href: '/home-decor',
          tagline: 'Adorn your space',
          img: '/editorial/editorial-38.jpg',
          is_active: true,
        },
      ],
    },
  },
  {
    id: 'sec-new-arrivals',
    type: 'NEW_ARRIVALS',
    title: 'New Arrivals',
    subtitle: 'Freshly crafted pieces added to our boutique.',
    is_enabled: true,
    order: 2,
    config: {
      limit: 4,
      cta_text: 'View all',
      cta_href: '/shop?filter=new',
      theme: 'champagne',
    },
  },
  {
    id: 'sec-bestsellers',
    type: 'BESTSELLERS',
    title: 'Most Loved Pieces',
    subtitle: 'Our signature bestsellers chosen by our community.',
    is_enabled: false,
    order: 3,
    config: {
      limit: 4,
      cta_text: 'Shop Best Sellers',
      cta_href: '/shop?filter=bestsellers',
      theme: 'ivory',
    },
  },
  {
    id: 'sec-featured-collection',
    type: 'FEATURED_COLLECTION',
    eyebrow: 'Featured Collection',
    title: 'The Allure Edit',
    subtitle: '',
    is_enabled: true,
    order: 4,
    config: {
      cta_text: 'EXPLORE THE COLLECTION',
      cta_href: '/collections/the-allure-edit',
    },
  },
  {
    id: 'sec-brand-promise',
    type: 'BRAND_PROMISE',
    eyebrow: 'Our Promise',
    title: 'Made To Stay Beautiful',
    is_enabled: true,
    order: 5,
    config: {
      body_text:
        'Every anti-tarnish piece is finished to resist fading, so your jewellery looks as new on the hundredth wear as it did on the first.',
      cta_text: 'SHOP ANTI-TARNISH',
      cta_href: '/shop?filter=anti-tarnish',
      limit: 3,
      theme: 'burgundy',
    },
  },
  {
    id: 'sec-home-decor',
    type: 'HOME_DECOR_SHOWCASE',
    title: 'Adorn Your Space',
    subtitle: 'Candles, vases, wall art and tablescapes — for a home that feels considered.',
    is_enabled: true,
    order: 6,
    config: {
      limit: 4,
      cta_text: 'SHOP HOME DECOR',
      cta_href: '/home-decor',
    },
  },
  {
    id: 'sec-instagram',
    type: 'INSTAGRAM_FEED',
    title: 'Follow the Allure',
    subtitle: '@allureadorn',
    is_enabled: true,
    order: 7,
    config: {
      instagram_url: 'https://instagram.com/allureadorn',
      cta_text: 'FOLLOW US',
      instagram_images: [
        '/editorial/editorial-20.jpg',
        '/editorial/editorial-21.jpg',
        '/editorial/editorial-22.jpg',
        '/editorial/editorial-23.jpg',
        '/editorial/editorial-24.jpg',
        '/editorial/editorial-25.jpg',
      ],
    },
  },
  {
    id: 'sec-reviews',
    type: 'REVIEWS_SHOWCASE',
    title: 'Loved & Adorned',
    subtitle: 'Words from our verified patrons',
    is_enabled: true,
    order: 8,
    config: {
      limit: 4,
    },
  },
  {
    id: 'sec-service-strip',
    type: 'SERVICE_STRIP',
    title: 'Boutique Guarantees',
    is_enabled: true,
    order: 9,
    config: {
      service_badges: [
        {
          id: 'srv-1',
          icon: 'Globe',
          title: 'Worldwide Shipping',
          text: 'India · Canada · Australia · UK · Russia & more',
          is_active: true,
        },
        {
          id: 'srv-2',
          icon: 'Package',
          title: 'Secure Packaging',
          text: 'Every piece arrives gift-ready and protected',
          is_active: true,
        },
        {
          id: 'srv-3',
          icon: 'MousePointerClick',
          title: 'Easy Online Ordering',
          text: 'Simple checkout, COD and online payments',
          is_active: true,
        },
        {
          id: 'srv-4',
          icon: 'Headphones',
          title: 'Customer Support',
          text: 'Real people, happy to help — on WhatsApp too',
          is_active: true,
        },
      ],
    },
  },
  {
    id: 'sec-newsletter',
    type: 'NEWSLETTER',
    title: 'A Little More Allure',
    subtitle: 'Occasional notes on new arrivals, styling and private offers. No noise.',
    is_enabled: true,
    order: 10,
    config: {},
  },
];

export const SECTION_TYPE_LABELS: Record<
  SectionType,
  { label: string; description: string }
> = {
  HERO_SLIDESHOW: {
    label: 'Hero Slideshow',
    description: 'Full-width rotating hero banner with headlines & buttons',
  },
  CATEGORY_SHOWCASE: {
    label: 'Category Cards Grid',
    description: 'Visual cards linking to product categories or pages',
  },
  NEW_ARRIVALS: {
    label: 'New Arrivals Grid',
    description: 'Automatically displays products marked as New Arrival',
  },
  BESTSELLERS: {
    label: 'Best Sellers Grid',
    description: 'Automatically displays products marked as Bestseller',
  },
  FEATURED_COLLECTION: {
    label: 'Featured Collection Spotlight',
    description: 'Split image & story spotlight for a chosen collection',
  },
  BRAND_PROMISE: {
    label: 'Brand Promise / Anti-Tarnish',
    description: 'Editorial highlight with 3 side-by-side product previews',
  },
  HOME_DECOR_SHOWCASE: {
    label: 'Home Decor Showcase',
    description: 'Curated grid of candles, vases, wall art and tablescapes',
  },
  PROMO_BANNER: {
    label: 'Promotional / Campaign Banner',
    description: 'Custom announcement, festive sale, or editorial callout block',
  },
  CUSTOM_PRODUCT_GRID: {
    label: 'Custom Product Section',
    description: 'Showcase hand-picked products or a specific category anywhere',
  },
  INSTAGRAM_FEED: {
    label: 'Instagram Gallery',
    description: '6-photo visual grid linking to your Instagram handle',
  },
  REVIEWS_SHOWCASE: {
    label: 'Customer Reviews',
    description: 'Displays approved & verified customer testimonials',
  },
  SERVICE_STRIP: {
    label: 'Service & Trust Badges',
    description: 'Icon strip highlighting shipping, packaging & support',
  },
  NEWSLETTER: {
    label: 'Newsletter Signup',
    description: 'Email subscription capture block',
  },
};

export function createDefaultSection(
  type: SectionType,
  order: number,
  id: string,
): HomepageSection {
  switch (type) {
    case 'PROMO_BANNER':
      return {
        id,
        type,
        eyebrow: 'Limited Edition',
        title: 'The Festive Celebration Edit',
        subtitle: 'Complimentary gift box on all orders above ₹3,000.',
        is_enabled: true,
        order,
        config: {
          body_text:
            'Handcrafted kundan, pearls, and statement home accents curated for effortless celebration.',
          cta_text: 'EXPLORE THE EDIT',
          cta_href: '/shop',
          badge_text: 'FESTIVE SPECIAL',
          theme: 'burgundy',
          image: '/editorial/editorial-13.jpg',
        },
      };
    case 'CUSTOM_PRODUCT_GRID':
      return {
        id,
        type,
        title: 'Curated For You',
        subtitle: 'Handpicked pieces from our latest studio drop.',
        is_enabled: true,
        order,
        config: {
          filter_category: 'JEWELLERY',
          limit: 4,
          cta_text: 'VIEW ALL',
          cta_href: '/shop?category=JEWELLERY',
          theme: 'ivory',
        },
      };
    case 'BESTSELLERS':
      return {
        id,
        type,
        title: 'Most Loved Pieces',
        subtitle: 'Our signature bestsellers chosen by our community.',
        is_enabled: true,
        order,
        config: {
          limit: 4,
          cta_text: 'Shop Best Sellers',
          cta_href: '/shop?filter=bestsellers',
          theme: 'ivory',
        },
      };
    default: {
      const template = SEED_SECTIONS.find((s) => s.type === type);
      if (template) {
        const copy = JSON.parse(JSON.stringify(template)) as HomepageSection;
        copy.id = id;
        copy.order = order;
        copy.is_enabled = true;
        return copy;
      }
      return {
        id,
        type,
        title: SECTION_TYPE_LABELS[type]?.label || 'New Section',
        subtitle: '',
        is_enabled: true,
        order,
        config: { limit: 4 },
      };
    }
  }
}
