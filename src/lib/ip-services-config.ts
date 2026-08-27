export interface IPServiceConfig {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  url: string;
  external_url: string;
  location?: string;
  website?: string;
  is_featured?: boolean;
  is_splash_sponsored?: boolean;
  display_order?: number;
  theme?: {
    primaryColor: string;
    accentColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    badgeLabel?: string;
    badgeBg?: string;
    badgeText?: string;
  };
  hero?: {
    badge?: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl: string;
    logoUrl?: string;
    logoSubtext?: string;
    bgGlowColor?: string;
  };
  backedBy?: string[];
  about?: {
    badge?: string;
    heading: string;
    paragraphs: string[];
    quote?: string;
  };
  metrics?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  pillarsTitle?: string;
  pillarsSubtitle?: string;
  pillars?: Array<{
    number?: string;
    title: string;
    description: string;
  }>;
  offer?: {
    enabled: boolean;
    badge?: string;
    title?: string;
    description?: string;
    discount?: string;
    promoCode?: string;
    ctaText?: string;
    ctaUrl?: string;
    contactEmail?: string;
    terms?: string;
    steps?: string[];
  };
  versions?: {
    v1?: { label?: string; hint?: string; text?: string };
    v2?: { label?: string; hint?: string; text?: string };
    v3?: { label?: string; hint?: string; text?: string };
  };
  services?: string[];
  featuresTitle?: string;
  featuresSubtitle?: string;
  features?: Array<{
    title: string;
    subtitle?: string;
    description: string;
  }>;
  expert?: {
    enabled: boolean;
    name?: string;
    role?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    email?: string;
    address?: string;
    locations?: string[];
  };
  videos?: Array<{ id: string; title: string; thumbnail: string; duration: string }>;
  articles?: Array<{ id: string; title: string; excerpt: string; date: string; readTime: string; image: string; category: string }>;
  webinars?: Array<{ id: string; title: string; description: string; date: string; time: string; status: string; image: string }>;
  events?: Array<{ id: string; title: string; description: string; date: string; fullDate?: string; location: string; type: string }>;
  tabs?: string[];
  sections_order?: string[];
}

export const DEFAULT_PSS_CONFIG: IPServiceConfig = {
  id: "821d981f-54f5-4d57-976f-6fd1cb998022",
  title: "PSS Solutions",
  slug: "pss-solutions",
  category: "tech-operations",
  subcategory: "Tech Operations",
  description: "Transforming IP operations through strategy, technology, process and people.",
  url: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
  external_url: "https://www.pss-solutions.com",
  location: "Basel, Switzerland",
  website: "www.pss-solutions.com",
  is_featured: true,
  is_splash_sponsored: true,
  display_order: 1,
  theme: {
    primaryColor: "#0284c7",
    accentColor: "#0369a1",
    gradientFrom: "from-sky-100 dark:from-[#082f49]",
    gradientTo: "to-slate-100 dark:to-black",
    badgeLabel: "Sponsored Partner",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-600 dark:text-amber-400"
  },
  hero: {
    badge: "IP Operations Consultancy",
    headline: "Transforming IP operations through strategy, technology, process and people.",
    subheadline: "PSS Solutions – The IP Operations Consultancy",
    ctaText: "Visit PSS Solutions",
    ctaUrl: "https://www.pss-solutions.com",
    logoUrl: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
    logoSubtext: "Sponsored Partner of WIPA",
    bgGlowColor: "rgba(14,165,233,0.2)"
  },
  backedBy: ["Independent Advisory", "Global Practice"],
  about: {
    badge: "About PSS Solutions",
    heading: "Independent expertise in IP operations",
    paragraphs: [
      "PSS Solutions is an independent consulting and advisory firm dedicated to IP operations. The company supports organisations seeking to transform, optimise and modernise the way their intellectual property functions operate.",
      "PSS combines specialist IP industry knowledge with operational, technology and transformation expertise, helping organisations navigate change and build more efficient and sustainable IP operating models.",
      "PSS describes itself as fully independent, allowing its consultants to provide impartial advice rather than being tied to particular technology vendors or service providers."
    ],
    quote: "Technology in isolation will never resolve a problem. It is a key foundation on which the right people, structure and strategy is underpinned by."
  },
  metrics: [
    { label: "Global Reach", value: "8+ Countries", icon: "Globe" },
    { label: "Specialist Focus", value: "100% IP Ops", icon: "Shield" },
    { label: "Advisory Model", value: "Independent", icon: "CheckCircle2" },
    { label: "Transformation", value: "End-to-End", icon: "Layers" }
  ],
  pillarsTitle: "People. Structure. Strategy.",
  pillarsSubtitle: "PSS believes successful IP transformation requires more than technology alone. Its approach brings together three core elements:",
  pillars: [
    {
      number: "1",
      title: "People",
      description: "Ensuring teams have the knowledge, skills and support required to successfully adopt and sustain change."
    },
    {
      number: "2",
      title: "Structure",
      description: "Developing the right processes, governance and operational framework to support an effective IP function."
    },
    {
      number: "3",
      title: "Strategy",
      description: "Creating a clear direction and roadmap aligned with the organisation's objectives and future requirements."
    }
  ],
  offer: {
    enabled: true,
    badge: "Exclusive for WIPA Members",
    title: "Access preferential rates on selected PSS Solutions services.",
    description: "Women's IP Alliance members can access an exclusive PSS member benefit when engaging PSS for selected IP operations and advisory services.",
    discount: "Preferential Rates",
    promoCode: "WIPA-PSS",
    ctaText: "Claim Your Member Benefit",
    ctaUrl: "https://www.pss-solutions.com",
    contactEmail: "info@pss-solutions.com",
    terms: "Available to eligible Women's IP Alliance members. Applicable services and terms to be agreed with PSS Solutions.",
    steps: [
      "Contact PSS Solutions via the partner link.",
      "Mention your active WIPA membership or quote code WIPA-PSS.",
      "Receive preferred pricing on strategic IP advisory and operations audits."
    ]
  },
  services: [
    "Strategic IP Operations",
    "IP Spend Management",
    "IP-Technology Advisory",
    "Training and Upskilling",
    "IP Data Analytics",
    "IP Procurement",
    "IP Project + Change Management",
    "IP Investors"
  ],
  featuresTitle: "Transforming IP operations through strategy, technology, process and people.",
  featuresSubtitle: "Explore PSS Solutions' specialist services designed to help IP teams improve operational performance, adopt the right technology, manage costs and successfully deliver organisational change.",
  features: [
    {
      title: "Strategic IP Operations",
      subtitle: "Assess and transform the way your IP function operates.",
      description: "PSS reviews existing operations, processes and technology to identify opportunities for improvement and develop an actionable transformation roadmap."
    },
    {
      title: "IP Technology Advisory",
      subtitle: "Make better technology decisions for your IP function.",
      description: "PSS helps organisations evaluate their existing technology, select suitable IP technology and support implementation with impartial advice."
    },
    {
      title: "IP Spend Management",
      subtitle: "Gain visibility and control over IP expenditure.",
      description: "Gain visibility and control over IP expenditure, benchmark outside counsel rates, and establish cost reduction frameworks."
    },
    {
      title: "IP Data Analytics",
      subtitle: "Turn IP data into better business decisions.",
      description: "Turn IP data into better business decisions with audit frameworks, data governance, and analytics reporting."
    },
    {
      title: "IP Project & Change Management",
      subtitle: "Successfully deliver complex IP transformation projects.",
      description: "Structured project delivery within agreed time and budget parameters, driving adoption and organisational alignment."
    },
    {
      title: "Training & Upskilling",
      subtitle: "Prepare your people for changing IP operations.",
      description: "Prepare your people for changing IP operations with customized training modules tailored to corporate in-house teams."
    }
  ],
  expert: {
    enabled: true,
    name: "Nadine Stuttle",
    role: "Founder & CEO, PSS Solutions",
    avatar: "/Nadine Stuttle Picture.jpg",
    bio: "Connect with Nadine to discuss how PSS can transform your intellectual property function.",
    phone: "+41 76 565 63 99",
    email: "info@pss-solutions.com",
    address: "Froburgstrasse 12, 4052 Basel, Switzerland",
    locations: ["Switzerland", "Singapore", "Germany", "China", "United Kingdom", "Australia", "France", "USA"]
  },
  videos: [
    { id: "v1", title: "Transforming IP Operations in 2024", thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600&h=400", duration: "4:32" },
    { id: "v2", title: "The Future of Legal Tech", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=400", duration: "12:15" },
    { id: "v3", title: "Optimizing IP Spend", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400", duration: "8:45" },
    { id: "v4", title: "Nadine Stuttle on IP Strategy", thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600&h=400", duration: "15:20" }
  ],
  articles: [
    { id: "a1", title: "5 Ways to Modernize Your IP Function", excerpt: "Discover how top organizations are leveraging new tech to streamline their intellectual property operations and reduce costs.", date: "Oct 12, 2024", readTime: "5 min read", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600&h=400", category: "Insight" },
    { id: "a2", title: "The Hidden Costs of Legacy IP Systems", excerpt: "Are your outdated tools draining your budget? A deep dive into the hidden inefficiencies of legacy IP management software.", date: "Sep 28, 2024", readTime: "8 min read", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600&h=400", category: "Technology" },
    { id: "a3", title: "Navigating Change Management in IP", excerpt: "Implementing a new system is only half the battle. How to ensure your team actually adopts and thrives with new processes.", date: "Sep 15, 2024", readTime: "6 min read", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=400", category: "Operations" }
  ],
  webinars: [
    { id: "w1", title: "Masterclass: Modernizing IP Operations", description: "Join Nadine Stuttle and industry experts to explore how top organizations are leveraging new tech to streamline their intellectual property operations.", date: "Nov 15, 2024", time: "10:00 AM EST", status: "Upcoming", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600&h=400" },
    { id: "w2", title: "The Future of Legal Tech & IP Management", description: "A deep dive into the hidden inefficiencies of legacy IP management software and how to build a business case for modern tools.", date: "Sep 10, 2024", time: "1:00 PM EST", status: "On Demand", image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=600&h=400" }
  ],
  events: [
    { id: "e1", title: "Global IP Strategy Summit 2024", description: "Join PSS Solutions at the premier summit for IP professionals. We'll be hosting a workshop on operational excellence.", date: "Dec 05", fullDate: "December 5-7, 2024", location: "Geneva, Switzerland", type: "In-Person" },
    { id: "e2", title: "WIPA Networking Dinner", description: "An exclusive networking dinner sponsored by PSS Solutions for Women's IP Alliance members to connect and share insights.", date: "Jan 12", fullDate: "January 12, 2025", location: "London, UK", type: "In-Person" },
    { id: "e3", title: "IP Tech Vendor Showcase", description: "Explore the latest IP technology tools. PSS consultants will be available to help you evaluate which solutions fit your operating model.", date: "Feb 22", fullDate: "February 22-23, 2025", location: "Virtual", type: "Online" }
  ],
  tabs: ["Overview", "Tech Operations", "Videos", "Articles", "Webinars", "Events"],
  sections_order: ["hero", "about", "expert", "pillars", "features", "services"]
};

export const DEFAULT_GENIE_CONFIG: IPServiceConfig = {
  id: "3022bf12-b177-4387-a478-1e86178adda2",
  title: "Genie AI",
  slug: "genie-ai",
  category: "tech-way",
  subcategory: "Legal AI & Contracts",
  description: "AI-powered legal drafting, review and contract intelligence.",
  url: "/genie-ai-logo.svg",
  external_url: "https://www.genieai.co/partners/wipa",
  location: "London, UK & Worldwide (150+ Jurisdictions)",
  website: "www.genieai.co",
  is_featured: true,
  is_splash_sponsored: false,
  display_order: 2,
  theme: {
    primaryColor: "#7c3aed",
    accentColor: "#6d28d9",
    gradientFrom: "from-purple-100 dark:from-[#2e1065]/40",
    gradientTo: "to-slate-100 dark:to-black",
    badgeLabel: "Official WIPA Partner",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-600 dark:text-purple-300"
  },
  hero: {
    badge: "Legal AI Platform",
    headline: "AI-powered legal drafting, review and contract intelligence.",
    subheadline: "Genie AI helps legal and business teams draft, review, edit and negotiate contracts using purpose-built legal AI.",
    ctaText: "Visit Genie AI",
    ctaUrl: "https://www.genieai.co/partners/wipa",
    logoUrl: "/genie-ai-logo.svg",
    logoSubtext: "Official Partner of WIPA",
    bgGlowColor: "rgba(147,51,234,0.2)"
  },
  backedBy: ["Google Ventures", "Khosla Ventures"],
  about: {
    badge: "About Genie AI",
    heading: "Legal AI built for modern business teams",
    paragraphs: [
      "Genie AI is a specialist legal AI platform designed to make contract work faster, more consistent and easier to manage.",
      "The platform supports teams across the contract lifecycle — from creating agreements and reviewing complex documents to identifying risks, negotiating terms and managing organisational legal knowledge.",
      "Rather than operating as a general-purpose AI assistant, Genie is designed specifically for legal work and can work with an organisation's own templates, contract standards and playbooks."
    ],
    quote: "Rather than operating as a general-purpose AI assistant, Genie is designed specifically for legal work and can work with an organisation's own templates, contract standards and playbooks."
  },
  metrics: [
    { label: "Active Users Worldwide", value: "200,000+", icon: "Users" },
    { label: "Contract Types Covered", value: "1,000+", icon: "FileCode" },
    { label: "Global Jurisdictions", value: "150+", icon: "Globe" },
    { label: "Supported Languages", value: "40+", icon: "Layers" }
  ],
  offer: {
    enabled: true,
    badge: "Exclusive WIPA Member Benefit",
    title: "50% off Genie Pro for your first 3 months",
    description: "As a Women's IP Alliance member, you get full access to Genie's drafting and negotiation tools — essential for licensing agreements, assignment agreements and NDAs — at half price while you get set up.",
    discount: "50% Off for 3 Months",
    promoCode: "WIPA",
    ctaText: "Claim Your 50% Discount",
    ctaUrl: "https://www.genieai.co/partners/wipa",
    contactEmail: "partnerships@genieai.co",
    terms: "Offer details: 50% off Genie Pro for 3 months when your customers use code WIPA at checkout.",
    steps: [
      "Visit the partner landing page: genieai.co/partners/wipa",
      "Sign up for an account with your business email.",
      "Enter promo code WIPA at checkout.",
      "Enjoy 50% off Genie Pro for your first 3 months!"
    ]
  },
  versions: {
    v1: {
      label: "Version 1: Short and simple",
      hint: "Best for: an email signature blurb, a banner, or a quick mention in a newsletter.",
      text: "GenieAI is a legal AI platform that helps you create, edit and negotiate contracts, used by over 200,000 people across 150+ jurisdictions. Through its partnership with Women's IP Alliance, you get 50% off Genie Pro for your first three months, so you can get licensing agreements, NDAs and other IP contracts done quickly and safely, allowing you to focus on scaling your business with confidence."
    },
    v2: {
      label: "Version 2: Standard",
      hint: "Best for: a dedicated email to customers, or a section on a partner page.",
      text: "GenieAI is built to take the friction out of legal paperwork. It lets you create, edit and negotiate contracts using AI, covering 1,000+ contract types across 150+ jurisdictions and 40+ languages. It's backed by Google Ventures and Khosla Ventures, and used by more than 200,000 people worldwide.\n\nAs a Women's IP Alliance member, you can get 50% off Genie Pro for your first three months. That's full access to Genie's drafting and negotiation tools, useful for the licensing agreements, assignment agreements and NDAs that come with protecting and commercialising IP, at half price while you get set up."
    },
    v3: {
      label: "Version 3: Longer, with offer detail",
      hint: "Best for: a partner newsletter feature, a landing page section, or anywhere the offer terms need to be spelled out clearly.",
      text: "About Genie\nGenie AI helps businesses create, edit and negotiate contracts using AI, so legal work stops being the thing that holds a deal up. It covers 1,000+ contract types across 150+ jurisdictions and 40+ languages, and is trusted by over 200,000 users. Genie is backed by Google Ventures and Khosla Ventures.\n\nWe've partnered with Women's IP Alliance to bring its members a better way to handle contracts, from licensing and assignment agreements to NDAs, without needing a full legal team on hand for every one.\n\nThe offer\nAs a Women's IP Alliance member, you get:\n• 50% off Genie Pro for your first 3 months\n• Full access to Genie's contract creation, editing and negotiation tools\n• Promo code: WIPA\n• Landing page: https://www.genieai.co/partners/wipa\n• Contact: partnerships@genieai.co"
    }
  },
  services: [
    "AI Contract Drafting & Editing",
    "Automated Legal Document & NDA Review",
    "Risk Identification & Redlining",
    "Playbooks & Custom Template Standards",
    "IP Licensing & Assignment Agreements",
    "NDAs & Commercial Deal Negotiation",
    "Multi-Jurisdiction Compliance (150+)",
    "Organisational Legal Knowledge Base"
  ],
  featuresTitle: "Purpose-Built Legal AI Architecture",
  featuresSubtitle: "Genie AI does not rely on generic chatbots. It is engineered with deep legal context, precise clause libraries, and intelligent risk detection to handle mission-critical legal and IP documents.",
  features: [
    {
      title: "AI Contract Drafting",
      description: "Generate full, compliant agreements from scratch or bespoke clauses in seconds, tailored to your governing law and industry requirements."
    },
    {
      title: "Automated Document Review",
      description: "Instantly scan inbound third-party contracts, identify non-standard clauses, flag missing protections, and highlight deal risks."
    },
    {
      title: "Playbook & Template Standards",
      description: "Upload your organization's own playbooks and standard templates so Genie drafts and negotiates strictly in alignment with your corporate standards."
    },
    {
      title: "IP Licensing & NDAs",
      description: "Specialized workflows for IP assignments, patent licenses, technology transfers, and multi-party non-disclosure agreements."
    },
    {
      title: "Cross-Border Jurisdictions",
      description: "Coverage across 150+ legal jurisdictions and 40+ languages, helping international teams negotiate global agreements with confidence."
    },
    {
      title: "Enterprise Grade Security",
      description: "Confidentiality guaranteed. Your data is isolated, encrypted in transit and at rest, and never used to train public LLM models."
    }
  ],
  expert: {
    enabled: false,
    name: "Genie Partnerships Team",
    role: "Legal AI Specialists",
    email: "partnerships@genieai.co",
    address: "Genie AI Ltd, London, United Kingdom",
    locations: ["United Kingdom", "United States", "European Union", "150+ Jurisdictions Worldwide"]
  },
  tabs: ["Overview", "Legal AI & Features", "WIPA Exclusive Offer"],
  sections_order: ["hero", "metrics", "about", "offer", "versions", "services", "features"]
};

export const DEFAULT_SERVICES_LIST: IPServiceConfig[] = [DEFAULT_PSS_CONFIG, DEFAULT_GENIE_CONFIG];

export function parseIPServiceConfig(raw: any): IPServiceConfig {
  if (!raw) return DEFAULT_GENIE_CONFIG;
  
  let parsedContent: Partial<IPServiceConfig> = {};
  if (typeof raw.content === 'string' && raw.content.startsWith('{')) {
    try {
      parsedContent = JSON.parse(raw.content);
    } catch (e) {
      console.warn("Failed to parse resource content JSON", e);
    }
  } else if (raw.content && typeof raw.content === 'object') {
    parsedContent = raw.content;
  }

  const baseDefault: Partial<IPServiceConfig> = 
    raw.slug === 'pss-solutions' || raw.id === '821d981f-54f5-4d57-976f-6fd1cb998022'
      ? DEFAULT_PSS_CONFIG
      : raw.slug === 'genie-ai' || raw.id === '3022bf12-b177-4387-a478-1e86178adda2'
      ? DEFAULT_GENIE_CONFIG
      : {};

  return {
    ...baseDefault,
    ...parsedContent,
    id: raw.id || baseDefault.id || String(Date.now()),
    title: raw.title || parsedContent.title || baseDefault.title || "IP Service",
    slug: raw.slug || parsedContent.slug || baseDefault.slug || "service",
    category: raw.category || parsedContent.category || baseDefault.category || "ip-services",
    subcategory: raw.subcategory || parsedContent.subcategory || baseDefault.subcategory || "Specialist Services",
    description: raw.description || parsedContent.description || baseDefault.description || "",
    url: raw.url || parsedContent.url || baseDefault.url || "",
    external_url: raw.external_url || parsedContent.external_url || baseDefault.external_url || "",
    location: raw.location || parsedContent.location || baseDefault.location || "Global",
    website: raw.website || parsedContent.website || baseDefault.website || "",
    is_featured: raw.is_featured ?? parsedContent.is_featured ?? baseDefault.is_featured ?? false,
    is_splash_sponsored: raw.is_splash_sponsored ?? parsedContent.is_splash_sponsored ?? baseDefault.is_splash_sponsored ?? false,
    display_order: raw.display_order ?? parsedContent.display_order ?? baseDefault.display_order ?? 1,
    theme: {
      ...baseDefault.theme,
      ...parsedContent.theme,
      primaryColor: parsedContent.theme?.primaryColor || baseDefault.theme?.primaryColor || '#7c3aed',
    },
    hero: {
      ...baseDefault.hero,
      ...parsedContent.hero,
      badge: parsedContent.hero?.badge || baseDefault.hero?.badge || "Specialist Platform",
      headline: parsedContent.hero?.headline || baseDefault.hero?.headline || raw.title || "",
      subheadline: parsedContent.hero?.subheadline || baseDefault.hero?.subheadline || raw.description || "",
      ctaText: parsedContent.hero?.ctaText || baseDefault.hero?.ctaText || "Visit Provider",
      ctaUrl: parsedContent.hero?.ctaUrl || baseDefault.hero?.ctaUrl || raw.external_url || "#",
      logoUrl: parsedContent.hero?.logoUrl || raw.url || baseDefault.hero?.logoUrl || "",
      logoSubtext: parsedContent.hero?.logoSubtext || baseDefault.hero?.logoSubtext || "Official Partner of WIPA"
    },
    backedBy: parsedContent.backedBy || baseDefault.backedBy || [],
    about: {
      ...baseDefault.about,
      ...parsedContent.about,
      badge: parsedContent.about?.badge || baseDefault.about?.badge || ("About " + (raw.title || "Provider")),
      heading: parsedContent.about?.heading || baseDefault.about?.heading || "About " + (raw.title || "Service"),
      paragraphs: parsedContent.about?.paragraphs || baseDefault.about?.paragraphs || [raw.description || ""]
    },
    metrics: parsedContent.metrics || baseDefault.metrics || [],
    pillarsTitle: parsedContent.pillarsTitle || baseDefault.pillarsTitle || "People. Structure. Strategy.",
    pillarsSubtitle: parsedContent.pillarsSubtitle || baseDefault.pillarsSubtitle || "PSS believes successful IP transformation requires more than technology alone. Its approach brings together three core elements:",
    pillars: parsedContent.pillars || baseDefault.pillars || [
      { number: "1", title: "People", description: "Ensuring teams have the knowledge, skills and support required to successfully adopt and sustain change." },
      { number: "2", title: "Structure", description: "Developing the right processes, governance and operational framework to support an effective IP function." },
      { number: "3", title: "Strategy", description: "Creating a clear direction and roadmap aligned with the organisation's objectives and future requirements." }
    ],
    offer: {
      ...baseDefault.offer,
      ...parsedContent.offer,
      enabled: parsedContent.offer?.enabled ?? baseDefault.offer?.enabled ?? true,
      steps: parsedContent.offer?.steps || baseDefault.offer?.steps || []
    },
    versions: {
      ...baseDefault.versions,
      ...parsedContent.versions
    },
    services: parsedContent.services || baseDefault.services || [],
    featuresTitle: parsedContent.featuresTitle || baseDefault.featuresTitle || "Core Capabilities & Features",
    featuresSubtitle: parsedContent.featuresSubtitle || baseDefault.featuresSubtitle || "Explore comprehensive technical and operational features.",
    features: parsedContent.features || baseDefault.features || [],
    expert: {
      ...baseDefault.expert,
      ...parsedContent.expert,
      enabled: parsedContent.expert?.enabled ?? baseDefault.expert?.enabled ?? false,
    },
    videos: parsedContent.videos || baseDefault.videos || [],
    articles: parsedContent.articles || baseDefault.articles || [],
    webinars: parsedContent.webinars || baseDefault.webinars || [],
    events: parsedContent.events || baseDefault.events || [],
    tabs: parsedContent.tabs || baseDefault.tabs || (raw.slug === 'pss-solutions' ? DEFAULT_PSS_CONFIG.tabs : ["Overview", "Capabilities", "WIPA Exclusive Offer"]),
    sections_order: parsedContent.sections_order || baseDefault.sections_order || ["hero", "about", "offer", "services"]
  };
}
