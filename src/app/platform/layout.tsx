'use client';

import { useState, Suspense, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import PlatformHeader from "@/components/PlatformHeader";
import MobileTopBar from "@/components/MobileTopBar";
import AuthGuard from "@/components/AuthGuard";
import MobileBottomNav from "@/components/MobileBottomNav";
import Sidebar from "@/components/Sidebar";
import ThemeWrapper from "@/components/ThemeWrapper";
import VoiceGreeting from "@/components/VoiceGreeting";
import { PushNotificationPrompt } from "@/components/chat/PushNotificationPrompt";
import { useAppStore } from "@/store/useAppStore";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessagesPage = pathname?.startsWith('/platform/messages');
  const isInsideChat = useAppStore((state) => state.isInsideChat);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const shellStyle = {
    '--desktop-sidebar-width': isMessagesPage ? '0px' : (isSidebarOpen ? '268px' : '64px'),
    '--platform-header-height': '77px',
  } as CSSProperties;

  return (
    <ThemeWrapper>
      <div style={shellStyle} className="font-sans flex flex-col flex-1 min-h-screen w-full max-w-full min-w-0 overflow-x-clip box-border">
        <AuthGuard>
          {/* Audio Voice Greeting (No modal/popup, purely spoken audio) */}
          <VoiceGreeting />
          {/* Push Notification Opt-in Modal */}
          <PushNotificationPrompt />
          {/* Desktop Header */}
          <PlatformHeader />
          {/* Mobile Top App Bar */}
          <MobileTopBar />
          
          <div 
            className="platform-body-container flex-1 flex w-full max-w-full min-w-0 box-border pt-0 md:pt-[77px]"
          >
            {!isMessagesPage && (
              <Suspense fallback={null}>
                <Sidebar
                  isOpen={isSidebarOpen}
                  onToggle={() => setIsSidebarOpen((open) => !open)}
                  onOpen={() => setIsSidebarOpen(true)}
                />
              </Suspense>
            )}
            <div className={`flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-clip box-border transition-[padding-left] duration-300 ease-out ${
              isMessagesPage ? 'pl-0' : 'lg:pl-[var(--desktop-sidebar-width)]'
            }`}>
              <main className={`flex-1 w-full max-w-full min-w-0 overflow-x-clip box-border ${
                isMessagesPage ? 'pb-0' : 'pb-[calc(63px+env(safe-area-inset-bottom,0px))] md:pb-0'
              }`}>
                {children}
              </main>
              {/* Mobile 5-Tab Bottom Navigation Bar (Hidden inside active chat window) */}
              {!isInsideChat && <MobileBottomNav />}
            </div>
          </div>
        </AuthGuard>
      </div>
    </ThemeWrapper>
  );
}
