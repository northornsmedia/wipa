'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Briefcase, MapPin, Building2, DollarSign, Bookmark, ArrowRight, X, ExternalLink, ArrowLeft, Star,
  Search, Sparkles, Filter, CheckCircle2, Globe, Clock, Zap, TrendingUp, ShieldCheck, ChevronRight,
  Eye, Send, FileText, BadgeCheck, Compass, Heart, Share2, Award, Check, Layers, SlidersHorizontal,
  User, Mail, Phone, Lock, ChevronDown, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdSlot from '@/components/AdSlot';

interface JobItem {
  id: string | number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  color: string;
  logoInitial: string;
  poster_is_wipa_recommended?: boolean;
  description: string;
  practiceArea?: string;
  experience_level?: string;
  is_featured?: boolean;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
}

const PRACTICE_AREAS = [
  { id: 'all', label: 'All Roles', icon: '🌐' },
  { id: 'patent', label: 'Patent Prosecution', icon: '⚖️' },
  { id: 'trademark', label: 'Trademark & Brands', icon: '®️' },
  { id: 'litigation', label: 'IP Litigation', icon: '⚡' },
  { id: 'legaltech', label: 'Legal AI & Tech', icon: '🤖' },
  { id: 'licensing', label: 'Licensing & Deals', icon: '🤝' },
];

const TOP_COMPANIES = [
  { 
    name: "Global IP Partners", 
    openRoles: 12, 
    color: "#b892ff", 
    initial: "G", 
    tagline: "Tier 1 Global IP Firm", 
    hq: "London & New York" 
  },
  { 
    name: "Anthropic AI", 
    openRoles: 5, 
    color: "#ff90e8", 
    initial: "A", 
    tagline: "AI Research & IP", 
    hq: "San Francisco, CA" 
  },
  { 
    name: "Genie AI", 
    openRoles: 8, 
    color: "#8b5cf6", 
    initial: "G", 
    tagline: "Legal AI Technology", 
    hq: "London, UK / Remote" 
  },
  { 
    name: "BioMed Research", 
    openRoles: 6, 
    color: "#00d26a", 
    initial: "B", 
    tagline: "Biopharma Patent Hub", 
    hq: "Boston, MA" 
  },
  { 
    name: "NextGen Motors", 
    openRoles: 4, 
    color: "#ffc900", 
    initial: "N", 
    tagline: "Autonomous & EV IP", 
    hq: "Munich, DE" 
  },
];

const CURATED_FALLBACK_JOBS: JobItem[] = [
  {
    id: "mock-1",
    title: "Senior Patent Counsel (AI & Software)",
    company: "Anthropic AI",
    location: "San Francisco, CA (or Remote)",
    type: "Remote",
    salary: "$230,000 - $290,000 + Equity",
    postedAt: "1 day ago",
    isSaved: true,
    hasApplied: false,
    color: "#ff90e8",
    logoInitial: "A",
    is_featured: true,
    poster_is_wipa_recommended: true,
    practiceArea: "legaltech",
    experience_level: "Senior Counsel (6+ Yrs)",
    tags: ["USPTO", "AI Models", "Software Patents", "Open Source"],
    description: "We are seeking a seasoned patent attorney to spearhead our international patent strategy for foundation AI models, neural architectures, and safety alignment technologies.",
    requirements: [
      "Registered USPTO Patent Attorney with active Bar standing",
      "6+ years software & artificial intelligence patent preparation and prosecution",
      "Deep understanding of transformer architectures and LLM patentability",
      "Juris Doctor (JD) from an accredited US law school"
    ],
    benefits: [
      "Significant tech equity / stock option package",
      "100% remote flexibility or San Francisco hybrid",
      "Comprehensive employer-paid health, dental & vision",
      "Annual $5,000 continuous education & bar dues budget"
    ]
  },
  {
    id: "mock-2",
    title: "Head of Trademark & Brand Protection",
    company: "LVMH Group",
    location: "Paris, France / Geneva, CH",
    type: "Hybrid",
    salary: "€160,000 - €210,000",
    postedAt: "2 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#5a32fa",
    logoInitial: "L",
    is_featured: true,
    poster_is_wipa_recommended: true,
    practiceArea: "trademark",
    experience_level: "Head of Department (8+ Yrs)",
    tags: ["EUIPO", "Luxury Brands", "Anti-Counterfeiting", "Madrid Protocol"],
    description: "Lead global trademark enforcement, customs seizures, online anti-counterfeiting operations, and brand portfolio strategy across 40+ countries for iconic luxury Maisons.",
    requirements: [
      "Qualified European Trademark Attorney or EU Lawyer",
      "8+ years managing luxury, fashion, or consumer brand portfolios",
      "Proven track record in cross-border customs seizures & domain disputes",
      "Fluency in English and French required"
    ],
    benefits: [
      "Executive annual performance bonus & luxury product allowance",
      "Paris flagship HQ office with flexible hybrid schedule",
      "Full international relocation and private health coverage",
      "Executive pension plan & wellness programs"
    ]
  },
  {
    id: "mock-3",
    title: "Senior Trademark Attorney",
    company: "Global IP Partners",
    location: "London, UK",
    type: "Hybrid",
    salary: "£95,000 - £130,000",
    postedAt: "3 days ago",
    isSaved: true,
    hasApplied: false,
    color: "#b892ff",
    logoInitial: "G",
    is_featured: true,
    poster_is_wipa_recommended: true,
    practiceArea: "trademark",
    experience_level: "Senior Associate (5+ Yrs)",
    tags: ["UKIPO", "EUIPO", "Brand Clearance", "Portfolio Strategy"],
    description: "Manage international trademark portfolios, opposition proceedings at UKIPO/EUIPO, and cross-border brand clearance for Fortune 500 technology and retail leaders.",
    requirements: [
      "Fully qualified UK / European Trademark Attorney",
      "5+ years dedicated brand clearance and dispute resolution experience",
      "Expertise with Madrid Protocol filings and contentious proceedings",
      "Excellent commercial drafting and negotiation acumen"
    ],
    benefits: [
      "Modern hybrid work model (2 days office, 3 days remote)",
      "Full private healthcare (Bupa) + dental",
      "Annual performance bonus up to 25%",
      "CITMA / ECTA / INTA conference dues fully covered"
    ]
  },
  {
    id: "mock-4",
    title: "Director of IP Strategy & Licensing",
    company: "Genie AI",
    location: "London, UK / Remote",
    type: "Remote",
    salary: "£140,000 - £180,000 + Equity",
    postedAt: "Just now",
    isSaved: false,
    hasApplied: false,
    color: "#8b5cf6",
    logoInitial: "G",
    is_featured: true,
    poster_is_wipa_recommended: true,
    practiceArea: "licensing",
    experience_level: "Director / Executive",
    tags: ["Legal AI", "Contract Tech", "IP Licensing", "SaaS Commercial"],
    description: "Lead global IP licensing frameworks, training data copyright compliance, and patent commercialization for the fastest growing legal AI contract drafting platform.",
    requirements: [
      "10+ years in technology IP, software licensing, and commercial agreements",
      "Deep expertise in AI/ML software copyright and generative AI legal models",
      "Proven track record structuring multi-million SaaS enterprise licenses",
      "Juris Doctor or European LL.M. in Commercial & IP Law"
    ],
    benefits: [
      "Generous venture-backed stock options grant",
      "100% remote flexibility across UK & Europe",
      "Unlimited annual leave policy",
      "£2,000 dedicated home workspace setup budget"
    ]
  },
  {
    id: "mock-5",
    title: "Chief IP Counsel (Life Sciences & Biotech)",
    company: "BioMed Research",
    location: "Boston, MA",
    type: "Hybrid",
    salary: "$220,000 - $270,000",
    postedAt: "4 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#00d26a",
    logoInitial: "B",
    is_featured: false,
    poster_is_wipa_recommended: true,
    practiceArea: "patent",
    experience_level: "Director / Executive",
    tags: ["USPTO", "Biotech", "mRNA Patents", "Hatch-Waxman"],
    description: "Spearhead patent portfolio prosecution, freedom-to-operate (FTO) landscaping, and FDA regulatory patent term extensions for clinical-stage mRNA and cell therapies.",
    requirements: [
      "Registered USPTO Patent Attorney",
      "Ph.D. in Molecular Biology, Genetics, or Biochemistry",
      "8+ years dedicated biopharma patent prosecution and FTO experience",
      "Familiarity with Hatch-Waxman, BPCIA, and PTAB IPR proceedings"
    ],
    benefits: [
      "Comprehensive 401(k) with 6% immediate company match",
      "Relocation package to Boston biotech corridor",
      "Executive tier healthcare plan with 0% deductible",
      "Annual stock & equity refresh program"
    ]
  },
  {
    id: "mock-6",
    title: "Senior Patent Litigation Counsel",
    company: "Smith & Wesson IP Law",
    location: "New York, NY",
    type: "On-site",
    salary: "$260,000 - $320,000",
    postedAt: "5 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#ffc900",
    logoInitial: "S",
    is_featured: false,
    poster_is_wipa_recommended: false,
    practiceArea: "litigation",
    experience_level: "Senior Counsel (7+ Yrs)",
    tags: ["Patent Litigation", "PTAB", "Federal Courts", "Semiconductors"],
    description: "Lead high-stakes patent disputes in federal district courts (D. Del., E.D. Tex., N.D. Cal.) and before the PTAB representing semiconductor and telecommunication leaders.",
    requirements: [
      "JD from top-tier law school and NY State Bar admission",
      "7+ years dedicated patent trial and litigation experience",
      "First-chair deposition experience and strong courtroom presence",
      "Technical background in EE, Computer Engineering, or Physics"
    ],
    benefits: [
      "Top-tier Cravath-scale bonus structure",
      "Fast-track partner evaluation path",
      "Comprehensive family health, dental, and wellness coverage",
      "Dedicated associates and litigation support squad"
    ]
  },
  {
    id: "mock-7",
    title: "Senior Patent Agent (Quantum & Hardware)",
    company: "Quantum Compute Corp",
    location: "Austin, TX",
    type: "Hybrid",
    salary: "$150,000 - $190,000",
    postedAt: "6 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#b892ff",
    logoInitial: "Q",
    is_featured: false,
    poster_is_wipa_recommended: false,
    practiceArea: "patent",
    experience_level: "Mid-Senior (4+ Yrs)",
    tags: ["USPTO", "Quantum Qubits", "Hardware", "Claim Drafting"],
    description: "Draft and prosecute breakthrough patent disclosures covering superconducting qubits, quantum error correction algorithms, and cryogenic computing hardware.",
    requirements: [
      "USPTO Registered Patent Agent or Patent Attorney",
      "M.S. or Ph.D. in Applied Physics, Electrical Engineering, or Materials Science",
      "4+ years patent preparation and claim drafting experience",
      "Proven ability to work closely with quantum research scientists"
    ],
    benefits: [
      "Annual equity grant with Austin tech hub flexibility",
      "Patent filing incentive cash bonuses ($2,500 per issued patent)",
      "Full medical, dental & vision plan",
      "Flexible hybrid hours"
    ]
  },
  {
    id: "mock-8",
    title: "Head of Autonomous IP & Patent Portfolio",
    company: "NextGen Motors",
    location: "Munich, Germany",
    type: "Hybrid",
    salary: "€140,000 - €180,000",
    postedAt: "1 week ago",
    isSaved: false,
    hasApplied: false,
    color: "#ffc900",
    logoInitial: "N",
    is_featured: true,
    poster_is_wipa_recommended: true,
    practiceArea: "patent",
    experience_level: "Head of IP (7+ Yrs)",
    tags: ["EPO", "EV Batteries", "Autonomous Tech", "SEP Licensing"],
    description: "Drive patent harvesting, competitive landscape intelligence, and standard essential patent (SEP) licensing for next-generation electric and autonomous vehicle platforms.",
    requirements: [
      "European Patent Attorney (EQE qualified) or German Patentanwalt",
      "Degree in Mechanical Engineering, Electrical Engineering, or Mechatronics",
      "7+ years automotive, robotics, or sensor IP management experience",
      "Experience with FRAND/SEP licensing negotiations"
    ],
    benefits: [
      "Company executive vehicle scheme (Electric performance EV)",
      "30 days paid annual leave + public holidays",
      "Full relocation assistance to Munich",
      "Corporate profit-sharing scheme"
    ]
  }
];

export default function JobsPage() {
  const { user } = useAppStore();
  
  // State
  const [activeTab, setActiveTab] = useState<'All Jobs' | 'Saved' | 'My Applications'>('All Jobs');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'All Types' | 'Remote' | 'Hybrid' | 'On-site'>('All Types');
  const [experienceFilter, setExperienceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'salary'>('recent');
  
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobItem | null>(null);
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Application Form State inside Detail Modal
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLinkedIn, setApplicantLinkedIn] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Fetch Jobs from Supabase and merge with rich fallback
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          poster:profiles(is_wipa_recommended)
        `)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mappedDbJobs: JobItem[] = data.map(j => {
          let area = 'patent';
          const lowerTitle = (j.title || '').toLowerCase();
          const lowerDesc = (j.description || '').toLowerCase();
          if (lowerTitle.includes('trademark') || lowerTitle.includes('brand')) area = 'trademark';
          else if (lowerTitle.includes('litigation') || lowerTitle.includes('dispute')) area = 'litigation';
          else if (lowerTitle.includes('ai') || lowerTitle.includes('tech') || lowerTitle.includes('software')) area = 'legaltech';
          else if (lowerTitle.includes('licensing') || lowerTitle.includes('commercial') || lowerTitle.includes('counsel')) area = 'licensing';

          return {
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location || 'Remote',
            type: j.job_type || (j.is_remote ? 'Remote' : 'Hybrid'),
            salary: j.salary_range || '$160,000 - $210,000',
            postedAt: new Date(j.created_at).toLocaleDateString(),
            isSaved: false,
            hasApplied: false,
            color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900', '#8b5cf6'][Math.floor(Math.random() * 5)],
            logoInitial: (j.company || 'C').charAt(0).toUpperCase(),
            poster_is_wipa_recommended: j.poster?.is_wipa_recommended || j.is_featured,
            is_featured: j.is_featured,
            description: j.description || 'Join our high-performing intellectual property legal team.',
            practiceArea: area,
            experience_level: j.experience_level || 'Senior Counsel',
            requirements: j.requirements || [
              'Juris Doctor or Equivalent Qualified Trademark/Patent Attorney',
              '5+ years dedicated intellectual property legal practice',
              'Demonstrated experience handling complex cross-border IP matters'
            ],
            benefits: j.benefits || [
              'Top-tier competitive compensation and annual bonuses',
              'Comprehensive healthcare, dental and vision coverage',
              'Flexible remote/hybrid working arrangement'
            ],
            tags: ['IP Law', 'WIPA Partner', 'Global Practice']
          };
        });

        // Merge DB jobs with curated fallbacks ensuring unique IDs
        const existingTitles = new Set(mappedDbJobs.map(j => j.title.toLowerCase()));
        const uniqueFallbacks = CURATED_FALLBACK_JOBS.filter(f => !existingTitles.has(f.title.toLowerCase()));
        setJobs([...mappedDbJobs, ...uniqueFallbacks]);
      } else {
        setJobs(CURATED_FALLBACK_JOBS);
      }
    } catch (err) {
      console.warn("Error loading jobs, using curated list:", err);
      setJobs(CURATED_FALLBACK_JOBS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Bookmark
  const toggleSave = async (id: string | number) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const newSaved = !job.isSaved;

    setJobs(jobs.map(j => j.id === id ? { ...j, isSaved: newSaved } : j));
    showToast(newSaved ? "⭐ Saved to your bookmarked roles" : "Removed from saved roles");

    if (user?.id) {
      try {
        if (newSaved) {
          await supabase.from('saved_jobs').insert({ job_id: id, user_id: user.id });
        } else {
          await supabase.from('saved_jobs').delete().match({ job_id: id, user_id: user.id });
        }
      } catch (e) {
        // Silently catch
      }
    }
  };

  // Submit Application Handler
  const handleApply = async (job: JobItem) => {
    setIsSubmittingApp(true);
    try {
      if (user?.id) {
        await supabase.from('job_applications').insert({
          job_id: job.id,
          applicant_id: user.id,
          status: 'pending'
        });
      }
      setJobs(jobs.map(j => j.id === job.id ? { ...j, hasApplied: true } : j));
      setIsApplySuccess(true);
      showToast("🚀 Application submitted successfully!");
      setTimeout(() => {
        setIsApplySuccess(false);
        setSelectedJobDetail(null);
      }, 1800);
    } catch (e) {
      showToast("Applied successfully!");
      setJobs(jobs.map(j => j.id === job.id ? { ...j, hasApplied: true } : j));
      setSelectedJobDetail(null);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Post a Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    type: 'Remote',
    location: '',
    salary: '',
    practiceArea: 'patent',
    experienceLevel: 'Senior (5+ Years)',
    description: '',
    requirementsStr: '',
    benefitsStr: ''
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    const reqs = newJob.requirementsStr ? newJob.requirementsStr.split('\n').filter(Boolean) : ['5+ years relevant IP experience', 'Strong analytical and drafting skills'];
    const bens = newJob.benefitsStr ? newJob.benefitsStr.split('\n').filter(Boolean) : ['Comprehensive health and retirement benefits', 'Flexible work schedule'];

    const jobToAdd: JobItem = {
      id: `custom-${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location || 'Remote',
      type: newJob.type,
      salary: newJob.salary || '$150,000 - $200,000',
      postedAt: "Just now",
      isSaved: false,
      hasApplied: false,
      color: '#8b5cf6',
      logoInitial: newJob.company.charAt(0).toUpperCase() || 'C',
      poster_is_wipa_recommended: true,
      is_featured: true,
      practiceArea: newJob.practiceArea,
      experience_level: newJob.experienceLevel,
      description: newJob.description,
      requirements: reqs,
      benefits: bens,
      tags: ['New Listing', newJob.practiceArea.toUpperCase()]
    };

    setJobs([jobToAdd, ...jobs]);
    setIsPostModalOpen(false);
    showToast("🎉 Job opportunity published live on the board!");

    // Save to Supabase
    if (user?.id) {
      try {
        await supabase.from('jobs').insert({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          job_type: newJob.type,
          salary_range: newJob.salary,
          description: newJob.description,
          experience_level: newJob.experienceLevel,
          requirements: reqs,
          benefits: bens,
          posted_by: user.id,
          is_active: true
        });
      } catch (e) {
        console.warn("Could not sync to DB:", e);
      }
    }

    setNewJob({
      title: '',
      company: '',
      type: 'Remote',
      location: '',
      salary: '',
      practiceArea: 'patent',
      experienceLevel: 'Senior (5+ Years)',
      description: '',
      requirementsStr: '',
      benefitsStr: ''
    });
  };

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Tab filter
      if (activeTab === 'Saved' && !job.isSaved) return false;
      if (activeTab === 'My Applications' && !job.hasApplied) return false;

      // Practice Area filter
      if (selectedPracticeArea !== 'all') {
        const area = job.practiceArea || 'patent';
        if (area !== selectedPracticeArea) return false;
      }

      // Work Type filter
      if (typeFilter !== 'All Types') {
        if (!job.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
      }

      // Experience filter
      if (experienceFilter !== 'All') {
        if (job.experience_level && !job.experience_level.toLowerCase().includes(experienceFilter.toLowerCase())) return false;
      }

      // Company specific filter from Top Companies bar
      if (selectedCompanyFilter) {
        if (job.company.toLowerCase() !== selectedCompanyFilter.toLowerCase()) return false;
      }

      // Location filter
      if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesLoc = job.location.toLowerCase().includes(query);
        const matchesTags = job.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesLoc && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, activeTab, selectedPracticeArea, typeFilter, experienceFilter, selectedCompanyFilter, locationFilter, searchQuery]);

  const savedCount = jobs.filter(j => j.isSaved).length;
  const appliedCount = jobs.filter(j => j.hasApplied).length;
  const isAnyFilterActive = searchQuery || locationFilter || typeFilter !== 'All Types' || selectedPracticeArea !== 'all' || selectedCompanyFilter || experienceFilter !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setTypeFilter('All Types');
    setSelectedPracticeArea('all');
    setSelectedCompanyFilter(null);
    setExperienceFilter('All');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors pb-24">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900/95 text-white dark:bg-white dark:text-slate-950 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 border border-white/10 dark:border-slate-800">
          <Sparkles size={18} className="text-purple-400 dark:text-purple-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-[#1e1145] to-[#0b0f19] text-white pt-10 pb-16 px-4 md:px-8 border-b border-purple-500/20">
        {/* Glow ambient lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-purple-600/25 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                <Sparkles size={14} className="text-yellow-400" />
                Global Intellectual Property Career Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Find Your Next <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">IP Leadership</span> Role
              </h1>
              <p className="text-purple-200/80 text-base md:text-lg max-w-2xl font-medium mt-3">
                Explore curated executive positions across patent prosecution, trademarks, IP litigation, and frontier legal tech with top global employers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border border-purple-400/30"
              >
                <Briefcase size={20} />
                + Post a Role
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xl font-black text-white">{jobs.length}+ Roles</p>
                <p className="text-xs text-purple-200/60 font-semibold">Active Listings</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xl font-black text-white">85+ Partners</p>
                <p className="text-xs text-purple-200/60 font-semibold">Law Firms & Tech</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xl font-black text-white">$185k Avg</p>
                <p className="text-xs text-purple-200/60 font-semibold">Base Compensation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-bold">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xl font-black text-white">Fast-Track</p>
                <p className="text-xs text-purple-200/60 font-semibold">WIPA Member Reviews</p>
              </div>
            </div>
          </div>

          {/* UNIFIED SEARCH BAR */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-3 sm:p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-3 bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
              <Search size={20} className="text-purple-300 shrink-0" />
              <input 
                type="text" 
                placeholder="Search job title, skills, keywords (e.g. Patent, Trademark, AI, USPTO)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder:text-purple-200/50 text-sm font-medium focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-purple-300 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="w-full md:w-64 flex items-center gap-3 bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
              <MapPin size={18} className="text-pink-300 shrink-0" />
              <input 
                type="text" 
                placeholder="Location (e.g. London, Boston, Remote)..."
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder:text-purple-200/50 text-sm font-medium focus:outline-none"
              />
              {locationFilter && (
                <button onClick={() => setLocationFilter('')} className="text-purple-300 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="w-full md:w-44 bg-black/30 border border-white/10 rounded-2xl px-3 py-3 text-white flex items-center">
              <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="w-full bg-transparent border-none text-white text-sm font-bold focus:outline-none cursor-pointer"
              >
                <option value="All Types" className="bg-slate-900 text-white">All Work Types</option>
                <option value="Remote" className="bg-slate-900 text-white">🌍 Remote</option>
                <option value="Hybrid" className="bg-slate-900 text-white">🏢 Hybrid</option>
                <option value="On-site" className="bg-slate-900 text-white">📍 On-site</option>
              </select>
            </div>

            {isAnyFilterActive && (
              <button 
                onClick={handleResetFilters}
                className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-purple-200 hover:text-white text-xs font-black transition-all flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 space-y-10">

        {/* 1. TOP HIRING PARTNERS ROW */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Star size={22} className="text-amber-400 fill-amber-400" />
              Featured Hiring Employers
            </h2>
            {selectedCompanyFilter && (
              <button 
                onClick={() => setSelectedCompanyFilter(null)}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Showing {selectedCompanyFilter} (Clear filter) <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOP_COMPANIES.map((company, idx) => {
              const isSelected = selectedCompanyFilter?.toLowerCase() === company.name.toLowerCase();
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedCompanyFilter(isSelected ? null : company.name)}
                  className={`group relative p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50 shadow-lg' 
                      : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: company.color }}
                    >
                      {company.initial}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {company.openRoles} roles
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      {company.tagline}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-2 flex items-center gap-1">
                      <MapPin size={11} /> {company.hq}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. DYNAMIC AD SLOT BANNER */}
        <div className="w-full">
          <AdSlot slotId="jobs_sidebar" />
        </div>

        {/* 3. PRACTICE AREA QUICK TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PRACTICE_AREAS.map(area => {
            const isActive = selectedPracticeArea === area.id;
            return (
              <button
                key={area.id}
                onClick={() => setSelectedPracticeArea(area.id)}
                className={`px-5 py-2.5 rounded-full font-extrabold text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-purple-500/25 border border-purple-500 scale-105' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <span>{area.icon}</span>
                <span>{area.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. MAIN FEED HEADER & NAVIGATION TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeTab === 'All Jobs' && 'All IP Opportunities'}
              {activeTab === 'Saved' && '⭐ Bookmarked Roles'}
              {activeTab === 'My Applications' && '📄 My Submitted Applications'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Showing {filteredJobs.length} active opportunities
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('All Jobs')}
              className={`px-5 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === 'All Jobs'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              All Roles ({jobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('Saved')}
              className={`px-5 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'Saved'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark size={14} className={savedCount > 0 ? 'fill-amber-400 text-amber-400' : ''} />
              Saved ({savedCount})
            </button>
            <button 
              onClick={() => setActiveTab('My Applications')}
              className={`px-5 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'My Applications'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 size={14} className="text-emerald-500" />
              Applied ({appliedCount})
            </button>
          </div>
        </div>

        {/* 5. JOB CARDS GRID */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading IP opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-white/10 p-16 text-center flex flex-col items-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 border border-purple-200 dark:border-purple-800">
              <Briefcase size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No matching positions found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
              We couldn't find any roles matching your active search and filter criteria. Try resetting your filters or search keywords.
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="group relative bg-white dark:bg-slate-900/90 rounded-[2rem] border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-2xl hover:border-purple-400/80 dark:hover:border-purple-500/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Ambient glow */}
                <div 
                  className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-[50px] opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: job.color }}
                ></div>

                <div>
                  {/* Top Row: Monogram + Badges + Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-13 h-13 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: job.color }}
                      >
                        {job.logoInitial}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight flex items-center gap-1.5">
                          {job.company}
                          {job.poster_is_wipa_recommended && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-black border border-amber-300/40">
                              ★ Verified
                            </span>
                          )}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> {job.postedAt}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleSave(job.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        job.isSaved 
                          ? 'bg-amber-500/15 text-amber-500 border-amber-400/40' 
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-white/10'
                      }`}
                      title={job.isSaved ? "Saved" : "Save role"}
                    >
                      <Bookmark size={17} className={job.isSaved ? 'fill-amber-500' : ''} />
                    </button>
                  </div>

                  {/* Job Title */}
                  <h3 
                    onClick={() => setSelectedJobDetail(job)}
                    className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer line-clamp-2 mb-3"
                  >
                    {job.title}
                  </h3>

                  {/* Pills Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {job.type}
                    </span>
                    {job.experience_level && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {job.experience_level}
                      </span>
                    )}
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  {/* Meta Specs Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      <MapPin size={14} className="text-purple-500 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 truncate">
                        <DollarSign size={14} className="shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                  <button 
                    onClick={() => setSelectedJobDetail(job)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Eye size={14} /> Quick View
                  </button>

                  <button 
                    onClick={() => !job.hasApplied && setSelectedJobDetail(job)}
                    disabled={job.hasApplied}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      job.hasApplied
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95 shadow-purple-500/20'
                    }`}
                  >
                    {job.hasApplied ? (
                      <>
                        <Check size={14} /> Applied
                      </>
                    ) : (
                      <>
                        Apply Now <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. JOB DETAILS SLIDE-OVER MODAL */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedJobDetail(null)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-3xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-purple-950 via-[#1c1040] to-slate-950 text-white border-b border-purple-500/20">
              <button 
                onClick={() => setSelectedJobDetail(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-xl"
                  style={{ backgroundColor: selectedJobDetail.color }}
                >
                  {selectedJobDetail.logoInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 font-extrabold text-sm uppercase tracking-wider">{selectedJobDetail.company}</span>
                    {selectedJobDetail.poster_is_wipa_recommended && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                        ★ Verified Partner
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-1">
                    {selectedJobDetail.title}
                  </h2>
                </div>
              </div>

              {/* Badges bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-purple-200">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <MapPin size={14} className="text-pink-400" /> {selectedJobDetail.location}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-purple-400" /> {selectedJobDetail.type}
                </span>
                {selectedJobDetail.salary && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black flex items-center gap-1.5">
                    <DollarSign size={14} /> {selectedJobDetail.salary}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Overview */}
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                  Role Overview
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                  {selectedJobDetail.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedJobDetail.requirements && selectedJobDetail.requirements.length > 0 && (
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-purple-600 dark:text-purple-400" />
                    Key Requirements & Experience
                  </h4>
                  <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    {selectedJobDetail.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJobDetail.benefits && selectedJobDetail.benefits.length > 0 && (
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award size={20} className="text-purple-600 dark:text-purple-400" />
                    Compensation & Perks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedJobDetail.benefits.map((ben, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                        <Sparkles size={16} className="text-amber-500 shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Form */}
              <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                <h4 className="text-lg font-black text-purple-950 dark:text-white mb-1 flex items-center gap-2">
                  <Send size={18} className="text-purple-600 dark:text-purple-400" />
                  1-Click Direct Application
                </h4>
                <p className="text-xs text-purple-700 dark:text-purple-300 mb-4 font-semibold">
                  Fast-tracked candidate submission for Women's IP Alliance verified members.
                </p>

                {selectedJobDetail.hasApplied ? (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-3">
                    <CheckCircle2 size={24} />
                    <span>You have already submitted an application for this role. The hiring team will be in touch!</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleApply(selectedJobDetail); }} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input 
                          type="text"
                          required
                          defaultValue={user?.email?.split('@')[0] || ''}
                          onChange={e => setApplicantName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input 
                          type="email"
                          required
                          defaultValue={user?.email || ''}
                          onChange={e => setApplicantEmail(e.target.value)}
                          placeholder="your.email@firm.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">LinkedIn or Portfolio URL</label>
                      <input 
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={applicantLinkedIn}
                        onChange={e => setApplicantLinkedIn(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brief Cover Note / Qualifications (Optional)</label>
                      <textarea 
                        rows={2}
                        placeholder="Briefly highlight your years of experience, relevant bar admissions, and specialty..."
                        value={applicantNote}
                        onChange={e => setApplicantNote(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingApp}
                      className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-xl hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {isSubmittingApp ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit Fast-Track Application
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. POST A JOB ENTERPRISE MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setIsPostModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
                <Briefcase size={14} /> Employer Hiring Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Post an IP Career Opportunity
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                Reach thousands of verified women patent attorneys, trademark specialists, and IP executives.
              </p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.title}
                    onChange={e => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Senior Patent Attorney"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company or Firm *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.company}
                    onChange={e => setNewJob({...newJob, company: e.target.value})}
                    placeholder="e.g. Global IP Partners LLP"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Practice Area</label>
                  <select 
                    value={newJob.practiceArea}
                    onChange={e => setNewJob({...newJob, practiceArea: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="patent">⚖️ Patent Prosecution</option>
                    <option value="trademark">®️ Trademarks & Brands</option>
                    <option value="litigation">⚡ IP Litigation</option>
                    <option value="legaltech">🤖 Legal AI & Tech</option>
                    <option value="licensing">🤝 Licensing & Deals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Work Arrangement</label>
                  <select 
                    value={newJob.type}
                    onChange={e => setNewJob({...newJob, type: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Remote">🌍 Remote</option>
                    <option value="Hybrid">🏢 Hybrid</option>
                    <option value="On-site">📍 On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Level</label>
                  <input 
                    type="text" 
                    value={newJob.experienceLevel}
                    onChange={e => setNewJob({...newJob, experienceLevel: e.target.value})}
                    placeholder="e.g. Senior (5+ Yrs)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. London, UK or New York, NY"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Salary / Compensation</label>
                  <input 
                    type="text" 
                    value={newJob.salary}
                    onChange={e => setNewJob({...newJob, salary: e.target.value})}
                    placeholder="e.g. £110k - £140k or $180k+"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role Description *</label>
                <textarea 
                  required
                  rows={3}
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Outline the core responsibilities and team mandate..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Requirements (One per line)</label>
                <textarea 
                  rows={2}
                  value={newJob.requirementsStr}
                  onChange={e => setNewJob({...newJob, requirementsStr: e.target.value})}
                  placeholder="e.g. Registered USPTO Patent Attorney&#10;5+ years drafting experience"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base shadow-xl hover:shadow-purple-500/25 transition-all cursor-pointer active:scale-98"
                >
                  🚀 Publish Role Live to Job Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
