'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, Briefcase, FileText, TrendingUp } from 'lucide-react';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    users: 0,
    events: 0,
    jobs: 0,
    resources: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const [usersRes, eventsRes, jobsRes, resourcesRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true })
      ]);
      
      setMetrics({
        users: usersRes.count || 0,
        events: eventsRes.count || 0,
        jobs: jobsRes.count || 0,
        resources: resourcesRes.count || 0
      });
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Users" 
          value={metrics.users} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <MetricCard 
          title="Events" 
          value={metrics.events} 
          icon={Calendar} 
          color="bg-green-500" 
        />
        <MetricCard 
          title="Jobs Posted" 
          value={metrics.jobs} 
          icon={Briefcase} 
          color="bg-purple-500" 
        />
        <MetricCard 
          title="Resources" 
          value={metrics.resources} 
          icon={FileText} 
          color="bg-pink-500" 
        />
      </div>

      {/* Placeholder for charts or activity feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp size={20}/> Growth Activity</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 font-medium">Chart Placeholder</div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4">Recent Signups</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 font-medium">Feed Placeholder</div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}
