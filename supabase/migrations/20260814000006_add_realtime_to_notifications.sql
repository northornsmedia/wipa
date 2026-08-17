-- Enable Realtime for notifications and activity_feed
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.activity_feed;
