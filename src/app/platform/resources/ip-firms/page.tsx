'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  Star, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  Globe, 
  Mail, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ArrowLeft,
  X,
  Share2,
  Bookmark
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';

const SPECIALTY_CHIPS = [
  'All',
  'Featured',
  'Verified',
  'Patents',
  'Trademarks',
  'Litigation',
  'Software Patents',
  'Trade Secrets',
  'BioTech',
  'Licensing',
  'IP Strategy'
];

export default function IPFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Shared & Mobile states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedSize, setSelectedSize] = useState('');
  const [bookmarkedFirms, setBookmarkedFirms] = useState<Record<string, boolean>>({});

  // Desktop specific states
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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

  // Filter logic for Mobile Native Layout
  const filteredFirmsMobile = useMemo(() => {
    return firms.filter(firm => {
      // Specialty chip filter
      if (selectedSpecialty === 'Featured' && !firm.is_featured) return false;
      if (selectedSpecialty === 'Verified' && !firm.is_verified) return false;
      if (selectedSpecialty !== 'All' && selectedSpecialty !== 'Featured' && selectedSpecialty !== 'Verified') {
        const hasSpec = firm.specializations?.some((s: string) => 
          s.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );
        if (!hasSpec) return false;
      }

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
      return a.name.localeCompare(b.name);
    });
  }, [firms, selectedSpecialty, selectedSize, searchQuery]);

  // Filter logic for Desktop Layout
  const filteredFirmsDesktop = useMemo(() => {
    return firms.filter(firm => {
      if (verifiedOnly && !firm.is_verified) return false;
      if (selectedSize && firm.size_range !== selectedSize) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = firm.name?.toLowerCase().includes(query);
        const matchDesc = firm.description?.toLowerCase().includes(query);
        const matchSpec = firm.specializations?.some((s: string) => s.toLowerCase().includes(query));
        const matchLoc = firm.headquarters?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchSpec && !matchLoc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [firms, verifiedOnly, selectedSize, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24 sm:pb-32">
      
      {/* ========================================================================= */}
      {/* 1. MOBILE-ONLY NATIVE APP LAYOUT (< md)                                    */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        {/* Mobile-Native IP Firms Top Bar */}
        <header className="sticky top-0 z-40 bg-[#f8fafc]/95 dark:bg-[#070b14]/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-4 pt-safe sm:pt-4 pb-3 sm:px-6 w-full transition-all">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Link
              href="/platform/resources"
              aria-label="Back to resources"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#272535] shadow-[0_5px_18px_rgba(32,25,63,0.07)] border border-slate-100 dark:border-white/10 active:scale-95 transition-transform dark:bg-white/10 dark:text-white"
            >
              <ArrowLeft size={19} />
            </Link>
            
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7c3aed] dark:text-[#c4b5fd]">
                Resource space
              </p>
              <h1 
                className="truncate text-[22px] sm:text-[26px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white font-instagram-headline"
                style={{ fontFamily: "var(--font-instagram-headline), 'Instagram Sans Headline', sans-serif" }}
              >
                IP Firms
              </h1>
            </div>

            <Link
              href="/platform/resources/ip-firms/claim"
              aria-label="Showcase or list firm"
              title="List or Claim Your Firm"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eeeafd] text-[#7248da] dark:bg-[#7c3aed]/20 dark:text-[#c4b5fd] active:scale-95 transition-transform shadow-xs"
            >
              <Sparkles size={18} />
            </Link>
          </div>
        </header>

        {/* Mobile Main Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
          
          {/* Mobile Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search firms, location, or patent specialty..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#5a32fa]/40 transition-all shadow-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Specialty Quick Filter Scroll Strip (Native App Feel) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {SPECIALTY_CHIPS.map(chip => {
              const isActive = selectedSpecialty === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setSelectedSpecialty(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#5a32fa] text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {chip === 'Featured' && '⭐ '}
                  {chip === 'Verified' && '🛡️ '}
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Active Filters & Firm Size Selector */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-bold">
              Showing <span className="text-slate-900 dark:text-white font-black">{filteredFirmsMobile.length}</span> curated {filteredFirmsMobile.length === 1 ? 'practice' : 'practices'}
            </div>

            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 rounded-xl px-2.5 py-1 font-bold text-xs outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="">All Firm Sizes</option>
              <option value="1-10">1-10 Attorneys</option>
              <option value="10-50">10-50 Attorneys</option>
              <option value="50-100">50-100 Attorneys</option>
              <option value="100-500">100-500 Attorneys</option>
            </select>
          </div>

          {/* Mobile Results Stream */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-3">
              <DotmCircular7 size={44} className="text-[#5a32fa]" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Directory...</p>
            </div>
          ) : filteredFirmsMobile.length === 0 ? (
            <div className="text-center bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="text-xl font-black">No IP firms found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any firms matching &ldquo;{searchQuery || selectedSpecialty}&rdquo;. Try resetting your filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); setSelectedSize(''); }}
                className="px-4 py-2 rounded-full bg-[#5a32fa] text-white text-xs font-black active:scale-95 transition-all shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {filteredFirmsMobile.map((firm) => {
                const isBookmarked = bookmarkedFirms[firm.id];

                return (
                  <div 
                    key={firm.id}
                    className="group bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col relative"
                  >
                    {/* Top Cover Image with Gradient Overlay */}
                    <div className="h-40 sm:h-44 w-full relative overflow-hidden bg-slate-900">
                      <img 
                        src={firm.cover_image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'} 
                        alt={`${firm.name} cover`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.88]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {firm.is_featured && (
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Star size={10} className="fill-white" /> Featured
                            </div>
                          )}
                          {firm.is_verified && (
                            <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                              <ShieldCheck size={11} /> Verified
                            </div>
                          )}
                        </div>

                        {/* Quick Action Icons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleShare(e, firm)}
                            title="Share firm"
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors active:scale-90"
                          >
                            <Share2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(e, firm.id)}
                            title="Save firm"
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors active:scale-90"
                          >
                            <Bookmark size={13} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
                          </button>
                        </div>
                      </div>

                      {/* Location Badge on cover */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white/95 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                          <MapPin size={11} className="text-rose-400" />
                          <span>{firm.headquarters || 'Global Practice'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Logo & Firm Header */}
                    <div className="px-5 pt-0 relative flex-1 flex flex-col">
                      {/* Floating Avatar Logo */}
                      <div className="-mt-10 mb-3 flex items-end justify-between">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-4 ring-white dark:ring-[#0f172a] overflow-hidden flex items-center justify-center relative z-10 shrink-0">
                          {firm.logo_url ? (
                            <img 
                              src={firm.logo_url} 
                              alt={firm.name} 
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-full h-full bg-gradient-to-br from-[#5a32fa] to-purple-600 text-white font-black text-2xl flex items-center justify-center"
                            style={{ display: firm.logo_url ? 'none' : 'flex' }}
                          >
                            {firm.name.charAt(0)}
                          </div>
                        </div>

                        {firm.size_range && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                            <Users size={12} className="text-[#5a32fa]" />
                            <span>{firm.size_range} Attorneys</span>
                          </div>
                        )}
                      </div>

                      {/* Firm Title and Verification */}
                      <Link href={`/platform/resources/ip-firms/${firm.slug}`} className="block group-hover:text-[#5a32fa] transition-colors">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">
                            {firm.name}
                          </h2>
                          {firm.is_verified && (
                            <CheckCircle2 size={16} className="text-blue-500 shrink-0 fill-blue-500/20" />
                          )}
                        </div>
                      </Link>

                      {/* Est. year & Rating */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-bold mb-3">
                        {firm.founded_year && <span>Est. {firm.founded_year}</span>}
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={12} className="fill-amber-400" />
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">4.9</span>
                          <span className="text-slate-400 text-[10px]">(Top Tier)</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {firm.description || 'Full-service intellectual property prosecution, counseling, and litigation practice.'}
                      </p>

                      {/* Specialization Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                        {(firm.specializations || ['Patents', 'Trademarks']).slice(0, 3).map((spec: string) => (
                          <span 
                            key={spec}
                            className="bg-indigo-50/80 dark:bg-indigo-950/40 text-[#5a32fa] dark:text-indigo-300 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-indigo-100/60 dark:border-indigo-900/40"
                          >
                            {spec}
                          </span>
                        ))}
                        {(firm.specializations?.length || 0) > 3 && (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1 py-1">
                            +{firm.specializations.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* App Bottom Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 mb-4">
                        <Link
                          href={`/platform/resources/ip-firms/${firm.slug}`}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#5a32fa] text-white dark:bg-white dark:text-slate-900 dark:hover:bg-[#5a32fa] dark:hover:text-white font-black text-xs transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                        >
                          <span>View Profile</span>
                          <ChevronRight size={14} />
                        </Link>

                        {firm.contact_email && (
                          <a
                            href={`mailto:${firm.contact_email}`}
                            title="Email firm"
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-200 hover:text-[#5a32fa] flex items-center justify-center transition-colors active:scale-95 shrink-0"
                          >
                            <Mail size={16} />
                          </a>
                        )}

                        {firm.website_url && (
                          <a
                            href={firm.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Visit official website"
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-200 hover:text-[#5a32fa] flex items-center justify-center transition-colors active:scale-95 shrink-0"
                          >
                            <Globe size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Showcase Banner at Bottom */}
          <div className="pt-6">
            <div className="bg-gradient-to-r from-[#5a32fa] via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                  <Building2 size={13} /> For IP Law Firms
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Are you an IP Law Practice?
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-md">
                  Claim your firm profile on WIPA to reach over 100,000+ patent owners, innovators, and in-house IP counsel worldwide.
                </p>
              </div>
              
              <Link
                href="/platform/resources/ip-firms/claim"
                className="px-6 py-3.5 rounded-2xl bg-white text-[#5a32fa] font-black text-xs sm:text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                Showcase Your Firm
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP ORIGINAL DIRECTORY LAYOUT (>= md)                              */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        {/* Hero Header */}
        <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 pt-10 sm:pt-20 pb-10 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest mb-4">
              <Building2 size={16} /> IP Firms Directory
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight">
              Find the Right IP Partner
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
              Browse our curated directory of top intellectual property law firms, agencies, and specialists worldwide.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/platform/resources/ip-firms/claim"
                className="px-5 py-2.5 rounded-full bg-[#5a32fa] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#4a24db] active:scale-95 transition-all inline-flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} /> Showcase or List Your Firm
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Filters and Search */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 mb-12 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, description, or specialization..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#5a32fa]/50 transition-all text-slate-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
              <select 
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-sm outline-none shrink-0 text-slate-900 dark:text-white"
              >
                <option value="">All Sizes</option>
                <option value="1-10">1-10 Employees</option>
                <option value="10-50">10-50 Employees</option>
                <option value="50-100">50-100 Employees</option>
                <option value="100-500">100-500 Employees</option>
              </select>
              
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shrink-0 transition-colors">
                <input 
                  type="checkbox" 
                  checked={verifiedOnly} 
                  onChange={e => setVerifiedOnly(e.target.checked)} 
                  className="w-4 h-4 rounded text-[#5a32fa]" 
                />
                <span className="font-bold text-sm">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Desktop Results */}
          {loading ? (
            <div className="flex justify-center p-20">
              <DotmCircular7 size={40} className="text-[#6600FF]" />
            </div>
          ) : filteredFirmsDesktop.length === 0 ? (
            <div className="text-center bg-white dark:bg-[#0f172a] rounded-3xl p-16 border border-slate-200 dark:border-white/10 shadow-sm">
              <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-2xl font-black mb-2">No firms found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFirmsDesktop.map(firm => (
                <Link 
                  href={`/platform/resources/ip-firms/${firm.slug}`} 
                  key={firm.id}
                  className="group bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
                >
                  {firm.is_featured && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Star size={10} className="fill-white" /> Featured
                    </div>
                  )}
                  
                  <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                    {firm.cover_image_url ? (
                      <img src={firm.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                    )}
                    
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                        {firm.logo_url ? (
                          <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-black text-slate-300">{firm.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-14 p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors line-clamp-1">{firm.name}</h3>
                      {firm.is_verified && <CheckCircle2 size={16} className="text-blue-500 shrink-0" />}
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
                      <MapPin size={12} /> {firm.headquarters || 'Multiple Locations'}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                      {firm.description}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(firm.specializations || []).slice(0, 3).map((spec: string) => (
                          <span key={spec} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                            {spec}
                          </span>
                        ))}
                        {(firm.specializations?.length || 0) > 3 && (
                          <span className="text-xs font-bold text-slate-400 px-1 py-1">+{firm.specializations.length - 3}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-[#5a32fa] font-black text-sm group-hover:translate-x-1 transition-transform">
                        View Profile <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Footer */}
        <div className="max-w-4xl mx-auto px-4 mt-12 mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-[#5a32fa] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Are you an IP Firm?</h2>
              <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto">
                List your firm on WIPA to connect with top IP professionals, clients, and partners globally.
              </p>
              <Link href="/platform/resources/ip-firms/claim" className="inline-block bg-white text-[#5a32fa] font-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
                Submit Your Firm
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
