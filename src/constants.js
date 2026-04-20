import { getRuntimeEnv } from './lib/runtimeEnv'

// ═══════════════════════════════════════════════════
// SSR Group — Site Constants & Data
// ═══════════════════════════════════════════════════

export const SITE = {
  name: 'SSR Group Civil',
  tagline: 'Engineering • Construction • Development',
  phone: '+91-8796138550',
  phoneRaw: '918796138550',
  email: 'info@ssrgroupcivil.in',
  address: 'E/207 Apex Aura Society, Sector 1, Greater Noida West',
  hours: 'Mon — Sat: 9:00 AM — 7:00 PM',
  founder: 'Sankalp Singh Rajput',
  domain: 'ssrgroupcivil.in',
  logo: '/ssr-logo-premium.png',
}

export const WHATSAPP_URL = `https://wa.me/${SITE.phoneRaw}?text=Hi%20SSR%20Group!`

export const SOCIAL = {
  instagram: 'https://instagram.com/ssrgroupcivil',
  linkedin: 'https://linkedin.com/company/ssrgroupcivil',
  youtube: 'https://youtube.com/@ssrgroupcivil',
  facebook: 'https://facebook.com/ssrgroupcivil',
}

export const API_URL = getRuntimeEnv('VITE_API_URL', 'http://localhost:8000/api/v1')

export const SERVICES = [
  {
    id: 'residential',
    icon: '🏗️',
    title: 'Residential Construction',
    short: 'Custom homes, villas & apartments',
    desc: 'From foundations to finishing, we build homes that stand the test of time — at the most competitive margins in the market. Custom designs, premium materials, transparent pricing.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    features: ['Custom floor plans', 'Premium materials', 'On-time delivery', 'Free BOQ'],
  },
  {
    id: 'commercial',
    icon: '🏢',
    title: 'Commercial Projects',
    short: 'Offices, retail & mixed-use',
    desc: 'Office complexes, retail spaces, and mixed-use developments designed for modern business needs. End-to-end project management with transparent budgeting.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    features: ['Office complexes', 'Retail spaces', 'Turnkey delivery', 'Budget transparency'],
  },
  {
    id: 'property-search',
    icon: '🔍',
    title: 'Property Search & Advisory',
    short: 'We find your dream property',
    desc: 'Submit your requirements and relax. Our expert team curates the perfect property matches — residential, commercial, or plots — tailored to your vision and budget.',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    features: ['Personalized matches', 'Budget advisory', 'Legal verification', 'Site visits'],
  },
  {
    id: 'interior',
    icon: '🎨',
    title: 'Interior & Finishing',
    short: 'Transform your spaces',
    desc: 'Premium interior solutions that transform spaces into luxurious living and working environments. Modern designs, quality execution, competitive pricing.',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    features: ['Modern designs', 'Modular kitchens', 'False ceilings', 'Furniture'],
  },
  {
    id: 'planning',
    icon: '📐',
    title: 'Project Planning & BOQ',
    short: 'Know costs before you commit',
    desc: 'Detailed Bill of Quantities and comprehensive project planning — completely free. Get accurate cost breakdowns, material lists, and timelines before breaking ground.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    features: ['Free BOQ', 'Cost breakdown', 'Timeline planning', 'Material lists'],
  },
  {
    id: 'renovation',
    icon: '🔨',
    title: 'Renovation & Remodelling',
    short: 'Breathe new life into spaces',
    desc: 'Breathing new life into existing structures with modern design sensibilities and quality craftsmanship. Complete makeovers for homes, offices, and commercial spaces.',
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    features: ['Home makeover', 'Office refit', 'Structural repair', 'Modern upgrades'],
  },
  {
    id: 'materials',
    icon: '🧱',
    title: 'Building Materials Supply',
    short: 'Premium materials, best prices',
    desc: 'Source quality building materials through our trusted network — cement, steel, bricks, plumbing, electrical, paints, tiles, and more at wholesale rates.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    features: ['Wholesale rates', 'Trusted brands', 'Doorstep delivery', 'Bulk orders'],
  },
  {
    id: 'partnership',
    icon: '🤝',
    title: 'Partner Network',
    short: 'Grow with SSR Group',
    desc: 'Join our network of premium suppliers, contractors, and service providers. Get verified bulk orders and grow your business with SSR Group.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    features: ['Direct orders', 'Verified buyers', 'Network growth', 'Brand visibility'],
  },
]

export const PROJECTS = [
  { title: 'Luxury Villa — Sector 1', type: 'Residential', status: 'Completed', area: '3,200 sq ft', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { title: 'Corporate Office Complex', type: 'Commercial', status: 'In Progress', area: '15,000 sq ft', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
  { title: 'Modern Apartment Block', type: 'Residential', status: 'Completed', area: '45,000 sq ft', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
  { title: 'Retail Mall — Greater Noida', type: 'Commercial', status: 'Upcoming', area: '60,000 sq ft', img: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=600&q=80' },
  { title: 'Independent Floor G+2', type: 'Residential', status: 'Completed', area: '1,800 sq ft', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
  { title: 'Warehouse & Industrial', type: 'Industrial', status: 'Completed', area: '25,000 sq ft', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80' },
]

export const TEAM = [
  { name: 'Sankalp Singh Rajput', role: 'Founder & CEO', desc: 'Visionary leader with deep expertise in construction and real estate across Delhi NCR.', initials: 'SS' },
  { name: 'Operations Team', role: 'Project Management', desc: 'Dedicated professionals ensuring every project is delivered on time and within budget.', initials: 'OT' },
  { name: 'Advisory Board', role: 'Strategic Partners', desc: 'Industry experts providing guidance on market trends, compliance and growth.', initials: 'AB' },
]

export const TESTIMONIALS = [
  { name: 'Rajesh K.', text: 'SSR Group built our dream home in Greater Noida West. Transparent pricing, zero hidden costs. Highly recommended!', rating: 5, project: 'Residential' },
  { name: 'Priya V.', text: 'Found the perfect 3BHK apartment through their property finder service. They truly do the work for you!', rating: 5, project: 'Property Search' },
  { name: 'Amit S.', text: 'Best material prices in the market. Their steel and cement supply saved us 15% on our commercial project.', rating: 4, project: 'Materials' },
  { name: 'Neha G.', text: 'The BOQ they provided was incredibly detailed and completely free. Professional team, excellent service.', rating: 5, project: 'Planning' },
  { name: 'Vikram M.', text: 'Complete office renovation done on time. The interior design team understood our vision perfectly.', rating: 5, project: 'Interior' },
  { name: 'Sunita R.', text: 'From plot selection to construction — SSR Group handled everything. Stress-free experience for our family.', rating: 5, project: 'Residential' },
]

export const MATERIAL_CATEGORIES = [
  { icon: '🧱', name: 'Cement & Concrete', brands: 'UltraTech, ACC, Ambuja' },
  { icon: '⚙️', name: 'Steel & TMT Bars', brands: 'Tata Tiscon, JSW, SAIL' },
  { icon: '🏠', name: 'Bricks & Blocks', brands: 'AAC, Fly Ash, Red Clay' },
  { icon: '⛰️', name: 'Sand & Aggregates', brands: 'River, M-Sand, Crushed' },
  { icon: '🔧', name: 'Plumbing & Pipes', brands: 'Astral, Supreme, Finolex' },
  { icon: '⚡', name: 'Electrical & Wiring', brands: 'Havells, Polycab, KEI' },
  { icon: '🎨', name: 'Paints & Finishes', brands: 'Asian, Berger, Nerolac' },
  { icon: '🪟', name: 'Tiles & Flooring', brands: 'Kajaria, Somany, Johnson' },
]

export const PROPERTY_TYPES = [
  'Residential — Villa',
  'Residential — Apartment',
  'Residential — Independent House',
  'Commercial — Office Space',
  'Commercial — Retail / Shop',
  'Industrial — Warehouse',
  'Plot / Land',
]

export const CONTACT_SUBJECTS = [
  'Property Enquiry',
  'Construction Quote',
  'Building Materials',
  'Partnership',
  'Free BOQ Request',
  'Other',
]

export const PARTNER_CATEGORIES = [
  'Building Materials Supplier',
  'Sub-Contractor',
  'Architect / Designer',
  'Equipment Rental',
  'Labour Contractor',
  'Other',
]

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Projects' },
  { path: '/about', label: 'About Us' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
]
