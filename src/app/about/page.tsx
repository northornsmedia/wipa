'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Star, Users, Target, Shield, Heart } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbe8d5] bg-grid-pattern font-sans overflow-x-hidden flex flex-col">
      
      <PublicHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Hero Section */}
        <section className="text-center mb-24 relative">
          <div className="absolute top-10 left-10 md:left-20 w-16 h-16 bg-[#ff90e8] rounded-full border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] animate-pulse"></div>
          <div className="absolute bottom-10 right-10 md:right-20 w-24 h-24 bg-[#00d26a] rounded-[2rem] rotate-12 border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313]"></div>
          
          <span className="inline-block bg-[#f99d3e] text-black font-black px-6 py-2 rounded-full text-sm md:text-base border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] mb-8 tracking-wider uppercase">
            Our Mission
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] text-[#1a1a1a] leading-[1.1] mb-8 max-w-5xl mx-auto">
            Empowering Women in <br /> Intellectual Property
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
            WIPA is a global community dedicated to advancing, connecting, and celebrating women professionals in patents, trademarks, copyright, and innovation.
          </p>
        </section>

        {/* Our Story (2 Columns) */}
        <section className="bg-white rounded-[3rem] border-4 border-[#131313] shadow-[12px_12px_0px_0px_#131313] p-10 md:p-20 mb-24 overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] rounded-[2rem] bg-[#5a32fa] border-4 border-[#131313] overflow-hidden group">
              <Image src="/feature_student_1783622505917.png" alt="Our Story" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-8 flex items-center gap-4">
                Our Story <Sparkles className="text-[#5a32fa] w-10 h-10" />
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-6">
                Founded by a group of passionate IP attorneys and tech innovators, WIPA was born out of a shared vision: to bridge the gender gap in intellectual property leadership.
              </p>
              <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-8">
                We realized that while women make up a significant portion of the legal and tech workforce, they are severely underrepresented in patent filings, IP partnerships, and startup founder roles. We decided it was time to change the narrative.
              </p>
              <Link href="/signup" className="inline-block bg-[#00d26a] text-[#131313] px-8 py-4 rounded-xl font-black text-lg border-4 border-[#131313] shadow-[6px_6px_0px_0px_#131313] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#131313] transition-all">
                Join the Movement
              </Link>
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="mb-24">
          <h2 className="font-serif text-4xl md:text-5xl text-center text-[#1a1a1a] mb-16">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-[#ff90e8] p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-white rounded-2xl border-4 border-[#131313] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#131313]">
                <Users className="w-8 h-8 text-[#131313]" />
              </div>
              <h3 className="text-2xl font-black text-[#131313] mb-4">Community</h3>
              <p className="text-[#131313]/80 font-bold text-lg leading-relaxed">
                Building strong, supportive networks that span across borders and disciplines.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#ffc900] p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-white rounded-2xl border-4 border-[#131313] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#131313]">
                <Target className="w-8 h-8 text-[#131313]" />
              </div>
              <h3 className="text-2xl font-black text-[#131313] mb-4">Empowerment</h3>
              <p className="text-[#131313]/80 font-bold text-lg leading-relaxed">
                Equipping women with the resources, mentorship, and opportunities they need to lead.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#6eb4ff] p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-white rounded-2xl border-4 border-[#131313] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#131313]">
                <Shield className="w-8 h-8 text-[#131313]" />
              </div>
              <h3 className="text-2xl font-black text-[#131313] mb-4">Protection</h3>
              <p className="text-[#131313]/80 font-bold text-lg leading-relaxed">
                Advocating for robust intellectual property rights that reward innovation and creativity.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
