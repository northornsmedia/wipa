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
  return (
    <ThemeWrapper>
      <div className="font-sans flex flex-col flex-1 min-h-screen w-full max-w-full min-w-0 overflow-x-hidden box-border">
        <AuthGuard>
          {/* Push Notification Opt-in Modal */}
          <PushNotificationPrompt />
          {/* Desktop Header */}
          <PlatformHeader />
          {/* Mobile Top App Bar */}
          <MobileTopBar />
          
          <div className="flex-1 flex w-full max-w-full min-w-0 box-border pt-0 md:pt-[60px]">
            <Sidebar />
            <div className="flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden box-border lg:pl-[260px]">
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
