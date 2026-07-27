'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useAppStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchNotifications = async () => {
        const { data } = await supabase
          .from('notifications')
          .select(`
            id,
            type,
            read,
            created_at,
            actor:profiles!actor_id(id, full_name)
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
  return (
    <div className="min-h-screen p-4 pb-24 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-[#131313] mb-6">Notifications</h1>
        <div className="flex flex-col border-t-2 border-[#131313] mt-2">
          
          {/* Dynamic Notifications */}
          {notifications.map((notif) => (
            <Link href={`/platform/user/${notif.actor?.id}`} key={notif.id}>
              <div className={`py-4 px-2 border-b-2 border-[#131313] transition-colors cursor-pointer flex items-center gap-4 ${notif.read ? 'bg-transparent hover:bg-white/50' : 'bg-[#e2d5fb] hover:bg-[#d6c2fc]'}`}>
                <div className="w-10 h-10 rounded-full bg-[#00d26a] text-[#131313] flex items-center justify-center font-black border-[1.5px] border-[#131313] shrink-0 text-sm">
                  {notif.actor?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-gray-900 leading-snug">
                    <span className="font-black text-[#131313]">{notif.actor?.full_name || 'Anonymous User'}</span>
                    {notif.type === 'connection_accepted' && ' accepted your connection request.'}
                  </p>
                  <p className="text-[11px] text-[#5a32fa] font-bold mt-0.5">Recently</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-[#ff5241] rounded-full border border-[#131313]"></div>
                )}
              </div>
            </Link>
          ))}
          {/* Mock Notification 1 */}
          <div className="py-4 px-2 border-b-2 border-[#131313] bg-transparent hover:bg-white/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold border-[1.5px] border-[#131313] shrink-0 text-sm">
              S
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-gray-900 leading-snug">
                <span className="font-black text-[#131313]">Sarah Jenkins</span> viewed your profile.
              </p>
              <p className="text-[11px] text-[#5a32fa] font-bold mt-0.5">2 hours ago</p>
            </div>
          </div>

          {/* Mock Notification 2 */}
          <div className="py-4 px-2 border-b-2 border-[#131313] bg-transparent hover:bg-white/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#00d26a] text-[#131313] flex items-center justify-center font-bold border-[1.5px] border-[#131313] shrink-0 text-sm">
              W
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-gray-900 leading-snug">
                <span className="font-black text-[#131313]">WIPA Event:</span> Annual IP Conference is starting soon.
              </p>
              <p className="text-[11px] text-[#5a32fa] font-bold mt-0.5">5 hours ago</p>
            </div>
          </div>

          {/* Mock Notification 3 */}
          <div className="py-4 px-2 border-b-2 border-[#131313] bg-transparent hover:bg-white/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ffc900] text-[#131313] flex items-center justify-center font-black border-[1.5px] border-[#131313] shrink-0 text-sm">
              M
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-gray-900 leading-snug">
                <span className="font-black text-[#131313]">Marie Dubois</span> commented on your post.
              </p>
              <p className="text-[11px] text-[#5a32fa] font-bold mt-0.5">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
