'use client';

import { useAppStore } from '@/store/useAppStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useAppStore();
  
  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'platform-dark bg-[#0f172a]' : 'bg-[#f8f9fa]'}`}>
      {isDarkMode && (
        <style>{`
          .platform-dark {
            background-color: #0f172a !important;
            color: #f8fafc !important;
          }
          .platform-dark .bg-white {
            background-color: #0f172a !important;
            border-color: #1e293b !important;
          }
          .platform-dark .bg-slate-50\\/50, .platform-dark .bg-gray-50, .platform-dark .bg-gray-100 {
            background-color: #1e293b !important;
          }
          .platform-dark .bg-gray-50\\/30 {
            background-color: rgba(30, 41, 59, 0.5) !important;
          }
          .platform-dark .text-gray-900, .platform-dark .text-gray-800, .platform-dark .text-slate-800, .platform-dark .text-\\[\\#334155\\] {
            color: #f1f5f9 !important;
          }
          .platform-dark .text-gray-500, .platform-dark .text-gray-600 {
            color: #94a3b8 !important;
          }
          .platform-dark .text-gray-400 {
            color: #64748b !important;
          }
          .platform-dark .border-gray-100, .platform-dark .border-gray-50, .platform-dark .border-gray-200 {
            border-color: #334155 !important;
          }
          .platform-dark h1, .platform-dark h2, .platform-dark h3, .platform-dark h4 {
            color: #f8fafc !important;
          }
          .platform-dark .shadow-sm {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5) !important;
          }
          .platform-dark input, .platform-dark textarea {
            background-color: #1e293b !important;
            color: #f8fafc !important;
            border-color: #334155 !important;
          }
          .platform-dark input::placeholder, .platform-dark textarea::placeholder {
            color: #64748b !important;
          }
          .platform-dark .hover\\:bg-gray-100:hover, .platform-dark .hover\\:bg-gray-50:hover {
            background-color: #334155 !important;
          }
        `}</style>
      )}
      {children}
    </div>
  );
}
