'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Plus } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Calendar className="text-[#5a32fa]" /> Manage Events
        </h1>
        <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors">
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Title</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Location</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Date</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No events found.</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                      {event.title}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                      {event.location_type === 'online' ? 'Online' : event.location}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                      {new Date(event.start_time).toLocaleString()}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                      <button className="text-sm font-bold text-[#5a32fa] hover:underline">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
