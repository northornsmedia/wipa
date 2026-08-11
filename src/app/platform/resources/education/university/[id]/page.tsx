'use client';

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, BookOpen, Clock, Star, Users, MapPin, Building, Globe, Award, Search } from 'lucide-react';
import Link from 'next/link';

// Mock University Data
const UNIVERSITIES_DB = {
  cambridge: {
    name: 'Cambridge University',
    location: 'Cambridge, United Kingdom',
    established: '1209',
    type: 'Public Research University',
    website: 'cam.ac.uk',
    logo: 'https://download.logo.wine/logo/University_of_Cambridge/University_of_Cambridge-Logo.wine.png',
    heroImage: '/resourceimg1.jpg',
    description: 'The University of Cambridge is a collegiate research university in Cambridge, United Kingdom. Founded in 1209, Cambridge is the third-oldest university in continuous operation. It offers world-leading courses in intellectual property, technology law, and corporate strategy.',
    stats: { students: '24k+', courses: '150+', alumni: '300k+' },
    theme: { from: 'from-[#002f6c]', to: 'to-[#1b5e20]' }, // Cambridge blue/green
    courses: [
      { id: 1, title: "International Copyright Law", type: "Masterclass", time: "6 weeks", students: 1240, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 2, title: "Tech Transfer & Spin-outs", type: "Online Course", time: "8 weeks", students: 850, rating: 4.8, image: "/resourceimg2.jpg" },
      { id: 3, title: "European Patent Convention", type: "Certification", time: "Self-paced", students: 3200, rating: 4.7, image: "/resource3.jpg" },
    ]
  },
  yale: {
    name: 'Yale University',
    location: 'New Haven, Connecticut',
    established: '1701',
    type: 'Private Ivy League',
    website: 'yale.edu',
    logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Yale-University-Logo-1.png',
    heroImage: '/resourceimg2.jpg',
    description: 'Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701, it is the third-oldest institution of higher education in the United States. Yale Law School is consistently ranked as the premier institution for legal studies, including IP and innovation policy.',
    stats: { students: '13k+', courses: '120+', alumni: '190k+' },
    theme: { from: 'from-[#0f4d92]', to: 'to-[#002366]' }, // Yale Blue
    courses: [
      { id: 4, title: "IP in the Information Age", type: "Masterclass", time: "4 weeks", students: 2100, rating: 5.0, image: "/resourceimg2.jpg" },
      { id: 5, title: "Law and Technology Clinic", type: "Workshop", time: "1 day", students: 150, rating: 4.9, image: "/resource3.jpg" },
    ]
  },
  columbia: {
    name: 'Columbia University',
    location: 'New York, NY',
    established: '1754',
    type: 'Private Ivy League',
    website: 'columbia.edu',
    logo: 'https://bcassetcdn.com/public/blog-ms/production/sites/2/2022/05/Columbia-University-Logo.png',
    heroImage: '/resource3.jpg',
    description: 'Columbia University is a private Ivy League research university in New York City. Established in 1754, it is the oldest institution of higher education in New York. Its specialized courses in patent litigation and commercial law are renowned globally.',
    stats: { students: '33k+', courses: '200+', alumni: '380k+' },
    theme: { from: 'from-[#b9d9eb]', to: 'to-[#002b7f]' }, // Columbia Blue
    courses: [
      { id: 6, title: "Patent Litigation Strategy", type: "CPD Programme", time: "3 hours", students: 430, rating: 4.8, image: "/resource3.jpg" },
      { id: 7, title: "Media and Entertainment Law", type: "Online Course", time: "10 weeks", students: 1500, rating: 4.6, image: "/resourceimg1.jpg" },
      { id: 8, title: "Startups & Venture Capital", type: "Masterclass", time: "5 weeks", students: 2800, rating: 4.9, image: "/resourceimg2.jpg" },
    ]
  },
  delhi: {
    name: 'Delhi University',
    location: 'New Delhi, India',
    established: '1922',
    type: 'Public Central University',
    website: 'du.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Delhi_University.svg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
    heroImage: '/resourceimg1.jpg',
    description: 'The University of Delhi is a premier university of the country with a venerable legacy and international acclaim for highest academic standards. It offers specialized postgraduate diplomas in Intellectual Property Rights.',
    stats: { students: '600k+', courses: '500+', alumni: '1M+' },
    theme: { from: 'from-[#3b156b]', to: 'to-[#9b2938]' }, // Purple/Red mix
    courses: [
      { id: 9, title: "Diploma in Intellectual Property Rights", type: "Certification", time: "6 months", students: 5000, rating: 4.5, image: "/resourceimg1.jpg" },
      { id: 10, title: "Traditional Knowledge & Patent Law", type: "Online Course", time: "4 weeks", students: 1200, rating: 4.7, image: "/resourceimg2.jpg" },
    ]
  },
  stanford: {
    name: 'Stanford University',
    location: 'Stanford, California',
    established: '1885',
    type: 'Private Research University',
    website: 'stanford.edu',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuWroQgVKxEvraDoi4RCt2EwbfBF2MLlYEGGsyssOeLYu6E-txC_SNJAFt&s=10',
    heroImage: '/resourceimg2.jpg',
    description: 'Stanford University is a private research university in Stanford, California. The campus occupies 8,180 acres, among the largest in the United States. Its location in Silicon Valley makes it a powerhouse for technology, innovation, and patent law.',
    stats: { students: '17k+', courses: '250+', alumni: '220k+' },
    theme: { from: 'from-[#8c1515]', to: 'to-[#4d0000]' }, // Cardinal Red
    courses: [
      { id: 11, title: "AI and IP Valuation", type: "Masterclass", time: "3 weeks", students: 3400, rating: 4.9, image: "/resource3.jpg" },
      { id: 12, title: "Software Patents in the US", type: "Online Course", time: "6 weeks", students: 2800, rating: 4.8, image: "/resourceimg1.jpg" },
      { id: 13, title: "Silicon Valley IP Bootcamp", type: "Workshop", time: "3 days", students: 500, rating: 5.0, image: "/resourceimg2.jpg" },
    ]
  },
  harvard: {
    name: 'Harvard University',
    location: 'Cambridge, Massachusetts',
    established: '1636',
    type: 'Private Ivy League',
    website: 'harvard.edu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg',
    heroImage: '/resource3.jpg',
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher learning in the United States. Harvard Law School offers unparalleled resources in global IP policy.',
    stats: { students: '25k+', courses: '300+', alumni: '400k+' },
    theme: { from: 'from-[#A51C30]', to: 'to-[#5E101B]' }, // Crimson
    courses: [
      { id: 14, title: "Global IP Policy", type: "Masterclass", time: "8 weeks", students: 4200, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 15, title: "Biotech Patents", type: "Online Course", time: "6 weeks", students: 1800, rating: 4.7, image: "/resourceimg2.jpg" },
    ]
  },
  oxford: {
    name: 'Oxford University',
    location: 'Oxford, United Kingdom',
    established: '1096',
    type: 'Public Research University',
    website: 'ox.ac.uk',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg',
    heroImage: '/resourceimg1.jpg',
    description: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096. It boasts one of the most prestigious intellectual property law programs in Europe.',
    stats: { students: '26k+', courses: '350+', alumni: '350k+' },
    theme: { from: 'from-[#002147]', to: 'to-[#001228]' }, // Oxford Blue
    courses: [
      { id: 16, title: "European Copyright Law", type: "Certification", time: "Self-paced", students: 5000, rating: 4.8, image: "/resource3.jpg" },
      { id: 17, title: "History of Patents", type: "Masterclass", time: "4 weeks", students: 900, rating: 4.9, image: "/resourceimg2.jpg" },
    ]
  },
  mit: {
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, Massachusetts',
    established: '1861',
    type: 'Private Land-grant University',
    website: 'mit.edu',
    logo: 'https://download.logo.wine/logo/Massachusetts_Institute_of_Technology/Massachusetts_Institute_of_Technology-Logo.wine.png',
    heroImage: '/resourceimg2.jpg',
    description: 'MIT is a private land-grant research university in Cambridge, Massachusetts. The institute has played a key role in the development of modern technology and science, making its courses on IP transfer and spin-outs world-class.',
    stats: { students: '11k+', courses: '200+', alumni: '140k+' },
    theme: { from: 'from-[#A31F34]', to: 'to-[#8A8B8C]' }, // MIT Red and Gray
    courses: [
      { id: 18, title: "Tech Transfer & Commercialization", type: "Workshop", time: "2 days", students: 300, rating: 5.0, image: "/resourceimg1.jpg" },
      { id: 19, title: "Open Source Licensing", type: "Online Course", time: "5 weeks", students: 3100, rating: 4.9, image: "/resource3.jpg" },
    ]
  },
  princeton: {
    name: 'Princeton University',
    location: 'Princeton, New Jersey',
    established: '1746',
    type: 'Private Ivy League',
    website: 'princeton.edu',
    logo: 'https://download.logo.wine/logo/Princeton_University/Princeton_University-Logo.wine.png',
    heroImage: '/resource3.jpg',
    description: 'Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746 in Elizabeth as the College of New Jersey, Princeton is the fourth-oldest institution of higher education in the United States.',
    stats: { students: '8k+', courses: '150+', alumni: '95k+' },
    theme: { from: 'from-[#E77500]', to: 'to-[#121212]' }, // Princeton Orange & Black
    courses: [
      { id: 20, title: "Innovation Economics", type: "Masterclass", time: "10 weeks", students: 1200, rating: 4.9, image: "/resourceimg2.jpg" },
      { id: 21, title: "Policy and Technology", type: "Online Course", time: "8 weeks", students: 3000, rating: 4.8, image: "/resource3.jpg" },
    ]
  },
  penn: {
    name: 'University of Pennsylvania',
    location: 'Philadelphia, Pennsylvania',
    established: '1740',
    type: 'Private Ivy League',
    website: 'upenn.edu',
    logo: 'https://download.logo.wine/logo/University_of_Pennsylvania/University_of_Pennsylvania-Logo.wine.png',
    heroImage: '/resourceimg1.jpg',
    description: 'The University of Pennsylvania is a private Ivy League research university in Philadelphia, Pennsylvania. Founded in 1740, it is one of the nine colonial colleges chartered prior to the U.S. Declaration of Independence.',
    stats: { students: '28k+', courses: '250+', alumni: '320k+' },
    theme: { from: 'from-[#011F5B]', to: 'to-[#990000]' }, // Penn Blue & Red
    courses: [
      { id: 22, title: "Wharton: IP Strategy", type: "Certification", time: "12 weeks", students: 6500, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 23, title: "Law and Entrepreneurship", type: "Workshop", time: "4 days", students: 450, rating: 4.7, image: "/resourceimg2.jpg" },
    ]
  }
};

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
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
           <div className="lg:col-span-2">
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">About the Institution</h2>
             <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
               {university.description}
             </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{university.stats.students}</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Students</div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{university.stats.courses}</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Courses</div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${university.theme.from} ${university.theme.to} flex items-center justify-center text-white shrink-0`}>
                  <Award size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{university.stats.alumni}</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Alumni</div>
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
            <div key={course.id} className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
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
            </div>
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
