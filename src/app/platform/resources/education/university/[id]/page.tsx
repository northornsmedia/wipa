'use client';

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, BookOpen, Clock, Star, Users, MapPin, Building, Globe, Award, Search, Mail, Phone } from 'lucide-react';
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
    contact: { name: "Eleanor Wright", role: "UK Academic Liaison", email: "eleanor.w@wipa.org", phone: "+44 20 7946 0958", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "David Chen", role: "Ivy League Coordinator", email: "david.c@wipa.org", phone: "+1 (203) 555-0198", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Marcus Vance", role: "New York Programs Lead", email: "marcus.v@wipa.org", phone: "+1 (212) 555-0122", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Priya Sharma", role: "Asia-Pacific Relations", email: "priya.s@wipa.org", phone: "+91 11 2766 7011", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Sarah Jenkins", role: "Silicon Valley Director", email: "sarah.j@wipa.org", phone: "+1 (650) 555-0188", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Dr. Robert Hughes", role: "Strategic Partnerships", email: "robert.h@wipa.org", phone: "+1 (617) 555-0134", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "James Sterling", role: "European Operations Lead", email: "james.s@wipa.org", phone: "+44 1865 270000", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Lisa Wong", role: "Technology Integration Manager", email: "lisa.w@wipa.org", phone: "+1 (617) 555-0199", image: "https://images.unsplash.com/photo-1598550874175-4d0ef43ce418?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Amanda Clarke", role: "Academic Affairs Director", email: "amanda.c@wipa.org", phone: "+1 (609) 555-0177", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop" },
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
    contact: { name: "Michael Ross", role: "Wharton Liaison", email: "michael.r@wipa.org", phone: "+1 (215) 555-0145", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop" },
    courses: [
      { id: 22, title: "Wharton: IP Strategy", type: "Certification", time: "12 weeks", students: 6500, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 23, title: "Law and Entrepreneurship", type: "Workshop", time: "4 days", students: 450, rating: 4.7, image: "/resourceimg2.jpg" },
    ]
  },
  unh: {
    name: 'University of New Hampshire',
    location: 'Durham, New Hampshire',
    established: '1866',
    type: 'Public Research University',
    website: 'unh.edu',
    logo: '/university.png',
    heroImage: '/resourceimg1.jpg',
    description: 'The University of New Hampshire is a public land-grant research university with its main campus in Durham, New Hampshire. It offers leading programs in law, intellectual property, and technology transfer through its Franklin Pierce School of Law.',
    stats: { students: '15k+', courses: '100+', alumni: '140k+' },
    theme: { from: 'from-[#041E42]', to: 'to-[#1f2a44]' },
    contact: { name: "Sarah Dorner", role: "Assistant Dean for Graduate Admissions & International Outreach", email: "sarah.dorner@law.unh.edu", phone: "(603) 228.1541", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop" },
    courses: [
      { id: 24, title: "LL.M. in Intellectual Property (Online)", type: "Degree", time: "Online", students: 450, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 25, title: "Master's in Intellectual Property (Online)", type: "Degree", time: "Online", students: 600, rating: 4.8, image: "/resourceimg2.jpg" },
      { id: 26, title: "Graduate Certificate in Intellectual Property (Online)", type: "Certificate", time: "Online", students: 850, rating: 4.7, image: "/resource3.jpg" },
      { id: 27, title: "LL.M. in IP", type: "Degree", time: "Residential", students: 300, rating: 4.9, image: "/resourceimg1.jpg" },
      { id: 28, title: "LL.M. in Commerce and Technology", type: "Degree", time: "Residential", students: 320, rating: 4.9, image: "/resourceimg2.jpg" },
      { id: 29, title: "Master's in IP", type: "Degree", time: "Residential", students: 380, rating: 4.8, image: "/resource3.jpg" },
      { id: 30, title: "Master's in Commerce and Technology", type: "Degree", time: "Residential", students: 410, rating: 4.8, image: "/resourceimg1.jpg" },
      { id: 31, title: "Graduate Certificate in IP", type: "Certificate", time: "Residential", students: 450, rating: 4.7, image: "/resourceimg2.jpg" },
      { id: 32, title: "Graduate Certificate in Commerce and Technology", type: "Certificate", time: "Residential", students: 500, rating: 4.7, image: "/resource3.jpg" },
      { id: 33, title: "Hybrid JD — main program page (both specializations)", type: "Hybrid JD", time: "Hybrid", students: 200, rating: 5.0, image: "/resourceimg1.jpg" },
      { id: 34, title: "Hybrid JD — Intellectual Property, Technology, and Information Law concentration", type: "Hybrid JD", time: "Hybrid", students: 120, rating: 5.0, image: "/resourceimg2.jpg" },
      { id: 35, title: "Hybrid JD — Health and Life Science Law concentration", type: "Hybrid JD", time: "Hybrid", students: 90, rating: 4.9, image: "/resource3.jpg" },
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
