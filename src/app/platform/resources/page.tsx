'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Download, FileText, Video, Headphones, Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';

const MOCK_RESOURCES = [
  {
    id: 1,
    title: "Global Trademark Registration Guide 2026",
    type: "PDF Guide",
    icon: FileText,
    color: "#5a32fa",
    author: "WIPA Policy Committee",
    date: "July 2026",
    downloads: 1245,
    description: "A comprehensive 50-page guide covering international trademark filing strategies and Madrid Protocol updates.",
    isSaved: true
  },
  {
    id: 2,
    title: "Masterclass: AI and Intellectual Property",
    type: "Webinar Recording",
    icon: Video,
    color: "#ff4b4b",
    author: "Dr. Sarah Jenkins",
    date: "June 2026",
    downloads: 830,
    description: "Watch the recording of our most popular webinar discussing AI-generated content and copyright.",
    isSaved: false
  },
  {
    id: 3,
    title: "WIPA Podcast: Interview with USPTO Director",
    type: "Audio",
    icon: Headphones,
    color: "#00d26a",
    author: "WIPA Media",
    date: "May 2026",
    downloads: 3200,
    description: "An exclusive 45-minute interview discussing the future of patent examination.",
    isSaved: true
  },
  {
    id: 4,
    title: "Sample IP Licensing Agreement",
    type: "Document Template",
    icon: FileText,
    color: "#ffc900",
    author: "David Chen",
    date: "April 2026",
    downloads: 410,
    description: "A standard, customizable template for software and technology licensing agreements.",
    isSaved: false
  },
  {
    id: 5,
    title: "Q1 2026 IP Litigation Trends Report",
    type: "Research Paper",
    icon: BookOpen,
    color: "#ff90e8",
    author: "WIPA Research Team",
    date: "March 2026",
    downloads: 950,
    description: "Statistical analysis of patent and trademark litigation outcomes in major jurisdictions.",
    isSaved: false
  }
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('All');

  const toggleSave = (id: number) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, isSaved: !r.isSaved } : r
    ));
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Saved') {
      matchesTab = r.isSaved;
    } else if (activeTab !== 'All') {
      matchesTab = r.type === activeTab;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b-4 border-[#131313] h-[72px] flex items-center px-6 sticky top-0 z-50">
        <Link 
          href="/platform" 
          className="flex items-center gap-2 text-gray-900 font-black hover:text-[#5a32fa] transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          Back to Feed
        </Link>
        
        <div className="mx-auto font-black text-xl text-gray-900 tracking-tight">
          RESOURCE LIBRARY
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b-4 border-[#131313] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <BookOpen size={32} className="text-[#5a32fa]" />
              Resource Library
            </h1>
            <p className="text-gray-600 font-medium mt-2">Access exclusive guides, templates, webinars, and reports.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#131313] text-white px-6 py-3 rounded-xl border-4 border-[#131313] font-black hover:bg-[#5a32fa] hover:border-[#5a32fa] transition-colors shadow-[4px_4px_0px_0px_#131313] hover:translate-y-1 hover:shadow-none">
              <Plus size={20} strokeWidth={3} />
              Upload Resource
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
            {['All', 'Saved', 'PDF Guide', 'Audio', 'Document Template', 'Webinar Recording', 'Research Paper'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-black border-4 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#131313] text-white border-[#131313] shadow-[4px_4px_0px_0px_#131313]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
                }`}
              >
                {tab === 'Saved' && <Bookmark size={16} className={activeTab === tab ? "fill-white" : ""} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-[#131313] rounded-xl py-3 pl-12 pr-4 font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#5a32fa]/20 shadow-[4px_4px_0px_0px_#131313]"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const Icon = resource.icon;
            return (
              <div 
                key={resource.id} 
                className="bg-white rounded-[2rem] border-4 border-[#131313] p-6 shadow-[8px_8px_0px_0px_#131313] flex flex-col hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#131313] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313]"
                    style={{ backgroundColor: resource.color }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  
                  <button 
                    onClick={() => toggleSave(resource.id)}
                    className="p-2 text-gray-400 hover:text-[#5a32fa] transition-colors"
                  >
                    <Bookmark size={24} strokeWidth={2.5} className={resource.isSaved ? "fill-[#5a32fa] text-[#5a32fa]" : ""} />
                  </button>
                </div>

                <div className="bg-[#fbe8d5] text-[#131313] text-xs font-black px-3 py-1 rounded-lg border-2 border-[#131313] w-fit mb-3">
                  {resource.type}
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 font-medium mb-6 flex-1">{resource.description}</p>
                
                <div className="flex items-center justify-between mt-auto border-t-2 border-gray-100 pt-4">
                  <div className="flex flex-col text-xs font-bold text-gray-500">
                    <span>{resource.author}</span>
                    <span>{resource.date}</span>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#131313] text-white rounded-xl border-2 border-[#131313] font-bold text-sm hover:bg-[#5a32fa] hover:border-[#5a32fa] transition-colors shadow-[2px_2px_0px_0px_#131313]">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            );
          })}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-4 border-[#131313] border-dashed">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
