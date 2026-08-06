'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckCheck, Eye, Calendar as CalendarIcon, MessageCircle, UserPlus, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAppStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchNotifications = async () => {
        const { data } = await (supabase as any)
          .from('notifications')
          .select(`
            id,
            type,
            is_read,
            created_at,
            actor:profiles!actor_id(id, full_name, avatar_url)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (data) {
          setNotifications(data);
        }
      };
      fetchNotifications();
    }
  }, [user?.id]);
  
  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    
    // Update DB
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
      
    // Update local state
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-[#0f172a] min-h-[calc(100vh-73px)] p-4 pb-24 md:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Decorative Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#5a32fa] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#ff90e8] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden relative z-10">
        
        {/* Creative Header */}
        <div className="p-6 sm:px-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between relative overflow-hidden">
          {/* Subtle header gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5ff] to-white opacity-50"></div>
          <div className="relative z-10 flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-[#5a32fa] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {unreadCount} New
              </span>
            )}
          </div>
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`relative z-10 flex items-center gap-1.5 text-[13px] font-bold transition-colors group ${unreadCount > 0 ? 'text-gray-500 dark:text-gray-400 hover:text-[#5a32fa]' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <CheckCheck size={16} className={unreadCount > 0 ? "group-hover:scale-110 transition-transform" : ""} />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
        </div>
        
        <div className="flex flex-col">
          
          {/* Dynamic Notifications */}

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No notifications yet.</div>
          ) : (
            notifications.map((notif: any) => {
              const actor = Array.isArray(notif.actor) ? notif.actor[0] : notif.actor;
              const name = actor?.full_name || 'Someone';
              const initial = name.charAt(0).toUpperCase();
              
              let Icon = Eye;
              let iconBg = 'bg-[#ff90e8]';
              let message = notif.content || 'interacted with your profile.';
              
              if (notif.type === 'connection_request') {
                Icon = UserPlus;
                iconBg = 'bg-[#00d26a]';
                message = notif.content || 'sent you a connection request.';
              } else if (notif.type === 'connection_accepted') {
                Icon = CheckCheck;
                iconBg = 'bg-[#5a32fa]';
                message = notif.content || 'accepted your connection request.';
              } else if (notif.type === 'comment') {
                Icon = MessageCircle;
                iconBg = 'bg-[#ffb000]';
              }

              return (
                <Link href={`/platform/profile/${actor?.id}`} key={notif.id} className="block">
                  <div className={`group p-4 sm:p-5 sm:px-8 border-b border-gray-100 dark:border-white/10 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative z-0 hover:z-10 ${notif.is_read ? 'bg-white dark:bg-[#0f172a] hover:bg-gray-50 dark:bg-white/5/80' : 'bg-[#fcfaff] hover:bg-[#f6f2ff]'}`}>
                  <div className="relative shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b892ff] to-[#5a32fa] text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                      style={actor?.avatar_url ? { backgroundImage: `url(${actor.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                    >
                      {!actor?.avatar_url && initial}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${iconBg} flex items-center justify-center shadow-sm`}>
                      <Icon size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 mt-1 transform group-hover:translate-x-1 transition-transform duration-300">
                    <p className="text-[14.5px] text-gray-700 dark:text-gray-200 leading-snug">
                      <span className="font-bold text-gray-900 dark:text-white">{name}</span> {message}
                    </p>
                    <p className={`text-[12px] font-medium mt-1.5 ${notif.is_read ? 'text-gray-400' : 'text-[#5a32fa]'}`}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!notif.is_read && <div className="w-2.5 h-2.5 bg-[#5a32fa] rounded-full shrink-0 shadow-sm animate-pulse"></div>}
                    <button 
                      onClick={(e) => handleDeleteNotification(e, notif.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-50 shrink-0"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  </div>
                </Link>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}
