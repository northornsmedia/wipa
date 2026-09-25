'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, Send, Share2, Link2 } from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import Cancel02Icon from '@/components/icons/Cancel02Icon';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !user?.id) return;
    let cancelled = false;
    setLoading(true);
    setSelected(new Set());
    setSent(false);
    setCopied(false);
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

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/platform/post/${post?.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(15);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = () => {
    const url = `${window.location.origin}/platform/post/${post?.id}`;
    if (navigator.share) {
      void navigator.share({ 
        title: 'WIPA post', 
        text: post?.content?.slice(0, 120) || 'Check out this post on WIPA', 
        url 
      }).catch(() => {});
    } else {
      void handleCopyLink();
    }
  };

  const selectedTargetName = useMemo(() => {
    if (selected.size === 1) {
      const firstId = Array.from(selected)[0];
      const target = targets.find(t => t.userId === firstId);
      return target?.name.split(' ')[0] || '1 person';
    }
    return `${selected.size} people`;
  }, [selected, targets]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4 select-none">
          {/* Backdrop with soft fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Sheet Modal with pull-down exit animation */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            onClick={event => event.stopPropagation()}
            className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-[2.2rem] bg-white shadow-2xl dark:bg-black sm:dark:bg-[#121620] sm:rounded-3xl border-t sm:border border-gray-100 dark:border-white/10 will-change-transform transform-gpu overflow-hidden"
          >
            {/* Pull Handle for mobile drag */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden cursor-grab active:cursor-grabbing touch-none">
              <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Share post</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Recent chats and connections</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                aria-label="Close share sheet"
              >
                <Cancel02Icon size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 pt-3 shrink-0">
              <div className="flex items-center gap-2.5 rounded-2xl bg-gray-100 px-3.5 dark:bg-white/5 border border-transparent focus-within:border-[#5a32fa] transition-all">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search people..."
                  className="h-10 flex-1 bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <Cancel02Icon size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* People Grid */}
            <div className="min-h-48 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:none]">
              {loading ? (
                <div className="flex justify-center py-16">
                  <DotmCircular7 size={36} className="text-[#5a32fa]" />
                </div>
              ) : visibleTargets.length ? (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {visibleTargets.map(target => {
                    const isSelected = selected.has(target.userId);
                    return (
                      <button
                        key={target.userId}
                        type="button"
                        onClick={() => {
                          if (navigator.vibrate) navigator.vibrate(10);
                          setSelected(current => {
                            const next = new Set(current);
                            isSelected ? next.delete(target.userId) : next.add(target.userId);
                            return next;
                          });
                        }}
                        className="relative flex min-w-0 flex-col items-center rounded-2xl p-2 active:scale-95 cursor-pointer transition-transform group"
                      >
                        <div className={`relative h-16 w-16 rounded-full p-0.5 transition-all duration-200 ${
                          isSelected 
                            ? 'ring-2 ring-[#5a32fa] ring-offset-2 ring-offset-white dark:ring-offset-black scale-105 shadow-md shadow-[#5a32fa]/25' 
                            : 'ring-1 ring-gray-200 dark:ring-white/10 group-hover:scale-105'
                        }`}>
                          {target.avatarUrl ? (
                            <img src={target.avatarUrl} alt={target.name} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#5a32fa]/20 to-[#ff90e8]/20 font-black text-sm text-[#5a32fa] dark:text-[#ff90e8]">
                              {target.name.charAt(0)}
                            </div>
                          )}
                          {isSelected && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff2a5f] text-white shadow-xs ring-2 ring-white dark:ring-black">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <span className="mt-2 w-full truncate text-xs font-bold text-gray-900 dark:text-white text-center">
                          {target.name}
                        </span>
                        <span className="w-full truncate text-[10px] text-gray-400 text-center font-medium">
                          {target.recent ? 'Recent' : target.role || 'Connected'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-14 text-center text-xs text-gray-500">
                  No matching conversations or connections.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-100 p-4 dark:border-white/10 space-y-2.5 bg-gray-50/50 dark:bg-white/[0.02]">
              {/* Send Button */}
              <button
                type="button"
                onClick={() => void sendInternally()}
                disabled={!selected.size || sending || sent}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl h-11 py-2.5 px-4 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] cursor-pointer ${
                  selected.size && !sending && !sent
                    ? 'bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] hover:opacity-95 text-white shadow-md shadow-[#5a32fa]/25'
                    : sent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <>
                    <DotmCircular7 size={18} className="text-white" />
                    <span>Sending...</span>
                  </>
                ) : sent ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    <span>Sent!</span>
                  </>
                ) : selected.size ? (
                  <>
                    <Send size={15} />
                    <span>Send to {selectedTargetName}</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Select people to send</span>
                  </>
                )}
              </button>

              {/* Quick Actions: Copy Link & Native Share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors active:scale-95 cursor-pointer"
                >
                  <Link2 size={14} className={copied ? 'text-emerald-500' : ''} />
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors active:scale-95 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>More options</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

