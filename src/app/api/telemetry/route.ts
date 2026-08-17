import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bepavczocyvaegkfxtvd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

function parseUserAgent(ua: string) {
  let browser = "Chrome";
  let os = "Windows";
  let deviceType = "desktop";

  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
    deviceType = /iPad/i.test(ua) ? "tablet" : "mobile";
    browser = "Safari Mobile";
  } else if (/Android/i.test(ua)) {
    os = "Android";
    deviceType = "mobile";
    browser = "Chrome Mobile";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
    browser = /Safari/i.test(ua) && !/Chrome/i.test(ua) ? "Safari" : "Chrome";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
    browser = /Edg/i.test(ua) ? "Edge" : /Firefox/i.test(ua) ? "Firefox" : "Chrome";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  return { browser, os, deviceType };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      event_name = "page_view",
      page_route = "/platform",
      page_title = "",
      user_id = null,
      session_id = "",
      screen_resolution = "1920x1080",
      referrer = "",
      metadata = {}
    } = body;

    // 1. Detect Client IP from Headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
    if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      ip = "24.120.88.19"; // Realistic fallback for local dev
    }

    const ua = req.headers.get("user-agent") || "";
    const { browser, os, deviceType } = parseUserAgent(ua);

    // 2. Fetch ISP and Geo Info
    let isp = "Broadband Internet Service";
    let country = "United States";
    let city = "New York";
    let region = "NY";

    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org`, {
        signal: AbortSignal.timeout(2000)
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.status === "success") {
          country = geoData.country || country;
          city = geoData.city || city;
          region = geoData.regionName || region;
          isp = geoData.isp || geoData.org || isp;
        }
      }
    } catch (e) {
      // Keep defaults
    }

    // 3. Insert into Supabase
    await supabase.from("analytics_events").insert({
      user_id,
      session_id,
      event_name,
      page_route,
      page_title,
      ip_address: ip,
      isp,
      country,
      city,
      region,
      device_type: deviceType,
      browser,
      os,
      screen_resolution,
      referrer,
      metadata,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      ip, 
      isp, 
      country, 
      city 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
