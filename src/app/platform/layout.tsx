import PlatformHeader from "@/components/PlatformHeader";
import AuthGuard from "@/components/AuthGuard";
import MobileBottomBar from "@/components/MobileBottomBar";
import Sidebar from "@/components/Sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex">
      <AuthGuard>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <PlatformHeader />
          <main className="flex-1 w-full pb-20 lg:pb-0">
            {children}
          </main>
          <MobileBottomBar />
        </div>
      </AuthGuard>
    </div>
  );
}
