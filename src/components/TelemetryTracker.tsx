"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export function trackEvent(eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  try {
    let sessionId = sessionStorage.getItem("wipa_telemetry_sid");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("wipa_telemetry_sid", sessionId);
    }

    const payload = {
      event_name: eventName,
      page_route: window.location.pathname,
      page_title: document.title || "WIPA Global Platform",
      session_id: sessionId,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || "",
      metadata
    };

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}
}

export default function TelemetryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAppStore();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    const fullPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    let sessionId = sessionStorage.getItem("wipa_telemetry_sid");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("wipa_telemetry_sid", sessionId);
    }

    const payload = {
      event_name: "page_view",
      page_route: pathname,
      page_title: document.title || "WIPA Platform",
      user_id: user?.id || null,
      session_id: sessionId,
      screen_resolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "1920x1080",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      metadata: {
        search_params: searchParams?.toString() || ""
      }
    };

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }, [pathname, searchParams, user?.id]);

  return null;
}
