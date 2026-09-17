export interface CareerResource {
  id: string;
  title: string;
  type: string;
  topic: string;
  subcategory: string;
  expert: string;
  expertRole?: string;
  expertAvatar?: string;
  time: string;
  featured: boolean;
  image: string;
  summary?: string;
  level?: string;
  rating?: string;
  reviewsCount?: number;
  tags?: string[];
  is_splash_sponsored?: boolean;
  splash_tagline?: string;
  splash_cta_text?: string;
  splash_cta_url?: string;
}

export interface CareerMentor {
  id: string;
  name: string;
  role: string;
  firm: string;
  location: string;
  avatar: string;
  practiceArea: string;
  focusAreas: string[];
  availability: string;
  experienceYears: number;
  bio: string;
  rating: string;
  menteesCount: number;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  track: string;
  timeline: string;
  badge: string;
  keyMilestone: string;
  description: string;
  phases: Array<{
    phase: string;
    title: string;
    timeframe: string;
    milestones: string[];
    competencies: string[];
  }>;
  salaryBenchmark: string;
  keyPitfall: string;
}

export interface ExecutiveToolkit {
  id: string;
  title: string;
  type: string;
  format: string;
  size: string;
  description: string;
  downloads: number;
  previewUrl?: string;
  features: string[];
}

export const CAREER_STATS = [
  { label: 'Women Promoted to Partner & GC', value: '480+', icon: 'Award' },
  { label: 'Senior IP Mentors & Faculty', value: '38', icon: 'Users' },
  { label: 'Executive Playbooks & Roadmaps', value: '24+', icon: 'BookOpen' },
  { label: 'Career Advancement Satisfaction', value: '98%', icon: 'Star' }
];

export const CAREER_SUBCATEGORIES = [
  { id: 'all', name: 'All Resources' },
  { id: 'masterclasses', name: 'Executive Masterclasses' },
  { id: 'roadmaps', name: 'Career Roadmaps' },
  { id: 'mentors', name: 'Executive Mentors' },
  { id: 'playbooks', name: 'Playbooks & Toolkits' }
];

export const CAREER_CONTENT_TYPES = [
  "All Types",
  "Leadership Guide",
  "Career Guide",
  "Executive Masterclass",
  "Career Roadmap",
  "Executive Toolkit",
  "Webinar",
  "Podcast"
];

export const MOCK_CAREER_MENTORS: CareerMentor[] = [
  {
    id: "mentor-1",
    name: "Sarah Norkor Anku",
    role: "Global Managing Partner",
    firm: "SN Anku IP Firm (Accra / London)",
    location: "London, UK & Accra",
    avatar: "/resourceimg2.jpg",
    practiceArea: "Cross-Border IP & Law Firm Leadership",
    focusAreas: ["Partner Track Economics", "Building Global Practice", "Equity Origination"],
    availability: "2 Sessions Open This Month",
    experienceYears: 22,
    bio: "Sarah has guided over 35 senior associates to full equity partnership across AmLaw 100 and international IP firms. She specializes in business development for women in tech and cross-border IP.",
    rating: "5.0",
    menteesCount: 42
  },
  {
    id: "mentor-2",
    name: "Claire Dupont",
    role: "Senior Partner & Patent Litigation Chair",
    firm: "Dupont & Partners (Paris / New York)",
    location: "New York & Paris",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    practiceArea: "High-Stakes Patent Litigation & Trial Strategy",
    focusAreas: ["Courtroom Advocacy", "Originating Corporate Clients", "Trial Team Leadership"],
    availability: "Accepting Mentees",
    experienceYears: 20,
    bio: "Veteran patent litigator with first-chair trial experience in federal district courts and the ITC. Dedicated to mentoring women litigators on oral arguments and mastering firm politics.",
    rating: "4.9",
    menteesCount: 38
  },
  {
    id: "mentor-3",
    name: "Dr. Arpita Sengupta",
    role: "VP & Global Head of IP",
    firm: "Horizon BioPharma (Boston / Zurich)",
    location: "Boston, USA",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
    practiceArea: "Life Sciences IP & C-Suite Governance",
    focusAreas: ["Firm to In-House Transition", "C-Suite Presentation", "Portfolio Monetization"],
    availability: "1 Session Open",
    experienceYears: 18,
    bio: "Dr. Sengupta transitioned from big law partner to global head of IP for a major biopharma group. She mentors senior counsel on executive presence and managing C-suite dynamics.",
    rating: "5.0",
    menteesCount: 29
  },
  {
    id: "mentor-4",
    name: "Charlotte Sterling",
    role: "Former Tech GC & Senior IP Fellow",
    firm: "Stanford Tech Law & Autonomous Mobility",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    practiceArea: "General Counsel Ascension & Tech IP",
    focusAreas: ["General Counsel Seat", "Executive Equity & Compensation", "Board Advisory"],
    availability: "Accepting Mentees",
    experienceYears: 24,
    bio: "Former General Counsel at autonomous systems and AI pioneers. Charlotte advises senior IP attorneys on executive contracts, stock equity negotiation, and transitioning to corporate boardrooms.",
    rating: "4.9",
    menteesCount: 51
  },
  {
    id: "mentor-5",
    name: "Elena Rostova",
    role: "Partner & Emerging Tech / AI Chair",
    firm: "Apex Global Law (London)",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80",
    practiceArea: "AI Patents & Emerging Tech Transactions",
    focusAreas: ["Tech Patenting", "Originating Tech Unicorns", "Sponsorship & Promotion"],
    availability: "3 Sessions Open",
    experienceYears: 16,
    bio: "Leading legal authority on AI patentability in Europe and the US. Elena empowers rising IP counsel to carve out niche technological authority and secure institutional sponsorship.",
    rating: "4.9",
    menteesCount: 24
  },
  {
    id: "mentor-6",
    name: "Sophia Bennett",
    role: "Head of Global IP Operations & Governance",
    firm: "Astra International & WIPA Advisory",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    practiceArea: "IP Operations, Budgeting & Department Strategy",
    focusAreas: ["IP Department Restructuring", "Outside Counsel Management", "Work-Life Integration"],
    availability: "Accepting Mentees",
    experienceYears: 19,
    bio: "Sophia oversees multi-million dollar annual IP budgets and global docketing infrastructure. She mentors counsel on operational leadership, vendor negotiations, and team wellness.",
    rating: "5.0",
    menteesCount: 33
  }
];

export const MOCK_CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: "roadmap-equity-partner",
    title: "Senior Associate to Equity Partner Roadmap",
    track: "Law Firm Track",
    timeline: "6 – 8 Years",
    badge: "Partnership Progression",
    keyMilestone: "Building a $1.5M+ Portable Book of Business",
    description: "A structured, phased strategic roadmap designed to transition high-performing senior IP associates into originating equity partners.",
    salaryBenchmark: "$350,000 – $1,200,000+ Total Compensation",
    keyPitfall: "Relying exclusively on billable hours without cultivating an identifiable client origination niche.",
    phases: [
      {
        phase: "Phase 1: Foundations (Years 1–3)",
        title: "Technical Mastery & Firm Credibility",
        timeframe: "Years 1–3 Senior Associate",
        milestones: [
          "Establish flawless execution across complex patent prosecution and litigation drafting.",
          "Exceed annual billable benchmarks with high realization rate (>92%).",
          "Identify 2 key internal partner champions who sit on firm evaluation committees."
        ],
        competencies: ["Complex Patent Drafting", "FTO & Patent Landscaping", "Internal Sponsor Cultivation"]
      },
      {
        phase: "Phase 2: Transition (Years 4–5)",
        title: "Business Development & External Authority",
        timeframe: "Years 4–5 Counsel / Junior Partner",
        milestones: [
          "Publish 3 flagship IP thought leadership articles in reputable legal reviews.",
          "Secure speaking slots at major industry conferences (INTA, AIPLA, IPO).",
          "Originate first $300k–$500k in portable client billings from direct contacts."
        ],
        competencies: ["Pitching & RFP Leadership", "Client Pitch Pricing", "Cross-Practice Referrals"]
      },
      {
        phase: "Phase 3: Equity Track (Years 6+)",
        title: "Equity Elevation & Firm Governance",
        timeframe: "Year 6+ Full Equity Partner",
        milestones: [
          "Present verified business plan with projected $1.5M+ recurring portable book.",
          "Secure formal sponsorship from practice group leader and managing partner.",
          "Formal election by firm equity partnership committee."
        ],
        competencies: ["Firm Economics & P&L", "Practice Group Leadership", "Succession Planning"]
      }
    ]
  },
  {
    id: "roadmap-general-counsel",
    title: "Senior IP Counsel to General Counsel (GC) Blueprint",
    track: "Corporate In-House Track",
    timeline: "5 – 7 Years",
    badge: "Executive C-Suite",
    keyMilestone: "Translating IP Assets into Enterprise Valuation & EBITDA",
    description: "The definitive playbook for in-house IP counsel aspiring to the Chief Legal Officer and General Counsel executive seat.",
    salaryBenchmark: "$400,000 – $950,000 + Significant Equity",
    keyPitfall: "Remaining pigeonholed as a technical patent expert rather than a commercial business executive.",
    phases: [
      {
        phase: "Phase 1: In-House Core (Years 1–2)",
        title: "Portfolio Strategy & Business Alignment",
        timeframe: "Senior IP Counsel",
        milestones: [
          "Streamline outside counsel spend by 15% through consolidated flat-fee arrangements.",
          "Embed IP intake mechanisms directly into R&D and product launch sprints.",
          "Conduct complete portfolio audit to prune low-value maintenance costs."
        ],
        competencies: ["Enterprise Risk Management", "R&D Product Alignment", "Outside Counsel Budgeting"]
      },
      {
        phase: "Phase 2: Broader Legal Exposure (Years 3–4)",
        title: "Commercial Contracts, Privacy & M&A",
        timeframe: "Director of IP / Deputy GC",
        milestones: [
          "Lead IP due diligence and integration on major corporate acquisitions.",
          "Broaden oversight to commercial licensing, data privacy, and employment compliance.",
          "Present annual IP risk and competitive landscape briefings to the Board of Directors."
        ],
        competencies: ["M&A Transaction Diligence", "Boardroom Reporting", "Data Governance"]
      },
      {
        phase: "Phase 3: C-Suite Ascension (Years 5+)",
        title: "Chief Legal Officer / General Counsel",
        timeframe: "General Counsel / CLO",
        milestones: [
          "Serve as trusted strategic counselor to the CEO and Board Audit Committee.",
          "Architect comprehensive corporate governance and crisis response protocols.",
          "Oversee total company legal operations, regulatory compliance, and investor relations."
        ],
        competencies: ["Executive Leadership", "Crisis Management", "Public Company Governance"]
      }
    ]
  },
  {
    id: "roadmap-trial-lead",
    title: "Patent Litigator to Lead Trial Counsel Pathway",
    track: "Litigation & Trial Track",
    timeline: "7 – 9 Years",
    badge: "First-Chair Mastery",
    keyMilestone: "First-Chair Jury Trial & ITC Section 337 Argument",
    description: "Step-by-step roadmap from drafting discovery motions to commanding federal courtrooms as lead trial counsel.",
    salaryBenchmark: "$450,000 – $1,500,000+",
    keyPitfall: "Getting trapped behind the scenes in document review and expert report drafting without taking standup courtroom depositions.",
    phases: [
      {
        phase: "Phase 1: Courtroom Foundations (Years 1–3)",
        title: "Discovery & Witness Depositions",
        timeframe: "Associate Litigator",
        milestones: [
          "Take and defend 20+ key fact and technical expert witness depositions.",
          "Draft winning summary judgment and Daubert motions.",
          "Argue minor discovery motions before magistrate judges."
        ],
        competencies: ["Deposition Strategy", "Claim Construction Briefing", "Daubert Motions"]
      },
      {
        phase: "Phase 2: Standup Advocacy (Years 4–6)",
        title: "Markman Hearings & Key Witness Examination",
        timeframe: "Senior Counsel / Trial Partner",
        milestones: [
          "Lead oral argument at pivotal Markman claim construction hearings.",
          "Direct and cross-examine technical experts during evidentiary hearings.",
          "Co-chair ITC Section 337 evidentiary hearings before administrative law judges."
        ],
        competencies: ["Markman Oral Arguments", "Cross-Examination of Technical Experts", "ITC Procedure"]
      },
      {
        phase: "Phase 3: First-Chair Command (Years 7+)",
        title: "First-Chair Federal Jury Trials",
        timeframe: "Lead Trial Counsel",
        milestones: [
          "First-chair jury selection, opening statements, and closing arguments.",
          "Deliver winning oral arguments before the Court of Appeals for the Federal Circuit (CAFC).",
          "Command multi-million dollar high-stakes trade secret and patent disputes."
        ],
        competencies: ["Jury Persuasion", "Federal Circuit Advocacy", "Trial Team Command"]
      }
    ]
  }
];

export const MOCK_EXECUTIVE_TOOLKITS: ExecutiveToolkit[] = [
  {
    id: "toolkit-partner-plan",
    title: "Law Firm Partnership Business Plan Model (2026 Edition)",
    type: "Financial & Business Plan",
    format: "Excel & PPTX",
    size: "4.8 MB",
    downloads: 1420,
    description: "The complete financial forecasting model, origination matrix, and prospective client portable book calculator used by successful AmLaw candidates.",
    features: [
      "3-Year Portable Revenue & Origination Forecasting Template",
      "Billing Realization & Leverage Rate Calculator",
      "Executive Summary Presentation Deck for Partnership Committees",
      "Cross-Selling Matrix for Existing Firm Clients"
    ]
  },
  {
    id: "toolkit-first-100-days",
    title: "The First 100 Days as Head of Global IP: Strategic Action Plan",
    type: "Executive Playbook",
    format: "Executive PDF",
    size: "2.4 MB",
    downloads: 1890,
    description: "A battle-tested 100-day roadmap for new Heads of IP and Chief Patent Counsel to audit portfolios, meet R&D leaders, and present budget priorities to the CEO.",
    features: [
      "Week-by-week stakeholder interview schedule (R&D, Finance, Product)",
      "Patent portfolio pruning and cost-reduction matrix",
      "Outside counsel scorecard and rate renegotiation guidelines",
      "Executive 1-page dashboard template for C-suite reporting"
    ]
  },
  {
    id: "toolkit-comp-benchmark",
    title: "2026 IP Legal Executive Compensation & Equity Benchmark Report",
    type: "Industry Benchmark",
    format: "Research PDF",
    size: "5.1 MB",
    downloads: 2340,
    description: "Comprehensive salary, bonus, origination percentage, and equity grant benchmarks for women IP leaders across AmLaw 100, Fortune 500, and growth-stage tech.",
    features: [
      "Partner compensation brackets by tier, city, and portable book size",
      "In-house GC & Head of IP total compensation (base, bonus, equity)",
      "Tested negotiation scripts for origination credit disputes",
      "Key equity vesting benchmarks and severance protections"
    ]
  },
  {
    id: "toolkit-boardroom-deck",
    title: "Boardroom IP Presentation Deck & Risk Governance Framework",
    type: "Presentation Template",
    format: "PowerPoint & Keynote",
    size: "3.2 MB",
    downloads: 1180,
    description: "High-impact slide deck for Chief IP Counsel to translate complex patent litigation risk, competitive barriers, and licensing revenue directly to Board Directors.",
    features: [
      "12 editable executive slides with crisp financial charts",
      "IP risk heat-map and competitor patent fencing graphics",
      "EBITDA contribution framework for IP monetization",
      "Director Q&A preparation guide with executive talking points"
    ]
  }
];

export const MOCK_FULL_CAREER_RESOURCES: CareerResource[] = [
  {
    id: "adf54322-17ca-461c-bf38-bc35e8f8bff9",
    title: "Rising to Partner: Strategies for Women Attorneys in Modern Law Firms",
    type: "Leadership Guide",
    topic: "Career Growth",
    subcategory: "leadership",
    expert: "Sarah Norkor Anku, Global Managing Partner",
    expertRole: "Global Managing Partner, SN Anku IP Firm",
    expertAvatar: "/resourceimg2.jpg",
    time: "10 min read",
    featured: true,
    image: "/resourceimg2.jpg",
    summary: "Actionable mentorship pathways, business development frameworks, and portfolio leadership for emerging partners.",
    level: "Partner Track",
    rating: "4.9",
    reviewsCount: 184,
    tags: ["Law Firm Partnership", "Origination", "Leadership"]
  },
  {
    id: "0111a3a9-6e9b-425e-9070-69b92f114e6f",
    title: "From Senior Associate to IP Partner: The Roadmap to Equity",
    type: "Career Guide",
    topic: "Partnership",
    subcategory: "career-growth",
    expert: "Nadine Stuttle, CEO & WIPA European Board",
    expertRole: "CEO, PSS Solutions",
    expertAvatar: "/Nadine Stuttle Picture.jpg",
    time: "8 min read",
    featured: false,
    image: "/Nadine Stuttle Picture.jpg",
    summary: "Key metrics, client origination tactics, and executive presence required to make partner in tier-1 IP firms.",
    level: "Senior Associate",
    rating: "4.8",
    reviewsCount: 142,
    tags: ["Career Transition", "Equity Partner", "Firm Politics"]
  },
  {
    id: "52ee37c0-8cff-4cd4-8926-c9be05e40f8a",
    title: "Mastering the General Counsel Seat: IP Strategy for Corporate Executives",
    type: "Executive Briefing",
    topic: "Corporate IP",
    subcategory: "leadership",
    expert: "Michele Katz, Founding Partner",
    expertRole: "Founding Partner, Advitam IP LLC",
    expertAvatar: "/resourceimg1.jpg",
    time: "8 min read",
    featured: false,
    image: "/resourceimg1.jpg",
    summary: "Bridging technical patent prosecution with executive C-suite board presentations and risk governance.",
    level: "General Counsel",
    rating: "4.9",
    reviewsCount: 96,
    tags: ["In-House Leadership", "C-Suite", "Governance"]
  },
  {
    id: "masterclass-building-book",
    title: "Building a $5M+ Portable Book of Business in Tech IP",
    type: "Executive Masterclass",
    topic: "Business Development",
    subcategory: "masterclasses",
    expert: "Claire Dupont, Senior Partner",
    expertRole: "Chair of Patent Litigation, Dupont & Partners",
    expertAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    time: "42 min watch",
    featured: false,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    summary: "How to cultivate client relationships from seed-stage tech startups into Fortune 500 retainers with proven origination models.",
    level: "Partner Track",
    rating: "5.0",
    reviewsCount: 215,
    tags: ["Client Development", "Origination", "Tech IP"]
  },
  {
    id: "masterclass-negotiating-comp",
    title: "Negotiating Partner Compensation, Origination Credits & Equity Points",
    type: "Executive Masterclass",
    topic: "Negotiation",
    subcategory: "masterclasses",
    expert: "Charlotte Sterling & Maya Patel",
    expertRole: "Senior Fellows & Executive Talent Advisors",
    expertAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    time: "35 min watch",
    featured: false,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    summary: "An inside look into compensation committees: how lockstep vs. eat-what-you-kill models evaluate women partners.",
    level: "Senior & Partner",
    rating: "4.9",
    reviewsCount: 168,
    tags: ["Compensation", "Equity Negotiation", "Firm Governance"]
  },
  {
    id: "masterclass-boardroom-presence",
    title: "Mastering Boardroom Influence: Translating IP Risk into EBITDA",
    type: "Executive Masterclass",
    topic: "Executive Leadership",
    subcategory: "masterclasses",
    expert: "Elena Rostova, Practice Chair",
    expertRole: "Partner & Emerging Tech / AI Chair, Apex Legal",
    expertAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80",
    time: "28 min watch",
    featured: false,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    summary: "Techniques for commanding executive presence in front of audit committees and venture boards without losing technical accuracy.",
    level: "General Counsel",
    rating: "4.9",
    reviewsCount: 130,
    tags: ["Boardroom", "EBITDA", "Executive Presence"]
  },
  {
    id: "playbook-first-90-days",
    title: "The First 90 Days as Head of Global IP: Corporate Playbook",
    type: "Leadership Guide",
    topic: "Corporate Strategy",
    subcategory: "career-growth",
    expert: "Corporate Practice Team & Dr. Arpita Sengupta",
    expertRole: "VP of Global IP, BioPharma Holdings",
    expertAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
    time: "15 min read",
    featured: false,
    image: "/resource3.jpg",
    summary: "Step-by-step guidance on setting corporate IP goals, renegotiating outside counsel billable rates, and aligning with R&D heads.",
    level: "Director & Head of IP",
    rating: "4.8",
    reviewsCount: 88,
    tags: ["Corporate IP", "Leadership", "First 90 Days"]
  },
  {
    id: "guide-cross-border-litigation",
    title: "The Woman IP Litigator's Guide to High-Stakes Oral Arguments",
    type: "Career Guide",
    topic: "Courtroom Advocacy",
    subcategory: "leadership",
    expert: "Justice Beatrice Moreau (Ret.)",
    expertRole: "Former Appellate Judge & International Arbitrator",
    expertAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    time: "12 min read",
    featured: false,
    image: "/resourceimg1.jpg",
    summary: "Tactical advice on preparing for hostile questioning, commanding the courtroom podium, and appealing to diverse juries.",
    level: "Trial Litigator",
    rating: "5.0",
    reviewsCount: 104,
    tags: ["Litigation", "Courtroom", "Advocacy"]
  }
];
