'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { Search, Building2, Star, CheckCircle2, MapPin, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function IPFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  useEffect(() => {
    const fetchFirms = async () => {
      setLoading(true);
      const { data } = await supabase.from('ip_firms').select('*');
      if (data) {
        setFirms(data);
      }
      setLoading(false);
    };
    fetchFirms();
  }, []);

  // Sort and filter logic
  const filteredFirms = firms.filter(firm => {
    if (verifiedOnly && !firm.is_verified) return false;
    if (selectedSize && firm.size_range !== selectedSize) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = firm.name.toLowerCase().includes(query);
      const matchDesc = firm.description?.toLowerCase().includes(query);
      const matchSpec = firm.specializations?.some((s: string) => s.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchSpec) return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24">
      
      {/* Hero Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 pt-10 sm:pt-20 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest mb-4">
            <Building2 size={16} /> IP Firms Directory
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight">
            Find the Right IP Partner
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Browse our curated directory of top intellectual property law firms, agencies, and specialists worldwide.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/platform/resources/ip-firms/claim"
              className="px-5 py-2.5 rounded-full bg-[#5a32fa] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#4a24db] active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} /> Showcase or List Your Firm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters and Search */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, description, or specialization..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#5a32fa]/50 transition-all text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <select 
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-sm outline-none shrink-0"
            >
              <option value="">All Sizes</option>
              <option value="1-10">1-10 Employees</option>
              <option value="10-50">10-50 Employees</option>
              <option value="50-100">50-100 Employees</option>
              <option value="100-500">100-500 Employees</option>
            </select>
            
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shrink-0 transition-colors">
              <input 
                type="checkbox" 
                checked={verifiedOnly} 
                onChange={e => setVerifiedOnly(e.target.checked)} 
                className="w-4 h-4 rounded text-[#5a32fa]" 
              />
              <span className="font-bold text-sm">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center p-20">
            <DotmCircular7 size={40} className="text-[#6600FF]" />
          </div>
        ) : filteredFirms.length === 0 ? (
          <div className="text-center bg-white dark:bg-[#0f172a] rounded-3xl p-16 border border-slate-200 dark:border-white/10 shadow-sm">
            <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-2xl font-black mb-2">No firms found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFirms.map(firm => (
              <Link 
                href={`/platform/resources/ip-firms/${firm.slug}`} 
                key={firm.id}
                className="group bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
              >
                {firm.is_featured && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star size={10} className="fill-white" /> Featured
                  </div>
                )}
                
                <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                  {firm.cover_image_url ? (
                    <img src={firm.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                  )}
                  
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                      {firm.logo_url ? (
                        <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black text-slate-300">{firm.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-14 p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors line-clamp-1">{firm.name}</h3>
                    {firm.is_verified && <CheckCircle2 size={16} className="text-blue-500 shrink-0" />}
                  </div>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
                    <MapPin size={12} /> {firm.headquarters || 'Multiple Locations'}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                    {firm.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(firm.specializations || []).slice(0, 3).map((spec: string) => (
                        <span key={spec} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                          {spec}
                        </span>
                      ))}
                      {(firm.specializations?.length || 0) > 3 && (
                        <span className="text-xs font-bold text-slate-400 px-1 py-1">+{firm.specializations.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-[#5a32fa] font-black text-sm group-hover:translate-x-1 transition-transform">
                      View Profile <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-indigo-600 to-[#5a32fa] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Are you an IP Firm?</h2>
            <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto">
              List your firm on WIPA to connect with top IP professionals, clients, and partners globally.
            </p>
            <Link href="/platform/resources/ip-firms/claim" className="inline-block bg-white text-[#5a32fa] font-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
              Submit Your Firm
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
