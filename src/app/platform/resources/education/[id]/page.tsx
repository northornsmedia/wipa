'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, User, Award, CheckCircle, Download, ExternalLink, GraduationCap, Video, FileText, ChevronRight, Activity, Mail, Phone, Loader2, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { UNIVERSITIES_DB } from '../data';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EducationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);

  const STATIC_COURSE_DB: Record<string, any> = {
    "24": {
      id: "24",
      title: "LL.M. in Intellectual Property (Online)",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Advanced (Requires Law Degree)",
      type: "Online Degree",
      overview: "Franklin Pierce School of Law's LL.M. in Intellectual Property online program is designed for legal professionals seeking specialization in IP. Ranked top 10 for IP law for over 30 years, this program provides comprehensive training in patent, copyright, and trademark law.",
      learningOutcomes: [
        "Master the fundamentals of US and international intellectual property law.",
        "Navigate complex patent prosecution and litigation.",
        "Understand trademark registration and enforcement strategies.",
        "Develop expertise in copyright law and digital media."
      ],
      modules: [
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Practice and Procedure" },
        { week: "Core", title: "Trademarks and Deceptive Practices" },
        { week: "Elective", title: "Technology Transfer" },
        { week: "Elective", title: "International and Comparative IP" },
        { week: "Elective", title: "Copyright Law" }
      ],
      downloads: [
        { title: "Program Curriculum (PDF)", type: "PDF", size: "2.1 MB" },
        { title: "Admissions Guide", type: "PDF", size: "1.5 MB" }
      ],
      certificate: true
    },
    "25": {
      id: "25",
      title: "Master's in Intellectual Property (Online)",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Intermediate/Advanced (No Law Degree Required)",
      type: "Online Degree",
      overview: "The Master's in Intellectual Property (MIP) online program is designed for professionals without a law degree who want to advance their careers by gaining deep expertise in IP. Perfect for scientists, engineers, and business leaders.",
      learningOutcomes: [
        "Gain a solid foundation in the legal framework of intellectual property.",
        "Understand how to protect and commercialize innovations.",
        "Learn patent searching and drafting essentials.",
        "Navigate IP issues in business strategy and technology transfer."
      ],
      modules: [
        { week: "Core", title: "Introduction to the Legal System" },
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Law for Non-Lawyers" },
        { week: "Elective", title: "IP Management and Valuation" },
        { week: "Elective", title: "Licensing Intellectual Property" },
        { week: "Elective", title: "Trademarks in Business" }
      ],
      downloads: [
        { title: "MIP Program Overview (PDF)", type: "PDF", size: "1.8 MB" },
        { title: "Career Opportunities in IP", type: "PDF", size: "900 KB" }
      ],
      certificate: true
    },
    "26": {
      id: "26",
      title: "Graduate Certificate in Intellectual Property (Online)",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1 year",
      level: "Intermediate/Advanced",
      type: "Online Certificate",
      overview: "Designed for busy professionals, the Graduate Certificate in Intellectual Property provides a foundational understanding of IP law in an accessible online format.",
      learningOutcomes: [
        "Gain a foundational understanding of IP law.",
        "Learn the basics of patent, trademark, and copyright.",
        "Understand IP management and strategy."
      ],
      modules: [
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Law Essentials" },
        { week: "Core", title: "Trademarks and Copyrights" }
      ],
      downloads: [
        { title: "Certificate Curriculum (PDF)", type: "PDF", size: "1.0 MB" }
      ],
      certificate: true
    },
    "27": {
      id: "27",
      title: "LL.M. in Intellectual Property",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1 year",
      level: "Advanced (Requires Law Degree)",
      type: "Residential Degree",
      overview: "Franklin Pierce School of Law's LL.M. in Intellectual Property program is designed for legal professionals seeking specialization in IP. Ranked top 10 for IP law for over 30 years, this residential program provides comprehensive training in patent, copyright, and trademark law.",
      learningOutcomes: [
        "Master the fundamentals of US and international intellectual property law.",
        "Navigate complex patent prosecution and litigation.",
        "Understand trademark registration and enforcement strategies.",
        "Develop expertise in copyright law and digital media."
      ],
      modules: [
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Practice and Procedure" },
        { week: "Core", title: "Trademarks and Deceptive Practices" },
        { week: "Elective", title: "Technology Transfer" },
        { week: "Elective", title: "International and Comparative IP" }
      ],
      downloads: [
        { title: "Program Curriculum (PDF)", type: "PDF", size: "2.1 MB" }
      ],
      certificate: true
    },
    "28": {
      id: "28",
      title: "LL.M. in Commerce and Technology Law",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1 year",
      level: "Advanced (Requires Law Degree)",
      type: "Residential Degree",
      overview: "Supported by UNH Franklin Pierce Law School's strong IP foundation, the Commerce and Technology program is built at the intersection of business and law. The program explores evolving legal issues facing new business and e-commerce in the global information age economy, with a focus on data and privacy law.",
      learningOutcomes: [
        "Navigate the intersection of business, law, and technology.",
        "Address evolving legal issues in e-commerce.",
        "Master data privacy and cybersecurity regulations.",
        "Counsel clients on digital economy legal matters."
      ],
      modules: [
        { week: "Core", title: "Information Privacy Law" },
        { week: "Core", title: "E-Commerce and Digital Business" },
        { week: "Core", title: "Technology Contracting" },
        { week: "Elective", title: "Cybersecurity Law" },
        { week: "Elective", title: "Fintech and Blockchain" }
      ],
      downloads: [
        { title: "Commerce & Tech Curriculum (PDF)", type: "PDF", size: "1.8 MB" }
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
              level: match.level || "Intermediate / Professional",
              type: match.type || "University Course",
              overview: match.description || match.overview || `${match.title} delivered by ${(uni as any).name}.`,
              learningOutcomes: match.learningOutcomes || [
                `Master foundational and advanced principles of ${match.title}.`,
                "Practical application and case study analysis.",
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
          // Parse learning outcomes from tags or content
          let outcomes: string[] = [];
          if (Array.isArray(data.tags) && data.tags.length > 0) {
            outcomes = data.tags.map((t: string) => `Comprehensive coverage of ${t} and real-world IP applications.`);
          }

          // Check if syllabus/modules are present or generate from content
          const overviewText = data.content || data.description || data.summary || "";

          setCourse({
            id: data.id,
            title: data.title,
            provider: data.organization || "WIPA Academy",
            instructor: data.author_name || "Faculty Specialist",
            duration: data.read_time || "Self-Paced",
            level: "Professional Certification",
            type: data.resource_type || data.type || "Masterclass",
            overview: overviewText,
            summary: data.summary,
            learningOutcomes: outcomes.length > 0 ? outcomes : null,
            modules: null,
            downloads: data.file_url ? [{ title: "Course Syllabus & Reference Materials (PDF)", type: "PDF", size: "2.4 MB", url: data.file_url }] : [],
            certificate: true,
            enrollUrl: data.url || data.external_url || null,
            coverImage: data.cover_image_url
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={36} />
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[1200px] mx-auto text-left mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] font-bold text-sm transition-colors cursor-pointer">
            <ArrowLeft size={16} />
            Back to previous page
          </button>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-12 rounded-[2rem] shadow-sm text-center max-w-lg mx-auto border border-gray-200 dark:border-white/10">
          <BookOpen className="text-gray-300 dark:text-gray-600 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Details Available</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Detailed information for this specific course has not been published yet.</p>
          <button onClick={() => router.push('/platform/resources/education')} className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
            Explore Available Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Navigation & Cinematic Header */}
      <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <div className="relative bg-gradient-to-b from-indigo-900 via-[#1e293b] to-[#1e293b] border border-indigo-500/20 rounded-[2.5rem] pt-8 pb-12 overflow-hidden shadow-2xl shadow-indigo-900/10">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          
          <div className="relative z-10 px-6 md:px-10 lg:px-12">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-indigo-200 hover:text-white font-bold text-sm mb-8 transition-all group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 cursor-pointer">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to previous page
            </button>
            
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-indigo-300 mb-6">
              <span className="bg-indigo-500/20 text-indigo-200 px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] border border-indigo-500/30 backdrop-blur-md">
                {course.type}
              </span>
              {course.certificate && (
                <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] border border-emerald-500/30 backdrop-blur-md">
                  <Award size={14} /> Certificate Available
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight drop-shadow-lg max-w-4xl">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium pt-8 border-t border-white/10">
              {course.provider && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <GraduationCap size={18} className="text-indigo-400" />
                  <span className="text-indigo-200">Provider: <strong className="text-white ml-1">{course.provider}</strong></span>
                </div>
              )}
              {course.instructor && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <User size={18} className="text-indigo-400" />
                  <span className="text-indigo-200">Instructor: <strong className="text-white ml-1">{course.instructor}</strong></span>
                </div>
              )}
              {course.duration && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <Clock size={18} className="text-indigo-400" />
                  <span className="text-indigo-200">Duration: <strong className="text-white ml-1">{course.duration}</strong></span>
                </div>
              )}
              {course.level && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <Activity size={18} className="text-indigo-400" />
                  <span className="text-indigo-200">Level: <strong className="text-white ml-1">{course.level}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 pt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Content) */}
          <div className="flex-1">
            <div className="bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-gray-200 dark:border-white/10 shadow-xl shadow-indigo-900/5 mb-8">
              
              {/* Overview */}
              {course.overview ? (
                <>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Course Overview</h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg mb-10 whitespace-pre-line space-y-4">
                    {course.overview}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 mb-8">
                  <BookOpen className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-500 font-semibold">No detailed course overview text provided yet.</p>
                </div>
              )}

              {/* Learning Outcomes (Only show if present) */}
              {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 md:p-8 mb-10 border border-indigo-100 dark:border-indigo-500/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                      <CheckCircle size={20} />
                    </div>
                    Learning Outcomes & Focus Areas
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                        <span className="font-medium text-sm leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Curriculum / Modules (Only show if present) */}
              {Array.isArray(course.modules) && course.modules.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                      <BookOpen size={20} />
                    </div>
                    Course Curriculum
                  </h3>
                  <div className="space-y-3">
                    {course.modules.map((mod: { week: string, title: string }, idx: number) => (
                      <div key={idx} className="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                        <span className="font-black text-indigo-500 shrink-0 w-20 text-sm uppercase tracking-wider">{mod.week}</span>
                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 group-hover:bg-indigo-500/30 transition-colors"></div>
                        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{mod.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            
            {/* Enrollment Action Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-1 border border-indigo-400/50 shadow-2xl shadow-indigo-600/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="bg-white dark:bg-[#0f172a] rounded-[1.8rem] p-8 relative z-10 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-500/20">
                  <Award size={32} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ready to advance?</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Enrollment and registration are open. Advance your IP mastery today.
                </p>
                {course.enrollUrl ? (
                  <a 
                    href={course.enrollUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Enrol / Register Now <ExternalLink size={18} />
                  </a>
                ) : (
                  <button 
                    onClick={() => alert("Thank you for your interest! Enrollment admissions details have been recorded.")} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Enrol / Register <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Downloads Card (Only show if present) */}
            {Array.isArray(course.downloads) && course.downloads.length > 0 && (
              <div className="bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/10 shadow-lg shadow-gray-200/20 dark:shadow-none transition-all hover:border-indigo-500/30">
                <h3 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Download size={20} />
                  </div>
                  Materials & Downloads
                </h3>
                <div className="space-y-3">
                  {course.downloads.map((doc: { title: string, type: string, size: string, url?: string }, idx: number) => (
                    <a 
                      key={idx} 
                      href={doc.url || "#"} 
                      target={doc.url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#0f172a] border border-transparent hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] shadow-sm flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                          <FileText size={18} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{doc.title}</p>
                          <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Back Navigation */}
            <div className="bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/10 text-center">
              <Link 
                href="/platform/resources/education"
                className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-bold text-sm"
              >
                <ArrowLeft size={16} /> Explore All WIPA Academy Courses
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
