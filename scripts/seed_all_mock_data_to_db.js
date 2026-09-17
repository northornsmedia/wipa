const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// 1. In-House Counsel Resources
const INHOUSE_RESOURCES = [
  {
    title: "The 2026 Corporate IP Strategy Playbook",
    category: "in-house-counsel",
    subcategory: "operations",
    resource_type: "Corporate IP Playbook",
    type: "Playbook",
    organization: "WIPA In-House Council",
    author_name: "Corporate Practice Team",
    author_title: "Executive Corporate Committee",
    summary: "Comprehensive executive roadmap for managing corporate intellectual property assets, outside counsel budgeting, and board reporting.",
    content: "Enterprise IP strategy requires treating intellectual property not merely as a cost center, but as a strategic moat. This playbook outlines modern invention disclosure capture, cross-licensing strategies, and risk mitigation.",
    read_time: "15 min read",
    duration: "15 min",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: true,
    tags: ["In-House Counsel", "Corporate Strategy", "IP Operations"]
  },
  {
    title: "GC Roundtable: Managing IP Budgets in a Downturn",
    category: "in-house-counsel",
    subcategory: "leadership",
    resource_type: "GC Roundtable",
    type: "Video",
    organization: "Tech Industry Forum",
    author_name: "Panel of 4 General Counsels",
    author_title: "General Counsel Faculty",
    summary: "Executive discussion on optimizing law firm rate structures, alternative fee arrangements, and portfolio pruning during corporate budget tightening.",
    content: "Four Fortune 500 General Counsels share concrete methodologies for auditing law firm billing rates, negotiating blended AFAs, and prioritizing strategic assets.",
    read_time: "45 min watch",
    duration: "45:00",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: true,
    tags: ["Leadership", "Budgeting", "AFAs"]
  },
  {
    title: "Chief IP Counsel Interview: Building a Culture of Innovation",
    category: "in-house-counsel",
    subcategory: "leadership",
    resource_type: "Chief IP Counsel Interview",
    type: "Interview",
    organization: "Global Motors Inc.",
    author_name: "Sarah Jenkins",
    author_title: "Chief Patent Counsel",
    summary: "How engineering-heavy enterprises structure patent incentive bonuses and foster patent harvesting across multidisciplinary R&D groups.",
    content: "Sarah Jenkins details the shift from passive invention disclosures to active harvesting workshops embedded within software and hardware sprints.",
    read_time: "8 min read",
    duration: "8 min",
    cover_image_url: "/resource3.jpg",
    is_featured: false,
    tags: ["Innovation", "Patent Harvesting", "R&D"]
  },
  {
    title: "Outside Counsel Guidelines & Billing Compliance Template",
    category: "in-house-counsel",
    subcategory: "operations",
    resource_type: "Template",
    type: "Template",
    organization: "WIPA Standards",
    author_name: "Legal Ops Group",
    author_title: "Head of Legal Operations",
    summary: "Customizable outside counsel guideline template establishing strict billing rules, staffing caps, and electronic invoicing standards.",
    content: "Standardized guidelines for corporate legal departments to ensure outside law firms bill efficiently and align with corporate fiduciary duties.",
    read_time: "Download (DOCX)",
    duration: "Download",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: false,
    tags: ["Legal Operations", "Compliance", "Outside Counsel"]
  },
  {
    title: "In-House Patent Harvesting Pipeline Framework",
    category: "in-house-counsel",
    subcategory: "operations",
    resource_type: "Corporate IP Playbook",
    type: "Playbook",
    organization: "Ennoble IP & WIPA",
    author_name: "Ennoble IP & WIPA",
    author_title: "Patent Advisory Division",
    summary: "Tactical framework for engineering disclosure reviews, competitive whitespace analysis, and patent committee decision matrices.",
    content: "Step-by-step guidance on identifying high-value patentable subject matter early in the product lifecycle before publication or competitor filings.",
    read_time: "12 min read",
    duration: "12 min",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=400&q=80",
    is_featured: false,
    tags: ["Patent Harvesting", "Whitespace Analysis", "Engineering"]
  },
  {
    title: "Case Study: Streamlining Patent Harvesting Workflows",
    category: "in-house-counsel",
    subcategory: "operations",
    resource_type: "Case Study",
    type: "Case Study",
    organization: "BioTech Global",
    author_name: "Innovation Team",
    author_title: "BioTech Legal Ops",
    summary: "How a mid-sized biotechnology firm reduced patent application cycle times by 40% using automated docketing and collaborative disclosure portals.",
    content: "In-depth case study analyzing pre- and post-implementation metrics for biotech patent capture and external prosecution efficiency.",
    read_time: "10 min read",
    duration: "10 min",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: false,
    tags: ["Case Study", "BioTech", "Efficiency"]
  }
];

// 2. Career & Leadership Resources
const CAREER_RESOURCES = [
  {
    title: "Rising to Partner: Strategies for Women Attorneys in Modern Law Firms",
    category: "career-leadership",
    subcategory: "leadership",
    resource_type: "Leadership Guide",
    type: "Guide",
    organization: "SN Anku IP Firm",
    author_name: "Sarah Norkor Anku",
    author_title: "Global Managing Partner",
    summary: "Actionable mentorship pathways, business development frameworks, and portfolio leadership for emerging equity partners.",
    content: "Making partner requires moving beyond billing excellence into client relationship origination and practice leadership.",
    read_time: "10 min read",
    duration: "10 min",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: true,
    tags: ["Law Firm Partnership", "Origination", "Leadership"]
  },
  {
    title: "From Senior Associate to IP Partner: The Roadmap to Equity",
    category: "career-leadership",
    subcategory: "career-growth",
    resource_type: "Career Guide",
    type: "Guide",
    organization: "PSS Solutions",
    author_name: "Nadine Stuttle",
    author_title: "CEO & WIPA European Board",
    summary: "Key metrics, client origination tactics, and executive presence required to make partner in tier-1 IP firms.",
    content: "Learn how partnership committees evaluate associate performance, realization rates, and institutional commitment.",
    read_time: "8 min read",
    duration: "8 min",
    cover_image_url: "/Nadine Stuttle Picture.jpg",
    is_featured: true,
    tags: ["Career Transition", "Equity Partner", "Firm Politics"]
  },
  {
    title: "Mastering the General Counsel Seat: IP Strategy for Corporate Executives",
    category: "career-leadership",
    subcategory: "leadership",
    resource_type: "Executive Briefing",
    type: "Executive Briefing",
    organization: "Advitam IP LLC",
    author_name: "Michele Katz",
    author_title: "Founding Partner",
    summary: "Bridging technical patent prosecution with executive C-suite board presentations and risk governance.",
    content: "Transitioning to General Counsel demands fluency in corporate risk, capital allocation, and executive communication.",
    read_time: "8 min read",
    duration: "8 min",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: false,
    tags: ["In-House Leadership", "C-Suite", "Governance"]
  },
  {
    title: "Building a $5M+ Portable Book of Business in Tech IP",
    category: "career-leadership",
    subcategory: "masterclasses",
    resource_type: "Executive Masterclass",
    type: "Video",
    organization: "Dupont & Partners",
    author_name: "Claire Dupont",
    author_title: "Chair of Patent Litigation",
    summary: "How to cultivate client relationships from seed-stage tech startups into Fortune 500 retainers with proven origination models.",
    content: "Claire Dupont breaks down client origination into systematic steps: cross-selling, industry roundtables, and high-trust advisory.",
    read_time: "42 min watch",
    duration: "42:00",
    cover_image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    is_featured: false,
    tags: ["Client Development", "Origination", "Tech IP"]
  },
  {
    title: "Negotiating Partner Compensation, Origination Credits & Equity Points",
    category: "career-leadership",
    subcategory: "masterclasses",
    resource_type: "Executive Masterclass",
    type: "Video",
    organization: "Executive Talent Advisory",
    author_name: "Charlotte Sterling & Maya Patel",
    author_title: "Senior Fellows & Executive Talent Advisors",
    summary: "An inside look into compensation committees: how lockstep vs eat-what-you-kill models evaluate women partners.",
    content: "Practical strategies for negotiating origination credits, bonus tier formulas, and equity share allocation.",
    read_time: "35 min watch",
    duration: "35:00",
    cover_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    is_featured: false,
    tags: ["Compensation", "Equity Negotiation", "Firm Governance"]
  },
  {
    title: "Law Firm Partnership Business Plan Model (2026 Edition)",
    category: "career-leadership",
    subcategory: "toolkits",
    resource_type: "Executive Toolkit",
    type: "Financial & Business Plan",
    organization: "WIPA Executive Faculty",
    author_name: "Partnership Advisory Desk",
    author_title: "Executive Faculty",
    summary: "The complete financial forecasting model, origination matrix, and prospective client portable book calculator used by successful AmLaw candidates.",
    content: "Excel & PPTX templates including 3-year portable revenue forecasting, billing realization, and executive committee pitch deck.",
    read_time: "Download (Excel/PPTX)",
    duration: "4.8 MB",
    cover_image_url: "/resource3.jpg",
    is_featured: true,
    tags: ["Partnership Plan", "Financial Model", "Origination"]
  }
];

// 3. Guides & Toolkits Resources
const GUIDES_RESOURCES = [
  {
    title: "AI Patent Strategy Playbook",
    category: "guides-toolkits",
    subcategory: "playbooks",
    resource_type: "Playbook",
    type: "Playbook",
    organization: "WIPA Tech Group",
    author_name: "WIPA Tech Group",
    author_title: "Emerging Tech Committee",
    summary: "Comprehensive playbook for drafting software and machine learning patents compliant with USPTO Alice and EPO guidelines.",
    content: "Detailed claim drafting guidelines for neural networks, transformer architectures, and training pipeline inventions.",
    read_time: "24 Pages",
    duration: "24 Pages",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: true,
    tags: ["AI in IP", "Patent Prosecution", "Playbook"]
  },
  {
    title: "In-House Counsel IP Audit Toolkit",
    category: "guides-toolkits",
    subcategory: "toolkits",
    resource_type: "Toolkit",
    type: "Toolkit",
    organization: "Corporate Practice Team",
    author_name: "Corporate Practice Team",
    author_title: "Audit Committee",
    summary: "Essential diagnostic checklists and scoring spreadsheets to audit enterprise patent, trademark, and trade secret portfolios.",
    content: "Includes 5 standardized spreadsheet templates for risk scoring, inventor assignment verification, and license agreement compliance.",
    read_time: "5 Templates",
    duration: "5 Templates",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: true,
    tags: ["IP Strategy", "Audit", "Toolkit"]
  },
  {
    title: "SaaS Licensing Agreement Template",
    category: "guides-toolkits",
    subcategory: "templates",
    resource_type: "Template",
    type: "Template",
    organization: "Contracts Division",
    author_name: "Contracts Division",
    author_title: "Commercial Licensing Desk",
    summary: "Production-ready enterprise SaaS license agreement featuring SLA provisions, data protection clauses, and IP indemnification.",
    content: "Comprehensive editable legal agreement for commercial software providers and corporate licensees.",
    read_time: "DOCX Template",
    duration: "DOCX",
    cover_image_url: "/resource3.jpg",
    is_featured: false,
    tags: ["Licensing", "SaaS", "Template"]
  },
  {
    title: "Defensive Publication Checklist",
    category: "guides-toolkits",
    subcategory: "guides",
    resource_type: "Checklist",
    type: "Checklist",
    organization: "Innovation Team",
    author_name: "Innovation Team",
    author_title: "IP Strategy Division",
    summary: "Tactical checklist for creating effective defensive prior art publications to prevent competitors from patenting adjacent technologies.",
    content: "Criteria for evaluating when to defensively publish vs file a patent or keep as trade secret.",
    read_time: "PDF Checklist",
    duration: "PDF",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: false,
    tags: ["Patent Law", "Prior Art", "Checklist"]
  }
];

// 4. Women's IP World Resources
const WIPW_RESOURCES = [
  {
    title: "Women's IP World Annual 2026",
    category: "womens-ip-world",
    subcategory: "annual-issues",
    resource_type: "Annual Issue",
    type: "Annual Issue",
    organization: "WIPW Editorial",
    author_name: "WIPW Editorial",
    author_title: "Editorial Board",
    summary: "The flagship annual volume honoring pioneer women lawyers, patent attorneys, and judges transforming global intellectual property.",
    content: "Over 180 pages of investigative features, jurisdiction reports from 42 countries, and in-depth profiles of trailblazing IP leaders.",
    read_time: "2026 Edition",
    duration: "Full Issue",
    cover_image_url: "/Womens-IP-World-Award.webp",
    is_featured: true,
    tags: ["Global IP", "WIPW", "Annual Issue"]
  },
  {
    title: "Top 50 Women in Tech Law",
    category: "womens-ip-world",
    subcategory: "features",
    resource_type: "Ranking Feature",
    type: "Ranking Feature",
    organization: "Research Team",
    author_name: "Research Team",
    author_title: "Research Analysts",
    summary: "Authoritative editorial ranking recognizing the leading 50 women attorneys shaping artificial intelligence, semiconductors, and fintech IP.",
    content: "Detailed methodology, peer nominations, and profiles of 50 outstanding attorneys leading high-stakes deals and trial victories.",
    read_time: "15 min read",
    duration: "15 min",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: true,
    tags: ["Industry Rankings", "Tech Law", "Features"]
  },
  {
    title: "Breaking the Glass Ceiling in IP Litigation",
    category: "womens-ip-world",
    subcategory: "spotlights",
    resource_type: "Spotlight",
    type: "Spotlight",
    organization: "WIPA Spotlight Desk",
    author_name: "Eleanor Vance",
    author_title: "Special Contributor",
    summary: "First-person perspective on first-chair trial leadership, jury persuasion, and overcoming implicit courtroom bias.",
    content: "Inspiring narrative and actionable tactical advice from senior litigators on securing standup courtroom time.",
    read_time: "10 min read",
    duration: "10 min",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: false,
    tags: ["Career", "Trial Strategy", "Spotlight"]
  }
];

// 5. Articles & Insights Resources
const ARTICLE_RESOURCES = [
  {
    title: "The Patent Asset Index™ 2026: Benchmark Analysis of Top Global Innovators",
    category: "articles-insights",
    subcategory: "lexisnexis-exclusives",
    resource_type: "Thought Leadership",
    type: "Thought Leadership",
    organization: "LexisNexis® PatentSight+™ Research Institute",
    author_name: "LexisNexis® PatentSight+™",
    author_title: "Research Institute",
    summary: "Data-driven benchmark examining quality vs volume across 100,000+ patent portfolios worldwide.",
    content: "Comprehensive analytics on Competitive Impact, Technology Relevance, and Market Coverage across leading innovation clusters.",
    read_time: "8 min read",
    duration: "8 min",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: true,
    tags: ["Global IP", "Patent Analytics", "LexisNexis"]
  },
  {
    title: "USPTO Examiner Prosecution Analytics & Allowance Strategies",
    category: "articles-insights",
    subcategory: "lexisnexis-exclusives",
    resource_type: "Expert Article",
    type: "Expert Article",
    organization: "LexisNexis® IP Solutions",
    author_name: "LexisNexis® IP Solutions",
    author_title: "Prosecution Analytics Desk",
    summary: "Leveraging empirical examiner analytics to navigate difficult art units, predict office actions, and accelerate allowances.",
    content: "Detailed prosecution strategies based on big data analysis of patent examiner allowance rates and interview efficacy.",
    read_time: "10 min read",
    duration: "10 min",
    cover_image_url: "/resourceimg2.jpg",
    is_featured: true,
    tags: ["Patent Law", "USPTO", "Analytics"]
  },
  {
    title: "Navigating AI Patents in 2026: Technical Considerations",
    category: "articles-insights",
    subcategory: "thought-leadership",
    resource_type: "Thought Leadership",
    type: "Thought Leadership",
    organization: "Apex Global Law",
    author_name: "Elena Rostova",
    author_title: "Partner & AI Practice Chair",
    summary: "Technical and legal frameworks for patenting machine learning architectures across the USPTO, EPO, and JPO.",
    content: "Analysis of recent patent office guidance regarding inventive step, disclosure enablement, and inventorship standards for AI systems.",
    read_time: "7 min read",
    duration: "7 min",
    cover_image_url: "/resourceimg1.jpg",
    is_featured: true,
    tags: ["AI in IP", "Patents", "Elena Rostova"]
  }
];

async function seedAll() {
  console.log('=== STARTING SEEDING OF PLATFORM RESOURCES TO SUPABASE ===');

  const allResources = [
    ...INHOUSE_RESOURCES,
    ...CAREER_RESOURCES,
    ...GUIDES_RESOURCES,
    ...WIPW_RESOURCES,
    ...ARTICLE_RESOURCES
  ];

  console.log(`Total candidate resources to insert: ${allResources.length}`);

  // Fetch existing titles to avoid duplicates
  const { data: existing, error: errExisting } = await supabase
    .from('resources')
    .select('title');

  const existingTitles = new Set((existing || []).map(r => r.title.toLowerCase().trim()));

  let insertedCount = 0;
  for (const item of allResources) {
    if (existingTitles.has(item.title.toLowerCase().trim())) {
      console.log(`- Skipping already existing resource: "${item.title}"`);
      continue;
    }

    const payload = {
      ...item,
      slug: generateSlug(item.title),
      approval_status: 'approved',
      views_count: Math.floor(Math.random() * 200) + 50,
      downloads_count: Math.floor(Math.random() * 80) + 15,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('resources')
      .insert(payload)
      .select('id, title, category');

    if (error) {
      console.error(`Error inserting "${item.title}":`, error.message);
    } else {
      insertedCount++;
      console.log(`✓ Inserted [${item.category}] "${item.title}" (ID: ${data[0]?.id})`);
    }
  }

  console.log(`\nSuccessfully added ${insertedCount} resources to Supabase!`);

  // Enrich in-house counsel member profiles in Supabase
  console.log('\n=== ENRICHING IN-HOUSE COUNSEL PROFILES IN DB ===');
  const counselUpdates = [
    {
      id: '9b3c3082-04ef-4041-bebe-f018f3b3ef4d', // Charlotte Sterling
      skills: 'LiDAR Inventions, Autonomous Driving Models, USPTO PTAB Trials, Standards IP, Machine Learning Patents',
      bio: 'Lead IP Counsel at Waymo / Alphabet overseeing global patent portfolios in computer vision, neural driving policies, simulation architectures, and vehicle-to-everything (V2X) protocols.',
      practice_area: 'Autonomous Systems & Sensor Fusion',
      experience_years: 14,
      education: 'J.D., Stanford Law School | B.S. in Electrical Engineering, UC Berkeley'
    },
    {
      id: '44eef627-2bc9-4f3b-998c-56059d686b13', // Claire Dupont
      skills: 'Global Brand Architecture, Anti-Counterfeiting Enforcement, 3D Trade Dress, Customs Interceptions',
      bio: 'Head of Global Trademarks at LVMH Moët Hennessy Louis Vuitton managing high-value international luxury brand protection, anti-counterfeiting operations, and trade dress litigation.',
      practice_area: 'Luxury Brand Protection & Fashion Law',
      experience_years: 17,
      education: 'LL.M., Université Panthéon-Assas (Paris II) | Master in Commercial Law'
    },
    {
      id: 'f15bd30f-f74b-4a4b-b948-6b001a5cd822', // Beatrice Moreau
      skills: 'mRNA Vaccines, Monoclonal Antibodies, Hatch-Waxman Litigation, Global Patent Prosecution, Clinical Trial IP',
      bio: 'Senior Legal Director - IP at Sanofi Pasteur directing European and US patent prosecution strategies for immunological therapies, recombinant vaccines, and biologic delivery systems.',
      practice_area: 'Biologics, Vaccines & Immuno-Therapeutics',
      experience_years: 16,
      education: 'Ph.D. in Molecular Biology, Institut Pasteur | J.D., University of Strasbourg'
    },
    {
      id: '0f6fc8f9-7748-436c-a4b3-7499e695ac12', // Olivia Thornton
      skills: 'Target Discovery Patents, Antibody Drug Conjugates, SPC Filings in Europe, PTAB Inter Partes Reviews',
      bio: 'Senior Patent Counsel at AstraZeneca Biologics managing cross-border oncology patent exclusivity, European Supplementary Protection Certificates (SPCs), and Freedom to Operate (FTO) reviews.',
      practice_area: 'Oncology Therapeutics & Antibody Drug Conjugates',
      experience_years: 13,
      education: 'Ph.D. in Pharmacology, Cambridge University | Chartered Patent Attorney (UK & EPO)'
    }
  ];

  for (const c of counselUpdates) {
    const { error: upErr } = await supabase
      .from('profiles')
      .update({
        skills: c.skills,
        bio: c.bio,
        practice_area: c.practice_area,
        experience_years: c.experience_years,
        education: c.education
      })
      .eq('id', c.id);

    if (upErr) {
      console.error(`Error updating profile ${c.id}:`, upErr.message);
    } else {
      console.log(`✓ Enriched profile: ${c.id}`);
    }
  }

  console.log('\n========================================');
  console.log('ALL MOCK DATA MIGRATED TO SUPABASE DB!');
  console.log('========================================');
}

seedAll();
