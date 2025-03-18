import { DashboardSidebar } from "@/app/dashboard/_components/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SidebarProvider>
        <div className="w-full flex-none md:w-64">
          <DashboardSidebar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}
