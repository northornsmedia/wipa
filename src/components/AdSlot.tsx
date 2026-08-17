"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, Sparkles, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdSlotProps {
  placement?: "feed_native" | "sidebar_banner" | "header_ticker" | "resource_splash" | "jobs_spotlight";
  slotId?: string; // e.g. 'members_sidebar' | 'network_sidebar' | 'events_sidebar' | 'jobs_sidebar' | 'groups_sidebar' | 'mentorship_sidebar' | 'forums_banner' | 'feed_sidebar'
  className?: string;
}

export default function AdSlot({ placement, slotId, className = "" }: AdSlotProps) {
  const [ad, setAd] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const impressionRecorded = useRef<boolean>(false);

  useEffect(() => {
    async function loadActiveAd() {
      try {
        // 1. Try to load specific placement slot first
        if (slotId) {
          const { data: slotData, error: slotError } = await supabase
            .from("ad_placements")
            .select("*")
            .eq("id", slotId)
            .eq("is_active", true)
            .single();

          if (!slotError && slotData) {
            setAd({
              id: slotData.id,
              title: slotData.name,
              company_name: slotData.badge_text || "Featured Sponsor",
              banner_image_url: slotData.banner_image_url,
              headline: slotData.headline,
              description: slotData.subtext,
              cta_label: slotData.cta_text || "Learn More",
              target_url: slotData.target_url,
              badge_text: slotData.badge_text || "Sponsored",
              is_placement_table: true,
              impressions_count: slotData.impressions_count || 0,
              clicks_count: slotData.clicks_count || 0
            });
            return;
          }
        }

        // 2. Fallback to ad_campaigns by placement
        if (placement) {
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
          }
        }
      } catch (err) {
        // Silently catch
      } finally {
        setLoading(false);
      }
    }
    loadActiveAd();
  }, [placement, slotId]);

  // Viewable Impression Tracking via IntersectionObserver
  useEffect(() => {
    if (!ad || impressionRecorded.current || typeof window === "undefined") return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !impressionRecorded.current) {
          impressionRecorded.current = true;
          
          let sessionId = sessionStorage.getItem("wipa_telemetry_sid") || `sess_${Date.now()}`;
          const trackKey = `ad_imp_${slotId || ad.id}_${sessionId}`;
          if (!sessionStorage.getItem(trackKey)) {
            sessionStorage.setItem(trackKey, "1");

            fetch("/api/ad-tracking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slot_id: slotId || null,
                campaign_id: ad.is_placement_table ? null : ad.id,
                event_type: "impression",
                session_id: sessionId,
                page_route: window.location.pathname
              })
            }).catch(() => {});
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ad, slotId]);

  const handleAdClick = () => {
    if (!ad) return;

    try {
      let sessionId = typeof window !== "undefined" ? sessionStorage.getItem("wipa_telemetry_sid") || "" : "";
      
      fetch("/api/ad-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slotId || null,
          campaign_id: ad.is_placement_table ? null : ad.id,
          event_type: "click",
          session_id: sessionId,
          page_route: typeof window !== "undefined" ? window.location.pathname : "/platform"
        })
      }).catch(() => {});

      supabase.from("sponsored_clicks").insert({ 
        resource_id: ad.id, 
        source: `ad_slot_${slotId || placement}` 
      }).then();
    } catch (e) {}
  };

  if (isDismissed || loading || !ad) {
    if ((placement === "sidebar_banner" || slotId?.includes("sidebar")) && !ad && !loading) {
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
      <div 
        ref={containerRef}
        className={`bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 dark:from-[#130b24]/90 dark:via-[#0f172a]/90 dark:to-[#1a0f30]/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-amber-400/40 dark:border-amber-400/30 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      >
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
            href={ad.target_url || "#"} 
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
            href={ad.target_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="block rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 mb-4 bg-black group/img shadow-sm max-h-[380px]"
          >
            <img 
              src={ad.banner_image_url} 
              alt={ad.headline} 
              className="w-full h-full object-cover group-hover/img:scale-[1.02] transition-transform duration-500" 
            />
          </a>
        )}

        {/* Action CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 relative z-10">
          <span className="text-xs font-bold text-gray-400">Promoted Partner Content</span>
          <a
            href={ad.target_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white text-xs font-black shadow-md shadow-purple-500/20 hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <span>{ad.cta_label || "Learn More"}</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    );
  }

  // 2. SIDEBAR BANNER CARD
  return (
    <div 
      ref={containerRef}
      className={`rounded-3xl overflow-hidden shadow-sm border border-amber-400/30 dark:border-amber-400/20 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-transparent relative group ${className}`}
    >
      {ad.banner_image_url && (
        <a
          href={ad.target_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="block w-full h-36 bg-black overflow-hidden relative"
        >
          <img 
            src={ad.banner_image_url} 
            alt={ad.headline} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40">
            {ad.badge_text || "Sponsored"}
          </div>
        </a>
      )}

      <div className="p-4 space-y-2">
        <h4 className="text-xs font-black text-gray-900 dark:text-white leading-snug line-clamp-2">
          {ad.headline}
        </h4>
        {ad.description && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        )}
        <a
          href={ad.target_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="inline-flex items-center justify-center gap-1.5 w-full mt-2 py-2 rounded-xl bg-white/10 hover:bg-[#5a32fa] text-gray-900 dark:text-white hover:text-white text-xs font-bold transition-all border border-white/10"
        >
          <span>{ad.cta_label || "Learn More"}</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
