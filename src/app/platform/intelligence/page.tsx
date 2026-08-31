'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Shield, Zap, TrendingUp, BarChart3, Globe, Award, Sparkles, 
  ArrowUpRight, CheckCircle2, ChevronRight, FileText, Activity, Layers, 
  Cpu, Filter, Download, HelpCircle, ArrowRight, BookOpen, Clock, AlertCircle
} from 'lucide-react';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'landscape' | 'advisor' | 'benchmark' | 'seps'>('landscape');
  const [patentQuery, setPatentQuery] = useState('');
  const [artUnit, setArtUnit] = useState('2100');
  const [techDomain, setTechDomain] = useState('artificial-intelligence');
  const [portfolioPatents, setPortfolioPatents] = useState(45);
  const [citationRatio, setCitationRatio] = useState(1.4);

  // Computed Patent Asset Index score
  const computedScore = Math.min(100, Math.round((portfolioPatents * 0.85) * (citationRatio * 1.2)));

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-white transition-colors">
      {/* Top Hero Banner with LexisNexis Co-Branding */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-900/90 via-indigo-950/95 to-slate-950 p-6 md:p-10 text-white shadow-2xl backdrop-blur-xl mb-8">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={13} className="text-blue-300" />
              Global IP Intelligence Backbone • LexisNexis® IP Suite
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              LexisNexis® <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">IP Intelligence Center</span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Institutional patent analytics, examiner prosecution predictions, and portfolio valuation benchmarked across 100+ global patent authorities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                <Shield size={14} className="text-blue-400" /> Institutional Verification
              </div>
              <div className="text-lg font-black text-white">Shepard&apos;s® & PatentSight+™</div>
              <div className="text-[11px] text-blue-200 mt-0.5">Live Data Feed Active • 99.98% Accuracy</div>
            </div>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <div className="mt-8 relative z-10 max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input 
              type="text"
              value={patentQuery}
              onChange={(e) => setPatentQuery(e.target.value)}
              placeholder="Search 142M+ global patents by publication number, assignee (e.g., US11847290B2, Apple, Qualcomm)..."
              className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-white/15 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 backdrop-blur-md shadow-inner"
            />
            <button className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md">
              Analyze Patent
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Indexed Global Patents', val: '142.8M+', change: '+180K this week', icon: Globe, color: 'text-blue-500' },
          { label: 'Patent Offices Covered', val: '100+', change: 'Full-text & Citations', icon: Layers, color: 'text-purple-500' },
          { label: 'USPTO Art Unit Coverage', val: '99.4%', change: 'Examiner analytics live', icon: Activity, color: 'text-emerald-500' },
          { label: 'Active Standard Essential SEPs', val: '340,000+', change: '5G, 6G & AI Radar', icon: Cpu, color: 'text-amber-500' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.label}</span>
                <Icon size={16} className={kpi.color} />
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{kpi.val}</div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">{kpi.change}</div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs for Enterprise Modules */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6 overflow-x-auto">
        {[
          { id: 'landscape', label: 'Patent Landscape Visualizer', icon: Globe },
          { id: 'advisor', label: 'PatentAdvisor® Prosecution Predictor', icon: Activity },
          { id: 'benchmark', label: 'Patent Asset Index™ Benchmark', icon: BarChart3 },
          { id: 'seps', label: 'IPlytics™ SEP & Frontier Tech Radar', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: Patent Landscape Visualizer */}
      {activeTab === 'landscape' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Interactive Landscape Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Global Patent Filing Velocity by Technology Sector
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">TotalPatent One® Global Index 2024–2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                    Live Feed
                  </span>
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="space-y-4">
                {[
                  { sector: 'Generative AI & LLM Architecture', count: '142,500 filings', pct: 92, growth: '+44.2%' },
                  { sector: 'Semiconductor Fabrication (EUV / 2nm)', count: '98,400 filings', pct: 76, growth: '+28.6%' },
                  { sector: 'Autonomous EV & Solid-State Batteries', count: '84,100 filings', pct: 65, growth: '+19.8%' },
                  { sector: 'Biotech & CRISPR-Cas Therapeutics', count: '62,800 filings', pct: 52, growth: '+15.4%' },
                  { sector: 'Quantum Computing & Cryptography', count: '31,200 filings', pct: 34, growth: '+51.3%' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{item.sector}</span>
                      <span className="text-slate-500 dark:text-slate-400">{item.count} <strong className="text-emerald-600 ml-1">{item.growth}</strong></span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" 
                        style={{ width: `${item.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jurisdiction Breakdown */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Top Filing Authorities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Global patent distribution share</p>

                <div className="space-y-3">
                  {[
                    { authority: 'USPTO (United States)', share: '38.4%', trend: 'Strong Grant Rate' },
                    { authority: 'EPO (Europe)', share: '24.1%', trend: 'Unitary Patent Surge' },
                    { authority: 'CNIPA (China)', share: '21.5%', trend: 'Domestic Volume High' },
                    { authority: 'JPO (Japan)', share: '10.2%', trend: 'Precision Engineering' },
                    { authority: 'WIPO (PCT International)', share: '5.8%', trend: 'Global Expansion' }
                  ].map((auth, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{auth.authority}</div>
                        <div className="text-[10px] text-slate-500">{auth.trend}</div>
                      </div>
                      <div className="text-xs font-black text-blue-600 dark:text-blue-400">{auth.share}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                <button className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
                  <Download size={13} /> Export Global Landscape Report (.PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PatentAdvisor Prosecution Predictor */}
      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Prosecution Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Select USPTO Art Unit to simulate examiner tendencies & allowance metrics.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">USPTO Tech Center / Art Unit</label>
                <select 
                  value={artUnit} 
                  onChange={(e) => setArtUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none"
                >
                  <option value="2100">TC 2100: Computer Architecture & Software</option>
                  <option value="2600">TC 2600: Communications & Networking</option>
                  <option value="1600">TC 1600: Biotechnology & Organic Chemistry</option>
                  <option value="2800">TC 2800: Semiconductors & Optics</option>
                  <option value="3700">TC 3700: Mechanical & Medical Devices</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                  <Shield size={14} /> PatentAdvisor® ETA Metric
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                  Examiner Time Allocation (ETA) predicts likelihood of grant based on examiner difficulty quartile.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Art Unit {artUnit} Prosecution Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Benchmarked against 45,000+ historical applications</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Average Allowance Rate</div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1">68.4%</div>
                <div className="text-[10px] text-emerald-700/80">Moderate Examiner Difficulty</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-center">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300">Avg. Office Actions</div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-1">2.3</div>
                <div className="text-[10px] text-blue-700/80">Before Notice of Allowance</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 text-center">
                <div className="text-xs font-bold text-purple-800 dark:text-purple-300">Time to Grant</div>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400 my-1">21.8 mo</div>
                <div className="text-[10px] text-purple-700/80">From Initial Filing</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Recommended Prosecution Strategy (PatentOptimizer™):</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Early Examiner Interview:</strong> Scheduling an interview post-first OA increases allowance odds by <strong>34%</strong> in this unit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>101 Subject Matter Eligibility:</strong> Focus independent claims on concrete physical architecture to bypass Alice/Mayo rejections.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Patent Asset Index Benchmark */}
      {activeTab === 'benchmark' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Portfolio Diagnostic</h3>
              <p className="text-xs text-slate-500">Calculate Patent Asset Index™ competitive strength.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Active Patent Families:</span>
                <span className="text-blue-600 dark:text-blue-400">{portfolioPatents} families</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="250" 
                value={portfolioPatents} 
                onChange={(e) => setPortfolioPatents(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Forward Citation Multiplier:</span>
                <span className="text-purple-600 dark:text-purple-400">{citationRatio}x Industry Avg</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3.0" 
                step="0.1" 
                value={citationRatio} 
                onChange={(e) => setCitationRatio(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-center">
              <div className="text-xs font-medium text-slate-300">Simulated Patent Asset Index™</div>
              <div className="text-4xl font-black text-blue-300 my-1">{computedScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
              <div className="text-[11px] text-emerald-400 font-semibold">Top 15% in Technology Relevance</div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Competitive Impact Quadrant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Benchmarked against global Fortune 500 patent holders</p>
            </div>

            <div className="relative h-64 w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">High Relevance / High Impact (Leaders)</div>
                <div className="border-b border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">High Volume / Moderate Impact</div>
                <div className="border-r border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">Emerging Innovators</div>
                <div className="p-2 text-[10px] font-bold text-slate-400">Legacy Portfolios</div>
              </div>

              {/* Plotted Dot */}
              <div 
                className="relative z-10 flex flex-col items-center animate-pulse"
                style={{ transform: `translate(${(computedScore - 50) * 1.5}px, -${(computedScore - 50) * 0.8}px)` }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1 shadow-md">
                  Your Portfolio ({computedScore})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span>Methodology: <em>Patent Asset Index™ by LexisNexis PatentSight®</em></span>
              <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Request Full Corporate Due Diligence Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: IPlytics SEP & Frontier Tech Radar */}
      {activeTab === 'seps' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12182e]/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              IPlytics™ Standard Essential Patent (SEP) Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live declarations in 3GPP 5G, 6G, V2X, and IEEE 802.11 standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { standard: '5G Standard Essential (3GPP Rel 17/18)', count: '48,200 declarations', leader: 'Qualcomm, Huawei, Ericsson' },
              { standard: 'V2X Automotive Connected Fleet', count: '14,800 declarations', leader: 'LG Electronics, Samsung, Toyota' },
              { standard: 'Wi-Fi 7 (IEEE 802.11be Next-Gen)', count: '9,400 declarations', leader: 'Broadcom, Intel, MediaTek' }
            ].map((sep, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{sep.standard}</div>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">{sep.count}</div>
                <div className="text-[11px] text-slate-500">Top Assignees: <strong>{sep.leader}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Co-Branded Footer Information */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
            LN
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Official Global Knowledge & Analytics Partner</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Powered by LexisNexis® IP Solutions (PatentSight+, TotalPatent One, PatentAdvisor, IPlytics)</div>
          </div>
        </div>
        <Link 
          href="/platform/resources/research-reports" 
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0"
        >
          View Research Reports
        </Link>
      </div>
    </div>
  );
}
