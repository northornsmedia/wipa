"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Sparkles, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdSlotProps {
  placement: "feed_native" | "sidebar_banner" | "header_ticker" | "resource_splash" | "jobs_spotlight";
  className?: string;
  fallbackGradient?: string;
}

export default function AdSlot({ placement, className = "" }: AdSlotProps) {
  const [ad, setAd] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function loadActiveAd() {
      try {
        const { data, error } = await supabase
          .from("ad_campaigns")
          .select("*")
          .eq("slot_placement", placement)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setAd(data);
          // Increment impression count
          supabase.from("ad_campaigns").update({ impressions_count: (data.impressions_count || 0) + 1 }).eq("id", data.id).then();
        }
      } catch (err) {
        // Silently catch
      } finally {
        setLoading(false);
      }
    }
    loadActiveAd();
  }, [placement]);

  const handleAdClick = (e: React.MouseEvent) => {
    if (!ad) return;
    // Log click
    try {
      supabase.from("ad_campaigns").update({ clicks_count: (ad.clicks_count || 0) + 1 }).eq("id", ad.id).then();
      supabase.from("sponsored_clicks").insert({ resource_id: ad.id, source: `ad_slot_${placement}` }).then();
    } catch (e) {}
  };

  if (isDismissed || loading || !ad) {
    if (placement === "sidebar_banner" && !ad && !loading) {
      return (
        <div className={`w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-gradient-to-br from-[#5a32fa]/10 to-[#b892ff]/10 p-5 ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black tracking-wider text-[#5a32fa] uppercase">⭐ Featured Partner</span>
          </div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">Empowering Women in Global IP</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Join executive councils, access accredited masterclasses & connect worldwide.</p>
          <a href="/platform/memberships" className="inline-flex items-center gap-1 text-xs font-bold text-[#5a32fa] hover:underline">
            Explore Memberships <ArrowUpRight size={14} />
          </a>
        </div>
      );
    }
    return null;
  }

  // 1. IN-FEED NATIVE POST AD
  if (placement === "feed_native") {
    return (
      <div className={`bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 dark:from-[#130b24]/90 dark:via-[#0f172a]/90 dark:to-[#1a0f30]/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-amber-400/40 dark:border-amber-400/30 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a32fa]/10 border border-[#5a32fa]/30 flex items-center justify-center font-black text-xs text-[#5a32fa] overflow-hidden shrink-0 shadow-sm">
              {ad.company_logo_url ? (
                <img src={ad.company_logo_url} alt={ad.company_name} className="w-full h-full object-cover" />
              ) : (
                "SP"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none">{ad.company_name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                  {ad.badge_text || "Sponsored"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Verified WIPA Enterprise Sponsor</p>
            </div>
          </div>

          <a 
            href={ad.target_url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Headline & Body */}
        <div className="mb-4 relative z-10">
          <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug mb-1.5">
            {ad.headline}
          </h3>
          {ad.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {ad.description}
            </p>
          )}
        </div>

        {/* Banner Asset */}
        {ad.banner_image_url && (
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="block rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 mb-4 bg-black group/img shadow-sm max-h-[380px]"
          >
            <img 
              src={ad.banner_image_url} 
              alt={ad.headline} 
              className="w-full max-h-[360px] object-cover group-hover/img:scale-[1.02] transition-transform duration-500" 
            />
          </a>
        )}

        {/* Footer CTA */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between relative z-10">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[200px]">
            {ad.target_url.replace(/^https?:\/\//, '')}
          </span>
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#b892ff] text-white text-xs font-bold shadow-lg shadow-[#5a32fa]/25 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>{ad.cta_label || "Learn More"}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

      </div>
    );
  }

  // 2. RIGHT SIDEBAR BANNER AD
  if (placement === "sidebar_banner") {
    return (
      <div className={`w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] group relative ${className}`}>
        {ad.banner_image_url && (
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="block h-44 w-full overflow-hidden bg-black relative"
          >
            <img 
              src={ad.banner_image_url} 
              alt={ad.headline} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-black uppercase tracking-wider">
                {ad.badge_text || "Sponsored"}
              </span>
            </div>
          </a>
        )}

        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{ad.company_name}</span>
            <ExternalLink size={12} className="text-gray-400" />
          </div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">{ad.headline}</h4>
          {ad.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{ad.description}</p>
          )}
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="w-full py-2.5 rounded-xl bg-[#5a32fa] hover:bg-[#6c47ff] text-white text-xs font-bold shadow-md shadow-[#5a32fa]/30 transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{ad.cta_label || "Explore"}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  // 3. TOP HEADER BROADCAST TICKER
  if (placement === "header_ticker") {
    return (
      <div className="w-full bg-gradient-to-r from-[#5a32fa] via-[#7952ff] to-[#ff90e8] text-white py-2 px-4 shadow-md relative z-40 text-xs font-semibold flex items-center justify-between">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 w-full px-4 overflow-hidden">
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-black/30 uppercase tracking-widest shrink-0">
            {ad.badge_text || "Featured"}
          </span>
          <p className="truncate font-medium">{ad.headline}</p>
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="px-3 py-1 rounded-lg bg-black/40 hover:bg-black/70 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
          >
            <span>{ad.cta_label || "Learn More"}</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-white/75 hover:text-white rounded-lg transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return null;
}
