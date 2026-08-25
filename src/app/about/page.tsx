'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Users, Target, Shield, Heart, Globe, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white font-sans overflow-x-hidden flex flex-col transition-colors duration-300 relative selection:bg-pink-500 selection:text-white">
      
      {/* Background Glowing Wavy Line Gradient SVG */}
      <div className="absolute top-16 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-85 z-0">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44 sm:h-64 stroke-current">
          <defs>
            <linearGradient id="aboutWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M-20,30 Q80,130 200,60 T440,80 T550,20" fill="none" stroke="url(#aboutWaveGradient)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ambient Radial Neon Glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-[#ff2a70]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="w-full z-50 relative border-b border-slate-100 dark:border-white/5 bg-white/90 dark:bg-[#060608]/80 backdrop-blur-md">
        <PublicHeader />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Hero Section */}
        <section className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-4 py-1.5 mb-6 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff2a70] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 dark:from-pink-400 dark:via-orange-300 dark:to-purple-400">
              Our Mission & Global Community
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.12] mb-6 max-w-4xl mx-auto tracking-tight">
            Advancing Women in <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] via-[#ff7836] to-[#a855f7]">
              Intellectual Property
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Women&apos;s IP World Alliance (WIPA) connects, empowers, and elevates women leaders across patent prosecution, trademark law, legal tech, and corporate IP strategy in 45+ jurisdictions.
          </p>
        </section>

        {/* Story Section */}
        <section className="bg-white/90 dark:bg-[#0c101d] rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 shadow-xl p-8 sm:p-12 lg:p-16 mb-24 relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 relative h-[360px] md:h-[460px] rounded-3xl overflow-hidden group shadow-2xl border border-slate-200 dark:border-white/10">
              <Image 
                src="/feature_student_1783622505917.png" 
                alt="Women in IP Leadership" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-400">Global Alliance</span>
                  <h4 className="text-lg font-bold">Uniting Counsel Across 45+ Nations</h4>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
                <Sparkles size={14} /> The WIPA Origin
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                Transforming The Landscape Of Intellectual Property
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                Founded by managing partners, general counsel, and legal innovators, WIPA was born from a unified conviction: to bridge the leadership divide in intellectual property.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                While women drive groundbreaking innovations, they have historically faced barriers in patent inventorship credits, firm equity partnerships, and corporate IP board seats. WIPA provides the global platform, legal intelligence, and verified network to accelerate change.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">5,000+</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">Verified Members</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">45+</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">Global Jurisdictions</p>
                </div>
              </div>

              <div>
                <Link 
                  href="/signup" 
                  className="p-[2px] inline-block rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2">
                    <span>Join The Global Network</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Our Core Pillars
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">
              The guiding principles that shape our programs, resources, and global community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">Global Community</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Building borderless networks that connect private practice attorneys, in-house counsel, patent examiners, and legal tech visionaries.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">Leadership & Equity</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Empowering women through verified credentials, executive roundtables, keynote stages, and published thought leadership in our flagship annuals.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">Innovation & AI Intelligence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Delivering cutting-edge AI legal assistants (LexIQ) and real-time 30-second automated intelligence tracking to keep members ahead.
              </p>
            </div>

          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
