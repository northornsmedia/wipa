// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Find events starting within 24 hours
    const { data: events, error } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .gte('start_at', now.toISOString())
      .lte('start_at', tomorrow.toISOString());

    if (error) throw error;
    
    let notificationsCount = 0;

    if (events && events.length > 0) {
      const notifications = events.map(event => ({
        user_id: event.user_id,
        type: 'event_reminder',
        title: 'Upcoming Event Reminder',
        content: `Reminder: ${event.title} is starting within 24 hours.`,
        action_url: '/platform/calendar',
        created_at: new Date().toISOString()
      }));

      // Insert notifications
      // Assuming app_notifications table exists from Phase 8E
      const { error: notifyError } = await supabaseClient
        .from('app_notifications')
        .insert(notifications);
        
      if (notifyError) throw notifyError;
      notificationsCount = notifications.length;
    }

    return new Response(JSON.stringify({ message: `Processed ${notificationsCount} reminders.` }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
