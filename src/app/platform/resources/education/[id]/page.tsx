'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Clock, User, Award, CheckCircle, Download, ExternalLink, GraduationCap, Video, FileText, ChevronRight, Activity, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { UNIVERSITIES_DB } from '../data';
import { useRouter } from 'next/navigation';

export default function EducationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const COURSE_DB: Record<string, any> = {
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
    },
    "29": {
      id: "29",
      title: "Master's in Intellectual Property",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Intermediate/Advanced (No Law Degree Required)",
      type: "Residential Degree",
      overview: "The Master's in Intellectual Property (MIP) program is designed for professionals without a law degree who want to advance their careers by gaining deep expertise in IP. Perfect for scientists, engineers, and business leaders.",
      learningOutcomes: [
        "Gain a solid foundation in the legal framework of intellectual property.",
        "Understand how to protect and commercialize innovations.",
        "Learn patent searching and drafting essentials."
      ],
      modules: [
        { week: "Core", title: "Introduction to the Legal System" },
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Law for Non-Lawyers" }
      ],
      downloads: [
        { title: "MIP Overview (PDF)", type: "PDF", size: "1.5 MB" }
      ],
      certificate: true
    },
    "30": {
      id: "30",
      title: "Master's in Commerce and Technology Law",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1-2 years",
      level: "Intermediate/Advanced (No Law Degree Required)",
      type: "Residential Degree",
      overview: "Built at the intersection of business and law, the Master's in Commerce and Technology program is designed for non-lawyers tackling evolving legal issues in e-commerce, data privacy, and the global information age economy.",
      learningOutcomes: [
        "Understand the legal principles guiding digital business.",
        "Navigate data privacy laws and compliance.",
        "Gain practical knowledge of technology contracting."
      ],
      modules: [
        { week: "Core", title: "Introduction to the Legal System" },
        { week: "Core", title: "Information Privacy Law" },
        { week: "Core", title: "E-Commerce Law Basics" }
      ],
      downloads: [
        { title: "MCTL Overview (PDF)", type: "PDF", size: "1.4 MB" }
      ],
      certificate: true
    },
    "31": {
      id: "31",
      title: "Graduate Certificate in Intellectual Property",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1 year",
      level: "Intermediate/Advanced",
      type: "Residential Certificate",
      overview: "The residential Graduate Certificate in Intellectual Property provides a foundational understanding of IP law for professionals seeking to enhance their credentials in a focused format.",
      learningOutcomes: [
        "Understand core IP law concepts.",
        "Learn to identify and protect IP assets."
      ],
      modules: [
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Law Essentials" }
      ],
      downloads: [
        { title: "IP Certificate Guide (PDF)", type: "PDF", size: "1.1 MB" }
      ],
      certificate: true
    },
    "32": {
      id: "32",
      title: "Graduate Certificate in Commerce and Technology",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "1 year",
      level: "Intermediate/Advanced",
      type: "Residential Certificate",
      overview: "Supported by UNH Law's strong IP foundation, the Commerce and Technology certificate program provides a streamlined overview of legal issues facing new business and e-commerce in the information age.",
      learningOutcomes: [
        "Learn the basics of data privacy and cybersecurity law.",
        "Understand the legal implications of digital commerce."
      ],
      modules: [
        { week: "Core", title: "Information Privacy Law" },
        { week: "Core", title: "E-Commerce and Digital Business" }
      ],
      downloads: [
        { title: "Commerce & Tech Certificate Guide (PDF)", type: "PDF", size: "1.1 MB" }
      ],
      certificate: true
    },
    "33": {
      id: "33",
      title: "Hybrid JD",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "3.5 years",
      level: "Advanced (Juris Doctor)",
      type: "Hybrid Degree",
      overview: "Stay in your home. Stay in your job. Earn your JD primarily online. Join the first and only ABA-approved Hybrid Juris Doctor (JD) Program with a focus on Intellectual Property, Technology, and Health Law.",
      learningOutcomes: [
        "Earn an ABA-approved Juris Doctor degree primarily online.",
        "Gain comprehensive knowledge of the U.S. legal system.",
        "Develop essential legal writing and analytical skills.",
        "Prepare for the bar exam and legal practice."
      ],
      modules: [
        { week: "Core", title: "Contracts and Torts" },
        { week: "Core", title: "Civil Procedure" },
        { week: "Core", title: "Criminal Law" },
        { week: "Core", title: "Constitutional Law" },
        { week: "Residency", title: "On-Campus Immersion Periods" }
      ],
      downloads: [
        { title: "Hybrid JD Program Guide (PDF)", type: "PDF", size: "3.2 MB" },
        { title: "Admissions Requirements", type: "PDF", size: "1.5 MB" }
      ],
      certificate: false
    },
    "34": {
      id: "34",
      title: "Hybrid JD — Intellectual Property, Technology, and Information Law",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "3.5 years",
      level: "Advanced (Juris Doctor)",
      type: "Hybrid Degree",
      overview: "The Intellectual Property, Technology, and Information Law concentration within the Hybrid JD program prepares students to tackle complex legal issues in the tech sector, patents, and digital information, all while earning their degree primarily online.",
      learningOutcomes: [
        "Earn a JD with specialized focus in IP and technology law.",
        "Navigate patent, trademark, and copyright laws.",
        "Address legal challenges in technology and information sectors.",
        "Complete a capstone or clinic in IP law."
      ],
      modules: [
        { week: "Core", title: "Fundamentals of Intellectual Property" },
        { week: "Core", title: "Patent Practice and Procedure" },
        { week: "Core", title: "Technology Contracting" },
        { week: "Elective", title: "Data Privacy Law" },
        { week: "Residency", title: "IP Immersion" }
      ],
      downloads: [
        { title: "IP Concentration Guide (PDF)", type: "PDF", size: "2.1 MB" }
      ],
      certificate: false
    },
    "35": {
      id: "35",
      title: "Hybrid JD — Health and Life Science Law",
      provider: "UNH Franklin Pierce School of Law",
      instructor: "UNH Law Faculty",
      duration: "3.5 years",
      level: "Advanced (Juris Doctor)",
      type: "Hybrid Degree",
      overview: "The Health and Life Sciences concentration within the Hybrid JD program provides specialized training in healthcare regulations, bioethics, and life science compliance, allowing professionals to advance their careers without leaving their jobs.",
      learningOutcomes: [
        "Earn a JD with specialized focus in health and life sciences.",
        "Navigate complex healthcare regulations and compliance.",
        "Address legal issues in bioethics, pharmaceuticals, and public health.",
        "Complete a capstone or clinic in health law."
      ],
      modules: [
        { week: "Core", title: "Health Law and Policy" },
        { week: "Core", title: "Food and Drug Law" },
        { week: "Core", title: "Bioethics and the Law" },
        { week: "Elective", title: "Public Health Law" },
        { week: "Residency", title: "Health Law Immersion" }
      ],
      downloads: [
        { title: "Health Law Concentration Guide (PDF)", type: "PDF", size: "2.0 MB" }
      ],
      certificate: false
    }
  };

  const course = COURSE_DB[id];

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[1200px] mx-auto text-left mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] font-bold text-sm transition-colors">
            <ArrowLeft size={16} />
            Back to previous page
          </button>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-12 rounded-[2rem] shadow-sm text-center max-w-lg mx-auto border border-gray-200 dark:border-white/10">
          <BookOpen className="text-gray-300 dark:text-gray-600 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Details Available</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Detailed information for this specific course has not been provided yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Navigation */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-6">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] font-bold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to previous page
          </button>
          
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
                {course.learningOutcomes?.map((outcome: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a32fa] mt-2 shrink-0"></span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BookOpen className="text-[#5a32fa]" size={20} /> Course Curriculum
              </h3>
              <div className="space-y-4">
                {course.modules?.map((mod: { week: string, title: string }, idx: number) => (
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

            {/* Contact Admissions */}
            {course.provider.includes("UNH") && UNIVERSITIES_DB.unh.contact && (
              <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#5a32fa]" /> Program Contact
                </h3>
                <div className="flex flex-col items-center text-center">
                  <img src={UNIVERSITIES_DB.unh.contact.image} alt={UNIVERSITIES_DB.unh.contact.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-50 shadow-sm dark:border-[#0f172a]" />
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{UNIVERSITIES_DB.unh.contact.name}</h4>
                  <p className="text-sm font-medium text-[#5a32fa] mb-4">{UNIVERSITIES_DB.unh.contact.role}</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    <a href={`mailto:${UNIVERSITIES_DB.unh.contact.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group text-left">
                      <Mail size={16} className="text-gray-400 group-hover:text-[#5a32fa]" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#5a32fa] truncate">{UNIVERSITIES_DB.unh.contact.email}</span>
                    </a>
                    <a href={`tel:${UNIVERSITIES_DB.unh.contact.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group text-left">
                      <Phone size={16} className="text-gray-400 group-hover:text-[#5a32fa]" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#5a32fa]">{UNIVERSITIES_DB.unh.contact.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Downloads Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Download size={20} className="text-[#5a32fa]" /> Downloadable Materials
              </h3>
              <div className="space-y-3">
                {course.downloads?.map((doc: { title: string, type: string, size: string }, idx: number) => (
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
