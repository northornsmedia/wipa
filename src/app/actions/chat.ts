'use server';

import { supabase, getSupabaseServerClient } from '@/lib/supabase';
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

export interface SendMessageParams {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  mediaType?: string;
  mediaUrl?: string | null;
  deliveredAt?: string | null;
}

export async function sendMessageServerAction(params: SendMessageParams): Promise<{ success: boolean; error?: string }> {
  if (!params.id || !params.conversationId || !params.senderId) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    const admin = getSupabaseServerClient();

    // 1. Insert message with service-role admin client to bypass client RLS/auth expiration
    const { error: insertError } = await admin.from('messages').insert({
      id: params.id,
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      content: params.content,
      media_type: params.mediaType || 'text',
      media_url: params.mediaUrl || null,
      delivered_at: params.deliveredAt || null,
    });

    if (insertError) {
      // Postgres error 23505 = unique_violation: message with this UUID already exists (earlier attempt succeeded)
      if (insertError.code === '23505') {
        return { success: true };
      }
      console.error('[sendMessageServerAction] Insert error:', insertError);
      return { success: false, error: insertError.message };
    }

    // 2. Update conversation updated_at
    await admin
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', params.conversationId);

    // 3. Clear Redis conversation cache for sender
    try {
      await redis.del(`wipa:chat:conversations:${params.senderId}`);
    } catch {}

    return { success: true };
  } catch (err: any) {
    console.error('[sendMessageServerAction] Exception:', err);
    return { success: false, error: err?.message || 'Server error occurred while sending message' };
  }
}

