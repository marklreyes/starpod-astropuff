// Mock data structure for partnership pages
const mockDispensaries = [
  {
    slug: 'march-and-ash-mission-valley',
    name: 'March and Ash',
    title: 'Cannabis Refined - Mission Valley Flagship',
    description: 'Experience cannabis refined at March and Ash Mission Valley, San Diego\'s premier cannabis boutique. Located just 15 minutes from Downtown San Diego, our flagship location boasts an impressive flower bar and dedicated CBD room.',
    location: {
      address: '2835 Camino del Rio South, Suite #100',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92108'
    },
    contact: {
      phone: '(619) 314-7336',
      email: 'info@marchandash.com',
      website: 'https://marchandash.com'
    },
    hours: {
      'Monday': '7:00 AM - 9:00 PM',
      'Tuesday': '7:00 AM - 9:00 PM',
      'Wednesday': '7:00 AM - 9:00 PM',
      'Thursday': '7:00 AM - 9:00 PM',
      'Friday': '7:00 AM - 9:00 PM',
      'Saturday': '7:00 AM - 9:00 PM',
      'Sunday': '7:00 AM - 9:00 PM'
    },
    specialties: [
      'Premium Flower Bar',
      'Kiva Family Products (Camino, Lost Farm, Petra, Terra)',
      'Cannabiotix Rare Genetics',
      'Flavorade Vapes',
      'CBD Dedicated Room',
      'Cannabis Delivery',
      'Online Ordering',
      'In-Store Pickup'
    ],
    promoOffers: [
      {
        title: 'PUFFPOD30',
        description: '30% off your entire order - Exclusive for Puff Provisions listeners',
        terms: 'Valid on all products. Cannot be combined with other offers.',
        validUntil: new Date('2025-03-31'),
        category: 'discount'
      },
      {
        title: 'FREEGIFT25',
        description: 'Free March & Ash keychain + rolling papers with $25+ purchase',
        terms: 'While supplies last. One per customer.',
        validUntil: new Date('2025-02-28'),
        category: 'freebie'
      },
      {
        title: 'FASTDELIVERY',
        description: 'Free same-day delivery within San Diego city limits',
        terms: 'Orders placed before 6PM. $35 minimum for delivery.',
        validUntil: new Date('2025-12-31'),
        category: 'delivery'
      }
    ],
    partnership: {
      benefits: [
        'Exclusive Puff Provisions listener discounts',
        'Brand spotlight features',
        'Educational content collaboration',
        'VIP cannabis concierge services',
        'Early access to new product launches',
        'Co-branded events and workshops'
      ],
      exclusiveOffers: [
        '30% off select brands daily',
        'Free March & Ash keychain with $30+ purchase',
        'Fast and free delivery in San Diego area',
        'Online ordering with in-store pickup',
        'Virtual cannabis concierge consultations'
      ]
    },
    images: {
      logo: '/images/dispensaries/1748622210-june_weedmaps_icon_2025-01.avif'
    },
    reviews: {
      rating: 4.7,
      totalReviews: 1250,
      highlights: [
        'Impressive flower bar selection',
        'Knowledgeable cannabis concierge',
        'Convenient downtown location',
        'Excellent customer service',
        'Premium product quality'
      ]
    },
    content: `
      <h2>About March and Ash Mission Valley</h2>
      <p>March and Ash Mission Valley is San Diego's premier cannabis boutique, located just 15 minutes from Downtown San Diego in the heart of Mission Valley. Our flagship location represents the pinnacle of cannabis retail, featuring an impressive flower bar and dedicated CBD room designed to provide customers with an unparalleled shopping experience.</p>

      <h2>Cannabis Refined</h2>
      <p>We believe that everyone deserves a comfortable and confident cannabis experience. That's why we prioritize customer education, safety, and satisfaction above all else. Our knowledgeable staff and carefully curated selection of the highest quality products set us apart in the Southern California cannabis market.</p>

      <h2>Premium Product Selection</h2>
      <p>Our product lineup features the best brands in cannabis, including the complete Kiva family (Camino, Lost Farm, Petra, Terra), award-winning Cannabiotix flower with rare genetics, fresh Flavorade vapes, and an extensive CBD collection. We stock only the finest products from trusted cultivators and manufacturers throughout California.</p>

      <h2>Convenient Services</h2>
      <p>March and Ash offers multiple ways to shop: visit our beautiful retail location, order online for convenient in-store pickup, or enjoy fast and free delivery throughout the San Diego area. Our virtual cannabis concierge is always available to provide personalized product recommendations and answer any questions.</p>

      <h2>Community Partnership</h2>
      <p>Our partnership with Puff Provisions reflects our commitment to cannabis education and community engagement. Together, we're working to destigmatize cannabis use and promote responsible consumption practices throughout San Diego and beyond.</p>
    `,
  }
];

// Async function to get all dispensaries (simulates API call)
export async function getAllDispensaries() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDispensaries;
}

// Async function to get dispensary by slug (simulates API call)
export async function getDispensaryBySlug(slug) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockDispensaries.find(dispensary => dispensary.slug === slug);
}

// Async function to get featured dispensaries
export async function getFeaturedDispensaries() {
  await new Promise(resolve => setTimeout(resolve, 75));
  // Return all dispensaries since we only have one featured dispensary
  return mockDispensaries;
}

// Function to get dispensary info (for compatibility with existing show structure)
export async function getDispensaryInfo() {
  return {
    title: 'Puff Provisions - Cannabis Dispensary Partners',
    description: 'Discover our trusted dispensary partners across California',
    author: 'Puff Provisions Team'
  };
}
