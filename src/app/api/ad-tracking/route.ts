import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bepavczocyvaegkfxtvd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      slot_id = null, 
      campaign_id = null, 
      event_type = "impression", // 'impression' | 'click'
      session_id = "",
      page_route = "/platform" 
    } = body;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

    if (event_type === "click") {
      await supabase.rpc("record_ad_click", {
        p_slot_id: slot_id,
        p_campaign_id: campaign_id,
        p_session_id: session_id,
        p_ip: ip,
        p_route: page_route
      });
    } else {
      await supabase.rpc("record_ad_impression", {
        p_slot_id: slot_id,
        p_campaign_id: campaign_id,
        p_session_id: session_id,
        p_ip: ip,
        p_route: page_route
      });
    }

    return NextResponse.json({ success: true, event_type, slot_id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
