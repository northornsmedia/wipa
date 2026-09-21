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
              }),
            }).catch(() => {});

            // Direct DB increment fallback
            if (ad.is_placement_table && slotId) {
              supabase.rpc("increment_slot_impressions", { slot_id_arg: slotId }).then();
            } else if (ad.id) {
              supabase.rpc("increment_ad_impressions", { campaign_id_arg: ad.id }).then();
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ad, slotId]);

  // Click Tracking
  const handleAdClick = () => {
    if (!ad) return;

    try {
      let sessionId = sessionStorage.getItem("wipa_telemetry_sid") || `sess_${Date.now()}`;
      fetch("/api/ad-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slotId || null,
          campaign_id: ad.is_placement_table ? null : ad.id,
          event_type: "click",
          session_id: sessionId,
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

  // 1. IN-FEED NATIVE POST AD (Seamlessly Blended with Feed Posts & Compact)
  if (placement === "feed_native") {
    return (
      <div 
        ref={containerRef}
        className={`w-full max-w-full min-w-0 bg-white dark:bg-[#0b0f19] sm:bg-white sm:dark:bg-[#151c2c] rounded-none sm:rounded-2xl md:rounded-[2rem] border-b sm:border border-gray-100/60 dark:border-white/[0.06] sm:border-gray-200/80 sm:dark:border-gray-800/80 px-4 py-4 sm:p-5 mb-0 sm:mb-4 shadow-none sm:shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all overflow-hidden select-none ${className}`}
      >
        {/* Sponsor Post Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-[#ff2a5f]">
              {ad.company_logo_url ? (
                <img src={ad.company_logo_url} alt={ad.company_name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-white dark:ring-[#0b0f19]" />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-[#0b0f19]">
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
        <div className="mb-2">
          <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-900 dark:text-white leading-snug mb-1">
            {ad.headline}
          </h3>
          {ad.description && (
            <p className="text-[12px] sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-wrap">
              {ad.description}
            </p>
          )}
        </div>

        {/* Banner Asset (Compact size, no oversized blowout) */}
        {ad.banner_image_url && (
          <div className="w-full max-w-full min-w-0 my-2 box-border">
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
                className="w-full max-w-full h-44 sm:h-60 max-h-[260px] object-cover rounded-xl transition-opacity hover:opacity-98 block mx-auto" 
              />
            </a>
          </div>
        )}

        {/* Action Bar + Learn More Button */}
        <div className="flex items-center justify-between pt-2 mt-1 box-border text-xs font-semibold">
          <span className="text-[11px] font-semibold text-gray-400">Promoted Content</span>
          <a
            href={ad.target_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff2a5f] to-[#ff90e8] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <span>{ad.cta_label || "Learn More"}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  // 2. HORIZONTAL WIDE BANNERS (Events, Jobs, Mentorship, Forums, Liked-Threads)
  const isHorizontalBanner = 
    slotId === "events_sidebar" || 
    slotId === "jobs_sidebar" || 
    slotId === "mentorship_sidebar" || 
    slotId === "forums_banner" || 
    slotId === "liked_threads_banner" || 
    slotId === "feed_sidebar";

  if (isHorizontalBanner) {
    return (
      <div 
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] relative group ${className}`}
      >
        {ad.banner_image_url && (
          <a
            href={ad.target_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="block w-full h-32 sm:h-36 md:h-44 overflow-hidden relative cursor-pointer bg-slate-950"
          >
            <img 
              src={ad.banner_image_url} 
              alt={ad.headline || "Sponsored Banner"} 
              className="w-full h-full object-cover block" 
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-sm z-10">
              {ad.badge_text || "Sponsored"}
            </div>
          </a>
        )}
      </div>
    );
  }

  // 3. VERTICAL RIGHT SIDEBAR ADS (Members Sidebar, Network Sidebar, Feed Sidebar - Square Image-Only)
  return (
    <div 
      ref={containerRef}
      className={`w-full shrink-0 aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] relative group ${className}`}
      style={{ aspectRatio: "1 / 1" }}
    >
      {ad.banner_image_url && (
        <a
          href={ad.target_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="block w-full h-full aspect-square overflow-hidden relative cursor-pointer bg-slate-950"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img 
            src={ad.banner_image_url} 
            alt={ad.headline || "Sponsored Banner"} 
            className="w-full h-full object-cover block" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-sm z-10">
            {ad.badge_text || "Sponsored"}
          </div>
        </a>
      )}
    </div>
  );
}
