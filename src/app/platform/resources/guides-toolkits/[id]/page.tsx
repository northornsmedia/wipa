'use client';

import React from 'react';
import { ArrowLeft, Download, FileText, Wrench, CheckCircle, Target, ListChecks, FileCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific guide resource
  const guide = {
    id: id,
    title: "In-House Counsel IP Audit Toolkit",
    type: "Toolkit",
    author: "Corporate Practice Team",
    format: "ZIP Archive (5 Templates + 1 Guide)",
    size: "12.4 MB",
    description: "A comprehensive toolkit designed specifically for in-house legal teams to conduct thorough internal intellectual property audits. This package includes customizable templates for tracking patents, trademarks, and trade secrets, along with a best-practice guide for interviewing technical staff and identifying undocumented IP assets.",
    intendedUse: [
      "Annual or bi-annual internal IP portfolio reviews.",
      "Preparing for M&A due diligence.",
      "Onboarding new engineering or R&D teams to establish IP capture processes."
    ],
    instructions: [
      { step: 1, title: "Review the Master Guide", desc: "Start by reading 'IP_Audit_Best_Practices.pdf' to understand the methodology." },
      { step: 2, title: "Distribute Questionnaires", desc: "Send the 'Inventor_Questionnaire.docx' to your lead engineers and product managers." },
      { step: 3, title: "Populate the Tracker", desc: "Compile the results into the 'Master_IP_Tracker.xlsx' spreadsheet." },
      { step: 4, title: "Identify Gaps", desc: "Use the 'Gap_Analysis_Template.pptx' to present findings and missing protections to the executive team." }
    ],
    related: [
      { id: '3', title: "SaaS Licensing Agreement Template", type: "Template" },
      { id: '4', title: "Defensive Publication Checklist", type: "Checklist" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/guides-toolkits" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#14b8a6] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to Guides & Toolkits
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#14b8a6]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#14b8a6]">{guide.type}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {guide.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/10 pt-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Format & Size</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileCheck size={18} className="text-[#14b8a6]" /> {guide.format} • {guide.size}
              </span>
            </div>
            
            <button className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] flex items-center justify-center gap-2 shrink-0">
              <Download size={20} /> Download Toolkit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-12">
        
        {/* Description & Intended Use */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Description */}
          <div className="md:col-span-2 bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="text-[#14b8a6]" size={24} /> Resource Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {guide.description}
            </p>
          </div>

          {/* Intended Use Cases */}
          <div className="bg-gradient-to-br from-[#14b8a6]/10 to-transparent rounded-[2rem] p-8 border border-[#14b8a6]/20 shadow-sm">
            <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Target className="text-[#14b8a6]" size={20} /> Intended Use
            </h3>
            <ul className="space-y-4">
              {guide.intendedUse.map((use, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#14b8a6] shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-200 dark:border-white/10 mb-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
            <ListChecks className="text-[#14b8a6]" size={24} /> How to Use This Toolkit
          </h2>
          
          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] md:before:left-[23px] before:w-0.5 before:bg-gray-100 dark:before:bg-white/10">
            {guide.instructions.map((inst, idx) => (
              <div key={idx} className="relative flex items-start gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-[#1e293b] border-4 border-[#14b8a6]/20 flex items-center justify-center font-black text-[#14b8a6] text-lg relative z-10 shrink-0 shadow-sm">
                  {inst.step}
                </div>
                <div className="bg-gray-50 dark:bg-[#0f172a] p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex-1 mt-[-4px]">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{inst.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{inst.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Resources */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
            <Wrench className="text-[#14b8a6]" size={24} /> Related Practical Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {guide.related.map(item => (
              <Link key={item.id} href={`/platform/resources/guides-toolkits/${item.id}`} className="group bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#14b8a6] bg-[#14b8a6]/10 px-2 py-1 rounded-md mb-3 inline-block">{item.type}</span>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#14b8a6] transition-colors line-clamp-2 pr-4">{item.title}</h4>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-[#14b8a6] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
