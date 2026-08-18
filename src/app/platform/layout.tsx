import PlatformHeader from "@/components/PlatformHeader";
import MobileTopBar from "@/components/MobileTopBar";
import AuthGuard from "@/components/AuthGuard";
import MobileBottomNav from "@/components/MobileBottomNav";
import Sidebar from "@/components/Sidebar";
import ThemeWrapper from "@/components/ThemeWrapper";
import WelcomeBackSplash from "@/components/WelcomeBackSplash";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeWrapper>
      <div className="font-sans flex flex-col flex-1 min-h-screen overflow-x-hidden">
        <AuthGuard>
          {/* Desktop Header */}
          <PlatformHeader />
          {/* Mobile Top App Bar */}
          <MobileTopBar />
          
          <div className="flex-1 flex min-w-0">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
              <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
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
