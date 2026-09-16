'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, ArrowLeft, Building2, DollarSign, Sparkles, Video } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        router.push('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_subadmin')
        .eq('id', user.id)
        .single();
        
      if (error || (!data?.is_admin && !data?.is_subadmin)) {
        router.push('/platform');
        return;
      }
      
      setIsChecking(false);
    };
    
    checkAdmin();
  }, [user?.id, router]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a]"><Loader2 size={40} className="animate-spin text-[#5a32fa]" /></div>;
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Webinars', path: '/admin/webinars', icon: Video },
    { label: 'Jobs', path: '/admin/jobs', icon: Briefcase },
    { label: 'Resources', path: '/admin/content', icon: FileText },
    { label: 'IP Services', path: '/admin/ip-services', icon: Sparkles },
    { label: 'Firms', path: '/admin/firms', icon: Building2 },
    { label: 'Businesses', path: '/admin/business', icon: Building2 },
    { label: 'Sponsorships', path: '/admin/sponsorships', icon: DollarSign },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <Link href="/platform" className="flex items-center gap-2 text-gray-500 hover:text-[#5a32fa] transition-colors mb-4 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Platform
          </Link>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-[#5a32fa] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
