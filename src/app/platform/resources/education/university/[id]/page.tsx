'use client';

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, BookOpen, Clock, Star, Users, MapPin, Building, Globe, Award, Search, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

// Mock University Data
import { UNIVERSITIES_DB } from '../../data';

import { useParams } from 'next/navigation';

export default function UniversityProfilePage() {
  const params = useParams();
  const uniId = (params?.id as keyof typeof UNIVERSITIES_DB) || 'cambridge';
  const university = UNIVERSITIES_DB[uniId] || UNIVERSITIES_DB['cambridge']; // fallback
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = university.courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30">
      
      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-between pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img src={university.heroImage} alt={university.name} className="w-full h-full object-cover opacity-70 dark:opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-[#050505] dark:via-black/60 to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-r ${university.theme.from} ${university.theme.to} opacity-50 dark:opacity-40 mix-blend-multiply`} />
        </div>
        
        {/* Texture Overlay Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[url('/patterns/cubes.png')] z-0 pointer-events-none"></div>

        {/* Top Nav Overlay */}
        <div className="relative z-50 p-6 flex items-center justify-between">
          <Link href="/platform/resources/education" className="flex items-center gap-2 bg-white/20 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/30 dark:hover:bg-white/10 transition-colors border border-white/20 font-bold text-sm shadow-sm">
             <ArrowLeft size={16} /> Back to Academy
          </Link>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-10 items-end justify-between">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white dark:bg-[#111] p-4 flex items-center justify-center shadow-2xl border border-gray-200 dark:border-white/10 shrink-0 relative overflow-hidden group">
               <div className={`absolute inset-0 bg-gradient-to-br ${university.theme.from} ${university.theme.to} opacity-0 group-hover:opacity-10 transition-opacity`} />
               <img src={university.logo} alt={university.name} className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="pb-2">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <span className="bg-white/90 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white text-xs font-black uppercase px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-1.5">
                  <Building size={14} className="opacity-70" /> {university.type}
                </span>
                <span className="bg-white/90 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white text-xs font-black uppercase px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-1.5">
                  <MapPin size={14} className="opacity-70" /> {university.location}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-sm dark:drop-shadow-lg">
                {university.name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-800 dark:text-white/80 font-medium">
                 <div className="flex items-center gap-2">
                   <Clock size={18} className="opacity-70" /> Established {university.established}
                 </div>
                 <div className="flex items-center gap-2">
                   <Globe size={18} className="opacity-70" /> <a href={`https://${university.website}`} target="_blank" rel="noreferrer" className="hover:underline">{university.website}</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        
        {/* About & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
           <div className="lg:col-span-2">
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">About the Institution</h2>
             <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
               {university.description}
             </p>
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{university.stats.students}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Students</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{university.stats.courses}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Courses</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{university.stats.alumni}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alumni</div>
                  </div>
                </div>
              </div>   
              {/* Dedicated Contact Person Card */}
              <div className="mt-4 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${university.theme.from} ${university.theme.to}`} />
                <div className="flex items-center gap-4 mb-4">
                  <img src={university.contact.image} alt={university.contact.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-white/10" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{university.contact.name}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{university.contact.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href={`mailto:${university.contact.email}`} className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    <Mail size={16} className="text-gray-400" />
                    {university.contact.email}
                  </a>
                  <a href={`tel:${university.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    <Phone size={16} className="text-gray-400" />
                    {university.contact.phone}
                  </a>
                </div>
              </div>
           </div>
        </div>

        {/* Courses Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Available Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Master IP with programs certified by {university.name}.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search curriculum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full py-3 pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <Link href={`/platform/resources/education/${course.id}`} key={course.id} className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent z-10 transition-colors duration-500" />
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {course.type}
                  </span>
                </div>
                
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {course.rating}
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> {course.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} /> {course.students.toLocaleString()} enrolled
                  </div>
                </div>
              </div>
              
              {/* Bottom accent bar using university theme */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${university.theme.from} ${university.theme.to} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Link>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/10">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
