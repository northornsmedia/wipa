'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SplashBannerProps {
  id: string;
  title: string;
  logoUrl?: string;
  tagline: string;
  ctaText: string;
  ctaUrl: string;
  bgColor: string;
}

export default function SplashSponsoredBanner({
  id,
  title,
  logoUrl,
  tagline,
  ctaText,
  ctaUrl,
  bgColor
}: SplashBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(`splash_dismissed_${id}`);
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, [id]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`splash_dismissed_${id}`, 'true');
    setIsVisible(false);
  };

  const handleCtaClick = async () => {
    // Phase 2E: we'll call analytics API here
    try {
      await fetch('/api/sponsored-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: id })
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-700"
      style={{ backgroundColor: bgColor || '#0ea5e9' }}
    >
      {/* Animated subtle background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-0"></div>
      
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        
        {/* Logo or Icon */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center p-4 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          {logoUrl ? (
            <img src={logoUrl} alt={title} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-4xl font-black text-gray-900">{title.charAt(0)}</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left text-white">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-white/20 shadow-sm relative overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Sparkles size={12} className="text-yellow-300" />
            <span>Splash Sponsored</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            {title}
          </h2>
          
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mb-6 md:mb-0">
            {tagline}
          </p>
        </div>

        {/* CTA & Dismiss */}
        <div className="flex flex-col items-center md:items-end gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm"
          >
            <X size={16} />
          </button>

          <a 
            href={ctaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="bg-white text-gray-900 hover:bg-gray-50 px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center group"
          >
            {ctaText}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
