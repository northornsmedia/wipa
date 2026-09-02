'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  Award, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  GraduationCap, 
  PlayCircle, 
  FileText, 
  ChevronRight, 
  Activity, 
  Mail, 
  Phone, 
  Loader2, 
  Sparkles, 
  Star, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Target, 
  Users2, 
  Check, 
  Building, 
  Globe2, 
  Calendar,
  Zap,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { UNIVERSITIES_DB } from '../data';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EducationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'eligibility' | 'methodology'>('overview');

  const STATIC_COURSE_DB: Record<string, any> = {
    "24": {
      id: "24",
      title: "LL.M. in Intellectual Property (Online)",
      provider: "University of New Hampshire Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Advanced (Requires Law Degree)",
      type: "Online Degree",
      coverImage: "https://img.magnific.com/free-photo/medium-shot-woman-living-as-digital-nomad_23-2151205454.jpg?ga=GA1.1.1499046589.1787222723&semt=ais_hybrid&w=740&q=80",
      overview: "Franklin Pierce School of Law's LL.M. in Intellectual Property online program is designed for legal professionals seeking specialization in IP. Ranked top 10 for IP law for over 30 years, this program provides comprehensive training in patent, copyright, and trademark law.",
      summary: "Comprehensive advanced legal master's degree focusing on global patent prosecution, trademark enforcement, and technology commercialization.",
      learningOutcomes: [
        "Master the fundamentals of US and international intellectual property law.",
        "Navigate complex patent prosecution and litigation frameworks.",
        "Understand trademark registration and enforcement strategies worldwide.",
        "Develop expertise in copyright law and digital media rights."
      ],
      modules: [
        { week: "Module 1", title: "Fundamentals of Global Intellectual Property" },
        { week: "Module 2", title: "Patent Practice, Claims & Procedure" },
        { week: "Module 3", title: "Trademarks, Brand Clearance & Deceptive Practices" },
        { week: "Module 4", title: "Technology Transfer & Commercial Licensing" },
        { week: "Module 5", title: "International & Comparative IP Systems" },
        { week: "Module 6", title: "Digital Copyright & Emerging Technologies" }
      ],
      downloads: [
        { title: "Program Curriculum & Syllabus (PDF)", type: "PDF", size: "2.1 MB" },
        { title: "Admissions & Credit Transfer Guide", type: "PDF", size: "1.5 MB" }
      ],
      certificate: true
    },
    "25": {
      id: "25",
      title: "Master's in Intellectual Property (Online)",
      provider: "University of New Hampshire Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Intermediate / Executive (No Law Degree Required)",
      type: "Online Degree",
      coverImage: "https://img.magnific.com/free-photo/scenes-people-work_23-2151895520.jpg?ga=GA1.1.1499046589.1787222723&semt=ais_hybrid&w=740&q=80",
      overview: "The Master's in Intellectual Property (MIP) online program is designed for professionals without a law degree who want to advance their careers by gaining deep expertise in IP. Perfect for scientists, engineers, and business leaders.",
      summary: "Executive master's program empowering non-lawyer professionals, engineers, and scientists with patent drafting, valuation, and licensing skills.",
      learningOutcomes: [
        "Gain a solid foundation in the legal framework of intellectual property.",
        "Understand how to protect and commercialize innovations.",
        "Learn patent searching and drafting essentials.",
        "Navigate IP issues in business strategy and technology transfer."
      ],
      modules: [
        { week: "Module 1", title: "Introduction to the Global Legal System" },
        { week: "Module 2", title: "Fundamentals of Intellectual Property" },
        { week: "Module 3", title: "Patent Law for Engineers & Non-Lawyers" },
        { week: "Module 4", title: "IP Valuation & Corporate Asset Management" },
        { week: "Module 5", title: "Licensing & Technology Commercialization" },
        { week: "Module 6", title: "Trademarks in Strategic Brand Building" }
      ],
      downloads: [
        { title: "MIP Program Overview (PDF)", type: "PDF", size: "1.8 MB" },
        { title: "Career Opportunities in IP Industry", type: "PDF", size: "900 KB" }
      ],
      certificate: true
    }
  };

  useEffect(() => {
    async function loadCourseData() {
      setLoading(true);
      try {
        // 1. Check if ID matches static database first
        if (STATIC_COURSE_DB[id]) {
          setCourse(STATIC_COURSE_DB[id]);
          setLoading(false);
          return;
        }

        // 2. Check in all university static courses
        for (const [uniKey, uni] of Object.entries(UNIVERSITIES_DB)) {
          const match = (uni as any).courses?.find((c: any) => String(c.id) === String(id));
          if (match) {
            setCourse({
              id: match.id,
              title: match.title,
              provider: (uni as any).name,
              instructor: match.instructor || (uni as any).name + " Faculty",
              duration: match.time || match.duration || "Self-Paced",
              level: match.level || "Professional Accreditation",
              type: match.type || "University Course",
              coverImage: match.image || (uni as any).coverImage || "/resourceimg1.jpg",
              overview: match.description || match.overview || `${match.title} delivered by ${(uni as any).name}.`,
              summary: match.summary || `Certified academic curriculum provided by ${(uni as any).name}.`,
              learningOutcomes: match.learningOutcomes || [
                `Master foundational and advanced principles of ${match.title}.`,
                "Practical application, case studies, and compliance frameworks.",
                "Industry-recognized certification upon completion."
              ],
              modules: match.modules || [
                { week: "Module 1", title: "Introduction & Theoretical Framework" },
                { week: "Module 2", title: "Practical Application & Case Studies" },
                { week: "Module 3", title: "Compliance & Industry Best Practices" }
              ],
              downloads: match.downloads || [],
              certificate: true,
              uniKey
            });
            setLoading(false);
            return;
          }
        }

        // 3. Query Supabase database
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (data) {
          // Parse learning outcomes from tags
          let outcomes: string[] = [];
          if (Array.isArray(data.tags) && data.tags.length > 0) {
            outcomes = data.tags.map((t: string) => `Comprehensive mastery of ${t} principles and practical workflows.`);
          }

          const overviewText = data.content || data.description || data.summary || "";

          setCourse({
            id: data.id,
            title: data.title,
            provider: data.organization || "WIPA Academy",
            instructor: data.author_name || "Faculty Specialist",
            duration: data.read_time || "Self-Paced",
            level: "Professional Certification",
            type: data.resource_type || data.type || "Masterclass",
            coverImage: data.cover_image_url || "/resourceimg1.jpg",
            overview: overviewText,
            summary: data.summary || "",
            rawContent: data.content || "",
            tags: data.tags || [],
            learningOutcomes: outcomes.length > 0 ? outcomes : null,
            modules: null,
            downloads: data.file_url ? [{ title: "Course Syllabus & Reference Materials (PDF)", type: "PDF", size: "2.4 MB", url: data.file_url }] : [],
            certificate: true,
            enrollUrl: data.url || data.external_url || null,
          });
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error("Error loading course details:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    loadCourseData();
  }, [id]);

  // Extract structured subsections from raw content (e.g. Methodology stages, Eligibility points)
  const parsedSections = useMemo(() => {
    if (!course) return { stages: [], eligibility: [], generalOverview: '' };

    const content = course.rawContent || course.overview || '';
    
    // Parse Methodology Stages
    const stages: { stage: string; title: string; desc: string }[] = [];
    const stageRegex = /Stage\s*(\d+)\s*:\s*([^\n]+)/gi;
    let match;
    while ((match = stageRegex.exec(content)) !== null) {
      stages.push({
        stage: `Stage ${match[1]}`,
        title: match[2].split('.')[0].trim(),
        desc: match[2].trim()
      });
    }

    // Parse Eligibility Bullet Points
    const eligibility: string[] = [];
    const bulletLines = content.split('\n');
    let isEligibilityBlock = false;
    for (const line of bulletLines) {
      const trimmed = line.trim();
      if (/^Eligibility/i.test(trimmed)) {
        isEligibilityBlock = true;
        continue;
      }
      if (isEligibilityBlock) {
        if (/^[•\-\*]\s*(.+)/.test(trimmed)) {
          eligibility.push(trimmed.replace(/^[•\-\*]\s*/, '').trim());
        } else if (trimmed.length > 0 && !/^[•\-\*]/.test(trimmed) && eligibility.length > 0) {
          // End of bullet block if a regular paragraph starts
          if (!trimmed.startsWith('•')) break;
        }
      }
    }

    // Clean Overview Text by stripping out structured sections if present
    let generalOverview = content;
    if (stages.length > 0 || eligibility.length > 0) {
      generalOverview = content
        .split(/Course Methodology/i)[0]
        .replace(/Stage\s*\d+:[\s\S]*/i, '')
        .trim();
    }

    return {
      stages,
      eligibility,
      generalOverview: generalOverview || course.summary || content
    };
  }, [course]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={20} />
        </div>
        <p className="text-gray-400 font-medium text-sm mt-4 tracking-wide">Loading course curriculum & details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#07090e] text-gray-900 dark:text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto text-left mb-8">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to previous page
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-[#11141f] p-12 rounded-[2.5rem] shadow-xl text-center max-w-lg mx-auto border border-gray-200 dark:border-white/10">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Details Available</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6">
            Detailed information for this specific course has not been published to the catalog yet.
          </p>
          <button 
            onClick={() => router.push('/platform/resources/education')} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-105 active:scale-95"
          >
            Explore Available Masterclasses <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans pb-28">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO HEADER */}
      {/* ========================================================================= */}
      <div className="relative bg-[#0b0f19] text-white pt-8 pb-16 md:pb-24 overflow-hidden border-b border-white/10">
        
        {/* Background Image with Ambient Glass & Glows */}
        <div className="absolute inset-0 z-0">
          <img 
            src={course.coverImage} 
            alt={course.title} 
            className="w-full h-full object-cover object-center opacity-25 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-[#0b0f19]/50" />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Breadcrumb + Back + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border border-white/15 transition-all group cursor-pointer"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-white/50 font-semibold">
                <Link href="/platform/resources/education" className="hover:text-indigo-300 transition-colors">WIPA Academy</Link>
                <span>/</span>
                <span className="text-white/80 truncate max-w-[240px]">{course.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-full text-xs font-bold backdrop-blur-md border border-white/15 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>

              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full text-xs font-bold backdrop-blur-md border transition-all cursor-pointer ${
                  isBookmarked 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
                title="Save course"
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-amber-400' : ''} />
              </button>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="max-w-4xl">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-indigo-400" /> {course.type}
              </span>

              {course.certificate && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={13} className="text-emerald-400" /> Verified Certificate
                </span>
              )}

              <span className="bg-white/10 text-white/90 border border-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 Rating · 240+ Enrolled
              </span>
            </div>

            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.15] tracking-tight mb-6 drop-shadow-lg">
              {course.title}
            </h1>

            {/* Short Tagline / Summary */}
            {course.summary && (
              <p className="text-base sm:text-lg text-indigo-100/90 font-medium leading-relaxed mb-8 max-w-3xl drop-shadow-sm">
                {course.summary}
              </p>
            )}

            {/* Metadata Pills Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/15">
              
              {/* Provider */}
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Building size={14} /> Provider
                </div>
                <p className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                  {course.provider}
                </p>
              </div>

              {/* Instructor */}
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <GraduationCap size={14} /> Lead Faculty
                </div>
                <p className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                  {course.instructor}
                </p>
              </div>

              {/* Duration */}
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Clock size={14} /> Duration
                </div>
                <p className="font-bold text-white text-xs sm:text-sm">
                  {course.duration}
                </p>
              </div>

              {/* Level */}
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Activity size={14} /> Skill Level
                </div>
                <p className="font-bold text-white text-xs sm:text-sm">
                  {course.level}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Editorial & Structured Learning Journey) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Course Core Content */}
          <div className="flex-1 min-w-0 w-full space-y-8">

            {/* Quick Navigation Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#11141f] p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar">
              {[
                { key: 'overview', label: 'Overview', icon: BookOpen },
                ...(parsedSections.stages.length > 0 || (course.modules && course.modules.length > 0) ? [{ key: 'curriculum', label: 'Curriculum & Methodology', icon: Layers }] : []),
                ...(parsedSections.eligibility.length > 0 ? [{ key: 'eligibility', label: 'Who Should Attend', icon: Users2 }] : []),
                ...(course.learningOutcomes && course.learningOutcomes.length > 0 ? [{ key: 'methodology', label: 'Key Competencies', icon: Target }] : [])
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={15} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* SECTION 1: OVERVIEW CARD */}
            <div className="bg-white dark:bg-[#11141f] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Program Overview</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Core objective and educational focus</p>
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed space-y-4">
                {parsedSections.generalOverview.split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Specializations & Frameworks Chips */}
              {course.tags && course.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Globe2 size={13} className="text-indigo-500" /> Focus Domains & International Treaties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag: string, idx: number) => (
                      <span 
                        key={idx} 
                        className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs hover:border-indigo-400 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: 3-STAGE COURSE METHODOLOGY (If present in text or parsed) */}
            {parsedSections.stages.length > 0 && (
              <div className="bg-white dark:bg-[#11141f] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Course Methodology</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Three-step structured learning pathway</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {parsedSections.stages.map((st, idx) => {
                    const icons = [BookOpen, PlayCircle, Award];
                    const StepIcon = icons[idx % icons.length];
                    const gradients = [
                      'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
                      'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400',
                      'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    ];

                    return (
                      <div 
                        key={idx}
                        className={`relative rounded-3xl p-6 border bg-gradient-to-b ${gradients[idx % gradients.length]} flex flex-col justify-between group hover:shadow-lg transition-all`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">{st.stage}</span>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-black/40 flex items-center justify-center shadow-xs">
                              <StepIcon size={16} />
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                            {st.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            {st.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                          <CheckCircle2 size={13} className="text-emerald-500" /> Milestone {idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: CURRICULUM MODULES (If defined in structured DB) */}
            {Array.isArray(course.modules) && course.modules.length > 0 && (
              <div className="bg-white dark:bg-[#11141f] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Curriculum Modules</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Progressive week-by-week deep dive</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {course.modules.map((mod: { week: string, title: string }, idx: number) => (
                    <div 
                      key={idx} 
                      className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#0c0e15] border border-gray-200 dark:border-white/5 hover:border-indigo-500/50 hover:bg-white dark:hover:bg-[#141824] transition-all shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                        0{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block mb-0.5">{mod.week}</span>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {mod.title}
                        </h4>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: WHO SHOULD ENROLL / ELIGIBILITY (If parsed or available) */}
            {parsedSections.eligibility.length > 0 && (
              <div className="bg-white dark:bg-[#11141f] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Users2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Who Should Attend</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Recommended participant profiles & eligibility criteria</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {parsedSections.eligibility.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-gray-50 dark:bg-[#0c0e15] border border-gray-200 dark:border-white/5 flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: KEY LEARNING OUTCOMES */}
            {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
              <div className="bg-white dark:bg-[#11141f] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Target size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Key Takeaways & Competencies</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Practical skills gained after completing this program</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      <span className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY ENROLLMENT & ACTIONS SIDEBAR */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-8 space-y-6 shrink-0">
            
            {/* Primary Enrollment Card */}
            <div className="bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-1 shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              
              <div className="bg-white dark:bg-[#11141f] rounded-[2.3rem] p-6 sm:p-8 text-gray-900 dark:text-white relative z-10">
                
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} className="fill-emerald-500" /> Enrollment Open
                  </span>
                  <span className="text-xs font-bold text-gray-400">Cohort 2026</span>
                </div>

                <h3 className="text-2xl font-black mb-2">Advance Your IP Mastery</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Join industry peers in this accredited program certified by WIPA Academy and partner institutions.
                </p>

                {/* Primary CTA */}
                {course.enrollUrl ? (
                  <a 
                    href={course.enrollUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                  >
                    Enrol / Register Now <ExternalLink size={16} />
                  </a>
                ) : (
                  <button 
                    onClick={() => alert("Thank you for your interest! Enrollment inquiry has been registered. Our admissions coordinator will reach out shortly.")} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                  >
                    Enrol / Register <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {/* Included Features Checklist */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">What's Included</p>
                  
                  {[
                    "Full access to interactive lectures & recordings",
                    "Comprehensive syllabus & study materials",
                    "Official WIPA verified digital certificate",
                    "Direct faculty Q&A and assignment review",
                    "Lifetime alumni networking and community access"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Faculty & Instructor Profile Box */}
            <div className="bg-white dark:bg-[#11141f] rounded-[2rem] p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <GraduationCap size={15} className="text-indigo-500" /> Lead Faculty
              </h4>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                  {course.instructor ? course.instructor.charAt(0) : 'F'}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                    {course.instructor}
                  </h5>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {course.provider}
                  </p>
                </div>
              </div>
            </div>

            {/* Downloads / Attachments (If present) */}
            {Array.isArray(course.downloads) && course.downloads.length > 0 && (
              <div className="bg-white dark:bg-[#11141f] rounded-[2rem] p-6 border border-gray-200 dark:border-white/10 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <Download size={15} className="text-indigo-500" /> Syllabus & Downloads
                </h4>

                <div className="space-y-2.5">
                  {course.downloads.map((doc: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={doc.url || "#"} 
                      target={doc.url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0c0e15] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-gray-200 dark:border-white/5 hover:border-indigo-500/40 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText size={18} className="text-indigo-500 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Download size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Need Assistance Card */}
            <div className="bg-gray-50 dark:bg-[#0c0e15] rounded-[2rem] p-5 border border-gray-200 dark:border-white/5 text-center">
              <HelpCircle className="text-gray-400 mx-auto mb-2" size={20} />
              <p className="text-xs font-bold text-gray-900 dark:text-white">Need help with registration?</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 mb-3">Our academic coordinator is available to assist you.</p>
              <a 
                href="mailto:contact@womensipalliance.com?subject=Inquiry regarding WIPA Academy Course"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <Mail size={12} /> Contact Admissions Team
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
