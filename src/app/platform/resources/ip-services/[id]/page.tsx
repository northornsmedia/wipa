'use client';

import React, { use } from 'react';
import { ArrowLeft, ArrowRight, Building, MapPin, Globe, Mail, Phone, Shield, FileText, CheckCircle2, Quote, Users, Map, Play, X, Calendar, Clock, Video } from 'lucide-react';
import Link from 'next/link';

// Using the same mock data to find the specific company
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
  const company = MOCK_COMPANIES.find(c => c.id === resolvedParams.id) || MOCK_COMPANIES[0];
  const [activeTab, setActiveTab] = React.useState('Overview');
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  const TABS = ['Overview', 'Tech Operations', 'Videos', 'Articles', 'Webinars', 'Events'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden pb-20">
      
      {/* Cinematic Header */}
      <div className="relative min-h-[480px] w-full flex flex-col justify-end pb-16 pt-40 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-slate-100 dark:from-[#082f49] dark:via-[#020617] dark:to-black z-0"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-300/30 dark:bg-sky-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
        
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-start justify-end h-full">
          <Link href="/platform/resources/ip-services" className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold mb-10 hover:-translate-x-1 transition-transform">
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
                <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-sm backdrop-blur-sm">
                  Sponsored Partner
                </div>
              )}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
                {company.name}
              </h1>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold text-lg">
                <MapPin size={20} className="text-sky-500" /> {company.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar py-6">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-2xl md:text-3xl font-black whitespace-nowrap transition-colors duration-300 tracking-tight ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        <div className={`grid grid-cols-1 gap-8 ${company.id === 'pss-solutions' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          
          {/* Main Content */}
          <div className={`${company.id === 'pss-solutions' ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-12`}>
            
            {activeTab === 'Overview' && company.id === 'pss-solutions' && (
              <div className="flex flex-col gap-12 w-full">
                
                {/* Top Section: Hero + About + Nadine */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left: Hero & About */}
                  <div className="xl:col-span-2 flex flex-col justify-between h-full gap-8 w-full">
                    {/* 1. Hero / Banner */}
                    <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 md:p-10 shadow-sm overflow-hidden relative w-full shrink-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col items-start">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                          Transforming IP operations through strategy, technology, process and people.
                        </h2>
                        <p className="text-lg md:text-xl font-bold text-sky-600 dark:text-sky-400 mb-8">
                          PSS Solutions – The IP Operations Consultancy
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl p-6 h-28 flex items-center justify-center shadow-inner shrink-0">
                            <img src={company.logo} alt="PSS Solutions" className="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-md ml-auto mt-4 sm:mt-0">
                            Visit PSS Solutions <ArrowRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* 2. About PSS Solutions */}
                    <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full shrink-0">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                        Independent expertise in IP operations
                      </h3>
                      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        <p>PSS Solutions is an independent consulting and advisory firm dedicated to IP operations. The company supports organisations seeking to transform, optimise and modernise the way their intellectual property functions operate.</p>
                        <p>PSS combines specialist IP industry knowledge with operational, technology and transformation expertise, helping organisations navigate change and build more efficient and sustainable IP operating models. PSS describes itself as fully independent, allowing its consultants to provide impartial advice rather than being tied to particular technology vendors or service providers.</p>
                      </div>
                    </section>
                  </div>

                  {/* Right: Nadine Connection Sidebar Card */}
                  <div className="xl:col-span-1 flex flex-col justify-between h-full gap-8">
                    <div className="bg-gradient-to-br from-[#12121a] to-[#20202a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-white/10 flex flex-col justify-center shrink-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/30 to-cyan-500/30 blur-[60px] rounded-full pointer-events-none"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                      
                      <div className="relative z-10 flex flex-col items-center text-center mb-8">
                        <div className="w-32 h-32 rounded-full border-[4px] border-white/10 overflow-hidden mb-6 shadow-xl relative">
                          <img 
                            src="/Nadine Stuttle Picture.jpg" 
                            alt="Nadine Stuttle" 
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-[#1a1a24] rounded-full shadow-sm"></div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-1">Nadine Stuttle</h3>
                        <p className="text-sky-400 font-bold text-sm mb-4 uppercase tracking-widest">Founder & CEO, PSS Solutions</p>
                        
                        <p className="text-white/80 font-medium text-sm leading-relaxed">
                          Connect with Nadine to discuss how PSS can transform your intellectual property function.
                        </p>
                      </div>

                      <div className="relative z-10 bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 space-y-4 text-left">
                        <div className="flex items-start gap-4">
                          <Globe size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                          <a href={`https://${company.website}`} target="_blank" className="text-white hover:text-sky-400 text-sm font-medium transition-colors break-all">{company.website}</a>
                        </div>
                        {company.contact && (
                          <>
                            <div className="flex items-start gap-4">
                              <Mail size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                              <a href={`mailto:${company.contact.email}`} className="text-white hover:text-sky-400 text-sm font-medium transition-colors break-all">{company.contact.email}</a>
                            </div>
                            <div className="flex items-start gap-4">
                              <Phone size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                              <span className="text-white text-sm font-medium">{company.contact.phone}</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <MapPin size={20} className="text-sky-400 shrink-0 mt-0.5" /> 
                              <span className="text-white text-sm font-medium leading-relaxed">{company.contact.address}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <button className="relative z-10 w-full bg-white text-slate-900 py-4 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-auto shrink-0">
                        <ArrowRight size={18} className="text-sky-500" /> Connect with Nadine
                      </button>
                    </div>

                    {company.locations && (
                      <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg shrink-0">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                          <Map className="text-sky-500" size={24} /> Global Presence
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {company.locations.map((loc: string, idx: number) => (
                            <span key={idx} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold border border-slate-200 dark:border-white/5">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* The Rest spans FULL WIDTH */}

                {/* 3. The PSS Approach */}
                <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                    People. Structure. Strategy.
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                    PSS believes successful IP transformation requires more than technology alone. Its approach brings together three core elements:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30 shadow-sm flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center mb-6 text-sky-700 dark:text-sky-300 font-black shrink-0">1</div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">People</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Ensuring teams have the knowledge, skills and support required to successfully adopt and sustain change.</p>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30 shadow-sm flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center mb-6 text-sky-700 dark:text-sky-300 font-black shrink-0">2</div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">Structure</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Developing the right processes, governance and operational framework to support an effective IP function.</p>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30 shadow-sm flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center mb-6 text-sky-700 dark:text-sky-300 font-black shrink-0">3</div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">Strategy</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Creating a clear direction and roadmap aligned with the organisation's objectives and future requirements.</p>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-bold mt-8 italic border-l-4 border-sky-500 pl-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-r-xl w-full">
                    PSS positions this combination of people, structure and strategy as central to achieving sustainable and profitable IP operations.
                  </p>
                </section>

                {/* 4. What PSS Helps Organisations Achieve */}
                <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                    Supporting Better IP Operations
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                    PSS works with organisations to help them:
                  </p>
                  <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8 w-full">
                    {[
                      "Improve operational efficiency",
                      "Transform outdated IP processes",
                      "Make more informed technology decisions",
                      "Optimise IP expenditure and supplier relationships",
                      "Improve the use and management of IP data",
                      "Successfully manage operational and organisational change",
                      "Build stronger skills and capabilities within IP teams"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold text-lg bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={24} /> {item}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setActiveTab('Tech Operations')}
                    className="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors w-max"
                  >
                    Explore Tech Operations <ArrowRight size={16} />
                  </button>
                </section>

                {/* 5. IP Operations Expertise & Why PSS? */}
                <div className="flex flex-col gap-12 w-full">
                  <section className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm w-full">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                      Specialist Experience. Global Perspective.
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                      PSS works through a team of experienced IP operations specialists with backgrounds spanning corporate IP departments, private practice, legal operations, technology and major transformation programmes. Its consultants have supported projects internationally, including across Europe, Asia-Pacific and the United States.
                    </p>
                    <button 
                      onClick={() => setActiveTab('Meet the Experts')}
                      className="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors w-max"
                    >
                      Meet the PSS Experts <ArrowRight size={16} />
                    </button>
                  </section>

                  <section className="w-full">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                      Why PSS?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                          <Shield className="text-sky-500 shrink-0" size={24} /> Independent
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">PSS is not tied to particular technology vendors, enabling recommendations to be based on the organisation's actual requirements.</p>
                      </div>
                      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                          <CheckCircle2 className="text-sky-500 shrink-0" size={24} /> IP Focused
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Its consulting work is specifically centred around IP operations and transformation.</p>
                      </div>
                      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                          <Globe className="text-sky-500 shrink-0" size={24} /> Experienced
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">The team brings extensive experience across IP operations, technology, legal operations and organisational transformation.</p>
                      </div>
                      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                          <ArrowRight className="text-sky-500 shrink-0" size={24} /> Transformation
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">PSS looks beyond individual tools or processes to address the wider operating model, including people, processes, technology and change.</p>
                      </div>
                    </div>
                  </section>
                </div>

              </div>
            )}

            {activeTab === 'Overview' && company.id !== 'pss-solutions' && (
              <>
                {/* Quote Banner */}
                {company.quote && (
                  <div className="relative p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-sky-500 to-cyan-500 text-white overflow-hidden shadow-2xl shadow-sky-500/20 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <Quote size={80} className="absolute -top-4 -left-4 text-white/10 rotate-180 group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-2xl md:text-3xl font-black leading-snug relative z-10 mb-6 italic tracking-tight text-white/95">
                      "{company.quote}"
                    </h3>
                  </div>
                )}

                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="text-sky-500" size={28} /> Our Philosophy
                  </h2>
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                    {company.description}
                  </div>
                </section>

                {company.services && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Shield className="text-sky-500" size={28} /> Areas of Expertise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.services.map((service: string, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center shrink-0 group-hover:bg-sky-500 transition-colors duration-300">
                            <CheckCircle2 size={20} className="text-sky-500 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{service}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {company.team && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Users className="text-sky-500" size={28} /> Key Operations Experts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {company.team.map((member: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 flex items-center gap-5 hover:shadow-lg transition-shadow">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl font-black text-slate-500 dark:text-slate-300 shadow-inner">
                            {member.initials}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-slate-900 dark:text-white">{member.name}</h4>
                            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
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
                          {webinar.speakers.map((speaker: any, idx: number) => (
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

            {activeTab === 'Tech Operations' && company.id === 'pss-solutions' && (
              <div className="flex flex-col gap-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 md:p-12 shadow-sm relative overflow-hidden w-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                      Transforming IP operations through strategy, technology, process and people.
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-4xl">
                      Explore PSS Solutions' specialist services designed to help IP teams improve operational performance, adopt the right technology, manage costs and successfully deliver organisational change. PSS takes a holistic approach to IP operations, bringing together people, structure and strategy rather than treating technology as a solution in isolation.
                    </p>
                  </div>
                </div>

                {/* Services Section */}
                <div className="w-full">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">How PSS Can Support Your IP Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[
                      {
                        title: "Strategic IP Operations",
                        subtitle: "Assess and transform the way your IP function operates.",
                        desc: "PSS reviews existing operations, processes and technology to identify opportunities for improvement and develop an actionable transformation roadmap. This includes process optimisation, governance, technology integration, change management and identifying achievable “quick wins”."
                      },
                      {
                        title: "IP Technology Advisory",
                        subtitle: "Make better technology decisions for your IP function.",
                        desc: "PSS helps organisations evaluate their existing technology, identify what is genuinely missing, select suitable IP technology and support implementation. As an independent advisory firm, PSS states that it is not tied to technology vendors, allowing recommendations to be based on the organisation's requirements."
                      },
                      {
                        title: "IP Spend Management",
                        subtitle: "Gain greater visibility and control over IP expenditure.",
                        desc: "PSS works with in-house legal teams, general counsel and senior management to analyse IP spend, identify cost-saving opportunities, benchmark expenditure, improve outside counsel management and establish performance metrics and KPIs."
                      },
                      {
                        title: "IP Data Analytics",
                        subtitle: "Turn IP data into better business decisions.",
                        desc: "PSS supports organisations with data audits, analytics and reporting frameworks, alongside data governance, compliance, security and the management of IP data across jurisdictions."
                      },
                      {
                        title: "IP Project & Change Management",
                        subtitle: "Successfully deliver complex IP transformation projects.",
                        desc: "PSS provides structured project and change management support, including requirements definition, project roadmaps, stakeholder engagement, implementation and organisational change — with a focus on delivering projects within agreed time and budget parameters."
                      },
                      {
                        title: "Training & Upskilling",
                        subtitle: "Prepare your people for changing IP operations.",
                        desc: "PSS provides tailored training designed around the needs of individual teams, helping organisations bridge knowledge gaps, develop new skills and support employees through operational and technological change."
                      },
                      {
                        title: "IP Procurement",
                        subtitle: "Specialist support for procurement within the IP environment.",
                        desc: "PSS lists IP Procurement as one of its core IP operations services. This can have its own service card and link through to further information or an enquiry with the PSS team."
                      }
                    ].map((svc, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors">{svc.title}</h4>
                          <p className="text-sky-600 dark:text-sky-400 font-bold text-sm mb-4">{svc.subtitle}</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{svc.desc}</p>
                        </div>
                        <button className="text-sky-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm mt-auto w-max">
                          Explore Service <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusive Benefit Banner */}
                <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0B1221] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-500/20 w-full">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-xs uppercase tracking-widest rounded-full mb-6">
                        Exclusive for WIPA Members
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                        Access preferential rates on selected PSS Solutions services.
                      </h3>
                      <p className="text-indigo-200 text-lg mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                        Women's IP Alliance members can access an exclusive PSS member benefit when engaging PSS for selected IP operations and advisory services.
                      </p>
                      <button className="bg-white text-indigo-950 px-8 py-4 rounded-xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto lg:mx-0 w-max">
                        Claim Your Member Benefit <ArrowRight size={18} />
                      </button>
                      <p className="text-indigo-300/60 text-xs mt-6 max-w-xl mx-auto lg:mx-0">
                        Available to eligible Women's IP Alliance members. Applicable services and terms to be agreed with PSS Solutions.
                      </p>
                    </div>
                    
                    <div className="w-full lg:w-auto shrink-0">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl text-center shadow-inner">
                        <p className="text-indigo-300 font-bold text-sm uppercase tracking-widest mb-3">WIPA Member Benefit:</p>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-2">
                          [X]%
                        </div>
                        <p className="text-white font-bold text-lg">exclusive member discount<br/>/ preferential rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'Overview' && activeTab !== 'Tech Operations' && activeTab !== 'Videos' && activeTab !== 'Articles' && activeTab !== 'Webinars' && activeTab !== 'Events' && (
              <div className="py-20 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-slate-900/20 rounded-[2rem] border border-slate-200 dark:border-white/5 border-dashed">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No {activeTab} Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-sm">
                  {company.name} hasn't uploaded any {activeTab.toLowerCase()} to their profile at this time.
                </p>
              </div>
            )}
            
          </div>

          {/* Sidebar */}
          {company.id !== 'pss-solutions' && (
            <div className="space-y-8 lg:sticky lg:top-28 self-start">
              
              <div className="p-8 rounded-[2rem] bg-sky-500 text-white shadow-2xl shadow-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <h3 className="text-3xl font-black mb-8 relative z-10 tracking-tight">Contact & Connect</h3>
                
                <div className="space-y-6 font-medium relative z-10 text-lg">
                  <div className="flex items-start gap-4">
                    <Globe size={24} className="text-sky-200 shrink-0 mt-1" /> 
                    <a href={`https://${company.website}`} target="_blank" className="hover:text-white hover:underline underline-offset-4">{company.website}</a>
                  </div>
                  {company.contact && (
                    <>
                      <div className="flex items-start gap-4">
                        <Mail size={24} className="text-sky-200 shrink-0 mt-1" /> 
                        <a href={`mailto:${company.contact.email}`} className="hover:text-white hover:underline underline-offset-4">{company.contact.email}</a>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone size={24} className="text-sky-200 shrink-0 mt-1" /> 
                        {company.contact.phone}
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin size={24} className="text-sky-200 shrink-0 mt-1" /> 
                        <span className="leading-snug">{company.contact.address}</span>
                      </div>
                    </>
                  )}
                </div>

                <button className="w-full mt-10 bg-white text-sky-600 font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 text-lg">
                  Request Consultation
                </button>
              </div>

              {company.locations && (
                <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-lg">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                    <Map className="text-sky-500" size={24} /> Global Presence
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.locations.map((loc: string, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold border border-slate-200 dark:border-white/5">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
          
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
