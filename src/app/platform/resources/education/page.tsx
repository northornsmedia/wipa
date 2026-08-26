'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, GraduationCap, ChevronDown, PlayCircle, BookOpen, Star, Info, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { UNIVERSITIES_DB } from './data';
const MOCK_EDU_SUBCATEGORIES = [
  { id: 'all', name: 'All Classes' },
  { id: 'patent-law', name: 'Patent Law' },
  { id: 'trademark-law', name: 'Trademark Law' },
  { id: 'career-skills', name: 'Career Skills' },
  { id: 'ip-strategy', name: 'IP Strategy' }
];

const CONTENT_TYPES = [
  "All Types",
  "Masterclass",
  "Online Course",
  "CPD Programme",
  "Certification",
  "Workshop"
];

const MOCK_EDU_RESOURCES = [
  {
    id: 24,
    title: "LL.M. in Intellectual Property (Online)",
    type: "Online Degree",
    topic: "Intellectual Property",
    subcategory: "ip-strategy",
    expert: "UNH Law Faculty",
    time: "1-2 years",
    featured: true,
    university: {
      logoLight: "/academic-partner-logo.svg",
      logoDark: "/academic-partner-logo.svg",
      name: "University of New Hampshire",
      description: "A top-ranked powerhouse for intellectual property law education, producing leaders in the IP field for over 50 years."
    },
    image: "/resource3.jpg"
  },
  {
    id: 25,
    title: "Master's in Intellectual Property (Online)",
    type: "Online Degree",
    topic: "Intellectual Property",
    subcategory: "patent-law",
    expert: "UNH Law Faculty",
    time: "1-2 years",
    featured: true,
    university: {
      logoLight: "/academic-partner-logo.svg",
      logoDark: "/academic-partner-logo.svg",
      name: "University of New Hampshire",
      description: "A top-ranked powerhouse for intellectual property law education, producing leaders in the IP field for over 50 years."
    },
    image: "/resourceimg1.jpg"
  },
  {
    id: 3,
    title: "Trademarks in the Digital Age",
    type: "University Course",
    topic: "Trademark Law",
    subcategory: "trademark-law",
    expert: "Dr. Amanda Lewis",
    time: "8 weeks",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 4,
    title: "Drafting Claims effectively",
    type: "Workshop",
    topic: "Patent Law",
    subcategory: "patent-law",
    expert: "Robert Smith Esq.",
    time: "1 day",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 5,
    title: "Negotiation Skills for IP Lawyers",
    type: "CPD Programme",
    topic: "Career Skills",
    subcategory: "career-skills",
    expert: "Sarah Jenkins",
    time: "3 CPD hours",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 6,
    title: "IP Portfolio Management",
    type: "Certification",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "IP Institute",
    time: "Self-paced",
    featured: false,
    image: "/resourceimg2.jpg"
  }
];

import { supabase } from "@/lib/supabase";

export default function EducationHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dbResources, setDbResources] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLiveEdu() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("category", "education")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Course",
            topic: d.tags?.[0] || "IP Education",
            subcategory: d.subcategory || "patent-law",
            expert: d.author_name || "Faculty",
            time: d.read_time || "4 Weeks",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg1.jpg",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_EDU_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_EDU_RESOURCES);
      }
    }
    fetchLiveEdu();
  }, []);

  const allUniversityCourses = React.useMemo(() => {
    const courses: any[] = [];
    Object.entries(UNIVERSITIES_DB).forEach(([key, uni]: [string, any]) => {
      uni.courses.forEach((course: any) => {
        courses.push({
          ...course,
          universityName: uni.name,
          universityLogo: uni.logo,
          isUNH: key === 'unh'
        });
      });
    });
    
    // Sort so UNH courses appear first
    return courses.sort((a, b) => {
      if (a.isUNH && !b.isUNH) return -1;
      if (!a.isUNH && b.isUNH) return 1;
      return 0;
    });
  }, []);

  const resourcesToFilter = dbResources.length > 0 ? dbResources : MOCK_EDU_RESOURCES;

  const filteredResources = resourcesToFilter.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 pb-24">
      {/* Sleek Header */}
      <div className="pt-12 px-6 max-w-7xl mx-auto mb-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
              WIPA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Academy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium">
              Advance your career with masterclasses, CPD programmes, and certifications from industry leaders and top universities.
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-80 shrink-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search curriculum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Modern Filter Pills */}
      <div className="px-6 max-w-7xl mx-auto mb-16 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {MOCK_EDU_SUBCATEGORIES.map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSub(sub.id)}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              activeSub === sub.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-white dark:bg-[#111111] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-indigo-600/50 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Partner Universities Section */}
      <div className="px-6 max-w-[1400px] mx-auto mb-20 overflow-hidden relative group">
        <div className="text-center mb-8 relative z-10 bg-slate-50 dark:bg-[#020617]">
          <p className="text-sm font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest inline-block px-4">Learn from top tier institutions</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max animate-marquee group-hover:pause-on-hover">
            {/* First Set */}
            <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 min-w-max">
              {[
                { id: 'cambridge', name: 'Cambridge University', logo: 'https://download.logo.wine/logo/University_of_Cambridge/University_of_Cambridge-Logo.wine.png' },
                { id: 'yale', name: 'Yale University', logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Yale-University-Logo-1.png' },
                { id: 'harvard', name: 'Harvard University', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg' },
                { id: 'oxford', name: 'Oxford University', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg' },
                { id: 'mit', name: 'MIT', logo: 'https://download.logo.wine/logo/Massachusetts_Institute_of_Technology/Massachusetts_Institute_of_Technology-Logo.wine.png' },
                { id: 'columbia', name: 'Columbia University', logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Columbia-University-Logo.png' },
                { id: 'delhi', name: 'Delhi University', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Delhi_University.svg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                { id: 'stanford', name: 'Stanford University', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuWroQgVKxEvraDoi4RCt2EwbfBF2MLlYEGGsyssOeLYu6E-txC_SNJAFt&s=10' },
                { id: 'princeton', name: 'Princeton University', logo: 'https://download.logo.wine/logo/Princeton_University/Princeton_University-Logo.wine.png' },
                { id: 'penn', name: 'UPenn', logo: 'https://download.logo.wine/logo/University_of_Pennsylvania/University_of_Pennsylvania-Logo.wine.png' },
                { id: 'unh', name: 'University of New Hampshire', logo: '/academic-partner-logo.svg' },
              ].map(uni => (
                <Link key={`set1-${uni.id}`} href={`/platform/resources/education/university/${uni.id}`} className="shrink-0 transition-transform hover:scale-110">
                  <img src={uni.logo} alt={uni.name} className="h-16 md:h-20 w-auto object-contain drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:brightness-125" />
                </Link>
              ))}
            </div>
            
            {/* Duplicate Set for Seamless Loop */}
            <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 min-w-max">
              {[
                { id: 'cambridge', name: 'Cambridge University', logo: 'https://download.logo.wine/logo/University_of_Cambridge/University_of_Cambridge-Logo.wine.png' },
                { id: 'yale', name: 'Yale University', logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Yale-University-Logo-1.png' },
                { id: 'harvard', name: 'Harvard University', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg' },
                { id: 'oxford', name: 'Oxford University', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg' },
                { id: 'mit', name: 'MIT', logo: 'https://download.logo.wine/logo/Massachusetts_Institute_of_Technology/Massachusetts_Institute_of_Technology-Logo.wine.png' },
                { id: 'columbia', name: 'Columbia University', logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Columbia-University-Logo.png' },
                { id: 'delhi', name: 'Delhi University', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Delhi_University.svg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                { id: 'stanford', name: 'Stanford University', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuWroQgVKxEvraDoi4RCt2EwbfBF2MLlYEGGsyssOeLYu6E-txC_SNJAFt&s=10' },
                { id: 'princeton', name: 'Princeton University', logo: 'https://download.logo.wine/logo/Princeton_University/Princeton_University-Logo.wine.png' },
                { id: 'penn', name: 'UPenn', logo: 'https://download.logo.wine/logo/University_of_Pennsylvania/University_of_Pennsylvania-Logo.wine.png' },
                { id: 'unh', name: 'University of New Hampshire', logo: '/academic-partner-logo.svg' },
              ].map(uni => (
                <Link key={`set2-${uni.id}`} href={`/platform/resources/education/university/${uni.id}`} className="shrink-0 transition-transform hover:scale-110">
                  <img src={uni.logo} alt={uni.name} className="h-16 md:h-20 w-auto object-contain drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:brightness-125" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Masterclasses - Cinematic Cards */}
      {featuredResources.length > 0 && (
        <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="text-indigo-500 fill-indigo-500" size={24} /> Featured Masterclasses
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch w-full">
            {featuredResources.map(resource => {
              const titleLength = (resource.title || '').length;
              const titleSizeClass = 
                titleLength > 85 
                  ? 'text-lg sm:text-xl md:text-2xl'
                  : titleLength > 50 
                  ? 'text-xl sm:text-2xl md:text-3xl'
                  : 'text-2xl sm:text-3xl md:text-4xl';

              return (
                <Link 
                  key={resource.id} 
                  href={`/platform/resources/education/${resource.id}`} 
                  className="group relative rounded-[2rem] overflow-hidden min-h-[380px] sm:min-h-[420px] md:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 bg-gray-950 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-500 w-full"
                >
                  {/* Background Image */}
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-black/30" />
                  
                  {/* Top Row: Badges & University Logo */}
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/30 shadow-sm">
                        {resource.type}
                      </span>
                      <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                        {resource.time}
                      </span>
                    </div>

                    {resource.university && (
                      <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl p-1.5 px-3 border border-white/20 shrink-0">
                        <img src={resource.university.logoLight} alt={resource.university.name} className="h-6 sm:h-7 w-auto object-contain dark:hidden" />
                        <img src={resource.university.logoDark} alt={resource.university.name} className="h-6 sm:h-7 w-auto object-contain hidden dark:block" />
                      </div>
                    )}
                  </div>
                  
                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-950/30 backdrop-blur-[2px] pointer-events-none">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/50 scale-75 group-hover:scale-100 transition-transform duration-500">
                      <PlayCircle size={36} className="ml-1" />
                    </div>
                  </div>

                  {/* Bottom Row: Dynamic Title & Instructor */}
                  <div className="relative z-10 pt-8">
                    <h3 className={`${titleSizeClass} font-black text-white mb-2.5 leading-snug drop-shadow-md group-hover:text-indigo-200 transition-colors line-clamp-3`}>
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs sm:text-sm md:text-base">
                      <GraduationCap size={16} className="text-indigo-400" /> {resource.expert}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Curriculum List */}
      <div className="px-6 max-w-7xl mx-auto">
         <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={24} /> All Available Courses
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allUniversityCourses.map((course, idx) => (
              <Link key={course.id} href={`/platform/resources/education/${course.id}`} className="group flex flex-col bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                 <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center p-8 border-b border-gray-100 dark:border-white/5">
                    <img src={course.universityLogo} alt={course.universityName} className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-black/80 flex items-center justify-center text-indigo-600 dark:text-white shadow-md border border-gray-100 dark:border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <PlayCircle size={20} className="ml-0.5" />
                    </div>
                 </div>
                 <div className="p-6 md:p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md">{course.type}</span>
                   </div>
                   <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">{course.title}</h3>
                   
                   <div className="mt-auto pt-6 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Provided By</p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1">{course.universityName}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                        <Clock size={14} /> {course.time}
                      </div>
                   </div>
                 </div>
              </Link>
            ))}
            
            {allUniversityCourses.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your category or search filters.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
