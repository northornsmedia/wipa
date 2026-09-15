'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Users, 
  Building2, 
  Briefcase, 
  Monitor, 
  MoreHorizontal, 
  Link as LinkIcon, 
  Edit2, 
  UserPlus, 
  Star, 
  MessageCircle, 
  Share2, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Send,
  Calendar,
  Check
} from 'lucide-react';
import Link from 'next/link';

const TYPE_ICONS: Record<string, any> = {
  startup: Briefcase,
  law_firm: Building2,
  ip_firm: Building2,
  tech_company: Monitor,
  other: MoreHorizontal
};

const TYPE_LABELS: Record<string, string> = {
  startup: 'Startup',
  law_firm: 'Law Firm',
  ip_firm: 'IP Law Firm',
  tech_company: 'Tech Company',
  other: 'Corporate'
};

export default function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // In Next.js 15, params is a Promise in client and server components
  const resolvedParams = React.use(params as any) as { slug: string };
  const slug = resolvedParams?.slug;

  const { user } = useAppStore();
  const [business, setBusiness] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'specializations' | 'team' | 'contact' | 'sponsorships'>('about');
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Direct Inquiry State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBusiness = async () => {
      setLoading(true);
      
      // 1. Try fetching from business_profiles
      let { data, error } = await supabase
        .from('business_profiles')
        .select('*, owner:profiles(id, first_name, last_name, email, avatar_url)')
        .eq('slug', slug)
        .maybeSingle();
      
      // 2. Fallback: Check if it exists in ip_firms table
      if (!data) {
        const { data: firmData } = await supabase
          .from('ip_firms')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (firmData) {
          data = {
            id: firmData.id,
            owner_id: firmData.claimed_by,
            name: firmData.name,
            slug: firmData.slug,
            type: 'ip_firm',
            logo_url: firmData.logo_url,
            cover_image_url: firmData.cover_image_url,
            tagline: firmData.description?.slice(0, 120) || 'Verified Intellectual Property Firm',
            description: firmData.description,
            website_url: firmData.website_url,
            linkedin_url: firmData.linkedin_url,
            founded_year: firmData.founded_year,
            company_size: firmData.size_range,
            headquarters: firmData.headquarters,
            specializations: firmData.specializations || [],
            contact_email: firmData.contact_email,
            phone: firmData.phone,
            is_verified: firmData.is_verified ?? true,
            status: 'approved',
            created_at: firmData.created_at
          };
        }
      }
      
      if (data) {
        setBusiness(data);
        
        // Fetch team members
        const { data: teamData } = await supabase
          .from('business_team_members')
          .select('*, profiles(id, first_name, last_name, avatar_url, job_title)')
          .eq('business_id', data.id);
          
        if (teamData && teamData.length > 0) {
          setTeam(teamData);
          if (user) {
            const myRole = teamData.find(t => t.profile_id === user.id);
            if (myRole?.is_admin || data.owner_id === user.id) {
              setIsAdmin(true);
            }
          }
        } else if (data.owner) {
          // Default team fallback: add owner
          setTeam([{
            id: 'owner-row',
            role: 'Founder / Managing Partner',
            is_admin: true,
            profiles: data.owner
          }]);
          if (user && data.owner_id === user.id) {
            setIsAdmin(true);
          }
        }

        // Fetch Sponsorships if admin/owner
        if (user && (data.owner_id === user.id || isAdmin)) {
          const { data: sponsorData } = await supabase
            .from('event_sponsorships')
            .select('*, event:events(title), package:sponsorship_packages(name, price)')
            .eq('business_profile_id', data.id)
            .order('applied_at', { ascending: false });
          if (sponsorData) setSponsorships(sponsorData);
        }
      }
      setLoading(false);
    };
    
    fetchBusiness();
  }, [slug, user]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 size={44} className="text-[#5a32fa] animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-sm">Loading business profile...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-white/10 shadow-lg">
          <Building2 size={36} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Business Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8">
          The requested profile does not exist or may still be undergoing administrator verification.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/platform/resources/ip-firms" className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#4a24db] transition-colors">
            Browse IP Firms Directory
          </Link>
          <Link href="/platform" className="bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const isPending = business.status === 'pending' || (!business.status && !business.is_verified);
  const isOwnerOrAdmin = user && (user.id === business.owner_id || isAdmin);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24">
      
      {/* Pending Status Alert Banner (visible to owner/admin) */}
      {isPending && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-800 dark:text-amber-200 px-4 py-3 text-xs font-bold">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Application Pending Admin Review:</strong> This profile is currently undergoing verification by WIPA administrators before being listed in the global directory.
              </span>
            </div>
            {isOwnerOrAdmin && (
              <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold uppercase text-[10px]">
                Owner Preview Mode
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cover & Hero Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-white/10">
        <div className="h-56 sm:h-72 md:h-80 w-full relative bg-slate-900 overflow-hidden">
          {business.cover_image_url ? (
            <img 
              src={business.cover_image_url} 
              alt="Cover" 
              className="w-full h-full object-cover brightness-[0.9]" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#1e1b4b] via-[#311042] to-[#0f172a]" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
          
          {/* Top navigation controls */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <Link 
              href="/platform/resources/ip-firms" 
              className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full inline-flex transition-colors border border-white/20 active:scale-95"
              title="Back to IP Directory"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 text-xs font-bold transition-colors border border-white/20 active:scale-95"
            >
              {isCopied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {isCopied ? 'Copied!' : 'Share'}
            </button>

            {isAdmin && (
              <Link
                href={`/platform/business/${business.slug}/edit`}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <Edit2 size={14} /> Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8 -mt-16 sm:-mt-20 relative z-10 mb-6">
            
            {/* Logo container */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl ring-4 ring-white dark:ring-[#0f172a] flex items-center justify-center overflow-hidden shrink-0">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#5a32fa] to-purple-600 text-white font-black text-4xl sm:text-5xl flex items-center justify-center">
                  {business.name?.charAt(0) || 'B'}
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {business.name}
                </h1>
                {business.is_verified && (
                  <span title="Verified Organization">
                    <CheckCircle2 size={24} className="text-blue-500 fill-blue-500/20 shrink-0" />
                  </span>
                )}
                <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa] dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-200/60 dark:border-purple-500/20">
                  <Building2 size={14} /> {TYPE_LABELS[business.type] || business.type || 'Enterprise'}
                </span>
              </div>

              {business.tagline && (
                <p className="text-base sm:text-lg text-[#5a32fa] font-bold mb-3">{business.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm">
                {business.headquarters && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-rose-500" /> {business.headquarters}
                  </div>
                )}
                {business.company_size && (
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-indigo-500" /> {business.company_size} Employees
                  </div>
                )}
                {business.founded_year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-amber-500" /> Est. {business.founded_year}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-8 border-b border-slate-200 dark:border-white/10 no-scrollbar">
            {[
              { id: 'about', label: 'About Company' },
              { id: 'specializations', label: 'Specializations' },
              { id: 'team', label: `Team (${team.length})` },
              { id: 'contact', label: 'Contact & Inquiries' },
              ...(isAdmin ? [{ id: 'sponsorships', label: 'My Sponsorships' }] : [])
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-[#5a32fa] text-[#5a32fa]' 
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Main Tabs Container */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: About */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xs">
                <h2 className="text-2xl font-black mb-4">About {business.name}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                  {business.description ? business.description : (
                    <p className="italic text-slate-400">No company description provided yet.</p>
                  )}
                </div>
              </section>

              {business.specializations && business.specializations.length > 0 && (
                <section className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xs">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#5a32fa]" /> Core Practice Areas & Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {business.specializations.map((spec: string) => (
                      <span 
                        key={spec} 
                        className="bg-purple-50 text-[#5a32fa] dark:bg-purple-950/40 dark:text-purple-300 px-4 py-2 rounded-xl font-bold text-xs border border-purple-200/50 dark:border-purple-500/20"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* TAB 2: Specializations */}
          {activeTab === 'specializations' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xs">
                <h2 className="text-2xl font-black mb-4">Practice Areas & Focus</h2>
                {business.specializations && business.specializations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {business.specializations.map((spec: string) => (
                      <div key={spec} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{spec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-slate-400">No specializations listed for this business.</p>
                )}
              </section>
            </div>
          )}

          {/* TAB 3: Team */}
          {activeTab === 'team' && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Our Team ({team.length})</h2>
                {isAdmin && (
                  <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors text-xs shadow-md">
                    <UserPlus size={15} /> Invite Team Member
                  </button>
                )}
              </div>
              
              {team.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                  <Users size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-medium">No team members visible yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {team.map(member => (
                    <div key={member.id} className="bg-white dark:bg-[#0f172a] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        <img 
                          src={member.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.profiles?.first_name || 'Team')}+${encodeURIComponent(member.profiles?.last_name || 'Member')}&background=5a32fa&color=fff`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-base text-slate-900 dark:text-white truncate">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </div>
                        <div className="text-slate-500 text-xs font-semibold">{member.role || 'Member'}</div>
                        {member.is_admin && (
                          <span className="inline-block mt-1 bg-purple-100 text-[#5a32fa] dark:bg-purple-900/40 dark:text-purple-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Contact & Inquiries */}
          {activeTab === 'contact' && (
            <div className="animate-in fade-in duration-300 space-y-8">
              
              {/* Contact information cards */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xs">
                <h2 className="text-2xl font-black mb-6">Contact & Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {business.website_url && (
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-[#5a32fa]/40 transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa] flex items-center justify-center shrink-0">
                        <Globe size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-400 mb-0.5">Official Website</div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#5a32fa] flex items-center gap-1">
                          {business.website_url.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                        </div>
                      </div>
                    </a>
                  )}

                  {business.contact_email && (
                    <a href={`mailto:${business.contact_email}`} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-[#5a32fa]/40 transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa] flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-400 mb-0.5">Direct Inquiries Email</div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#5a32fa]">
                          {business.contact_email}
                        </div>
                      </div>
                    </a>
                  )}

                  {business.phone && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa] flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-400 mb-0.5">Telephone</div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{business.phone}</div>
                      </div>
                    </div>
                  )}

                  {business.headquarters && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa] flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-400 mb-0.5">Headquarters</div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{business.headquarters}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xs">
                <h3 className="text-xl font-black mb-2">Send an Inquiry</h3>
                <p className="text-slate-500 text-xs mb-6">Leave a message for the representative team at {business.name}.</p>
                
                {inquirySent ? (
                  <div className="p-6 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800/40">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                    <h4 className="font-black text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs mt-1">Your inquiry has been relayed to the organization team.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                        <input 
                          type="text" 
                          required 
                          value={inquiryName} 
                          onChange={e => setInquiryName(e.target.value)}
                          placeholder="Jane Doe" 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#5a32fa]/40" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Email</label>
                        <input 
                          type="email" 
                          required 
                          value={inquiryEmail} 
                          onChange={e => setInquiryEmail(e.target.value)}
                          placeholder="jane@example.com" 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#5a32fa]/40" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                      <textarea 
                        required 
                        rows={4} 
                        value={inquiryMessage} 
                        onChange={e => setInquiryMessage(e.target.value)}
                        placeholder="Write your message or collaboration request..." 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-[#5a32fa]/40"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-[#5a32fa] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#4a24db] transition-colors flex items-center gap-2 shadow-md"
                    >
                      <Send size={14} /> Send Message
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: Sponsorships */}
          {activeTab === 'sponsorships' && isAdmin && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <h2 className="text-2xl font-black mb-6">My Sponsorships</h2>
              {sponsorships.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                  <Star size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-medium mb-4">No active event sponsorships yet.</p>
                  <Link href="/platform/events" className="bg-[#5a32fa] text-white px-6 py-2.5 rounded-xl font-bold inline-flex text-xs">
                    Explore Events to Sponsor
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sponsorships.map(app => (
                    <div key={app.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-400">{app.event?.title}</div>
                        <div className="font-black text-lg text-slate-900 dark:text-white">{app.package?.name}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">£{app.package?.price}</span>
                          <span>•</span>
                          <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#5a32fa]">
                          {app.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Direct CTA card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs text-center">
            <h3 className="font-black text-base mb-2">Connect with {business.name}</h3>
            <p className="text-slate-500 text-xs mb-6">
              Have questions, inquiries, or looking for IP legal representation? Reach out directly.
            </p>
            {business.contact_email ? (
              <a 
                href={`mailto:${business.contact_email}`}
                className="block w-full bg-[#5a32fa] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#4a24db] transition-colors shadow-md shadow-purple-500/20"
              >
                Send Email Inquiry
              </a>
            ) : (
              <button 
                onClick={() => setActiveTab('contact')}
                className="w-full bg-[#5a32fa] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#4a24db] transition-colors"
              >
                Inquire Now
              </button>
            )}
          </div>

          {/* Directory Verification Badge Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40">
            <div className="w-10 h-10 bg-[#5a32fa] text-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1.5">
              Verified Platform Organization
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
              This organization is listed in the Women in IP Alliance directory and verified by administration.
            </p>
            <Link 
              href="/platform/resources/ip-firms"
              className="text-[#5a32fa] dark:text-purple-300 font-bold text-xs hover:underline inline-flex items-center gap-1"
            >
              Browse IP Firms Directory →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
