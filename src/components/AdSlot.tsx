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

  // 1. IN-FEED NATIVE POST AD (Seamlessly Blended with Feed Posts)
  if (placement === "feed_native") {
    return (
      <div 
        ref={containerRef}
        className={`w-full max-w-full min-w-0 bg-white dark:bg-[#0b0f19] sm:bg-white sm:dark:bg-[#151c2c] rounded-none sm:rounded-2xl md:rounded-[2rem] border-b sm:border border-gray-100/60 dark:border-white/[0.06] sm:border-gray-200/80 sm:dark:border-gray-800/80 px-4 py-4 sm:p-6 mb-0 sm:mb-4 shadow-none sm:shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all overflow-hidden select-none ${className}`}
      >
        {/* Sponsor Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-[#ff2a5f]">
              {ad.company_logo_url ? (
                <img src={ad.company_logo_url} alt={ad.company_name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0b0f19]" />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-[#0b0f19]">
                  {ad.company_name?.charAt(0) || "S"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-[13px] sm:text-[14px] text-gray-900 dark:text-white leading-tight">{ad.company_name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                  {ad.badge_text || "Sponsored"}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                Verified Partner • Promoted
              </span>
            </div>
          </div>

          <a 
            href={ad.target_url || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Headline & Body */}
        <div className="mb-2.5">
          <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-900 dark:text-white leading-snug mb-1">
            {ad.headline}
          </h3>
          {ad.description && (
            <p className="text-[13px] sm:text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed font-normal whitespace-pre-wrap">
              {ad.description}
            </p>
          )}
        </div>

        {/* Banner Asset */}
        {ad.banner_image_url && (
          <div className="w-full max-w-full min-w-0 my-2.5 box-border">
            <a
              href={ad.target_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAdClick}
              className="w-full max-w-full min-w-0 overflow-hidden bg-slate-900/5 dark:bg-black/40 flex items-center justify-center rounded-xl shadow-sm block box-border"
            >
              <img 
                src={ad.banner_image_url} 
                alt={ad.headline} 
                className="w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-cover rounded-xl transition-opacity hover:opacity-98 block mx-auto" 
              />
            </a>
          </div>
        )}

        {/* Action Bar + Learn More Button */}
        <div className="flex items-center justify-between pt-2.5 mt-1 box-border text-xs font-semibold">
          <span className="text-[11px] font-semibold text-gray-400">Promoted Content</span>
          <a
            href={ad.target_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff2a5f] to-[#ff90e8] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <span>{ad.cta_label || "Learn More"}</span>
            <ExternalLink size={12} />
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
