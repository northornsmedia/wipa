'use client';

import React, { use } from 'react';
import { ArrowLeft, Building, MapPin, Globe, Mail, Phone, Shield, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Using the same mock data to find the specific company
const MOCK_COMPANIES = [
  {
    id: "wipa-legal",
    name: "WIPA Legal Team",
    type: "Enterprise IP Solutions",
    location: "Global",
    website: "www.wipa.org",
    sponsored: true,
    description: "The official WIPA Legal Team provides premier intellectual property services, focusing on comprehensive global trademark registration, patent drafting, and enterprise-level IP portfolio management.",
    services: ["Global Trademark Registration", "Patent Drafting", "IP Portfolio Audit", "Infringement Litigation"],
  },
  {
    id: "tech-protect-llp",
    name: "TechProtect LLP",
    type: "Digital IP Specialists",
    location: "San Francisco, CA",
    website: "www.techprotect.com",
    sponsored: false,
    description: "Specializing in copyright protection for digital assets, software patents, and AI-generated content licensing.",
    services: ["Software Patents", "Digital Copyrights", "Open Source Compliance"],
  },
  {
    id: "innovate-partners",
    name: "Innovate Partners",
    type: "Consulting & Strategy",
    location: "London, UK",
    website: "www.innovatepartners.co.uk",
    sponsored: false,
    description: "Strategic IP consulting firm helping startups and enterprises maximize the valuation of their intellectual property assets.",
    services: ["IP Valuation", "Strategy Consulting", "Due Diligence"],
  }
];

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const company = MOCK_COMPANIES.find(c => c.id === resolvedParams.id) || MOCK_COMPANIES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden pb-20">
      
      {/* Cinematic Header */}
      <div className="relative min-h-[400px] w-full flex flex-col justify-end pb-12 pt-32 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-slate-100 dark:from-[#082f49] dark:via-[#020617] dark:to-black z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/30 dark:bg-sky-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
        
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-start justify-end h-full">
          <Link href="/platform/resources/ip-services" className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold mb-8 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} /> Back to IP Services
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center shrink-0">
              <Building size={40} className="text-sky-500" />
            </div>
            <div>
              {company.sponsored && (
                <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                  Sponsored Partner
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {company.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                <MapPin size={16} /> {company.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-sky-500" /> About the Company
              </h2>
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-lg text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                {company.description}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="text-sky-500" /> Services Offered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.services.map((service, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-start gap-4">
                    <CheckCircle2 size={24} className="text-sky-500 shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{service}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-sky-500 text-white shadow-xl shadow-sky-500/20">
              <h3 className="text-2xl font-black mb-6">Contact & Connect</h3>
              
              <div className="space-y-4 font-medium">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-sky-200" /> {company.website}
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-sky-200" /> contact@{company.id}.com
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-sky-200" /> +1 (555) 123-4567
                </div>
              </div>

              <button className="w-full mt-8 bg-white text-sky-600 font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
                Request Consultation
              </button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
