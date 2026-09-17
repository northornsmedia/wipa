'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Users, 
  X,
  Share2,
  Bookmark,
  ArrowDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';

const SPECIALTY_CHIPS = [
  'All Practices',
  'Patents',
  'Trademarks',
  'Litigation',
  'Software & AI',
  'Trade Secrets',
  'BioTech',
  'Licensing',
  'IP Strategy'
];

export default function IPFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedSize, setSelectedSize] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [bookmarkedFirms, setBookmarkedFirms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFirms = async () => {
      setLoading(true);
      const { data: firmData } = await supabase
        .from('ip_firms')
        .select('*')
        .order('is_featured', { ascending: false });
      
      const { data: bizData } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('status', 'approved');

      const existingSlugs = new Set((firmData || []).map(f => f.slug));
      const formattedBiz = (bizData || [])
        .filter(b => !existingSlugs.has(b.slug))
        .map(b => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo_url: b.logo_url,
          cover_image_url: b.cover_image_url,
          description: b.description || b.tagline,
          website_url: b.website_url,
          linkedin_url: b.linkedin_url,
          headquarters: b.headquarters,
          size_range: b.company_size,
          founded_year: b.founded_year,
          specializations: b.specializations || [],
          is_verified: b.is_verified,
          is_featured: false,
          is_claimed: true,
          contact_email: b.contact_email,
          phone: b.phone
        }));

      setFirms([...(firmData || []), ...formattedBiz]);
      setLoading(false);
    };
    fetchFirms();
  }, []);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedFirms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (e: React.MouseEvent, firm: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: firm.name,
          text: `Check out ${firm.name} on WIPA IP Directory`,
          url: window.location.origin + `/platform/resources/ip-firms/${firm.slug}`
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      navigator.clipboard?.writeText(window.location.origin + `/platform/resources/ip-firms/${firm.slug}`);
      alert('Link copied to clipboard!');
    }
  };

  // Unified Filter Logic
  const filteredFirms = useMemo(() => {
    return firms.filter(firm => {
      // Specialty chip filter
      if (selectedSpecialty !== 'All' && selectedSpecialty !== 'All Practices') {
        const hasSpec = firm.specializations?.some((s: string) => 
          s.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );
        if (!hasSpec) return false;
      }

      // Verified toggle filter
      if (verifiedOnly && !firm.is_verified) return false;

      // Size filter
      if (selectedSize && firm.size_range !== selectedSize) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = firm.name?.toLowerCase().includes(q);
        const matchLoc = firm.headquarters?.toLowerCase().includes(q);
        const matchDesc = firm.description?.toLowerCase().includes(q);
        const matchSpec = firm.specializations?.some((s: string) => s.toLowerCase().includes(q));
        if (!matchName && !matchLoc && !matchDesc && !matchSpec) return false;
      }

      return true;
    }).sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [firms, selectedSpecialty, verifiedOnly, selectedSize, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24 sm:pb-32">
      
      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL HERO HEADER                                              */}
      {/* ========================================================================= */}
      <section className="relative bg-white dark:bg-[#070b14] border-b border-slate-200 dark:border-white/10 pt-14 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Ambient Depth & Luxury Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(90,50,250,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(120,60,255,0.18),rgba(7,11,20,0))] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40 dark:opacity-25">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-rose-400/15 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Institutional Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 dark:border-purple-400/30 text-[#5a32fa] dark:text-purple-300 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xs mb-6 backdrop-blur-md">
            <Building2 size={13} className="text-[#5a32fa] dark:text-purple-400" />
            <span>Accredited Global IP Directory</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f] shadow-xs shadow-rose-500/50" />
          </div>

          {/* Heading with Gradient Accent */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-5">
            Find the Right{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f]">
              IP Partner
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse our curated directory of premier intellectual property law firms, patent attorney practices, and global enforcement specialists.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-10">
            <Link
              href="/platform/resources/ip-firms/claim"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] hover:from-[#4a24db] hover:to-[#6d28d9] text-white font-black text-sm shadow-lg shadow-[#5a32fa]/25 hover:shadow-xl hover:shadow-[#5a32fa]/35 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <Building2 size={16} />
              <span>Showcase or List Your Firm</span>
            </Link>

            <a
              href="#firms-directory"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/15 font-bold text-sm shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Search size={15} className="text-slate-400" />
              <span>Explore All Practices</span>
              <ArrowDown size={14} className="text-slate-400" />
            </a>
          </div>

          {/* Institutional Trust Badges (Elevated Capsules) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-4 border-t border-slate-200/70 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08] shadow-2xs">
              <Globe size={14} className="text-[#5a32fa] shrink-0" />
              <span>150+ Global Jurisdictions</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08] shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>100% Vetted IP Practices</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08] shadow-2xs">
              <Users size={14} className="text-indigo-500 shrink-0" />
              <span>Direct Counsel Connect</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIRECTORY CONTROLS & FIRMS GRID                                        */}
      {/* ========================================================================= */}
      <div id="firms-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 scroll-mt-20">
        
        {/* Practice Area Navigation Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {SPECIALTY_CHIPS.map(chip => {
            const isActive = (chip === 'All Practices' && selectedSpecialty === 'All') || selectedSpecialty === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setSelectedSpecialty(chip === 'All Practices' ? 'All' : chip)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Integrated Search & Controls Bar */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-white/10 mb-10 flex flex-col md:flex-row items-stretch md:items-center gap-3.5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search firm name, city, attorney practice, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold outline-none focus:border-[#5a32fa] focus:ring-2 focus:ring-[#5a32fa]/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Firm Size Selector */}
            <div className="relative">
              <select 
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-4 pr-9 py-3 font-bold text-xs sm:text-sm outline-none shrink-0 text-slate-900 dark:text-white cursor-pointer focus:border-[#5a32fa]"
              >
                <option value="">All Firm Sizes</option>
                <option value="1-10">1-10 Attorneys (Boutique)</option>
                <option value="10-50">10-50 Attorneys (Mid-Size)</option>
                <option value="50-100">50-100 Attorneys (National)</option>
                <option value="100-500">100+ Attorneys (Enterprise)</option>
              </select>
              <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
            </div>

            {/* Verified Only Toggle */}
            <button 
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border shrink-0 ${
                verifiedOnly 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                  : 'bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck size={16} className={verifiedOnly ? 'text-white' : 'text-slate-400'} />
              <span>Verified Only</span>
            </button>

            {/* Counter */}
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 ml-auto md:ml-0">
              Showing <span className="text-slate-900 dark:text-white font-extrabold">{filteredFirms.length}</span> {filteredFirms.length === 1 ? 'practice' : 'practices'}
            </div>
          </div>
        </div>

        {/* Results Stream */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <DotmCircular7 size={44} className="text-[#5a32fa]" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Directory...</p>
          </div>
        ) : filteredFirms.length === 0 ? (
          <div className="text-center bg-white dark:bg-[#0f172a] rounded-3xl p-16 border border-slate-200 dark:border-white/10 shadow-sm max-w-xl mx-auto space-y-4">
            <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-2xl font-black">No IP firms found</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any firms matching your active filters. Try adjusting your practice area or search query.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); setSelectedSize(''); setVerifiedOnly(false); }}
              className="px-5 py-2.5 rounded-xl bg-[#5a32fa] text-white text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirms.map((firm) => {
              const isBookmarked = bookmarkedFirms[firm.id];

              return (
                <div 
                  key={firm.id}
                  className="group bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-purple-500/30 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/60 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Top Header: Monogram Emblem & Ghost Actions */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Emblem / Monogram Logo */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden flex items-center justify-center shrink-0 p-1">
                        {firm.logo_url ? (
                          <img 
                            src={firm.logo_url} 
                            alt={firm.name} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950 text-white font-black text-lg flex items-center justify-center"
                          style={{ display: firm.logo_url ? 'none' : 'flex' }}
                        >
                          {firm.name.charAt(0)}
                        </div>
                      </div>

                      {/* Header Right Actions (Bookmark & Share) */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleShare(e, firm)}
                          title="Share firm"
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(e, firm.id)}
                          title="Save firm"
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                        >
                          <Bookmark size={14} className={isBookmarked ? 'fill-purple-500 text-purple-500' : ''} />
                        </button>
                      </div>
                    </div>

                    {/* Firm Status & Verified Indicator */}
                    <div className="flex items-center gap-2 mb-2">
                      {firm.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/40">
                          <ShieldCheck size={12} className="text-purple-600 dark:text-purple-400" />
                          Premier Practice
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06]">
                          Institutional Practice
                        </span>
                      )}
                      {firm.is_verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          <CheckCircle2 size={13} className="shrink-0" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Firm Title */}
                    <Link href={`/platform/resources/ip-firms/${firm.slug}`} className="block group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                        {firm.name}
                      </h3>
                    </Link>

                    {/* Location & Founded Year */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{firm.headquarters || 'Global Practice'}</span>
                      {firm.founded_year && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span>Est. {firm.founded_year}</span>
                        </>
                      )}
                    </div>

                    {/* Practice Metric Strip */}
                    {firm.size_range && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Users size={13} className="text-slate-400" />
                          <span>{firm.size_range} Attorneys</span>
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Tier 1 Global</span>
                      </div>
                    )}

                    {/* Executive Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mt-3 mb-4">
                      {firm.description || 'Full-service intellectual property prosecution, counseling, portfolio strategy, and litigation practice.'}
                    </p>
                  </div>

                  {/* Practice Specializations & Footer */}
                  <div>
                    {/* Neutral Specialization Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(firm.specializations || ['Patents', 'Trademarks']).slice(0, 3).map((spec: string) => (
                        <span 
                          key={spec}
                          className="bg-slate-100/90 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-white/[0.05]"
                        >
                          {spec}
                        </span>
                      ))}
                      {(firm.specializations?.length || 0) > 3 && (
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 px-1 py-1">
                          +{firm.specializations.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2">
                      <Link
                        href={`/platform/resources/ip-firms/${firm.slug}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#5a32fa] text-white dark:bg-white dark:text-slate-900 dark:hover:bg-[#5a32fa] dark:hover:text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
                      >
                        <span>View Practice</span>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {firm.contact_email && (
                        <a
                          href={`mailto:${firm.contact_email}`}
                          title="Email firm"
                          className="w-9 h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/60 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
                        >
                          <Mail size={14} />
                        </a>
                      )}

                      {firm.website_url && (
                        <a
                          href={firm.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visit official website"
                          className="w-9 h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/60 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Showcase Practice Banner */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-black rounded-[2rem] p-8 sm:p-12 text-white border border-purple-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-3 text-center md:text-left relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 text-purple-300 text-xs font-black uppercase tracking-wider border border-white/10">
                <Building2 size={14} /> Global Practice Directory
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Are you an Intellectual Property Law Practice?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Claim your firm profile on WIPA to connect with over 100,000+ patent owners, innovating enterprises, and in-house corporate counsel worldwide.
              </p>
            </div>
            
            <Link
              href="/platform/resources/ip-firms/claim"
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm shadow-xl active:scale-95 transition-all whitespace-nowrap shrink-0 relative z-10 cursor-pointer"
            >
              Showcase Your Firm
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
