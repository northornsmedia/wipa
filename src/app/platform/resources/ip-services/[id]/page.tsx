'use client';

import React, { use } from 'react';
import { ArrowLeft, Building, MapPin, Globe, Mail, Phone, Shield, FileText, CheckCircle2, Quote, Users, Map } from 'lucide-react';
import Link from 'next/link';

// Using the same mock data to find the specific company
const MOCK_COMPANIES = [
  {
    id: "pss-solutions",
    name: "PSS Solutions",
    type: "IP Operations Experts",
    location: "Basel, Switzerland",
    website: "www.pss-solutions.com",
    sponsored: true,
    logo: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
    description: "PSS is the only fully independent IP focused consulting and advisory group in the sector. Impartial, honest, clear. At PSS Solutions we unite people, structure and strategy. It is our firm belief that only such a holistic approach can lead to sustainable and profitable IP operations.",
    quote: "Technology in isolation will never resolve a problem. It is a key foundation on which the right people, structure and strategy is underpinned by.",
    services: [
      "Strategic IP Operations", 
      "IP Spend Management", 
      "IP-Technology Advisory", 
      "Training and Upskilling", 
      "IP Data Analytics", 
      "IP Procurement", 
      "IP Project + Change Management", 
      "IP Investors"
    ],
    locations: ["Switzerland", "Singapore", "Germany", "China", "United Kingdom", "Australia", "France", "USA"],
    team: [
      { name: "Nadine Stuttle", role: "Senior IP Operations Expert", initials: "NS" },
      { name: "Virginien Leost", role: "Senior IP Operations Expert", initials: "VL" },
      { name: "Roisin Williams", role: "Senior Consultant", initials: "RW" },
      { name: "Franck Lancien", role: "Director – IP Consulting", initials: "FL" }
    ],
    contact: {
      phone: "+41 76 565 63 99",
      email: "info@pss-solutions.com",
      address: "Froburgstrasse 12, 4052 Basel, Switzerland"
    }
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
  const [activeTab, setActiveTab] = React.useState('Overview');

  const TABS = ['Overview', 'Videos', 'Articles', 'Webinars', 'Events'];

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
            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center shrink-0 p-4">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <Building size={40} className="text-sky-500" />
              )}
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

      <div className="border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar py-6">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-2xl md:text-3xl font-black whitespace-nowrap transition-colors duration-300 tracking-tight ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {activeTab === 'Overview' && (
              <>
                {/* Quote Banner */}
                {company.quote && (
                  <div className="relative p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-sky-500 to-cyan-500 text-white overflow-hidden shadow-2xl shadow-sky-500/20 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <Quote size={80} className="absolute -top-4 -left-4 text-white/10 rotate-180 group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-2xl md:text-3xl font-black leading-snug relative z-10 mb-6 italic tracking-tight text-white/95">
                      "{company.quote}"
                    </h3>
                  </div>
                )}

                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="text-sky-500" size={28} /> Our Philosophy
                  </h2>
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                    {company.description}
                  </div>
                </section>

                {company.services && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Shield className="text-sky-500" size={28} /> Areas of Expertise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.services.map((service, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center shrink-0 group-hover:bg-sky-500 transition-colors duration-300">
                            <CheckCircle2 size={20} className="text-sky-500 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{service}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {company.team && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Users className="text-sky-500" size={28} /> Key Operations Experts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {company.team.map((member: any, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 flex items-center gap-5 hover:shadow-lg transition-shadow">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl font-black text-slate-500 dark:text-slate-300 shadow-inner">
                            {member.initials}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-slate-900 dark:text-white">{member.name}</h4>
                            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {activeTab !== 'Overview' && (
              <div className="py-20 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-slate-900/20 rounded-[2rem] border border-slate-200 dark:border-white/5 border-dashed">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No {activeTab} Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-sm">
                  {company.name} hasn't uploaded any {activeTab.toLowerCase()} to their profile at this time.
                </p>
              </div>
            )}
            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            <div className="p-8 rounded-[2rem] bg-sky-500 text-white shadow-2xl shadow-sky-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <h3 className="text-3xl font-black mb-8 relative z-10 tracking-tight">Contact & Connect</h3>
              
              <div className="space-y-6 font-medium relative z-10 text-lg">
                <div className="flex items-start gap-4">
                  <Globe size={24} className="text-sky-200 shrink-0 mt-1" /> 
                  <a href={`https://${company.website}`} target="_blank" className="hover:text-white hover:underline underline-offset-4">{company.website}</a>
                </div>
                {company.contact && (
                  <>
                    <div className="flex items-start gap-4">
                      <Mail size={24} className="text-sky-200 shrink-0 mt-1" /> 
                      <a href={`mailto:${company.contact.email}`} className="hover:text-white hover:underline underline-offset-4">{company.contact.email}</a>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone size={24} className="text-sky-200 shrink-0 mt-1" /> 
                      {company.contact.phone}
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin size={24} className="text-sky-200 shrink-0 mt-1" /> 
                      <span className="leading-snug">{company.contact.address}</span>
                    </div>
                  </>
                )}
              </div>

              <button className="w-full mt-10 bg-white text-sky-600 font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 text-lg">
                Request Consultation
              </button>
            </div>

            {company.locations && (
              <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-lg">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <Map className="text-sky-500" size={24} /> Global Presence
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.locations.map((loc: string, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold border border-slate-200 dark:border-white/5">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
          
        </div>
      </div>

    </div>
  );
}
