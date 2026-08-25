'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="w-full bg-[#05070d] text-white pt-20 pb-12 px-6 relative overflow-hidden border-t border-white/[0.08]">
      
      {/* Ambient Top Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#ff2a70]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-24 bg-[#ff2a70]/10 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 relative z-10">
        
        {/* Col 1: Brand & Bio */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <img 
                src="/WIPA-Logo.png" 
                alt="Women's IP World Alliance" 
                className="h-10 w-auto object-contain dark:brightness-110 drop-shadow-md group-hover:scale-105 transition-transform" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md font-medium">
              Women&apos;s IP World Alliance (WIPA) is the premier global ecosystem connecting, empowering, and promoting women leaders across patent prosecution, trademark law, legal tech, and intellectual property strategy in 45+ jurisdictions.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Platform Operational
            </span>
            <span className="text-xs text-slate-500 font-mono">v2.4 Production</span>
          </div>
        </div>

        {/* Col 2: Platform Links */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2">Platform</h4>
          <Link href="/platform" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Platform Hub</Link>
          <Link href="/platform/ai" className="text-slate-400 hover:text-purple-400 text-sm font-medium transition-colors flex items-center gap-1.5">
            LexIQ AI <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">AI</span>
          </Link>
          <Link href="/platform/resources/ip-news" className="text-slate-400 hover:text-orange-400 text-sm font-medium transition-colors flex items-center gap-1.5">
            Live IP News <span className="text-[9px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-bold">30s</span>
          </Link>
          <Link href="/platform/resources/ip-firms" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">IP Firm Directory</Link>
          <Link href="/publications" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Annual Publications</Link>
          <Link href="/platform/events" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Meetn Live Events</Link>
          <Link href="/platform/mentorship" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Budding Minds</Link>
        </div>

        {/* Col 3: Company & Legal */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2">Alliance</h4>
          <Link href="/about" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">About WIPA</Link>
          <Link href="/pricing" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Membership Tiers</Link>
          <Link href="/resources" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Resource Library</Link>
          <Link href="/contact" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Contact Support</Link>
          <Link href="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
          <Link href="/signup" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Create Account</Link>
        </div>

        {/* Col 4: Global Offices (UK & India from womensipalliance.com) */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-1">Global Headquarters</h4>
          
          {/* UK Office */}
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-purple-400 shrink-0" /> United Kingdom Office:
            </p>
            <p className="text-slate-400 pl-4.5 font-medium leading-relaxed">
              60 Castle Street, Dover, CT16 1PJ, United Kingdom
            </p>
            <p className="text-slate-300 pl-4.5 font-mono font-bold pt-0.5">
              +44 (0)203-813-0457
            </p>
          </div>

          {/* India Office */}
          <div className="space-y-1 text-xs pt-1">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-400 shrink-0" /> India Office:
            </p>
            <p className="text-slate-400 pl-4.5 font-medium leading-relaxed">
              E-606, PNTC, Times Of India Press Rd, Satellite, Ahmedabad, Gujarat, 380015
            </p>
            <p className="text-slate-300 pl-4.5 font-mono font-bold pt-0.5">
              +91 90545 75950
            </p>
          </div>

          {/* Direct Email */}
          <div className="pt-2">
            <a 
              href="mailto:info@northonsprmarketing.com" 
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <Mail size={13} className="text-orange-400" /> info@northonsprmarketing.com
            </a>
          </div>
        </div>

      </div>
      
      {/* Bottom Divider */}
      <div className="max-w-7xl mx-auto w-full h-px bg-white/[0.08]" />
      
      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Women&apos;s IP World Alliance (WIPA). All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
          <Link href="/about" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-slate-200 transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}
