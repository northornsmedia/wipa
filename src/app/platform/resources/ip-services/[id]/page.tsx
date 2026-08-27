'use client';

import React, { use, useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Shield, 
  FileText, 
  CheckCircle2, 
  Quote, 
  Users, 
  Map, 
  Play, 
  X, 
  Calendar, 
  Clock, 
  Video, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Bot, 
  Zap, 
  Award, 
  Tag, 
  Gift, 
  Layers, 
  FileCode,
  Scale
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { IPServiceConfig, parseIPServiceConfig, DEFAULT_PSS_CONFIG, DEFAULT_GENIE_CONFIG } from '@/lib/ip-services-config';

// Mock companies fallback database for IP Services directory
const MOCK_COMPANIES = [
  {
    id: "pss-solutions",
    name: "PSS Solutions",
    type: "IP Operations Experts",
    location: "Basel, Switzerland",
    website: "www.pss-solutions.com",
    sponsored: true,
    logo: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
    description: "PSS is the only fully independent IP focused consulting and advisory group in the sector. Impartial, honest, clear. At PSS Solutions we unite people, structure and strategy. It is our firm belief that only such a holistic approach can lead to sustainable and profitable IP operations.",
    quote: "Technology in isolation will never resolve a problem. It is a key foundation on which the right people, structure and strategy is underpinned by.",
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
    videos: [
      { id: "v1", title: "Transforming IP Operations in 2024", thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600&h=400", duration: "4:32" },
      { id: "v2", title: "The Future of Legal Tech", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=400", duration: "12:15" },
      { id: "v3", title: "Optimizing IP Spend", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400", duration: "8:45" },
      { id: "v4", title: "Nadine Stuttle on IP Strategy", thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600&h=400", duration: "15:20" },
    ],
    articles: [
      { id: "a1", title: "5 Ways to Modernize Your IP Function", excerpt: "Discover how top organizations are leveraging new tech to streamline their intellectual property operations and reduce costs.", date: "Oct 12, 2024", readTime: "5 min read", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600&h=400", category: "Insight" },
      { id: "a2", title: "The Hidden Costs of Legacy IP Systems", excerpt: "Are your outdated tools draining your budget? A deep dive into the hidden inefficiencies of legacy IP management software.", date: "Sep 28, 2024", readTime: "8 min read", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600&h=400", category: "Technology" },
      { id: "a3", title: "Navigating Change Management in IP", excerpt: "Implementing a new system is only half the battle. How to ensure your team actually adopts and thrives with new processes.", date: "Sep 15, 2024", readTime: "6 min read", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=400", category: "Operations" },
    ],
    webinars: [
      { 
        id: "w1", 
        title: "Masterclass: Modernizing IP Operations", 
        description: "Join Nadine Stuttle and industry experts to explore how top organizations are leveraging new tech to streamline their intellectual property operations.", 
        date: "Nov 15, 2024", 
        time: "10:00 AM EST", 
        status: "Upcoming", 
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600&h=400",
        speakers: [
          { name: "Nadine Stuttle", role: "Founder & CEO, PSS Solutions", avatar: "/Nadine Stuttle Picture.jpg" }
        ]
      },
      { 
        id: "w2", 
        title: "The Future of Legal Tech & IP Management", 
        description: "A deep dive into the hidden inefficiencies of legacy IP management software and how to build a business case for modern tools.", 
        date: "Sep 10, 2024", 
        time: "1:00 PM EST", 
        status: "On Demand", 
        image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=600&h=400",
        speakers: [
          { name: "Virginien Leost", role: "PSS Solutions", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" }
        ]
      }
    ],
    events: [
      {
        id: "e1",
        title: "Global IP Strategy Summit 2024",
        description: "Join PSS Solutions at the premier summit for IP professionals. We'll be hosting a workshop on operational excellence.",
        date: "Dec 05",
        fullDate: "December 5-7, 2024",
        location: "Geneva, Switzerland",
        type: "In-Person",
      },
      {
        id: "e2",
        title: "WIPA Networking Dinner",
        description: "An exclusive networking dinner sponsored by PSS Solutions for Women's IP Alliance members to connect and share insights.",
        date: "Jan 12",
        fullDate: "January 12, 2025",
        location: "London, UK",
        type: "In-Person",
      },
      {
        id: "e3",
        title: "IP Tech Vendor Showcase",
        description: "Explore the latest IP technology tools. PSS consultants will be available to help you evaluate which solutions fit your operating model.",
        date: "Feb 22",
        fullDate: "February 22-23, 2025",
        location: "Virtual",
        type: "Online",
      }
    ],
    locations: ["Switzerland", "Singapore", "Germany", "China", "United Kingdom", "Australia", "France", "USA"],
    team: [
      { name: "Nadine Stuttle", role: "Founder & CEO, PSS Solutions", initials: "NS" },
      { name: "Virginien Leost", role: "Senior IP Operations Expert", initials: "VL" },
      { name: "Roisin Williams", role: "Senior Consultant", initials: "RW" },
      { name: "Franck Lancien", role: "Director – IP Consulting", initials: "FL" }
    ],
    contact: {
      phone: "+41 76 565 63 99",
      email: "info@pss-solutions.com",
      address: "Froburgstrasse 12, 4052 Basel, Switzerland"
    }
  },
  {
    id: "genie-ai",
    name: "Genie AI",
    type: "AI-Powered Legal Drafting & Contract Intelligence",
    location: "London, UK & Worldwide (150+ Jurisdictions)",
    website: "www.genieai.co",
    landingPage: "https://www.genieai.co/partners/wipa",
    promoCode: "WIPA",
    offer: "50% off Genie Pro for your first 3 months",
    sponsored: true,
    logo: "/genie-ai-logo.svg",
    icon: "/genie-icon.svg",
    headline: "AI-powered legal drafting, review and contract intelligence.",
    subheadline: "Genie AI helps legal and business teams draft, review, edit and negotiate contracts using purpose-built legal AI.",
    quote: "Rather than operating as a general-purpose AI assistant, Genie is designed specifically for legal work and can work with an organisation's own templates, contract standards and playbooks.",
    description: "Genie AI is a specialist legal AI platform designed to make contract work faster, more consistent and easier to manage. The platform supports teams across the contract lifecycle — from creating agreements and reviewing complex documents to identifying risks, negotiating terms and managing organisational legal knowledge.",
    backedBy: ["Google Ventures", "Khosla Ventures"],
    metrics: [
      { label: "Active Users", value: "200,000+" },
      { label: "Contract Types", value: "1,000+" },
      { label: "Jurisdictions", value: "150+" },
      { label: "Languages", value: "40+" }
    ],
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
    contact: {
      phone: "+44 20 8068 5060",
      email: "partnerships@genieai.co",
      address: "Genie AI Ltd, London, United Kingdom"
    },
    locations: ["United Kingdom", "United States", "European Union", "150+ Jurisdictions Worldwide"]
  },
  {
    id: "tech-protect-llp",
    name: "TechProtect LLP",
    type: "Digital IP Specialists",
    location: "San Francisco, CA",
    website: "www.techprotect.com",
    sponsored: false,
    description: "Specializing in copyright protection for digital assets, software patents, and AI-generated content licensing.",
    services: ["Software Patents", "Digital Copyrights", "Open Source Compliance"],
  },
  {
    id: "innovate-partners",
    name: "Innovate Partners",
    type: "Consulting & Strategy",
    location: "London, UK",
    website: "www.innovatepartners.co.uk",
    sponsored: false,
    description: "Strategic IP consulting firm helping startups and enterprises maximize the valuation of their intellectual property assets.",
    services: ["IP Valuation", "Strategy Consulting", "Due Diligence"],
  }
];

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const paramId = resolvedParams.id;

  const [dbConfig, setDbConfig] = useState<IPServiceConfig | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2' | 'v3'>('v2');

  // Fetch dynamic configuration from Supabase
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .or(`id.eq.${paramId},slug.eq.${paramId}`)
          .single();

        if (data) {
          setDbConfig(parseIPServiceConfig(data));
        }
      } catch (err) {
        console.warn("Could not load dynamic service from DB, using defaults:", err);
      }
    };
    fetchServiceData();
  }, [paramId]);

  // Merge database configuration with mock fallback
  const mockCompany = MOCK_COMPANIES.find(c => 
    c.id === paramId || 
    (paramId === '3022bf12-b177-4387-a478-1e86178adda2' && c.id === 'genie-ai') ||
    (paramId === 'genie-ai' && c.id === 'genie-ai') ||
    (paramId === '821d981f-54f5-4d57-976f-6fd1cb998022' && c.id === 'pss-solutions')
  ) || (paramId === 'genie-ai' ? DEFAULT_GENIE_CONFIG : DEFAULT_PSS_CONFIG);

  const isGenie = paramId === 'genie-ai' || dbConfig?.slug === 'genie-ai' || paramId === '3022bf12-b177-4387-a478-1e86178adda2';
  const isPss = paramId === 'pss-solutions' || dbConfig?.slug === 'pss-solutions' || paramId === '821d981f-54f5-4d57-976f-6fd1cb998022';

  const company = {
    id: dbConfig?.slug || mockCompany.id,
    name: dbConfig?.title || (mockCompany as any).name || (mockCompany as any).title,
    location: dbConfig?.location || (mockCompany as any).location || "Global",
    website: dbConfig?.website || (mockCompany as any).website,
    logo: dbConfig?.url || (mockCompany as any).logo,
    description: dbConfig?.description || (mockCompany as any).description,
    quote: dbConfig?.about?.quote || (mockCompany as any).quote,
    services: dbConfig?.services || (mockCompany as any).services || DEFAULT_PSS_CONFIG.services || [],
    pillarsTitle: dbConfig?.pillarsTitle || (mockCompany as any).pillarsTitle || DEFAULT_PSS_CONFIG.pillarsTitle,
    pillarsSubtitle: dbConfig?.pillarsSubtitle || (mockCompany as any).pillarsSubtitle || DEFAULT_PSS_CONFIG.pillarsSubtitle,
    pillars: dbConfig?.pillars || (mockCompany as any).pillars || DEFAULT_PSS_CONFIG.pillars,
    videos: dbConfig?.videos || (mockCompany as any).videos,
    articles: dbConfig?.articles || (mockCompany as any).articles,
    webinars: dbConfig?.webinars || (mockCompany as any).webinars,
    events: dbConfig?.events || (mockCompany as any).events,
    locations: dbConfig?.expert?.locations || (mockCompany as any).locations,
    contact: {
      phone: dbConfig?.expert?.phone || (mockCompany as any).contact?.phone,
      email: dbConfig?.expert?.email || (mockCompany as any).contact?.email,
      address: dbConfig?.expert?.address || (mockCompany as any).contact?.address,
    },
    sponsored: dbConfig?.is_splash_sponsored ?? (mockCompany as any).sponsored,
    theme: dbConfig?.theme || (isGenie ? DEFAULT_GENIE_CONFIG.theme : DEFAULT_PSS_CONFIG.theme),
    hero: dbConfig?.hero || (isGenie ? DEFAULT_GENIE_CONFIG.hero : DEFAULT_PSS_CONFIG.hero),
    backedBy: dbConfig?.backedBy || (mockCompany as any).backedBy || (isGenie ? DEFAULT_GENIE_CONFIG.backedBy : DEFAULT_PSS_CONFIG.backedBy),
    about: dbConfig?.about || (isGenie ? DEFAULT_GENIE_CONFIG.about : DEFAULT_PSS_CONFIG.about),
    metrics: dbConfig?.metrics || (isGenie ? DEFAULT_GENIE_CONFIG.metrics : DEFAULT_PSS_CONFIG.metrics),
    offer: dbConfig?.offer || (isGenie ? DEFAULT_GENIE_CONFIG.offer : DEFAULT_PSS_CONFIG.offer),
    versions: dbConfig?.versions || (isGenie ? DEFAULT_GENIE_CONFIG.versions : DEFAULT_PSS_CONFIG.versions),
    featuresTitle: dbConfig?.featuresTitle || (isGenie ? DEFAULT_GENIE_CONFIG.featuresTitle : DEFAULT_PSS_CONFIG.featuresTitle),
    featuresSubtitle: dbConfig?.featuresSubtitle || (isGenie ? DEFAULT_GENIE_CONFIG.featuresSubtitle : DEFAULT_PSS_CONFIG.featuresSubtitle),
    features: dbConfig?.features || (isGenie ? DEFAULT_GENIE_CONFIG.features : DEFAULT_PSS_CONFIG.features),
    expert: dbConfig?.expert || (isGenie ? DEFAULT_GENIE_CONFIG.expert : DEFAULT_PSS_CONFIG.expert),
  };

  const handleCopyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const TABS = isGenie
    ? ['Overview', 'Legal AI & Features', 'WIPA Exclusive Offer']
    : isPss
    ? ['Overview', 'Tech Operations', 'Videos', 'Articles', 'Webinars', 'Events']
    : dbConfig?.tabs || ['Overview', 'Capabilities', 'WIPA Exclusive Offer'];

  const primaryColor = company.theme?.primaryColor || (isGenie ? '#7c3aed' : '#0284c7');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 overflow-x-hidden pb-20">
      
      {/* Cinematic Header */}
      <div className="relative min-h-[480px] w-full flex flex-col justify-end pb-16 pt-40 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          company.theme?.gradientFrom || 'from-sky-100 dark:from-[#082f49]'
        } via-white dark:via-[#020617] ${
          company.theme?.gradientTo || 'to-slate-100 dark:to-black'
        } z-0`}></div>
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen opacity-30"
          style={{ backgroundColor: primaryColor }}
        ></div>
        
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-start justify-end h-full">
          <Link href="/platform/resources/ip-services" className="flex items-center gap-2 font-bold mb-10 hover:-translate-x-1 transition-transform" style={{ color: primaryColor }}>
            <ArrowLeft size={16} /> Back to IP Services
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-4">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white border border-slate-200 dark:border-white/10 shadow-2xl flex items-center justify-center shrink-0 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-white/5 dark:to-transparent opacity-50"></div>
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain relative z-10 drop-shadow-sm" />
              ) : (
                <Building size={64} className="text-sky-500 relative z-10" />
              )}
            </div>
            <div>
              {company.sponsored && (
                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${
                  company.theme?.badgeBg || 'bg-amber-500/10'
                } border border-amber-500/20 ${
                  company.theme?.badgeText || 'text-amber-600 dark:text-amber-400'
                } text-xs font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-sm backdrop-blur-sm`}>
                  <Sparkles size={14} /> {company.theme?.badgeLabel || "Official WIPA Partner"}
                </div>
              )}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 font-bold text-base md:text-lg">
                <span className="flex items-center gap-2">
                  <MapPin size={20} style={{ color: primaryColor }} /> {company.location}
                </span>
                {company.offer?.enabled !== false && company.offer?.promoCode && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                    <Tag size={13} /> Code: {company.offer.promoCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar py-6">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-2xl md:text-3xl font-black whitespace-nowrap transition-colors duration-300 tracking-tight ${
                  activeTab === tab 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
                style={activeTab === tab ? { color: primaryColor } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
          
          <div className="space-y-12">
            
            {/* ========================================================================= */}
            {/* GENIE AI & DYNAMIC PARTNER OVERVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'Overview' && (isGenie || (!isPss && isGenie)) && (
              <div className="flex flex-col gap-12 w-full">
                
                {/* 1. Hero Banner */}
                <div className="bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 dark:from-[#0f172a] dark:via-[#1e1b4b]/30 dark:to-[#0B1221] rounded-[2.5rem] border border-purple-200/70 dark:border-purple-500/20 p-8 md:p-12 shadow-xl overflow-hidden relative w-full">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-6">
                        <Bot size={15} /> Legal AI Platform
                      </div>
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                        {company.hero?.headline || "AI-powered legal drafting, review and contract intelligence."}
                      </h2>
                      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                        {company.hero?.subheadline || "Genie AI helps legal and business teams draft, review, edit and negotiate contracts using purpose-built legal AI."}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <a 
                          href={company.hero?.ctaUrl || "https://www.genieai.co/partners/wipa"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:scale-95 text-base"
                        >
                          {company.hero?.ctaText || "Visit Genie AI"} <ArrowRight size={18} />
                        </a>
                        {company.offer?.enabled !== false && (
                          <button 
                            onClick={() => setActiveTab('WIPA Exclusive Offer')}
                            className="bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors text-base"
                          >
                            <Gift size={18} /> View {company.offer?.discount || "50% Off"} Offer
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-auto shrink-0 flex flex-col items-center bg-white dark:bg-slate-800/80 p-8 rounded-3xl border border-purple-100 dark:border-white/10 shadow-lg">
                      <div className="h-28 w-56 flex items-center justify-center p-4">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Building size={48} className="text-purple-500" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                        Official Partner of WIPA
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Key Scale Metrics */}
                {company.metrics && company.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {company.metrics.map((stat, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 border border-purple-100 dark:border-purple-900/40">
                          <Layers size={20} />
                        </div>
                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                          {stat.value}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Backed by Investors Callout */}
                {company.backedBy && company.backedBy.length > 0 && (
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                      <Award className="text-purple-600 dark:text-purple-400" size={24} />
                      <span>Backed by premier technology investors:</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-3">
                      {company.backedBy.map((inv: string, i: number) => (
                        <span key={i} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm border border-slate-200 dark:border-white/5">
                          {inv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. About Section */}
                <section className="bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                  <div className="inline-block px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-4">
                    {company.about?.badge || `About ${company.name}`}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                    {company.about?.heading || "Legal AI built for modern business teams"}
                  </h3>
                  <div className="space-y-5 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-5xl">
                    {company.about?.paragraphs?.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                    {company.about?.quote && (
                      <p className="border-l-4 border-purple-500 pl-5 italic text-slate-800 dark:text-slate-200 font-semibold bg-purple-50/50 dark:bg-purple-950/20 py-3 rounded-r-2xl">
                        "{company.about.quote}"
                      </p>
                    )}
                  </div>
                </section>

                {/* 4. Exclusive Offer Banner Card */}
                {company.offer?.enabled !== false && (
                  <div className="bg-gradient-to-br from-purple-950 via-[#2e1065] to-slate-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-purple-500/30 w-full text-white">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black uppercase tracking-widest rounded-full mb-6">
                          <Sparkles size={14} className="text-yellow-400" /> {company.offer?.badge || "Exclusive WIPA Member Benefit"}
                        </span>
                        
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                          {company.offer?.title || "50% off Genie Pro for your first 3 months"}
                        </h3>
                        
                        <p className="text-purple-200 text-lg leading-relaxed mb-6 max-w-2xl font-medium">
                          {company.offer?.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                          <a 
                            href={company.offer?.ctaUrl || "https://www.genieai.co/partners/wipa"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-purple-50 text-purple-950 px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all text-base"
                          >
                            {company.offer?.ctaText || "Claim Your Discount"} <ArrowRight size={18} />
                          </a>
                          {company.offer?.contactEmail && (
                            <a 
                              href={`mailto:${company.offer.contactEmail}`} 
                              className="bg-purple-900/60 hover:bg-purple-900 text-white border border-purple-400/30 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-colors text-base"
                            >
                              <Mail size={18} /> Contact Partnerships
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Promo Code Box */}
                      {company.offer?.promoCode && (
                        <div className="w-full xl:w-auto shrink-0">
                          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl min-w-[280px]">
                            <span className="text-purple-300 text-xs font-black uppercase tracking-widest mb-2">
                              Checkout Promo Code
                            </span>
                            <div className="my-3 px-6 py-3 bg-black/40 rounded-2xl border border-purple-400/50 flex items-center gap-4">
                              <span className="text-3xl font-black tracking-widest text-purple-300">
                                {company.offer.promoCode}
                              </span>
                              <button 
                                onClick={() => handleCopyPromoCode(company.offer?.promoCode || 'WIPA')}
                                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                                title="Copy Promo Code"
                              >
                                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                                {copiedCode ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-xs text-purple-200/80 mt-2 font-medium">
                              Use code <strong>{company.offer.promoCode}</strong> at checkout
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Three Content Versions */}
                {company.versions && (
                  <section className="bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                          {company.name} Overview Summaries
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                          Select a summary version tailored for different communication channels:
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                        <button 
                          onClick={() => setSelectedVersion('v1')}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            selectedVersion === 'v1' 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Version 1 (Short)
                        </button>
                        <button 
                          onClick={() => setSelectedVersion('v2')}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            selectedVersion === 'v2' 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Version 2 (Standard)
                        </button>
                        <button 
                          onClick={() => setSelectedVersion('v3')}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            selectedVersion === 'v3' 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Version 3 (Detailed)
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-3xl p-8 transition-all">
                      <div className="space-y-4 whitespace-pre-line text-slate-700 dark:text-slate-200 text-base leading-relaxed font-medium">
                        <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-2">
                          {company.versions[selectedVersion]?.hint || `Summary Version: ${selectedVersion.toUpperCase()}`}
                        </span>
                        {company.versions[selectedVersion]?.text || "No summary text configured."}
                      </div>
                    </div>
                  </section>
                )}

                {/* 6. Areas of Expertise */}
                {company.services && company.services.length > 0 && (
                  <section className="bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <Shield className="text-purple-600 dark:text-purple-400" size={28} /> Areas of Expertise & Capabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.services.map((service: string, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                            <CheckCircle2 size={20} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-base md:text-lg">{service}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* PSS SOLUTIONS OVERVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'Overview' && isPss && (
              <div className="flex flex-col gap-12 w-full">
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 flex flex-col justify-between h-full gap-8 w-full">
                    <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 md:p-10 shadow-sm overflow-hidden relative w-full shrink-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col items-start">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                          {company.hero?.headline || "Transforming IP operations through strategy, technology, process and people."}
                        </h2>
                        <p className="text-lg md:text-xl font-bold text-sky-600 dark:text-sky-400 mb-8">
                          {company.hero?.subheadline || "PSS Solutions – The IP Operations Consultancy"}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl p-6 h-28 flex items-center justify-center shadow-inner shrink-0">
                            {company.logo && <img src={company.logo} alt="PSS Solutions" className="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />}
                          </div>
                          <a href={company.hero?.ctaUrl || `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-md ml-auto mt-4 sm:mt-0">
                            {company.hero?.ctaText || "Visit PSS Solutions"} <ArrowRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full shrink-0">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                        {company.about?.heading || "Independent expertise in IP operations"}
                      </h3>
                      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {company.about?.paragraphs?.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right: Nadine Connection Card */}
                  <div className="xl:col-span-1 flex flex-col justify-between h-full gap-8">
                    <div className="bg-gradient-to-br from-[#12121a] to-[#20202a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-white/10 flex flex-col justify-center shrink-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/30 to-cyan-500/30 blur-[60px] rounded-full pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col items-center text-center mb-8">
                        <div className="w-32 h-32 rounded-full border-[4px] border-white/10 overflow-hidden mb-6 shadow-xl relative">
                          <img 
                            src={company.expert?.avatar || "/Nadine Stuttle Picture.jpg"} 
                            alt={company.expert?.name || "Nadine Stuttle"} 
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-[#1a1a24] rounded-full shadow-sm"></div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-1">{company.expert?.name || "Nadine Stuttle"}</h3>
                        <p className="text-sky-400 font-bold text-sm mb-4 uppercase tracking-widest">{company.expert?.role || "Founder & CEO, PSS Solutions"}</p>
                        
                        <p className="text-white/80 font-medium text-sm leading-relaxed">
                          {company.expert?.bio || "Connect with Nadine to discuss how PSS can transform your intellectual property function."}
                        </p>
                      </div>

                      <div className="relative z-10 bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 space-y-4 text-left">
                        {company.website && (
                          <div className="flex items-start gap-4">
                            <Globe size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                            <a href={`https://${company.website}`} target="_blank" className="text-white hover:text-sky-400 text-sm font-medium transition-colors break-all">{company.website}</a>
                          </div>
                        )}
                        {company.contact?.email && (
                          <div className="flex items-start gap-4">
                            <Mail size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                            <a href={`mailto:${company.contact.email}`} className="text-white hover:text-sky-400 text-sm font-medium transition-colors break-all">{company.contact.email}</a>
                          </div>
                        )}
                        {company.contact?.phone && (
                          <div className="flex items-start gap-4">
                            <Phone size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                            <span className="text-white text-sm font-medium">{company.contact.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <a href={`mailto:${company.contact?.email || 'info@pss-solutions.com'}`} className="relative z-10 w-full bg-white text-slate-900 py-4 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-auto shrink-0">
                        <ArrowRight size={18} className="text-sky-500" /> Connect with {company.expert?.name?.split(' ')[0] || "Nadine"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* The PSS Approach / Pillars */}
                <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                    {company.pillarsTitle || "People. Structure. Strategy."}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                    {company.pillarsSubtitle || "PSS believes successful IP transformation requires more than technology alone. Its approach brings together three core elements:"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {(company.pillars || DEFAULT_PSS_CONFIG.pillars || []).map((pillar: any, idx: number) => (
                      <div key={idx} className="bg-sky-50 dark:bg-sky-900/20 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30 shadow-sm flex flex-col h-full">
                        <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center mb-6 text-sky-700 dark:text-sky-300 font-black shrink-0">
                          {pillar.number || idx + 1}
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">{pillar.title}</h4>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* ========================================================================= */}
            {/* OTHER TABS (Tech Operations, Legal AI & Features, Offer, Videos, Articles) */}
            {/* ========================================================================= */}
            {activeTab === 'Legal AI & Features' && (
              <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                    {company.featuresTitle || "Purpose-Built Legal AI Architecture"}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-4xl mb-8">
                    {company.featuresSubtitle || "Genie AI does not rely on generic chatbots. It is engineered with deep legal context, precise clause libraries, and intelligent risk detection to handle mission-critical legal and IP documents."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(company.features && company.features.length > 0 ? company.features : [
                      { title: "AI Contract Drafting", description: "Generate full, compliant agreements from scratch or bespoke clauses in seconds, tailored to your governing law and industry requirements." },
                      { title: "Automated Document Review", description: "Instantly scan inbound third-party contracts, identify non-standard clauses, flag missing protections, and highlight deal risks." },
                      { title: "Playbook & Template Standards", description: "Upload your organization's own playbooks and standard templates so Genie drafts and negotiates strictly in alignment with your corporate standards." },
                      { title: "IP Licensing & NDAs", description: "Specialized workflows for IP assignments, patent licenses, technology transfers, and multi-party non-disclosure agreements." },
                      { title: "Cross-Border Jurisdictions", description: "Coverage across 150+ legal jurisdictions and 40+ languages, helping international teams negotiate global agreements with confidence." },
                      { title: "Enterprise Grade Security", description: "Confidentiality guaranteed. Your data is isolated, encrypted in transit and at rest, and never used to train public LLM models." }
                    ]).map((feature: any, idx: number) => (
                      <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex flex-col justify-between h-full">
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 font-black mb-4">
                            {idx + 1}
                          </div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{feature.description || feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Tech Operations' && isPss && (
              <div className="flex flex-col gap-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 md:p-12 shadow-sm relative overflow-hidden w-full">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                      {company.featuresTitle || "Transforming IP operations through strategy, technology, process and people."}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-4xl">
                      {company.featuresSubtitle || "Explore PSS Solutions' specialist services designed to help IP teams improve operational performance, adopt the right technology, manage costs and successfully deliver organisational change."}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">How PSS Can Support Your IP Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {(company.features && company.features.length > 0 ? company.features : [
                      { title: "Strategic IP Operations", subtitle: "Assess and transform the way your IP function operates.", description: "PSS reviews existing operations, processes and technology to identify opportunities for improvement and develop an actionable transformation roadmap." },
                      { title: "IP Technology Advisory", subtitle: "Make better technology decisions for your IP function.", description: "PSS helps organisations evaluate their existing technology, identify what is genuinely missing, select suitable IP technology and support implementation." },
                      { title: "IP Spend Management", subtitle: "Gain greater visibility and control over IP expenditure.", description: "PSS works with in-house legal teams, general counsel and senior management to analyse IP spend, identify cost-saving opportunities, and benchmark expenditure." },
                      { title: "IP Data Analytics", subtitle: "Turn IP data into better business decisions.", description: "PSS supports organisations with data audits, analytics and reporting frameworks, alongside data governance, compliance, and security." },
                      { title: "IP Project & Change Management", subtitle: "Successfully deliver complex IP transformation projects.", description: "PSS provides structured project and change management support, including requirements definition, project roadmaps, and stakeholder engagement." },
                      { title: "Training & Upskilling", subtitle: "Prepare your people for changing IP operations.", description: "PSS provides tailored training designed around the needs of individual teams, helping organisations bridge knowledge gaps." }
                    ]).map((svc: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors">{svc.title}</h4>
                          {svc.subtitle && <p className="text-sky-600 dark:text-sky-400 font-bold text-sm mb-4">{svc.subtitle}</p>}
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{svc.description || svc.desc}</p>
                        </div>
                        <a href={company.hero?.ctaUrl || "https://www.pss-solutions.com"} target="_blank" className="text-sky-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm mt-auto w-max">
                          Explore Service <ArrowRight size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'WIPA Exclusive Offer' && (
              <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-[#2e1065] via-purple-950 to-black rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-purple-500/30 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                  <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black uppercase tracking-widest rounded-full mb-6">
                      <Gift size={15} /> {company.offer?.badge || "Exclusive Partner Discount"}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                      {company.offer?.title || "50% Off Genie Pro for 3 Months"}
                    </h2>
                    <p className="text-purple-200 text-lg md:text-xl font-medium leading-relaxed mb-8">
                      {company.offer?.description || "Through its partnership with Women's IP Alliance, you get 50% off Genie Pro for your first three months."}
                    </p>

                    <div className="p-6 bg-white/10 rounded-2xl border border-white/20 mb-8 space-y-4">
                      <h4 className="text-lg font-black text-white">How to Redeem:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-purple-200 font-medium text-base">
                        {company.offer?.steps && company.offer.steps.length > 0 ? (
                          company.offer.steps.map((st: string, i: number) => (
                            <li key={i}>{st}</li>
                          ))
                        ) : (
                          <>
                            <li>Visit the partner landing page: <a href={company.offer?.ctaUrl || "https://www.genieai.co/partners/wipa"} target="_blank" className="underline font-bold text-white">{company.offer?.ctaUrl || "genieai.co/partners/wipa"}</a></li>
                            <li>Sign up for an account with your business email.</li>
                            <li>Enter promo code <strong>{company.offer?.promoCode || "WIPA"}</strong> at checkout.</li>
                            <li>Enjoy your exclusive member rate!</li>
                          </>
                        )}
                      </ol>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a 
                        href={company.offer?.ctaUrl || "https://www.genieai.co/partners/wipa"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-purple-50 text-purple-950 px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all text-lg"
                      >
                        {company.offer?.ctaText || "Claim Discount Now"} <ArrowRight size={18} />
                      </a>
                      {company.offer?.contactEmail && (
                        <a 
                          href={`mailto:${company.offer.contactEmail}`} 
                          className="bg-purple-900/50 hover:bg-purple-900 text-white border border-purple-400/30 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 text-lg transition-colors"
                        >
                          <Mail size={18} /> Contact Partnerships
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Videos' && company.videos && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {company.videos.map((video: any) => (
                  <div key={video.id} className="bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => setSelectedVideo(video.id)}>
                    <div className="relative aspect-video overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform">
                          <Play size={24} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Articles' && company.articles && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {company.articles.map((article: any) => (
                  <Link href={`#`} key={article.id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-sky-500 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center font-bold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
                        Read Article <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'Webinars' && company.webinars && (
              <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {company.webinars.map((webinar: any) => (
                  <div key={webinar.id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row">
                    <div className="relative md:w-1/3 aspect-video md:aspect-auto overflow-hidden shrink-0">
                      <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-max ${webinar.status === 'Upcoming' ? 'bg-sky-500 text-white' : 'bg-slate-700/80 text-slate-300 backdrop-blur-md'}`}>
                          {webinar.status === 'Upcoming' ? <Calendar size={14} /> : <Video size={14} />}
                          {webinar.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-6 text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-sky-500" />
                          {webinar.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-sky-500" />
                          {webinar.time}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-sky-500 transition-colors leading-tight">
                        {webinar.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {webinar.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-white/5 gap-6">
                        <div className="flex items-center gap-4">
                          {webinar.speakers?.map((speaker: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={speaker.avatar} alt={speaker.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#0f172a] shadow-sm" />
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{speaker.name}</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">{speaker.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${webinar.status === 'Upcoming' ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg hover:shadow-sky-500/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                          {webinar.status === 'Upcoming' ? 'Register Now' : 'Watch Recording'} <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Events' && company.events && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {company.events.map((evt: any) => (
                  <div key={evt.id} className="bg-white dark:bg-[#0B1221] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group flex flex-col sm:flex-row">
                    <div className="bg-slate-50 dark:bg-[#131E32] w-full sm:w-40 flex flex-col items-center justify-center p-8 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-[#1E293B] shrink-0 transition-colors group-hover:dark:bg-[#1A263D]">
                      <span className="text-sm font-black text-sky-500 uppercase tracking-[0.2em] mb-2">{evt.date.split(' ')[0]}</span>
                      <span className="text-5xl font-black text-slate-900 dark:text-white">{evt.date.split(' ')[1]}</span>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-6 text-[11px] font-black text-sky-500 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-2"><MapPin size={14} /> {evt.location}</span>
                        <span className="flex items-center gap-2"><Globe size={14} /> {evt.type}</span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-sky-400 transition-colors leading-tight">
                        {evt.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                        {evt.description}
                      </p>
                      
                      <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-slate-100 dark:border-[#1E293B]">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{evt.fullDate}</span>
                        <button className="text-sky-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm w-max">
                          View Details <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
          
        </div>
      </div>
      
      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}></div>
          <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video z-10 animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>
            <video 
              src="https://www.w3schools.com/html/mov_bbb.mp4" 
              autoPlay 
              controls 
              className="w-full h-full object-contain"
            ></video>
          </div>
        </div>
      )}
    </div>
  );
}
