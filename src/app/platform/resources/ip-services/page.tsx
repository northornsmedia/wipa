'use client';

import React from 'react';
import { ArrowRight, Building2, Sparkles, ListPlus, ShieldCheck, Globe2, Layers3 } from 'lucide-react';
import Link from 'next/link';
import SplashSponsoredBanner from '@/components/SplashSponsoredBanner';
import PssSponsorIntro from '@/components/PssSponsorIntro';
import { supabase } from '@/lib/supabase';

const DEFAULT_IP_SERVICES = [
  {
    id: "821d981f-54f5-4d57-976f-6fd1cb998022",
    title: "Tech Operations (PSS)",
    description: "Transforming IP operations through strategy, technology, process and people.",
    type: "ip_services",
    url: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
    category: "tech-operations",
    slug: "pss-solutions",
    subcategory: "Tech Operations"
  },
  {
    id: "3022bf12-b177-4387-a478-1e86178adda2",
    title: "Tech Way (AIP Genius)",
    description: "Explore AI, technology and innovation transforming the way intellectual property professionals work.",
    type: "ip_services",
    url: "",
    category: "tech-way",
    subcategory: "AI & Automation"
  },
  {
    id: "92eb3db7-9c95-4c01-ad32-f5c3fbe07538",
    title: "Future Service Hub (Partner Company)",
    description: "Additional specialist IP service providers can be added as the platform develops.",
    type: "ip_services",
    url: "",
    category: "future-service-hub",
    subcategory: "Service Hub"
  },
  {
    id: "6fdbf611-53d1-4dac-a7d6-d3484de1d0e2",
    title: "Patent Docketing & Annuity Management",
    description: "End-to-end IP renewals, annuity payment automation, docketing audits, and global patent lifecycle management.",
    type: "ip_services",
    category: "ip-services",
    subcategory: "Patent Operations"
  },
  {
    id: "16be8056-cbd7-4c68-a2b9-75d10b94c173",
    title: "IP Valuation & Commercialisation",
    description: "Comprehensive intellectual property valuation, M&A due diligence, tech licensing strategy, and monetization frameworks.",
    type: "ip_services",
    category: "ip-services",
    subcategory: "Strategy & Valuation"
  },
  {
    id: "7faa2b14-2039-419d-a66d-cf0e2ef2175a",
    title: "Global Trademark & Brand Protection",
    description: "AI-powered trademark clearance, multi-jurisdiction brand monitoring, anti-counterfeiting, and online domain enforcement.",
    type: "ip_services",
    category: "ip-services",
    subcategory: "Brand Enforcement"
  }
];

export default function IPServicesPage() {
  const [showIntro, setShowIntro] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [ipServices, setIpServices] = React.useState<any[]>(DEFAULT_IP_SERVICES);
  const [splashServices, setSplashServices] = React.useState<any[]>([]);

  const handleDismissSplash = () => {
    setFadeOut(true);
    setTimeout(() => setShowIntro(false), 300);
  };

  React.useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .or('type.eq.ip_services,category.eq.ip-services,category.eq.tech-operations,category.eq.tech-way,category.eq.future-service-hub')
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        const now = new Date();
        const splash: any[] = [];
        const normal: any[] = [];

        data.forEach(item => {
          // Check if splash sponsored and not expired
          if (
            item.is_splash_sponsored && 
            item.splash_expires_at && 
            new Date(item.splash_expires_at) > now
          ) {
            splash.push(item);
          }
          normal.push(item);
        });

        // Ensure PSS is strictly first at index 0
        const pssIndex = normal.findIndex(s => 
          s.slug === 'pss-solutions' || 
          s.title?.toLowerCase().includes('pss') || 
          s.category === 'tech-operations'
        );
        
        let sorted = [...normal];
        if (pssIndex > 0) {
          const [pssItem] = sorted.splice(pssIndex, 1);
          sorted.unshift(pssItem);
        }

        setSplashServices(splash);
        setIpServices(sorted);
      }
    };
    
    fetchServices();
    const timer1 = setTimeout(() => setFadeOut(true), 4700);
    const timer2 = setTimeout(() => setShowIntro(false), 5100);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-20">
      
      {/* PSS sponsor intro keeps the brand wordmark visible throughout the animation. */}
      {showIntro && (
        <PssSponsorIntro fading={fadeOut} onDismiss={handleDismissSplash} />
      )}
      
      {/* Top Hero Section */}
      <div className="relative w-full border-b border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0b1120]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/20 dark:bg-sky-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12">
          <Link
            href="/platform/resources/ip-services/list"
            className="absolute right-4 top-4 z-20 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-sky-600/20 transition-all hover:-translate-y-0.5 hover:bg-sky-700 active:scale-95 sm:right-6 sm:top-5 sm:px-6 sm:py-3 sm:text-sm lg:right-8"
          >
            <ListPlus size={18} /> List Your IP Service
          </Link>
          
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-sm md:text-base font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-4 flex items-center justify-center lg:justify-start gap-2">
               IP SERVICES
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-6 text-slate-900 dark:text-white max-w-3xl">
              Discover Specialist IP Services, Technology & Solutions
            </h1>
            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Explore trusted service providers, innovative technologies and specialist solutions supporting intellectual property professionals worldwide.
              </p>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                This page is sponsored by PSS Solutions — an independent IP operations consultancy specialising in strategy, technology and process for corporate legal and IP teams.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <ShieldCheck size={15} className="text-sky-600 dark:text-sky-400" /> Independent advice
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Layers3 size={15} className="text-sky-600 dark:text-sky-400" /> IP-specialist expertise
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Globe2 size={15} className="text-sky-600 dark:text-sky-400" /> Global support
              </span>
            </div>
          </div>

          {/* Right Side - Sponsor Banner (Full Card Clickable) */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
            <Link 
              href="/platform/resources/ip-services/pss-solutions" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1.5 w-full max-w-[480px] flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full relative z-10 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Sponsored by
              </span>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                PSS Solutions
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] w-full flex items-center justify-center border border-slate-100 dark:border-white/5 mb-8 shadow-inner h-40 relative z-10 group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src="https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg" 
                  alt="PSS Solutions Logo" 
                  className="max-w-[180px] object-contain drop-shadow-sm" 
                />
              </div>

              <div className="text-sky-600 dark:text-sky-400 font-bold text-base flex items-center gap-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors relative z-10">
                <span>View Sponsor Profile</span>
                <ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Splash Banners */}
        {splashServices.length > 0 && (
          <div className="mb-16">
            {splashServices.map(service => (
              <SplashSponsoredBanner 
                key={`splash-${service.id}`}
                id={service.id}
                title={service.title}
                logoUrl={service.url}
                tagline={service.splash_tagline || ''}
                ctaText={service.splash_cta_text || 'Learn More'}
                ctaUrl={service.splash_cta_url || '#'}
                bgColor={service.splash_background_color || '#0ea5e9'}
              />
            ))}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              <span className="h-px w-7 bg-sky-500" /> Service directory
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-white">Explore trusted IP partners</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">Specialist providers supporting modern IP teams across operations, technology, strategy and protection.</p>
          </div>
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-100 px-1.5 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">{ipServices.length}</span>
            Available services
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          
          {ipServices.map((service, index) => {
            const isSponsored = index === 0;
            const cardHref = service.slug === 'pss-solutions' || service.id === '821d981f-54f5-4d57-976f-6fd1cb998022' 
              ? '/platform/resources/ip-services/pss-solutions' 
              : `/platform/resources/ip-services/${service.slug || service.id}`;

            if (isSponsored) {
              return (
                <Link
                  key={service.id}
                  href={cardHref}
                  className="group relative bg-white dark:bg-[#0B1221] rounded-[2rem] border-2 border-sky-400/40 dark:border-sky-500/30 overflow-hidden flex flex-col md:col-span-2 lg:col-span-2 min-h-[420px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-xl dark:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.2)]"
                >
                  <div className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600" />
                  {/* Glowing ambient gradient */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/25 via-blue-500/15 to-transparent blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] dark:opacity-[0.12] mix-blend-overlay"></div>
                  
                  <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 dark:bg-white/5 backdrop-blur-md shadow-lg border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          {service.url ? (
                            <img src={service.url} alt={service.title} className="max-w-[42px] max-h-[42px] object-contain relative z-10 drop-shadow-sm" />
                          ) : (
                            <Building2 size={30} className="text-sky-500 relative z-10" />
                          )}
                        </div>

                        <div>
                          <div className="inline-block px-3 py-1 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/20 rounded-full">
                            <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em]">
                              {service.subcategory || service.category || 'Tech Operations'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sponsored Gold/Sky Badge */}
                      <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles size={13} className="fill-slate-950" /> Sponsored Partner
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                      <div className="md:col-span-2">
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-sky-500 transition-colors drop-shadow-sm">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex flex-col justify-center bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                          Service Capability
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                          Enterprise IP Operating Models, Technology Transformation & Impartial Advisory.
                        </p>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck size={15} /> Verified IP Consultancy
                      </span>

                      <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors uppercase tracking-widest">
                        Explore Full Profile <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 text-sky-500" />
                      </div>
                    </div>

                  </div>
                </Link>
              );
            }

            // Normal single-width card
            return (
              <Link 
                key={service.id}
                href={cardHref}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-sky-300 hover:shadow-2xl dark:border-white/5 dark:bg-[#0B1221] dark:hover:border-sky-500/25 dark:hover:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]"
              >
                <div className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-500 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
                {/* Branded Abstract Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-cyan-500/20 blur-[70px] rounded-full pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02] dark:opacity-[0.1] mix-blend-overlay"></div>
                
                <div className="relative z-10 flex h-full flex-col p-8 md:p-9">
                  
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 dark:bg-white/5 backdrop-blur-md shadow-lg border border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      {service.url ? (
                        <img src={service.url} alt={service.title} className="max-w-[40px] max-h-[40px] object-contain relative z-10 drop-shadow-sm" />
                      ) : (
                        <Building2 size={28} className="text-slate-400 dark:text-slate-300 relative z-10" />
                      )}
                    </div>
                    <span className="text-5xl font-black tracking-[-0.06em] text-slate-100 transition-colors group-hover:text-sky-100 dark:text-white/5 dark:group-hover:text-sky-400/10">0{index + 1}</span>
                  </div>

                  <div className="relative z-10 mt-8 flex flex-1 flex-col">
                    <div className="mb-4 inline-block w-max rounded-full border border-slate-200 bg-slate-100 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                      <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em]">
                        {service.subcategory || service.category || 'IP Operations'}
                      </p>
                    </div>
                    <h3 className="mb-3 line-clamp-2 text-2xl font-black leading-tight text-slate-900 transition-colors group-hover:text-sky-600 md:text-3xl dark:text-white dark:group-hover:text-sky-400">
                      {service.title}
                    </h3>
                    
                    <p className="line-clamp-3 text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                      {service.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6 dark:border-white/5">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-700 transition-colors group-hover:text-sky-600 dark:text-slate-200 dark:group-hover:text-sky-400">Explore Profile</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:bg-sky-600 group-hover:text-white dark:bg-white/5 dark:text-slate-300">
                        <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                  
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}
