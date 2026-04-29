const allProperties = [
  {
    id: 1,
    project: 'Apex Aura',
    slug: 'apex-aura-phase-2-2bhk',
    title: 'Apex Aura Phase 2 2BHK',
    price: 'On Request',
    priceValue: 85,
    location: 'Sector 1, Greater Noida West',
    type: 'Apartment',
    bhk: '2 BHK',
    status: 'New Launch',
    createdAt: '2026-04-21',
    sqft: '1,050 sq ft',
    possessionDate: 'On Request',
    paymentPlan: '40:30:30',
    description:
      'Apex Aura Phase 2 2BHK apartment in Sector 1, Greater Noida West with an investor-friendly launch profile and location-focused appeal.',
    fullDescription:
      'This Apex Aura Phase 2 2BHK listing is positioned for buyers who want a practical apartment format in Sector 1, Greater Noida West. Based on the shared project material, the offering emphasizes the Noida Extension location advantage, a 2 and 3 BHK apartment mix, and a structured payment plan designed to support both end users and investment-minded buyers.',
    amenities: ['Sector 1 location', 'Apex Aura Phase 2 inventory', '2 & 3 BHK configuration mix', 'Investment-focused launch positioning', 'Greater Noida West connectivity'],
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
  },
  {
    id: 2,
    project: 'Apex Aura',
    slug: 'apex-aura-phase-2-3bhk',
    title: 'Apex Aura Phase 2 3BHK',
    price: 'On Request',
    priceValue: 98,
    location: 'Sector 1, Greater Noida West',
    type: 'Apartment',
    bhk: '3 BHK',
    status: 'New Launch',
    createdAt: '2026-04-22',
    sqft: '1,420 sq ft',
    possessionDate: 'On Request',
    paymentPlan: '40:30:30',
    description:
      'Apex Aura Phase 2 3BHK apartment tailored for buyers looking for a larger layout in Noida Extension with a launch-stage payment structure.',
    fullDescription:
      'This Apex Aura Phase 2 3BHK listing reflects the project positioning shown in the supplied creatives: a Sector 1, Greater Noida West address, 2 and 3 BHK luxury apartment focus, and a 40:30:30 payment-plan structure highlighted for booking conversations. It is suited for families who want more space while staying inside the same Apex Aura project cluster.',
    amenities: ['3 BHK luxury apartment format', 'Sector 1, Noida Extension address', '40:30:30 payment plan', 'Family-oriented layout profile', 'Project-led investment positioning'],
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    ],
  },
  {
    id: 3,
    project: 'Apex Aura',
    slug: 'apex-aura-luxury-apartments-25-25-25-25',
    title: 'Apex Aura Luxury Apartments',
    price: 'On Request',
    priceValue: 92,
    location: 'Sector 1, Greater Noida West',
    type: 'Apartment',
    bhk: '2 & 3 BHK',
    status: 'Under Construction',
    createdAt: '2026-04-20',
    sqft: '1,180-1,450 sq ft',
    possessionDate: 'On Request',
    paymentPlan: '25:25:25:25',
    description:
      'Apex Aura luxury apartment inventory positioned as ideal for living and investment, with a 25:25:25:25 payment plan highlighted in the project creatives.',
    fullDescription:
      'This Apex Aura listing is based on the shared project imagery featuring 2 and 3 BHK luxury apartments in Sector 1, Greater Noida West. The material specifically highlights a 25:25:25:25 payment plan and frames the inventory as suitable for both living and investment, making it a strong fit for buyers comparing phased payment structures within the same project.',
    amenities: ['2 & 3 BHK luxury inventory', '25:25:25:25 payment plan', 'Living and investment positioning', 'Greater Noida West micro-market', 'Apex Aura branded project stock'],
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    ],
  },
]

export const properties = allProperties.filter((property) => {
  const projectMatch = property.project?.toLowerCase().includes('apex aura')
  const titleMatch = property.title?.toLowerCase().includes('apex aura')

  return projectMatch || titleMatch
})

export default properties
