'use client';

import { useState, type CSSProperties } from "react";
import PlatformHeader from "@/components/PlatformHeader";
import MobileTopBar from "@/components/MobileTopBar";
import AuthGuard from "@/components/AuthGuard";
import MobileBottomNav from "@/components/MobileBottomNav";
import Sidebar from "@/components/Sidebar";
import ThemeWrapper from "@/components/ThemeWrapper";
import WelcomeBackSplash from "@/components/WelcomeBackSplash";
import { PushNotificationPrompt } from "@/components/chat/PushNotificationPrompt";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const shellStyle = {
    '--desktop-sidebar-width': isSidebarOpen ? '260px' : '64px',
    '--platform-header-height': '72px',
  } as CSSProperties;

  return (
    <ThemeWrapper>
      <div style={shellStyle} className="font-sans flex flex-col flex-1 min-h-screen w-full max-w-full min-w-0 overflow-x-hidden box-border">
        <AuthGuard>
          {/* Push Notification Opt-in Modal */}
          <PushNotificationPrompt />
          {/* Desktop Header */}
          <PlatformHeader />
          {/* Mobile Top App Bar */}
          <MobileTopBar />
          
          <div className="flex-1 flex w-full max-w-full min-w-0 box-border pt-0 md:pt-[var(--platform-header-height)]">
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen((open) => !open)}
              onOpen={() => setIsSidebarOpen(true)}
            />
            <div className="flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden box-border transition-[padding-left] duration-300 ease-out lg:pl-[var(--desktop-sidebar-width)]">
              <main className="flex-1 w-full max-w-full min-w-0 pb-20 md:pb-0 overflow-x-hidden box-border">
                {children}
              </main>
              {/* Mobile 5-Tab Bottom Navigation Bar */}
              <MobileBottomNav />
            </div>
          </div>
        </AuthGuard>
        <WelcomeBackSplash />
      </div>
    </ThemeWrapper>
  );
}
