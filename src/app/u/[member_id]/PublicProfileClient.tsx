'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BadgeCheck, MapPin, Briefcase, Building2, Globe, ShieldCheck, Mail, 
  Share2, Download, Copy, Check, Sparkles, GraduationCap, Calendar, Clock, 
  Star, Play, X, ExternalLink, ArrowUpRight, Phone, Award
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface PositionItem {
  id?: string;
  title: string;
  company: string;
  location?: string;
  years?: number | string;
  current?: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  year?: string;
  grade?: string;
  description?: string;
}

export default function PublicProfileClient({ profile }: { profile: any }) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  const fullName = profile.full_name || 'WIPA Member';
  const memberId = profile.member_id || profile.id;
  const publicUrl = `https://platform.womensipalliance.com/u/${memberId}`;

  // Parse positions
  let positionsList: PositionItem[] = [];
  if (Array.isArray(profile.positions) && profile.positions.length > 0) {
    positionsList = profile.positions;
  } else if (profile.role || profile.company) {
    positionsList = [
      {
        title: profile.role || 'Intellectual Property Specialist',
        company: profile.company || 'International IP Practice',
        location: profile.location || profile.country || 'Global',
        years: profile.experience_years || 5,
        current: true,
        description: ''
      }
    ];
  }

  // Parse educations
  let educationsList: EducationItem[] = [];
  if (Array.isArray(profile.education_data) && profile.education_data.length > 0) {
    educationsList = profile.education_data;
  } else if (Array.isArray(profile.educations) && profile.educations.length > 0) {
    educationsList = profile.educations;
  } else if (profile.education) {
    educationsList = [
      {
        institution: profile.education,
        degree: 'Degree & Professional Accreditation in Intellectual Property Law',
        year: 'Graduated'
      }
    ];
  }

  // Parse practice areas
  const practiceAreasList = (profile.practice_area || profile.practiceAreas || 'Trademark, IP Patents, International Trade')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  // Parse skills
  const skillsList = (profile.skills || 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} • WIPA Digital Pass`,
          text: `Connect with ${fullName} on Women in Intellectual Property Alliance (WIPA).`,
          url: publicUrl,
        });
        return;
      } catch (err) {
        // Fallback to modal
      }
    }
    setIsShareModalOpen(true);
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${fullName};;;;
FN:${fullName}
TITLE:${profile.role || 'IP Professional'}
ORG:${profile.company || 'WIPA Network'};
${profile.email ? `EMAIL;type=INTERNET,pref:${profile.email}` : ''}
${profile.phone ? `TEL;type=CELL:${profile.phone}` : ''}
URL:${publicUrl}
NOTE:Verified Member of Women in Intellectual Property Alliance (WIPA)
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_wipa.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white font-sans flex flex-col selection:bg-[#5a32fa] selection:text-white pb-16">
      
      {/* Top Floating Glass App Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0d14]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <span className="font-black text-base tracking-wider bg-gradient-to-r from-white via-purple-100 to-[#ff90e8] bg-clip-text text-transparent">
              WIPA
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativeShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Share Digital Pass"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">Share</span>
            </button>
            <Link
              href="/auth"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] hover:opacity-90 text-white text-xs font-black shadow-md shadow-purple-500/25 transition-all"
            >
              Join WIPA
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container (Mobile First, Elevated Digital Pass) */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 space-y-6">
        
        {/* ================= HERO CARD (DIGITAL IDENTITY PASS) ================= */}
        <div className="relative rounded-[2rem] bg-gradient-to-b from-[#131927] to-[#0d121c] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl">
          
          {/* Ambient Glow Gradient */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#5a32fa]/30 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-[#ff90e8]/15 blur-3xl pointer-events-none" />

          {/* Cover Banner with Branding */}
          <div className="h-36 sm:h-52 w-full bg-gradient-to-r from-[#5a32fa] via-[#4318d1] to-[#ff2a5f] relative overflow-hidden flex items-center justify-center">
            {profile.cover_url ? (
              <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            )}
            
            {/* WIPA Watermark Brand */}
            <div className="absolute right-4 top-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-1.5 shadow-lg">
              <ShieldCheck size={13} className="text-[#00d26a]" />
              Official Member Pass
            </div>
          </div>

          {/* Identity Body */}
          <div className="px-5 sm:px-8 pb-8 relative">
            
            {/* Avatar & Story Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              <div className="relative self-center sm:self-auto group">
                <div 
                  onClick={() => {
                    if (profile.intro_video_url) {
                      setStoryProgress(0);
                      setIsVideoModalOpen(true);
                    }
                  }}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#5a32fa] via-[#ff90e8] to-[#00d26a] shadow-2xl ring-4 ring-[#0d121c] ${profile.intro_video_url ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#151c2c] flex items-center justify-center relative">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl sm:text-5xl font-black text-white bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] w-full h-full flex items-center justify-center">
                        {fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pulsing Verified Badge */}
                <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#00d26a] text-black ring-4 ring-[#0d121c] shadow-lg" title="Verified Member">
                  <BadgeCheck size={16} className="fill-black text-[#00d26a]" />
                </div>
              </div>

              {/* Action Buttons: Save Contact & Share */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleDownloadVCard}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  title="Save contact card directly to your mobile phone"
                >
                  <Download size={14} />
                  <span>Save Contact</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Share Pass</span>
                </button>
              </div>
            </div>

            {/* Name, Headline & Verified Tag */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00d26a]/15 border border-[#00d26a]/30 text-[#00d26a] text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-purple-200">
                {profile.role || 'Intellectual Property Specialist'} {profile.company ? `• ${profile.company}` : ''}
              </p>

              {/* Meta Chips */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-gray-300 font-semibold">
                {(profile.location || profile.country) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
                    <MapPin size={13} className="text-pink-400" />
                    {profile.location || profile.country}
                  </span>
                )}
                {profile.experience_years && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
                    <Clock size={13} className="text-purple-400" />
                    {profile.experience_years} Years Experience
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono text-[11px] text-purple-300">
                  ID: {memberId}
                </span>
              </div>
            </div>

            {/* Quick Share Link Box */}
            <div className="mt-5 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="text-gray-400 truncate pl-1">{publicUrl.replace('https://', '')}</span>
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copied 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ================= SECTION 1: ABOUT & PRACTICE AREAS ================= */}
        <div className="rounded-[2rem] bg-[#101622] border border-white/10 p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-[#ff90e8] flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">About & Biography</h2>
              <p className="text-xs text-gray-400">Professional background & legal strategy</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line font-normal">
            {profile.bio || 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.'}
          </p>

          {/* Practice Areas */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Briefcase size={13} className="text-[#5a32fa]" />
              Practice Areas & Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {practiceAreasList.map((area: string, idx: number) => (
                <span 
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/60 text-purple-300 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff90e8]" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: EXPERIENCE TIMELINE ================= */}
        <div className="rounded-[2rem] bg-[#101622] border border-white/10 p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-[#5a32fa] flex items-center justify-center font-bold">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Career Experience</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-black uppercase">
                  {positionsList.length} {positionsList.length === 1 ? 'Role' : 'Roles'}
                </span>
              </div>
              <p className="text-xs text-gray-400">Chronological practice & leadership timeline</p>
            </div>
          </div>

          {/* Connected Timeline */}
          <div className="relative pl-2 sm:pl-3 space-y-6 before:absolute before:left-7 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#5a32fa] before:via-indigo-400 before:to-gray-800">
            {positionsList.map((pos, pIdx) => {
              const companyInitial = (pos.company || 'C').charAt(0).toUpperCase();
              const colorGradients = [
                'from-[#5a32fa] to-[#8b5cf6]',
                'from-[#ff2a5f] to-[#ff90e8]',
                'from-[#00b4d8] to-[#0077b6]',
                'from-[#10b981] to-[#059669]'
              ];
              const selectedGrad = colorGradients[pIdx % colorGradients.length];

              return (
                <div key={pos.id || pIdx} className="relative flex items-start gap-3.5 sm:gap-5 group">
                  {/* Monogram Node */}
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${selectedGrad} text-white flex items-center justify-center font-black text-base shadow-lg ring-4 ring-[#101622] shrink-0`}>
                    {companyInitial}
                  </div>

                  {/* Details Container */}
                  <div className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 p-4 sm:p-5 rounded-2xl transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {pos.title}
                      </h4>
                      {pos.current && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Current Role
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff90e8] mb-2.5">
                      <Building2 size={13} />
                      <span>{pos.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-400">
                      {pos.years && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                          <Clock size={11} className="text-purple-400" />
                          {pos.years} yrs experience
                        </span>
                      )}
                      {pos.location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                          <MapPin size={11} className="text-pink-400" />
                          {pos.location}
                        </span>
                      )}
                      {pos.startDate && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                          <Calendar size={11} className="text-indigo-400" />
                          {pos.startDate} {pos.endDate ? `– ${pos.endDate}` : (pos.current ? '– Present' : '')}
                        </span>
                      )}
                    </div>

                    {pos.description && (
                      <p className="mt-3 pt-2.5 border-t border-white/10 text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                        {pos.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SECTION 3: EDUCATION & CREDENTIALS ================= */}
        <div className="rounded-[2rem] bg-[#101622] border border-white/10 p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Education & Credentials</h2>
              <p className="text-xs text-gray-400">Academic degrees and accredited certifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {educationsList.map((edu, idx) => (
              <div key={edu.id || idx} className="flex items-start gap-3.5 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg ring-4 ring-[#101622] shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <h4 className="text-sm sm:text-base font-black text-white">{edu.institution}</h4>
                    {edu.year && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {edu.year}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-purple-300">
                    {edu.degree} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ''}
                  </p>
                  {edu.grade && (
                    <p className="text-xs text-gray-400 mt-1">
                      Honors / Grade: <span className="text-white font-bold">{edu.grade}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* LexisNexis Accreditation Badge */}
            <div className="flex items-start gap-3.5 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 to-indigo-950/40 border border-blue-500/30">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md ring-4 ring-[#101622] shrink-0">
                LN
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                    LexisNexis® Certified IP Analytics Specialist
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase border border-blue-500/30">
                    Verified
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-300">
                  PatentSight+™ Portfolio Valuation & TotalPatent One® Search Mastery
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">
                  Issued in partnership with WIPA • ID: LN-WIPA-2024-8842
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: SKILLS ================= */}
        <div className="rounded-[2rem] bg-[#101622] border border-white/10 p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-[#ff90e8] flex items-center justify-center font-bold">
              <Star size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Skills & Competencies</h2>
              <p className="text-xs text-gray-400">Peer-validated professional capabilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsList.map((skill: string, idx: number) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff90e8]" />
                  <span className="font-bold text-xs sm:text-sm text-white">{skill}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Validated
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 5: SOCIAL & LINKS ================= */}
        {(profile.linkedin_url || profile.website_url || profile.twitter_url || profile.email) && (
          <div className="rounded-[2rem] bg-[#101622] border border-white/10 p-6 sm:p-7 space-y-4 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Verified Links & Direct Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#0a66c2]/15 hover:bg-[#0a66c2]/25 border border-[#0a66c2]/30 text-white font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn Profile
                  </span>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </a>
              )}

              {profile.website_url && (
                <a
                  href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={16} className="text-[#ff90e8]" />
                    Official Website
                  </span>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ================= BOTTOM CTA: CONNECT ON WIPA ================= */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-[#5a32fa] via-[#4318d1] to-[#ff2a5f] p-8 sm:p-10 text-center text-white space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-inner">
            <Mail size={24} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Connect with {fullName} on WIPA
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto leading-relaxed">
            Join the Women in Intellectual Property Alliance to send encrypted direct messages, collaborate on briefs, and unlock exclusive global IP member intelligence.
          </p>
          <div className="pt-2">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles size={16} className="text-[#5a32fa]" />
              <span>Apply for WIPA Membership</span>
            </Link>
          </div>
        </div>

      </main>

      {/* ================= STORY VIDEO MODAL ================= */}
      {isVideoModalOpen && profile.intro_video_url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-black text-white w-full max-w-sm sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] sm:rounded-3xl border-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Story Header & Line Progress */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Progress Line */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>

              {/* User Avatar + Close Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] flex items-center justify-center font-bold text-xs ring-2 ring-white/50 overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      fullName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
                      {fullName} <BadgeCheck size={14} className="text-[#00d26a]" />
                    </h4>
                    <p className="text-[10px] text-white/70">WIPA Member Story</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Full Story Video */}
            <div className="w-full h-full sm:min-h-[500px] sm:max-h-[75vh] bg-black flex items-center justify-center relative overflow-hidden">
              <video 
                key={profile.intro_video_url}
                autoPlay
                playsInline
                preload="auto"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration > 0) {
                    setStoryProgress((v.currentTime / v.duration) * 100);
                  }
                }}
                onEnded={() => {
                  setStoryProgress(100);
                  setIsVideoModalOpen(false);
                }}
                className="w-full h-full object-cover sm:object-contain"
              >
                <source src={profile.intro_video_url} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ================= QR SHARE MODAL ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151c2c] w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl text-center text-white space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center text-2xl font-bold mx-auto">
              {fullName.charAt(0)}
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{fullName}</h3>
              <p className="text-xs text-gray-400">{profile.role || 'WIPA Member'}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border">
              <QRCodeCanvas value={publicUrl} size={160} />
            </div>

            <button 
              onClick={handleCopyLink}
              className="w-full py-3 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
