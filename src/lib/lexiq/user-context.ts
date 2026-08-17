import { supabase } from '../supabase';

export async function buildUserContext(userId: string) {
  if (!userId) return null;

  const [profileRes, connectionsRes, notificationsRes, eventsRes, xpRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('connections').select('id', { count: 'exact' }).or(`requester_id.eq.${userId},recipient_id.eq.${userId}`).eq('status', 'accepted'),
    supabase.from('notifications').select('id', { count: 'exact' }).eq('user_id', userId).eq('is_read', false),
    supabase.from('event_registrations').select('event_id').eq('user_id', userId),
    supabase.from('quiz_attempts').select('xp_earned').eq('user_id', userId)
  ]);

  const profile = profileRes.data;
  const connectionCount = connectionsRes.count || 0;
  const unreadNotifications = notificationsRes.count || 0;
  const registeredEvents = eventsRes.data?.map(e => e.event_id) || [];
  
  let totalXP = 0;
  if (xpRes.data) {
    totalXP = xpRes.data.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0);
  }

  const userLevel = Math.floor(totalXP / 100) + 1;

  return {
    userName: profile?.full_name || 'User',
    userRole: profile?.role || 'Member',
    userXP: totalXP,
    userLevel: userLevel,
    unreadNotifications,
    connectionCount,
    registeredEvents
  };
}
