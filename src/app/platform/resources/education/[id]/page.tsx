'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Clock, User, Award, CheckCircle, Download, ExternalLink, GraduationCap, Video, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function EducationDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the specific educational resource
  const course = {
    id: params.id,
    title: "Patent Law Fundamentals",
    provider: "UNH Franklin Pierce School of Law",
    instructor: "Prof. Amanda Lewis",
    duration: "6 weeks",
    level: "Intermediate",
    type: "Online Course",
    overview: "This comprehensive course covers the foundational principles of patent law, including patentability requirements, the patent application process, and strategies for patent enforcement and defense. Designed specifically for IP professionals seeking to deepen their technical understanding.",
    learningOutcomes: [
      "Understand the key requirements for patentability (novelty, non-obviousness, utility).",
      "Navigate the patent prosecution process effectively.",
      "Analyze patent claims and determine scope of protection.",
      "Identify strategies for patent portfolio management and monetization."
    ],
    modules: [
      { week: "Week 1", title: "Introduction to Intellectual Property and Patents" },
      { week: "Week 2", title: "Requirements for Patentability" },
      { week: "Week 3", title: "The Patent Application and Prosecution Process" },
      { week: "Week 4", title: "Patent Claims and Claim Construction" },
      { week: "Week 5", title: "Infringement and Defenses" },
      { week: "Week 6", title: "International Patent Law and Strategies" }
    ],
    downloads: [
      { title: "Course Syllabus (PDF)", type: "PDF", size: "1.2 MB" },
      { title: "Patent Case Law Summary", type: "Doc", size: "450 KB" }
    ],
    certificate: true
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Navigation */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-6">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/education" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] font-bold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to Education Hub
          </Link>
          
          <div className="flex items-center gap-3 text-sm font-bold text-[#5a32fa] mb-4">
            <span className="bg-[#5a32fa]/10 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">{course.type}</span>
            {course.certificate && (
              <span className="flex items-center gap-1 text-[#00d26a] bg-[#00d26a]/10 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                <Award size={12} /> Certificate Available
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-gray-100 mb-6 leading-tight">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-[#5a32fa]" />
              <span>Provider: <strong className="text-gray-800 dark:text-gray-100">{course.provider}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-[#5a32fa]" />
              <span>Instructor: <strong className="text-gray-800 dark:text-gray-100">{course.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#5a32fa]" />
              <span>Duration: <strong className="text-gray-800 dark:text-gray-100">{course.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#5a32fa]" />
              <span>Level: <strong className="text-gray-800 dark:text-gray-100">{course.level}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Content) */}
          <div className="flex-1">
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm mb-8">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4">Course Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
                {course.overview}
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="text-[#5a32fa]" size={20} /> Learning Outcomes
              </h3>
              <ul className="space-y-3 mb-8">
                {course.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a32fa] mt-2 shrink-0"></span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BookOpen className="text-[#5a32fa]" size={20} /> Course Modules
              </h3>
              <div className="space-y-3">
                {course.modules.map((mod, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0f172a] border border-gray-100 dark:border-white/5">
                    <span className="font-bold text-[#5a32fa] shrink-0 w-16">{mod.week}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{mod.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            
            {/* Enrollment Action Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-[#5a32fa]/30 shadow-lg shadow-[#5a32fa]/5 text-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Ready to advance your career?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enrollment is currently open for the next cohort.</p>
              <button className="w-full bg-[#5a32fa] hover:bg-[#4927d3] text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group">
                Enrol / Register <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Downloads Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Download size={20} className="text-[#5a32fa]" /> Downloadable Materials
              </h3>
              <div className="space-y-3">
                {course.downloads.map((doc, idx) => (
                  <a key={idx} href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400 group-hover:text-[#5a32fa] transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#5a32fa] transition-colors">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-[#5a32fa]" /> Related Learning
              </h3>
              <div className="space-y-4">
                <Link href="/platform/resources/education/2" className="block group">
                  <span className="text-[10px] font-black uppercase text-[#0984e3] mb-1 block">Article</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#5a32fa] transition-colors line-clamp-2">How to Navigate the EPO Examination Process</h4>
                </Link>
                <div className="border-t border-gray-100 dark:border-white/5"></div>
                <Link href="/platform/resources/education/3" className="block group">
                  <span className="text-[10px] font-black uppercase text-[#e84393] mb-1 block">Masterclass</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#5a32fa] transition-colors line-clamp-2">Advanced Claim Drafting Techniques</h4>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
