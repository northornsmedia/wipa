'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckCheck, Eye, Calendar as CalendarIcon, MessageCircle, UserPlus } from 'lucide-react';

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
    <div className="w-full bg-[#f8f9fa] min-h-[calc(100vh-73px)] p-4 pb-24 md:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Decorative Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#5a32fa] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#ff90e8] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative z-10">
        
        {/* Creative Header */}
        <div className="p-6 sm:px-8 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          {/* Subtle header gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5ff] to-white opacity-50"></div>
          <div className="relative z-10 flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <span className="bg-[#5a32fa] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              3 New
            </span>
          </div>
          <button className="relative z-10 flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-[#5a32fa] transition-colors group">
            <CheckCheck size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
        </div>
        
        <div className="flex flex-col">
          
          {/* Dynamic Notifications */}
          {notifications.map((notif) => (
            <Link href={`/platform/user/${notif.actor?.id}`} key={notif.id}>
              <div className={`group p-4 sm:p-5 sm:px-8 border-b border-gray-100 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative z-0 hover:z-10 ${notif.read ? 'bg-white hover:bg-gray-50/80' : 'bg-[#fcfaff] hover:bg-[#f6f2ff]'}`}>
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#00d26a] text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                    {notif.actor?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-[#5a32fa] flex items-center justify-center shadow-sm">
                    <UserPlus size={12} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 mt-1 transform group-hover:translate-x-1 transition-transform duration-300">
                  <p className="text-[14.5px] text-gray-700 leading-snug">
                    <span className="font-bold text-gray-900">{notif.actor?.full_name || 'Anonymous User'}</span>
                    {notif.type === 'connection_accepted' && ' accepted your connection request.'}
                  </p>
                  <p className="text-[12px] text-gray-400 font-medium mt-1.5">Recently</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-[#5a32fa] rounded-full mt-2.5 shrink-0 shadow-sm animate-pulse"></div>
                )}
              </div>
            </Link>
          ))}

          {/* Mock Notification 1 */}
          <div className="group p-4 sm:p-5 sm:px-8 border-b border-gray-100 bg-white hover:bg-gray-50/80 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative z-0 hover:z-10">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b892ff] to-[#5a32fa] text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                S
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-[#ff90e8] flex items-center justify-center shadow-sm">
                <Eye size={12} className="text-white" />
              </div>
            </div>
            <div className="flex-1 mt-1 transform group-hover:translate-x-1 transition-transform duration-300">
              <p className="text-[14.5px] text-gray-700 leading-snug">
                <span className="font-bold text-gray-900">Sarah Jenkins</span> viewed your profile.
              </p>
              <p className="text-[12px] text-gray-400 font-medium mt-1.5">2 hours ago</p>
            </div>
          </div>

          {/* Mock Notification 2 */}
          <div className="group p-4 sm:p-5 sm:px-8 border-b border-gray-100 bg-[#fcfaff] hover:bg-[#f6f2ff] transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative z-0 hover:z-10">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d26a] to-[#00b359] text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                W
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-[#131313] flex items-center justify-center shadow-sm">
                <CalendarIcon size={12} className="text-white" />
              </div>
            </div>
            <div className="flex-1 mt-1 transform group-hover:translate-x-1 transition-transform duration-300">
              <p className="text-[14.5px] text-gray-700 leading-snug">
                <span className="font-bold text-gray-900">WIPA Event:</span> Annual IP Conference is starting soon.
              </p>
              <p className="text-[12px] text-[#5a32fa] font-medium mt-1.5">5 hours ago</p>
            </div>
            <div className="w-2.5 h-2.5 bg-[#5a32fa] rounded-full mt-2.5 shrink-0 shadow-sm animate-pulse"></div>
          </div>

          {/* Mock Notification 3 */}
          <div className="group p-4 sm:p-5 sm:px-8 bg-white hover:bg-gray-50/80 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-b-3xl relative z-0 hover:z-10">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffc900] to-[#ffb000] text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                M
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-[#00d26a] flex items-center justify-center shadow-sm">
                <MessageCircle size={12} className="text-white" />
              </div>
            </div>
            <div className="flex-1 mt-1 transform group-hover:translate-x-1 transition-transform duration-300">
              <p className="text-[14.5px] text-gray-700 leading-snug">
                <span className="font-bold text-gray-900">Marie Dubois</span> commented on your post.
              </p>
              <p className="text-[12px] text-gray-400 font-medium mt-1.5">1 day ago</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
