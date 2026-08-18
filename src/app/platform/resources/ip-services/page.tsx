'use client';

import React from 'react';
import { ArrowRight, Building2, Sparkles, MonitorSmartphone, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";
import SplashSponsoredBanner from '@/components/SplashSponsoredBanner';
import { supabase } from '@/lib/supabase';

export default function IPServicesPage() {
  const [showIntro, setShowIntro] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [ipServices, setIpServices] = React.useState<any[]>([]);
  const [splashServices, setSplashServices] = React.useState<any[]>([]);

  const handleDismissSplash = () => {
    setFadeOut(true);
    setTimeout(() => setShowIntro(false), 300);
  };

  React.useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('type', 'ip_services');

      if (data) {
        const now = new Date();
        const splash = [];
        const normal = [];

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

        setSplashServices(splash);
        setIpServices(normal);
      }
    };
    
    fetchServices();
    const timer1 = setTimeout(() => setFadeOut(true), 2400);
    const timer2 = setTimeout(() => setShowIntro(false), 2800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-20">
      
      {/* CanvasText Splash Screen (Viewport-centered within main content area) */}
      {showIntro && (
        <div 
          onClick={handleDismissSplash}
          className={`fixed top-[73px] bottom-0 right-0 left-0 lg:left-[260px] z-30 bg-[#020617] flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-500 ${fadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        >
          {/* Ambient Glow */}
          <div className="absolute w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Skip Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleDismissSplash(); }}
            className="absolute top-6 right-6 z-50 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors backdrop-blur-sm"
          >
            Skip
          </button>

          <div className="relative z-10 flex flex-col items-center justify-center p-4">
            <h2 className={cn("group relative mx-auto text-center text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-2")}>
              <span className="text-slate-300">Sponsored by</span>
              <CanvasText
                text="PSS Solutions"
                className="font-black"
                colors={[
                  "#38bdf8",
                  "#0ea5e9",
                  "#0284c7",
                  "#60a5fa",
                  "#818cf8",
                  "#a78bfa",
                  "#38bdf8",
                  "#06b6d4"
                ]}
                lineGap={6}
                lineWidth={2.2}
                curveIntensity={45}
                animationDuration={4}
              />
            </h2>
          </div>
        </div>
      )}
      
      {/* Top Hero Section */}
      <div className="relative w-full border-b border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0b1120]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/20 dark:bg-sky-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12">
          
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
          </div>

          {/* Right Side - Sponsor Banner */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-[480px] flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full relative z-10">
                Sponsored by
              </span>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 relative z-10">
                PSS Solutions
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] w-full flex items-center justify-center border border-slate-100 dark:border-white/5 mb-8 shadow-inner h-40 relative z-10">
                <img 
                  src="https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg" 
                  alt="PSS Solutions Logo" 
                  className="max-w-[180px] object-contain drop-shadow-sm" 
                />
              </div>

              <Link href="/platform/resources/ip-services/pss-solutions" className="text-sky-600 dark:text-sky-400 font-bold text-base flex items-center gap-2 hover:text-sky-700 dark:hover:text-sky-300 transition-colors relative z-10">
                View Sponsor Profile <ArrowRight size={20} />
              </Link>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {ipServices.map(service => (
            <Link 
              key={service.id}
              href={`/platform/resources/ip-services/${service.id}`}
              className="group relative bg-white dark:bg-[#0B1221] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col h-[420px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)] dark:hover:border-white/10"
            >
              {/* Branded Abstract Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-cyan-500/20 blur-[70px] rounded-full pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`}></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02] dark:opacity-[0.1] mix-blend-overlay"></div>
              
              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-auto">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 dark:bg-white/5 backdrop-blur-md shadow-lg border border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    {service.url ? (
                      <img src={service.url} alt={service.title} className="max-w-[40px] max-h-[40px] object-contain relative z-10 drop-shadow-sm" />
                    ) : (
                      <Building2 size={28} className="text-slate-400 dark:text-slate-300 relative z-10" />
                    )}
                  </div>
                  
                  {service.is_splash_sponsored && new Date(service.splash_expires_at) > new Date() && (
                    <span className="bg-gradient-to-r from-yellow-400 to-[#f59e0b] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={10} /> Sponsored
                    </span>
                  )}
                </div>

                <div className="mt-8 relative z-10">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-sky-500 transition-colors drop-shadow-sm line-clamp-1">
                    {service.title}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full mb-6">
                    <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em]">
                      {service.category || 'Tech Operations'}
                    </p>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors uppercase tracking-widest mt-auto w-max">
                    Explore Profile <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
