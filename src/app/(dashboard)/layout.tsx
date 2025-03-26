import Breadcrumb from "@/app/(dashboard)/_components/breadcrum";
import { DashboardSidebar } from "@/app/(dashboard)/_components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col md:flex-row md:overflow-hidden">
      <DashboardSidebar />
      <main className="flex-grow p-6 md:overflow-y-auto">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb />
        {children}
      </main>
    </SidebarProvider>
  );
}
