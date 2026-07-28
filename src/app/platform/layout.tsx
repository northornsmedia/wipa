import PlatformHeader from "@/components/PlatformHeader";
import AuthGuard from "@/components/AuthGuard";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <AuthGuard>
        <PlatformHeader />
        <main className="w-full pb-20 md:pb-0">
          {children}
        </main>
        <MobileBottomBar />
      </AuthGuard>
    </div>
  );
}
