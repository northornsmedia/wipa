const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FIRM_UPDATES = [
  {
    name: 'Alpha IP Law',
    slug: 'alpha-ip-law',
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    description: 'Premier intellectual property litigation and patent prosecution firm based in Manhattan, defending Fortune 500 tech and pharmaceutical portfolios.',
    headquarters: 'New York, USA',
    founded_year: 1998,
    size_range: '50-100',
    specializations: ['Patents', 'Trademarks', 'Litigation', 'BioTech'],
    website_url: 'https://alpha-iplaw.example.com',
    contact_email: 'contact@alpha-iplaw.example.com',
    phone: '+1 (212) 555-0192',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Beta Innovations Legal',
    slug: 'beta-innovations-legal',
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    logo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Silicon Valley boutique focused on AI algorithms, open-source compliance, software patent strategy, and cross-border trade secret protection.',
    headquarters: 'San Francisco, USA',
    founded_year: 2014,
    size_range: '10-50',
    specializations: ['Software Patents', 'Trade Secrets', 'AI & Data IP', 'Copyright'],
    website_url: 'https://betainnovations.example.com',
    contact_email: 'hello@betainnovations.example.com',
    phone: '+1 (415) 555-0144',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Gamma Global Partners',
    slug: 'gamma-global-partners',
    cover_image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    logo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    description: 'Full-service European and UK patent attorneys specializing in EPO oppositions, UPC unified patent litigation, and global brand enforcement.',
    headquarters: 'London, UK',
    founded_year: 2002,
    size_range: '100-500',
    specializations: ['Patents', 'Design Rights', 'IP Strategy', 'UPC Litigation'],
    website_url: 'https://gammaglobal.example.com',
    contact_email: 'enquiries@gammaglobal.example.com',
    phone: '+44 20 7946 0912',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Delta IP Advisory',
    slug: 'delta-ip-advisory',
    cover_image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    logo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    description: 'Strategic IP advisory boutique helping deep-tech startups and venture funds navigate IP due diligence, technology licensing, and patent valuations.',
    headquarters: 'Berlin, Germany',
    founded_year: 2018,
    size_range: '10-50',
    specializations: ['Licensing', 'M&A IP Due Diligence', 'Patent Valuation', 'GreenTech IP'],
    website_url: 'https://delta-ipadvisory.example.com',
    contact_email: 'info@delta-ipadvisory.example.com',
    phone: '+49 30 901820',
    is_verified: true,
    is_featured: false
  },
  {
    name: 'Epsilon Trademark Co',
    slug: 'epsilon-trademark-co',
    cover_image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    logo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    description: 'Asia-Pacific brand guardianship leaders handling Madrid Protocol registrations, domain dispute resolution (UDRP), and anti-counterfeiting operations.',
    headquarters: 'Sydney, Australia',
    founded_year: 2009,
    size_range: '50-100',
    specializations: ['Trademarks', 'Domain Names', 'Anti-Counterfeiting', 'Brand Protection'],
    website_url: 'https://epsilontm.example.com',
    contact_email: 'sydney@epsilontm.example.com',
    phone: '+61 2 9374 4000',
    is_verified: true,
    is_featured: false
  },
  {
    name: 'Kibo International Patent Office',
    slug: 'kibo-patent-office',
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', // Tokyo skyscraper architecture
    logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=400&q=80',
    description: 'Renowned Tokyo Benrishi patent attorney corporation bridging Asian electronics innovators and global PCT patent national phase filings.',
    headquarters: 'Tokyo, Japan',
    founded_year: 1985,
    size_range: '100-500',
    specializations: ['PCT Filings', 'Robotics Patents', 'Semiconductor IP', 'JPO Prosecution'],
    website_url: 'https://kibo-pat.example.jp',
    contact_email: 'tokyo@kibo-pat.example.jp',
    phone: '+81 3 5555 0188',
    is_verified: true,
    is_featured: true
  },
  {
    name: 'Helvetia IP & Life Sciences',
    slug: 'helvetia-ip-legal',
    cover_image_url: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1200&q=80', // Swiss modern business architecture
    logo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    description: 'Swiss precision in intellectual asset protection, specialized in biopharma patents, MedTech diagnostics, and clinical trial IP.',
    headquarters: 'Zurich, Switzerland',
    founded_year: 2005,
    size_range: '50-100',
    specializations: ['BioPharma', 'MedTech IP', 'Swiss Patent Law', 'Patent Prosecution'],
    website_url: 'https://helvetia-ip.example.ch',
    contact_email: 'zurich@helvetia-ip.example.ch',
    phone: '+41 44 211 0022',
    is_verified: true,
    is_featured: false
  },
  {
    name: 'Meridian IP Singapore',
    slug: 'meridian-ip-singapore',
    cover_image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', // Singapore Marina Bay financial district
    logo_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    description: 'Southeast Asia gateway firm guiding tech unicorns through ASEAN patent examination cooperation (ASPEC) and cross-border IP structuring.',
    headquarters: 'Singapore',
    founded_year: 2016,
    size_range: '50-100',
    specializations: ['ASEAN Filing', 'FinTech IP', 'Patent Strategy', 'Trade Secrets'],
    website_url: 'https://meridian-ip.example.sg',
    contact_email: 'hello@meridian-ip.example.sg',
    phone: '+65 6789 0123',
    is_verified: true,
    is_featured: true
  }
];

async function updateFirms() {
  console.log('Updating IP firms with high quality Unsplash photos & data...');
  for (const firm of FIRM_UPDATES) {
    const { data: existing } = await supabase.from('ip_firms').select('id').eq('slug', firm.slug).single();
    if (existing) {
      const { error } = await supabase.from('ip_firms').update(firm).eq('id', existing.id);
      if (error) console.error(`Error updating ${firm.name}:`, error);
      else console.log(`✓ Updated ${firm.name}`);
    } else {
      const { error } = await supabase.from('ip_firms').insert(firm);
      if (error) console.error(`Error inserting ${firm.name}:`, error);
      else console.log(`+ Inserted ${firm.name}`);
    }
  }
  console.log('All IP firms updated successfully!');
}

updateFirms();
