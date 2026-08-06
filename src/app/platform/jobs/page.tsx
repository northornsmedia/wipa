'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Briefcase, MapPin, Building2, DollarSign, Bookmark, ArrowRight, X, ExternalLink, ArrowLeft, Star
} from 'lucide-react';
import Link from 'next/link';
import ScratchCardAd from '@/components/ScratchCardAd';

const INITIAL_MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Trademark Attorney",
    company: "Global IP Partners",
    location: "London, UK",
    type: "Hybrid",
    salary: "£90k - £120k",
    postedAt: "2 days ago",
    isSaved: true,
    hasApplied: false,
    color: "#b892ff",
    logoInitial: "G",
    description: "Looking for an experienced trademark attorney to manage global portfolios for Fortune 500 tech clients."
  },
  {
    id: 2,
    title: "IP Counsel, Product",
    company: "Innovatech Inc.",
    location: "Remote",
    type: "Remote",
    salary: "$150k - $190k",
    postedAt: "5 hours ago",
    isSaved: false,
    hasApplied: true,
    color: "#ff90e8",
    logoInitial: "I",
    description: "Join our fast-paced product team to advise on open source, patents, and copyright issues in AI development."
  },
  {
    id: 3,
    title: "Junior Patent Analyst",
    company: "BioMed Research",
    location: "Boston, MA",
    type: "On-site",
    salary: "$75k - $90k",
    postedAt: "1 week ago",
    isSaved: false,
    hasApplied: false,
    color: "#00d26a",
    logoInitial: "B",
    description: "Great entry-level opportunity for candidates with a life sciences background looking to transition into patent law."
  },
  {
    id: 4,
    title: "Head of Intellectual Property",
    company: "NextGen Motors",
    location: "Munich, DE",
    type: "Hybrid",
    salary: "€140k - €180k",
    postedAt: "Just now",
    isSaved: false,
    hasApplied: false,
    color: "#ffc900",
    logoInitial: "N",
    description: "Lead the IP strategy for our upcoming line of autonomous electric vehicles."
  },
  {
    id: 5,
    title: "Patent Attorney (Life Sciences)",
    company: "PharmaCorp",
    location: "Basel, CH",
    type: "Hybrid",
    salary: "CHF 160k - CHF 200k",
    postedAt: "1 day ago",
    isSaved: false,
    hasApplied: false,
    color: "#ff90e8",
    logoInitial: "P",
    description: "Seeking a qualified patent attorney with a PhD in molecular biology."
  },
  {
    id: 6,
    title: "IP Licensing Manager",
    company: "TechNova",
    location: "San Francisco, CA",
    type: "On-site",
    salary: "$140k - $175k",
    postedAt: "3 days ago",
    isSaved: true,
    hasApplied: false,
    color: "#5a32fa",
    logoInitial: "T",
    description: "Manage out-licensing of our core hardware patents and negotiate cross-licenses."
  },
  {
    id: 7,
    title: "Trademark Paralegal",
    company: "LegalTech Solutions",
    location: "Remote",
    type: "Remote",
    salary: "$65k - $80k",
    postedAt: "4 hours ago",
    isSaved: false,
    hasApplied: false,
    color: "#00d26a",
    logoInitial: "L",
    description: "Support our growing trademark team with filings, docketing, and clearance searches."
  },
  {
    id: 8,
    title: "VP, Intellectual Property",
    company: "Future AI Systems",
    location: "Seattle, WA",
    type: "Hybrid",
    salary: "$250k+",
    postedAt: "2 weeks ago",
    isSaved: false,
    hasApplied: false,
    color: "#ffc900",
    logoInitial: "F",
    description: "Executive role leading a team of 15 attorneys and patent engineers for an AI unicorn."
  },
  {
    id: 9,
    title: "Patent Engineer",
    company: "Quantum Compute Corp",
    location: "Austin, TX",
    type: "On-site",
    salary: "$110k - $140k",
    postedAt: "6 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#b892ff",
    logoInitial: "Q",
    description: "Work closely with our quantum researchers to draft patent disclosures and claims."
  },
  {
    id: 10,
    title: "Copyright Specialist",
    company: "MediaStream",
    location: "Los Angeles, CA",
    type: "Hybrid",
    salary: "$90k - $120k",
    postedAt: "12 hours ago",
    isSaved: false,
    hasApplied: false,
    color: "#ff90e8",
    logoInitial: "M",
    description: "Manage copyright registrations and tackle DMCA takedowns for a leading streaming platform."
  },
  {
    id: 11,
    title: "IP Litigation Associate",
    company: "Smith & Wesson Law",
    location: "New York, NY",
    type: "On-site",
    salary: "$210k - $240k",
    postedAt: "1 month ago",
    isSaved: false,
    hasApplied: true,
    color: "#5a32fa",
    logoInitial: "S",
    description: "Mid-level associate needed for complex patent litigation in district courts."
  },
  {
    id: 12,
    title: "Brand Protection Analyst",
    company: "Luxury Fashion Brands",
    location: "Paris, FR",
    type: "Remote",
    salary: "€70k - €90k",
    postedAt: "2 days ago",
    isSaved: true,
    hasApplied: false,
    color: "#00d26a",
    logoInitial: "L",
    description: "Monitor online marketplaces and enforce trademarks against counterfeit goods."
  },
  {
    id: 13,
    title: "Data Privacy & IP Counsel",
    company: "FinTech Global",
    location: "London, UK",
    type: "Hybrid",
    salary: "£110k - £140k",
    postedAt: "Just now",
    isSaved: false,
    hasApplied: false,
    color: "#ffc900",
    logoInitial: "F",
    description: "Unique role sitting at the intersection of data privacy (GDPR) and IP commercialization."
  },
  {
    id: 14,
    title: "Senior Patent Agent",
    company: "Semiconductor Innovations",
    location: "San Jose, CA",
    type: "Hybrid",
    salary: "$160k - $190k",
    postedAt: "5 days ago",
    isSaved: false,
    hasApplied: false,
    color: "#b892ff",
    logoInitial: "S",
    description: "Drafting and prosecuting patents in the semiconductor space. USPTO registration required."
  }
];

const TOP_COMPANIES = [
  { name: "Global IP Partners", openRoles: 12, color: "#b892ff", initial: "G" },
  { name: "Innovatech Inc.", openRoles: 8, color: "#ff90e8", initial: "I" },
  { name: "NextGen Motors", openRoles: 4, color: "#ffc900", initial: "N" },
  { name: "BioMed Research", openRoles: 6, color: "#00d26a", initial: "B" },
];

export default function JobsPage() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All Jobs' | 'Saved' | 'My Applications'>('All Jobs');
  const [typeFilter, setTypeFilter] = useState<'All Types' | 'Remote' | 'Hybrid' | 'On-site'>('All Types');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobs, setJobs] = useState(INITIAL_MOCK_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    type: 'Remote',
    location: '',
    salary: '',
    description: ''
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const jobToAdd = {
      id: jobs.length + 1,
      ...newJob,
      postedAt: "Just now",
      isSaved: false,
      hasApplied: false,
      color: '#5a32fa',
      logoInitial: newJob.company.charAt(0).toUpperCase() || 'C'
    };
    
    setJobs([jobToAdd, ...jobs]);
    setIsModalOpen(false);
    setNewJob({
      title: '',
      company: '',
      type: 'Remote',
      location: '',
      salary: '',
      description: ''
    });
    setActiveTab('All Jobs');
  };

  const toggleSave = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const handleApply = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, hasApplied: true } : job
    ));
    setActiveTab('My Applications');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-8">
      
      {/* MAIN SCROLLABLE CONTENT - FULL WIDTH */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          

          <div className="mb-12 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
                <Briefcase size={40} className="text-[#5a32fa]" />
                Jobs Board
              </h1>
              <p className="text-gray-500 font-medium mt-3 text-lg">
                Explore top roles and advance your career in Intellectual Property.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5a32fa] text-white px-8 py-4 rounded-xl font-bold text-lg border border-gray-100 shadow-sm hover:shadow-sm hover:-translate-y-0.5 transition-all"
            >
              + Post a Job
            </button>
          </div>

          {/* TOP COMPANIES SECTION */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star size={24} className="text-[#ffc900] fill-current" /> Top Companies Hiring
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['/JOBAD1.png', '/JOBAD2.png', '/JOBAD3.png', '/JOBAD4.png'].map((adSrc, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer relative h-[104px] group">
                  <img src={adSrc} alt={`Featured Company ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>

          <ScratchCardAd />

          {/* JOB FEED */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Roles</h2>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2.5 rounded-full font-bold text-sm border border-gray-100 bg-white text-gray-900 focus:outline-none focus:border-[#131313] transition-colors shrink-0 w-40 placeholder:text-gray-400"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-full font-bold text-sm border border-gray-100 bg-white text-gray-900 focus:outline-none focus:border-[#131313] transition-colors shrink-0 cursor-pointer appearance-none pr-8 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                <option value="All Types">All Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <div className="w-px h-6 bg-gray-200 mx-1 shrink-0 hidden md:block"></div>

              <button 
                onClick={() => setActiveTab('All Jobs')}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all shrink-0 ${activeTab === 'All Jobs' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'}`}
              >
                All Jobs
              </button>
              <button 
                onClick={() => setActiveTab('Saved')}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all shrink-0 ${activeTab === 'Saved' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'}`}
              >
                Saved
              </button>
              <button 
                onClick={() => setActiveTab('My Applications')}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all shrink-0 ${activeTab === 'My Applications' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'}`}
              >
                My Applications
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-24">
            {jobs.filter(job => {
              if (activeTab === 'Saved' && !job.isSaved) return false;
              if (activeTab === 'My Applications' && !job.hasApplied) return false;
              if (typeFilter !== 'All Types' && job.type !== typeFilter) return false;
              if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
              return true;
            }).length === 0 ? (
              <div className="xl:col-span-4 md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center">
                <Briefcase size={64} className="text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-500 font-medium text-lg">Try adjusting your filters or tabs.</p>
              </div>
            ) : jobs.filter(job => {
              if (activeTab === 'Saved' && !job.isSaved) return false;
              if (activeTab === 'My Applications' && !job.hasApplied) return false;
              if (typeFilter !== 'All Types' && job.type !== typeFilter) return false;
              if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
              return true; 
            }).map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:translate-y-[-4px] hover:shadow-sm p-5">
                
                <div className="flex items-start justify-between mb-4">
                  {/* Logo Block */}
                  <div className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center font-bold text-xl text-gray-900 shrink-0" style={{ backgroundColor: job.color }}>
                    {job.logoInitial}
                  </div>
                  
                  {/* Action Badges */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-gray-400">
                      {job.postedAt}
                    </span>
                    {job.hasApplied && (
                      <span className="bg-[#00d26a] text-gray-900 text-[9px] font-bold px-2 py-1 rounded border border-gray-100">
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-[#131313] text-white text-[9px] font-bold px-2 py-1 rounded uppercase border border-gray-100">
                      {job.type}
                    </span>
                  </div>
                  
                  <h3 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#5a32fa] transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-900 font-bold mb-3 text-sm line-clamp-1">{job.company}</p>
                  
                  <p className="text-gray-600 font-medium text-xs mb-4 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700 font-bold text-[11px] truncate">
                      <MapPin size={14} className="text-[#5a32fa] shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-gray-700 font-bold text-[11px] truncate">
                        <DollarSign size={14} className="text-[#00d26a] shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                    <button 
                      onClick={() => toggleSave(job.id)}
                      className={`flex items-center justify-center p-2.5 rounded-xl border-2 transition-all shrink-0 ${
                        job.isSaved 
                          ? 'bg-[#131313] text-white border-[#131313]' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                      }`}
                    >
                      <Bookmark size={16} className={job.isSaved ? 'fill-current' : ''} />
                    </button>

                    <button 
                      onClick={() => !job.hasApplied && handleApply(job.id)}
                      disabled={job.hasApplied}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl font-bold text-xs border border-gray-100 transition-all truncate ${
                        job.hasApplied 
                          ? 'bg-gray-100 text-gray-400 border-gray-200' 
                          : 'bg-[#5a32fa] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-sm'
                      }`}
                    >
                      {job.hasApplied ? 'Applied' : 'Apply'}
                      {!job.hasApplied && <ExternalLink size={14} className="shrink-0" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POST JOB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Briefcase size={28} className="text-[#5a32fa]" />
              Post a Job
            </h2>
            
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                  placeholder="e.g. Senior IP Counsel"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Company</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.company}
                    onChange={e => setNewJob({...newJob, company: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="e.g. Innovatech Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Work Type</label>
                  <select 
                    value={newJob.type}
                    onChange={e => setNewJob({...newJob, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors appearance-none"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="e.g. London, UK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Salary Range</label>
                  <input 
                    type="text" 
                    value={newJob.salary}
                    onChange={e => setNewJob({...newJob, salary: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="e.g. £90k - £120k"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                <textarea 
                  required
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors resize-none h-24"
                  placeholder="What is this role about?"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-[#5a32fa] text-white px-6 py-4 rounded-xl font-bold text-lg border border-gray-100 hover:shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none">
                  PUBLISH JOB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
