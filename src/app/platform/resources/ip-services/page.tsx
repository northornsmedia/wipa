'use client';

import React from 'react';
import { ArrowRight, Building2, Sparkles, MonitorSmartphone, X, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { SparklesCore } from '@/components/animations/SparklesCore';
import SplashSponsoredBanner from '@/components/SplashSponsoredBanner';
import { supabase } from '@/lib/supabase';

export default function IPServicesPage() {
  const [showIntro, setShowIntro] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [ipServices, setIpServices] = React.useState<any[]>([]);
  const [splashServices, setSplashServices] = React.useState<any[]>([]);

  const handleDismissSplash = () => {
    setFadeOut(true);
    setTimeout(() => setShowIntro(false), 400);
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
    const timer1 = setTimeout(() => setFadeOut(true), 4000);
    const timer2 = setTimeout(() => setShowIntro(false), 4500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-20">
      
      {/* Cool, Ultra-Premium Sponsored Splash Screen */}
      {showIntro && (
        <div className={`fixed inset-0 z-[1000] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 transition-all duration-500 ${fadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Particles Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.6}
              particleDensity={70}
              className="w-full h-full"
              particleColor="#38bdf8"
            />
          </div>

          {/* Dismiss Button */}
          <button 
            onClick={handleDismissSplash}
            className="absolute top-6 right-6 z-50 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <span>Skip</span>
            <X size={14} />
          </button>

          {/* Central Glass Showcase Card */}
          <div className="relative z-20 w-full max-w-xl bg-slate-900/85 dark:bg-slate-950/85 border border-sky-500/30 shadow-[0_0_80px_rgba(14,165,233,0.25)] rounded-[2.5rem] p-8 md:p-12 text-center backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            
            {/* Shimmer Border Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-gradient-to-b from-sky-400/30 to-transparent blur-2xl pointer-events-none" />
            
            {/* Sponsor Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black tracking-widest uppercase mb-8 shadow-inner">
              <Sparkles size={13} className="text-sky-400 animate-pulse" />
              Official Category Partner
            </div>

            {/* Logo Display Capsule */}
            <div className="relative mx-auto mb-8 w-60 h-24 bg-white/90 dark:bg-white/95 rounded-2xl p-4 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/20 transform transition-transform hover:scale-105 duration-300">
              <img 
                src="https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg" 
                alt="PSS Solutions Logo" 
                className="max-h-14 max-w-[200px] object-contain drop-shadow-sm" 
              />
            </div>

            {/* Title & Tagline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 leading-snug">
              Elevating IP Operations & Technology
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-medium max-w-md mx-auto">
              Presented by <strong className="text-white font-bold">PSS Solutions</strong> — Transforming IP through strategic advisory, cutting-edge technology, and operational excellence.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs font-semibold text-sky-200/90">
              <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                <ShieldCheck size={14} className="text-sky-400" /> Strategic IP Advisory
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                <Zap size={14} className="text-sky-400" /> Tech Optimization
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={handleDismissSplash}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white rounded-xl font-bold text-sm shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Explore IP Services</span>
                <ArrowRight size={16} />
              </button>
              
              <Link 
                href="/platform/resources/ip-services/pss-solutions"
                onClick={handleDismissSplash}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Sponsor Profile</span>
                <ExternalLink size={14} />
              </Link>
            </div>

            {/* Animated Bottom Timer Bar */}
            <div className="mt-8 w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full w-full animate-[progress_4.5s_linear_forwards]" />
            </div>

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
                Access expert insights, practical resources, industry knowledge and solutions from selected IP service providers and Women's IP Alliance partners.
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
