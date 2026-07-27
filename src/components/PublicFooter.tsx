'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const ThreeAnimation = dynamic(() => import('@/components/ThreeAnimation'), { ssr: false });

export default function PublicFooter() {
  return (
    <footer className="w-full bg-white pt-20 pb-12 px-6 relative overflow-hidden">
      <div className="block md:hidden">
        <ThreeAnimation />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
        
        {/* Col 1 */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-[2px] mb-6">
            <span className="font-serif text-4xl font-bold tracking-tight text-[#1a1a1a]">WIPA</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
            Connect, collaborate, and grow professionally within the premier global Intellectual Property community for women.
          </p>
        </div>

        {/* Link Columns Wrapper */}
        <div className="grid grid-cols-2 gap-8 lg:col-span-2">
          {/* Col 2 */}
          <div className="flex flex-col gap-5 pt-2">
            <Link href="/about" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">About</Link>
            <Link href="/contact" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Contact</Link>
            <Link href="/pricing" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Pricing</Link>
            <Link href="/resources" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Resources</Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-5 pt-2">
            <a href="#" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Cookie Policy</a>
            <a href="#" className="text-gray-700 font-medium text-sm hover:text-[#ff5241] transition-colors">Accessibility</a>
          </div>
        </div>

        {/* Col 4 */}
        <div className="flex flex-col gap-8 pt-1">
          <div>
            <p className="text-[#1a1a1a] text-lg font-bold mb-3">(316) 555-0116</p>
            <p className="text-[#1a1a1a] text-lg font-bold">hello@wipa.global</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-[#48d29b] border border-black flex items-center justify-center hover:opacity-90 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black fill-current"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

      </div>
      
      {/* Divider */}
      <div className="max-w-7xl mx-auto w-full h-px bg-black/10"></div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium">
        <p>© {new Date().getFullYear()} Women in Intellectual Property Association. All rights reserved.</p>
        <p>Designed for the WIPA Global Community</p>
      </div>
    </footer>
  );
}
