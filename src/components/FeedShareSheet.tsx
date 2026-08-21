'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Search, Send, Share2, X } from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';

type ShareTarget = {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
  conversationId?: string;
  recent: boolean;
};

export default function FeedShareSheet({ open, post, user, onClose }: { open: boolean; post: any; user: any; onClose: () => void }) {
  const [targets, setTargets] = useState<ShareTarget[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open || !user?.id) return;
    let cancelled = false;
    setLoading(true);
    setSelected(new Set());
    setSent(false);
    setQuery('');

    const loadTargets = async () => {
      const [conversationResult, connectionResult] = await Promise.all([
        supabase.from('conversation_participants').select(`
          conversation_id,
          conversations(id, updated_at, is_group, conversation_participants(user_id, profiles:profiles!conversation_participants_user_id_fkey(id, full_name, avatar_url, practice_area, role)))
        `).eq('user_id', user.id),
        supabase.from('connections').select(`
          requester_id, recipient_id,
          requester:profiles!requester_id(id, full_name, avatar_url, practice_area, role),
          recipient:profiles!recipient_id(id, full_name, avatar_url, practice_area, role)
        `).or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`).eq('status', 'accepted')
      ]);

      const targetMap = new Map<string, ShareTarget>();
      for (const row of conversationResult.data || []) {
        const conversation: any = Array.isArray(row.conversations) ? row.conversations[0] : row.conversations;
        if (!conversation || conversation.is_group) continue;
        const participant = conversation.conversation_participants?.find((item: any) => item.user_id !== user.id);
        const profile: any = Array.isArray(participant?.profiles) ? participant.profiles[0] : participant?.profiles;
        if (!profile?.id) continue;
        targetMap.set(String(profile.id), {
          userId: String(profile.id), name: profile.full_name || 'WIPA Member', avatarUrl: profile.avatar_url,
          role: profile.practice_area || profile.role, conversationId: String(conversation.id), recent: true,
        });
      }

      for (const connection of connectionResult.data || []) {
        const requester: any = Array.isArray(connection.requester) ? connection.requester[0] : connection.requester;
        const recipient: any = Array.isArray(connection.recipient) ? connection.recipient[0] : connection.recipient;
        const profile = String(connection.requester_id) === String(user.id) ? recipient : requester;
        if (!profile?.id || targetMap.has(String(profile.id))) continue;
        targetMap.set(String(profile.id), {
          userId: String(profile.id), name: profile.full_name || 'WIPA Member', avatarUrl: profile.avatar_url,
          role: profile.practice_area || profile.role, recent: false,
        });
      }

      if (!cancelled) {
        setTargets([...targetMap.values()]);
        setLoading(false);
      }
    };
    void loadTargets();
    return () => { cancelled = true; };
  }, [open, user?.id]);

  const visibleTargets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return targets.filter(target => !normalized || `${target.name} ${target.role || ''}`.toLowerCase().includes(normalized));
  }, [query, targets]);

  const ensureConversation = async (target: ShareTarget) => {
    if (target.conversationId) return target.conversationId;
    const { data: conversation, error } = await supabase.from('conversations').insert({ is_group: false }).select('id').single();
    if (error || !conversation) throw error || new Error('Could not create conversation');
    const { error: participantsError } = await supabase.from('conversation_participants').insert([
      { conversation_id: conversation.id, user_id: user.id },
      { conversation_id: conversation.id, user_id: target.userId },
    ]);
    if (participantsError) throw participantsError;
    return String(conversation.id);
  };

  const sendInternally = async () => {
    if (!selected.size || !post?.id || sending) return;
    setSending(true);
    try {
      const postUrl = `${window.location.origin}/platform/post/${post.id}`;
      const excerpt = String(post.content || 'View this post on WIPA').replace(/\s+/g, ' ').slice(0, 180);
      const chosenTargets = targets.filter(target => selected.has(target.userId));
      await Promise.all(chosenTargets.map(async target => {
        const conversationId = await ensureConversation(target);
        const messageId = crypto.randomUUID();
        const { error } = await supabase.from('messages').insert({
          id: messageId, conversation_id: conversationId, sender_id: user.id,
          content: `📌 Shared a WIPA post\n${excerpt}\n${postUrl}`, media_type: 'text',
        });
        if (error) throw error;
        void supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
        void fetch('/api/notifications/push', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
          body: JSON.stringify({ recipientId: target.userId, conversationId, senderId: user.id,
            senderName: user.name || 'WIPA Member', senderAvatar: user.avatar_url || null,
            messageText: 'Shared a post with you', mediaType: 'text' }),
        }).catch(() => {});
      }));
      setSent(true);
      if (navigator.vibrate) navigator.vibrate(25);
      setTimeout(onClose, 900);
    } catch (error) {
      console.error('Could not share post inside WIPA:', error);
      alert('Could not send this post. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[78dvh] w-full max-w-md flex-col rounded-t-[2rem] bg-white shadow-2xl dark:bg-[#151c2c] sm:rounded-[2rem]" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div><h2 className="text-lg font-black">Share post</h2><p className="text-xs text-gray-500">Recent chats and connections</p></div>
          <button onClick={onClose} className="rounded-full bg-gray-100 p-2 dark:bg-white/10" aria-label="Close share sheet"><X size={18} /></button>
        </div>
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3.5 dark:bg-white/5"><Search size={16} className="text-gray-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search people" className="h-11 flex-1 bg-transparent text-sm outline-none" /></div>
        </div>
        <div className="min-h-48 flex-1 overflow-y-auto px-3 py-3">
          {loading ? <div className="flex justify-center py-16"><DotmCircular7 size={42} className="text-[#6600FF]" /></div> : visibleTargets.length ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{visibleTargets.map(target => {
              const isSelected = selected.has(target.userId);
              return <button key={target.userId} onClick={() => setSelected(current => { const next = new Set(current); isSelected ? next.delete(target.userId) : next.add(target.userId); return next; })} className="relative flex min-w-0 flex-col items-center rounded-2xl p-2 active:scale-95">
                <div className={`relative h-16 w-16 rounded-full p-0.5 ${isSelected ? 'bg-[#6600FF]' : 'bg-gray-200 dark:bg-white/10'}`}>
                  {target.avatarUrl ? <img src={target.avatarUrl} alt={target.name} className="h-full w-full rounded-full object-cover" /> : <div className="flex h-full w-full items-center justify-center rounded-full bg-violet-100 font-black text-[#6600FF]">{target.name.charAt(0)}</div>}
                  {isSelected && <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#6600FF] text-white dark:border-[#151c2c]"><Check size={13} /></span>}
                </div><span className="mt-1.5 w-full truncate text-xs font-bold">{target.name}</span><span className="w-full truncate text-[10px] text-gray-400">{target.recent ? 'Recent' : target.role || 'Connected'}</span>
              </button>;
            })}</div>
          ) : <div className="py-14 text-center text-sm text-gray-500">No matching conversations or connections.</div>}
        </div>
        <div className="border-t border-gray-100 p-4 dark:border-white/10">
          <button onClick={() => void sendInternally()} disabled={!selected.size || sending || sent} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6600FF] py-3.5 text-sm font-bold text-white disabled:opacity-40">
            {sending ? <DotmCircular7 size={18} /> : sent ? <><Check size={18} /> Sent</> : <><Send size={17} /> Send {selected.size ? `to ${selected.size}` : ''}</>}
          </button>
          <button onClick={() => {
            const url = `${window.location.origin}/platform/post/${post?.id}`;
            if (navigator.share) void navigator.share({ title: 'WIPA post', text: post?.content?.slice(0, 120), url }).catch(() => {});
            else void navigator.clipboard.writeText(url);
          }} className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500"><Share2 size={15} /> More sharing options</button>
        </div>
      </div>
    </div>
  );
}
