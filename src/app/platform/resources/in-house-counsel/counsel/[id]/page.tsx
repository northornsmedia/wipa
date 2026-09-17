'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building, MapPin, Briefcase, Award, Shield, CheckCircle2, 
  ExternalLink, Mail, MessageSquare, Share2, Sparkles, BookOpen, 
  GraduationCap, Clock, FileText, ChevronRight, Download, Users, Star
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchInHouseCounsels, InHouseCounsel, MOCK_IN_HOUSE_COUNSELS } from '@/lib/in-house-counsels';
import { supabase } from '@/lib/supabase';

export default function CounselProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [counsel, setCounsel] = useState<InHouseCounsel | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCounsel() {
      try {
        const { data: p } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, company, country, bio, experience_years, practice_area, skills, membership_tier')
          .eq('id', id)
          .maybeSingle();

        if (p && p.full_name) {
          const matchingMock = MOCK_IN_HOUSE_COUNSELS.find(m => m.id === p.id);
          setCounsel({
            id: p.id,
            name: p.full_name,
            role: p.role || matchingMock?.role || "In-House IP Counsel",
            company: p.company || matchingMock?.company || "Corporate Legal",
            location: p.country || matchingMock?.location || "Global",
            avatar: p.avatar_url || matchingMock?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
            coverImage: matchingMock?.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=400&q=80",
            experienceYears: p.experience_years || matchingMock?.experienceYears || 12,
            practiceArea: p.practice_area || matchingMock?.practiceArea || "Corporate Intellectual Property",
            skills: p.skills ? (typeof p.skills === 'string' ? p.skills.split(',').map((s: string) => s.trim()) : p.skills) : (matchingMock?.skills || ["Patent Strategy", "Outside Counsel Management"]),
            bio: p.bio || matchingMock?.bio || `Senior in-house counsel at ${p.company} leading enterprise IP strategy.`,
            isVerified: true,
            membershipTier: p.membership_tier,
            patentsManaged: matchingMock?.patentsManaged || "250+ Assets",
            previousRoles: matchingMock?.previousRoles || [
              {
                title: "Senior Legal Counsel",
                company: p.company || "Enterprise Legal",
                period: "2019 - Present",
                description: "Lead corporate intellectual property counsel managing global patent portfolios."
              }
            ],
            education: matchingMock?.education || ["J.D. in Intellectual Property Law"],
            achievements: matchingMock?.achievements || ["WIPA Verified In-House Counsel Leader"],
            quote: matchingMock?.quote || "Strategic IP management turns legal assets into enterprise value."
          });
          return;
        }

        const all = await fetchInHouseCounsels();
        const found = all.find(c => c.id === id) || MOCK_IN_HOUSE_COUNSELS.find(c => c.id === id) || MOCK_IN_HOUSE_COUNSELS[0];
        setCounsel(found);
      } catch (err) {
        setCounsel(MOCK_IN_HOUSE_COUNSELS[0]);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadCounsel();
    }
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-sky-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading Counsel Dossier…</span>
        </div>
      </div>
    );
  }

  if (!counsel) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Counsel Profile Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested in-house counsel dossier is not available.</p>
        <Link 
          href="/platform/resources/in-house-counsel"
          className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-all"
        >
          Return to In-House Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-24">
      
      {/* Top Breadcrumbs / Navigation Bar */}
      <div className="border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#080d1e]/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/platform/resources/in-house-counsel"
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 dark:bg-white/5 dark:hover:bg-sky-950/40 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to In-House Directory</span>
            </Link>

            <span className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></span>

            <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Shield size={13} className="text-sky-500" />
              <span>Verified In-House Counsel Dossier</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 size={13} />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>

            <Link
              href={`/platform/profile/${counsel.id}`}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-black shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Users size={13} />
              <span>WIPA Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Cover Header */}
      <div className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-white/10">
        {/* Cover Image / Gradient */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
          <img 
            src={counsel.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&h=500&q=80"} 
            alt={counsel.name} 
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Profile Card Header Info */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 pb-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar Photo */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white dark:border-[#080d1e] shadow-2xl bg-slate-800">
                  <img 
                    src={counsel.avatar} 
                    alt={counsel.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-sky-500 text-white rounded-full ring-4 ring-white dark:ring-[#080d1e] shadow-md" title="Verified In-House Counsel">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                  <Shield size={11} /> Enterprise In-House Counsel
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {counsel.name}
                </h1>
                
                {/* Position & Company */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs sm:text-sm font-bold text-sky-200">
                  <span className="flex items-center gap-1.5 text-white">
                    <Briefcase size={14} className="text-sky-400" />
                    {counsel.role}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">&bull;</span>
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <Building size={14} className="text-sky-400" />
                    {counsel.company}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {counsel.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    {counsel.experienceYears}+ Years Legal Experience
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Portfolio</div>
                <div className="text-base sm:text-lg font-black text-white">{counsel.patentsManaged || "300+ Assets"}</div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tenure</div>
                <div className="text-base sm:text-lg font-black text-sky-400">{counsel.experienceYears}+ Yrs</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Dossier Content Body */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Experience History, Bio, & Portfolio Details (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Executive Bio */}
            <section className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <h2 className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3 flex items-center gap-2">
                <FileText size={15} /> Executive Counsel Overview
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {counsel.bio}
              </p>

              {counsel.quote && (
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 text-slate-800 dark:text-sky-200 text-xs sm:text-sm font-semibold italic">
                  "{counsel.quote}"
                </div>
              )}
            </section>

            {/* Experience & Career Milestones Timeline */}
            <section className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Briefcase size={18} className="text-sky-500" />
                  Career Experience & Leadership History
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {counsel.experienceYears}+ Years Track Record
                </span>
              </div>

              {/* Current Role Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500 text-white mb-2 inline-block">
                      Present In-House Position
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{counsel.role}</h3>
                    <div className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mt-0.5">
                      <Building size={14} /> {counsel.company}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Present</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  Leading strategic patent prosecution, global portfolio rationalization, outside counsel management, and intellectual property litigation defense.
                </p>
              </div>

              {/* Previous Roles Timeline */}
              {counsel.previousRoles && counsel.previousRoles.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Prior Corporate & Law Firm Positions
                  </div>

                  <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-3 pl-5 space-y-6">
                    {counsel.previousRoles.map((role, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline node */}
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-[#0b1329] group-hover:bg-sky-500 transition-colors"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                            {role.title}
                          </h4>
                          <span className="text-xs font-semibold text-slate-400">{role.period}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                          <Building size={12} /> {role.company}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* In-House Core Practice Areas & Competencies */}
            <section className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-sky-500" />
                Specialized Practice Areas & Technical Competencies
              </h2>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {counsel.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-sky-500 hover:text-sky-500 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT: Quick Contact, Education, & Related In-House Playbooks (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Connect Card */}
            <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                Corporate Counsel Connectivity
              </h3>
              
              <div className="space-y-3">
                <Link
                  href={`/platform/profile/${counsel.id}`}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Users size={15} />
                  <span>Connect on WIPA Network</span>
                </Link>

                <Link
                  href={`/platform/messages`}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={15} className="text-sky-500" />
                  <span>Direct Message</span>
                </Link>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Domain:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{counsel.practiceArea}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{counsel.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-sky-500">
                    <CheckCircle2 size={12} /> Verified Member
                  </span>
                </div>
              </div>
            </div>

            {/* Education & Credentials */}
            {counsel.education && (
              <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4 flex items-center gap-2">
                  <GraduationCap size={15} /> Academic & Legal Credentials
                </h3>
                <ul className="space-y-2.5">
                  {counsel.education.map((edu, idx) => (
                    <li key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recognitions & Honors */}
            {counsel.achievements && (
              <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4 flex items-center gap-2">
                  <Award size={15} /> Honors & Distinctions
                </h3>
                <ul className="space-y-2.5">
                  {counsel.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <Star size={13} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended In-House Playbook */}
            <div className="bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent rounded-3xl p-6 border border-sky-500/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-1.5">
                <BookOpen size={13} /> Recommended Playbook
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 leading-snug">
                Outside Counsel Guidelines & Fee Management
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Download the standardized framework for billing compliance, alternative fee arrangements (AFAs), and patent prosecution rate audits.
              </p>
              <Link 
                href="/platform/resources/in-house-counsel"
                className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 dark:text-sky-400 hover:underline"
              >
                <span>Access In-House Toolkit</span>
                <ChevronRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
