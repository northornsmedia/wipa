'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Download, FileText, ChevronRight, BarChart3, Building2, Calendar, CheckCircle, Database } from 'lucide-react';
import Link from 'next/link';

export default function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific research report
  const report = {
    id: id,
    title: "Global Intellectual Property Market Outlook 2026-2030",
    type: "Market Report",
    organisation: "WIPA Intelligence Unit",
    authors: [
      "Dr. Samuel Chen, Lead Researcher",
      "Maria Gonzalez, Senior Data Analyst"
    ],
    publicationDate: "October 2026",
    abstract: "This comprehensive report provides a five-year forecast for the global intellectual property market. By analyzing patent filing data, trademark registrations, and litigation trends across 50 major jurisdictions, the WIPA Intelligence Unit projects significant shifts in IP strategy driven by emerging technologies like Generative AI and green tech. The report offers actionable intelligence for law firms, in-house counsel, and policy makers navigating an increasingly complex global landscape.",
    keyFindings: [
      "Global patent filings are projected to grow by 4.2% annually, driven largely by innovations in the Asia-Pacific region.",
      "Litigation costs in the US and EU are expected to stabilize due to increased adoption of alternative dispute resolution mechanisms.",
      "Green technology patent fast-tracking programs have reduced average time-to-grant by 45% in participating jurisdictions.",
      "AI-related IP filings now account for over 12% of all new applications globally, up from just 4% in 2020."
    ],
    downloads: [
      { title: "Full Executive Report", type: "PDF", size: "8.5 MB", icon: FileText },
      { title: "Raw Market Data (Anonymized)", type: "CSV", size: "12.1 MB", icon: Database },
      { title: "Presentation Deck", type: "PPTX", size: "4.2 MB", icon: BarChart3 }
    ],
    related: [
      { id: '2', title: "The Impact of Generative AI on Copyright Systems", type: "White Paper" },
      { id: '4', title: "Patent Litigation Trends in the Tech Sector", type: "Partner Research" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/research-reports" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#ef4444] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to Research & Reports
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#ef4444]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#ef4444]">{report.type}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {report.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Building2 size={16} /> Organisation</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">{report.organisation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar size={16} /> Publication Date</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{report.publicationDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column (Report Body) */}
          <div className="flex-1">
            
            {/* Abstract */}
            <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-200 dark:border-white/10 mb-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <FileText className="text-[#ef4444]" size={24} /> Abstract
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
                {report.abstract}
              </p>
            </div>

            {/* Key Findings */}
            <div className="bg-gradient-to-br from-[#ef4444]/10 to-transparent p-8 md:p-10 rounded-[2rem] border border-[#ef4444]/20 shadow-sm mb-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                <BarChart3 className="text-[#ef4444]" size={24} /> Key Findings
              </h2>
              <ul className="space-y-6">
                {report.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0f172a] shadow-sm flex items-center justify-center text-[#ef4444] shrink-0 mt-1 border border-[#ef4444]/20">
                      <CheckCircle size={16} />
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed pt-1 font-medium">{finding}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authors */}
            <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10">
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-4">Lead Authors</h3>
              <div className="flex flex-wrap gap-4">
                {report.authors.map((author, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-[#0f172a] px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="font-bold text-gray-700 dark:text-gray-300">{author}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Actions) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            
            {/* Download/Access Card */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#ef4444]/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ef4444]/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 relative z-10">
                <Download size={20} className="text-[#ef4444]" /> Access Report
              </h3>
              
              <div className="flex flex-col gap-3 relative z-10">
                {report.downloads.map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <button key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#ef4444]/50 hover:bg-[#ef4444]/5 transition-all group text-left w-full">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-gray-400 group-hover:text-[#ef4444] transition-colors shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-sm group-hover:text-[#ef4444] transition-colors">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-[#ef4444] uppercase">{doc.type}</span>
                          <span className="text-[10px] font-medium text-gray-400">• {doc.size}</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-300 group-hover:text-[#ef4444] transition-colors shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Related Research */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-[#ef4444]" /> Related Research
              </h3>
              <div className="flex flex-col gap-4">
                {report.related.map(item => (
                  <Link key={item.id} href={`/platform/resources/research-reports/${item.id}`} className="group block">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#ef4444]/50 hover:bg-[#ef4444]/5 transition-all">
                      <span className="text-[10px] font-black uppercase text-[#ef4444] mb-2 block">{item.type}</span>
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#ef4444] transition-colors line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
