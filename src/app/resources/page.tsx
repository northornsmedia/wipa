'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BookOpen, PlayCircle, FileText, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fbe8d5] bg-grid-pattern font-sans overflow-x-hidden flex flex-col">
      
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tighter text-[#131313]">WIPA</h1>
        </Link>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-black rounded-full shadow-[3px_3px_0px_0px_#131313] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#131313] transition-all font-semibold text-sm text-[#131313]"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] text-[#1a1a1a] leading-[1.1] mb-8 max-w-4xl mx-auto">
            Knowledge is <br /> Your Best Asset
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Access exclusive IP resources, webinars, and guides curated by top industry professionals.
          </p>
          <div className="flex justify-center gap-4">
             <button className="bg-[#b892ff] text-[#131313] px-8 py-4 rounded-xl font-black text-lg border-4 border-[#131313] shadow-[6px_6px_0px_0px_#131313] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#131313] transition-all">
                Browse Library
              </button>
          </div>
        </section>

        {/* Featured Resources Grid */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
             <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">Featured Guides</h2>
             <Link href="/signup" className="text-lg font-bold text-[#5a32fa] underline decoration-2 underline-offset-4 hover:text-[#4219df]">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden group hover:-translate-y-2 transition-transform cursor-pointer">
              <div className="h-48 bg-[#48d29b] border-b-4 border-[#131313] relative p-6 flex items-end">
                <BookOpen className="w-16 h-16 text-[#131313] opacity-50 absolute top-6 right-6" />
                <span className="bg-white text-[#131313] text-xs font-black px-3 py-1 rounded-full border-2 border-[#131313]">PDF GUIDE</span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-[#131313] mb-3">The Ultimate Guide to Patent Prosecution</h3>
                <p className="text-gray-600 font-medium mb-6">Master the intricacies of the USPTO examination process and overcome rejections effectively.</p>
                <button className="flex items-center gap-2 text-[#5a32fa] font-bold hover:gap-4 transition-all">
                  Download <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guide 2 */}
            <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden group hover:-translate-y-2 transition-transform cursor-pointer">
              <div className="h-48 bg-[#f99d3e] border-b-4 border-[#131313] relative p-6 flex items-end">
                <PlayCircle className="w-16 h-16 text-[#131313] opacity-50 absolute top-6 right-6" />
                <span className="bg-white text-[#131313] text-xs font-black px-3 py-1 rounded-full border-2 border-[#131313]">WEBINAR RECORDING</span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-[#131313] mb-3">Navigating International Trademarks</h3>
                <p className="text-gray-600 font-medium mb-6">Watch our expert panel discuss the Madrid Protocol and strategies for global brand protection.</p>
                <button className="flex items-center gap-2 text-[#5a32fa] font-bold hover:gap-4 transition-all">
                  Watch Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guide 3 */}
            <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden group hover:-translate-y-2 transition-transform cursor-pointer">
              <div className="h-48 bg-[#ff90e8] border-b-4 border-[#131313] relative p-6 flex items-end">
                <FileText className="w-16 h-16 text-[#131313] opacity-50 absolute top-6 right-6" />
                <span className="bg-white text-[#131313] text-xs font-black px-3 py-1 rounded-full border-2 border-[#131313]">TEMPLATE</span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-[#131313] mb-3">Startup IP Assignment Agreement</h3>
                <p className="text-gray-600 font-medium mb-6">A standard, fully customizable template for transferring IP rights from founders to the company.</p>
                <button className="flex items-center gap-2 text-[#5a32fa] font-bold hover:gap-4 transition-all">
                  Download <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#131313] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">Unlock the Full Library</h2>
            <p className="text-xl text-gray-300 font-medium mb-10">Join WIPA today to get unlimited access to hundreds of premium articles, legal templates, and past webinar recordings.</p>
            <Link href="/signup" className="inline-block bg-[#ffc900] text-[#131313] px-10 py-5 rounded-xl font-black text-xl hover:scale-105 transition-transform">
              Become a Member
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#5a32fa] rounded-full mix-blend-screen opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00d26a] rounded-full mix-blend-screen opacity-50 blur-3xl"></div>
        </section>

      </main>
    </div>
  );
}
