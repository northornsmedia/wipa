const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function makeSvgMonogram(initials, bg1, bg2, accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad_${initials.replace(/[^a-zA-Z]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="36" fill="url(#grad_${initials.replace(/[^a-zA-Z]/g, '')})" />
    <rect x="10" y="10" width="180" height="180" rx="30" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.25" />
    <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="${initials.length > 2 ? '50' : '68'}" fill="#ffffff" letter-spacing="-1">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ELITE_FIRMS = [
  {
    name: 'Finnegan, Henderson & Garrett LLP',
    slug: 'finnegan-ip-law',
    logo_url: makeSvgMonogram('F&H', '#0f172a', '#1e3a8a', '#60a5fa'),
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Tier 1 global intellectual property powerhouse specializing in complex patent prosecution, PTAB trial litigation, and Federal Circuit appeals for multinational technology leaders.',
    headquarters: 'Washington, DC • Tokyo • London',
    founded_year: 1965,
    size_range: '100-500',
    specializations: ['Patents', 'PTAB Trials', 'Litigation', 'BioTech'],
    website_url: 'https://www.finnegan.com',
    contact_email: 'inquiries@finnegan.com',
    phone: '+1 (202) 408-4000',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Fish & Richardson P.C.',
    slug: 'fish-and-richardson',
    logo_url: makeSvgMonogram('F&R', '#022c22', '#065f46', '#34d399'),
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier patent litigation firm defending high-stakes ITC Section 337 investigations, patent jury trials, and AI algorithm trade secret disputes across federal district courts.',
    headquarters: 'Boston • New York • Munich',
    founded_year: 1878,
    size_range: '100-500',
    specializations: ['Patent Litigation', 'ITC 337', 'Software & AI', 'Trade Secrets'],
    website_url: 'https://www.fr.com',
    contact_email: 'contact@fr.com',
    phone: '+1 (617) 542-5070',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Bird & Bird Intellectual Property',
    slug: 'bird-and-bird-ip',
    logo_url: makeSvgMonogram('B&B', '#2e1065', '#4c1d95', '#c084fc'),
    cover_image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Full-service international law practice spearheading Unified Patent Court (UPC) litigation, European patent oppositions, and global brand enforcement programs.',
    headquarters: 'London • Munich • Singapore',
    founded_year: 1894,
    size_range: '100-500',
    specializations: ['UPC Litigation', 'EPO Oppositions', 'Trademarks', 'Licensing'],
    website_url: 'https://www.twobirds.com',
    contact_email: 'ip.enquiries@twobirds.com',
    phone: '+44 20 7415 6000',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Kilburn & Strode LLP',
    slug: 'kilburn-and-strode',
    logo_url: makeSvgMonogram('K&S', '#1e1b4b', '#312e81', '#818cf8'),
    cover_image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    description: 'Leading European and UK patent and trade mark attorneys crafting robust global IP protection strategies for tech unicorns, venture funds, and life science innovators.',
    headquarters: 'London • San Francisco • Amsterdam',
    founded_year: 1906,
    size_range: '50-100',
    specializations: ['European Patents', 'AI Inventions', 'Design Rights', 'IP Strategy'],
    website_url: 'https://www.kilburnstrode.com',
    contact_email: 'info@kilburnstrode.com',
    phone: '+44 20 7539 4200',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Morrison Foerster (MoFo IP)',
    slug: 'mofo-ip-practice',
    logo_url: makeSvgMonogram('MoFo', '#18181b', '#27272a', '#f43f5e'),
    cover_image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    description: 'Silicon Valley powerhouse advising global tech titans on cross-border patent licensing, semiconductor IP, trade secrets, and life sciences patent strategy.',
    headquarters: 'San Francisco • Tokyo • New York',
    founded_year: 1883,
    size_range: '100-500',
    specializations: ['Software & AI', 'Semiconductor IP', 'Trade Secrets', 'Patents'],
    website_url: 'https://www.mofo.com',
    contact_email: 'mofoinquiries@mofo.com',
    phone: '+1 (415) 268-7000',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Bardehle Pagenberg',
    slug: 'bardehle-pagenberg',
    logo_url: makeSvgMonogram('B&P', '#0f172a', '#1e293b', '#fbbf24'),
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Specialist European patent attorneys and attorneys-at-law renowned for multi-jurisdictional patent enforcement before German courts and the Unified Patent Court.',
    headquarters: 'Munich • Paris • Düsseldorf',
    founded_year: 1977,
    size_range: '50-100',
    specializations: ['UPC Litigation', 'Mechanical IP', 'Electronics', 'EPO Oppositions'],
    website_url: 'https://www.bardehle.com',
    contact_email: 'info@bardehle.de',
    phone: '+49 89 92805-0',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Deacons Intellectual Property Group',
    slug: 'deacons-ip-asia',
    logo_url: makeSvgMonogram('DIP', '#042f2e', '#134e4a', '#2dd4bf'),
    cover_image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    description: 'Asia-Pacific premier IP group handling complex trademark protection, anti-counterfeiting operations, and cross-border patent portfolio prosecution across Greater China.',
    headquarters: 'Hong Kong • Beijing • Singapore',
    founded_year: 1851,
    size_range: '100-500',
    specializations: ['Trademarks', 'Anti-Counterfeiting', 'Asia IP Strategy', 'Brand Protection'],
    website_url: 'https://www.deacons.com',
    contact_email: 'ip@deacons.com',
    phone: '+852 2825 9211',
    is_verified: true,
    is_featured: false
  },
  {
    name: 'Kirkland & Ellis IP Practice',
    slug: 'kirkland-and-ellis-ip',
    logo_url: makeSvgMonogram('K&E', '#450a0a', '#7f1d1d', '#f87171'),
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Elite courtroom trial lawyers securing benchmark jury verdicts in high-stakes patent infringement, trade secret theft, and pharmaceutical Hatch-Waxman litigation.',
    headquarters: 'Chicago • New York • London',
    founded_year: 1909,
    size_range: '100-500',
    specializations: ['Litigation', 'Patents', 'Hatch-Waxman', 'Trade Secrets'],
    website_url: 'https://www.kirkland.com',
    contact_email: 'ipinfo@kirkland.com',
    phone: '+1 (312) 862-2000',
    is_verified: true,
    is_featured: false
  },
  {
    name: 'Venable LLP IP Group',
    slug: 'venable-ip-group',
    logo_url: makeSvgMonogram('V&E', '#172554', '#1e3a8a', '#38bdf8'),
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Comprehensive intellectual property counsel covering global brand portfolio management, false advertising, copyright disputes, and tech transactions.',
    headquarters: 'New York • Washington, DC',
    founded_year: 1900,
    size_range: '50-100',
    specializations: ['Trademarks', 'Copyright', 'Licensing', 'IP Strategy'],
    website_url: 'https://www.venable.com',
    contact_email: 'ipdesk@venable.com',
    phone: '+1 (212) 307-5500',
    is_verified: true,
    is_featured: false
  }
];

async function updateFirms() {
  console.log('Clearing old Greek-letter dummy mock firms from ip_firms...');
  const { error: delErr } = await supabase
    .from('ip_firms')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all existing dummy rows
  
  if (delErr) {
    console.error('Delete error:', delErr.message);
  } else {
    console.log('Old dummy firms deleted successfully.');
  }

  console.log('Inserting elite law firms with heraldic SVG monograms...');
  const { data, error } = await supabase
    .from('ip_firms')
    .insert(ELITE_FIRMS)
    .select();

  if (error) {
    console.error('Insert error:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} elite law practices into ip_firms table.`);
    data.forEach(f => console.log(`✓ ${f.name} (${f.headquarters})`));
  }
}

updateFirms();
