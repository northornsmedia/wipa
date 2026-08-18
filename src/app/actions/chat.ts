'use server';

import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';

export async function getConversationsAction(userId: string): Promise<any[]> {
  if (!userId) return [];

  const cacheKey = `wipa:chat:conversations:${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Redis Hit] ${cacheKey}`);
      let parsed = cached;
      if (typeof cached === 'string') {
        try { parsed = JSON.parse(cached); } catch (e) {}
      }
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[Redis Chat Read Warning]', err);
  }

  // Fetch unread messages
  const { data: unreadData } = await supabase
    .from('messages')
    .select('conversation_id')
    .eq('is_read', false)
    .neq('sender_id', userId);

  const unreadMap: Record<string, number> = {};
  if (unreadData) {
    unreadData.forEach((m: any) => {
      unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
    });
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      updated_at,
      name,
      is_group,
      conversation_participants (
        user_id,
        profiles (id, full_name, avatar_url, role)
      )
    `)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  const parsed = data.map((c: any) => {
    const other = c.conversation_participants?.find((p: any) => p.user_id !== userId)?.profiles || {};
    const title = c.is_group ? c.name : (other.full_name || 'Direct Message');
    return {
      id: c.id,
      name: title,
      role: other.role || 'Member',
      initial: title.charAt(0).toUpperCase() || 'U',
      color: '#5a32fa',
      unread: unreadMap[c.id] || 0,
      lastMessage: 'Tap to view conversation',
      lastTime: c.updated_at ? new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      messages: [],
      participantId: other.id
    };
  });

  try {
    await redis.set(cacheKey, JSON.stringify(parsed), { ex: 60 });
  } catch (err) {
    console.warn('[Redis Chat Write Warning]', err);
  }

  return parsed;
}

export async function invalidateChatCacheAction(userId: string): Promise<void> {
  try {
    await redis.del(`wipa:chat:conversations:${userId}`);
  } catch (err) {}
}
