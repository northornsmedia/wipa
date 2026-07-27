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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 relative z-10">
        
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

        {/* Col 4 - Contact Us */}
        <div className="flex flex-col gap-6 pt-1 lg:col-span-2">
          <h3 className="text-[#1a1a1a] text-lg font-black uppercase tracking-wider mb-2">CONTACT US</h3>
          
          <div className="space-y-1">
            <p className="font-bold text-[#1a1a1a] text-sm underline decoration-2 decoration-[#b892ff] underline-offset-4 mb-3">United Kingdom Office:</p>
            <p className="text-gray-600 text-sm font-medium">60 Castle Street, Dover,</p>
            <p className="text-gray-600 text-sm font-medium">CT16 1PJ, United Kingdom</p>
            <p className="text-[#1a1a1a] text-sm font-bold mt-2">+ 44 (0)203-813-0457 <span className="text-gray-500 font-medium">(United Kingdom)</span></p>
          </div>

          <div className="space-y-1 mt-2">
            <p className="font-bold text-[#1a1a1a] text-sm underline decoration-2 decoration-[#48d29b] underline-offset-4 mb-3">India Office:</p>
            <p className="text-gray-600 text-sm font-medium leading-relaxed">E-606, Prahlad Nagar Trade Center(PNTC),<br/>Times Of India Press Rd, Satellite, Shyamal,<br/>Ahmedabad, Gujarat, India, 380015</p>
            <p className="text-[#1a1a1a] text-sm font-bold mt-2">+ 91 90545 75950 <span className="text-gray-500 font-medium">(India)</span></p>
          </div>

          <div className="mt-2">
            <a href="mailto:info@northonsprmarketing.com" className="inline-block bg-[#ffc900] text-[#131313] font-bold px-4 py-2 rounded-lg border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#131313] transition-all text-sm">
              info@northonsprmarketing.com
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
