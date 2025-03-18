import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Button
} from '@/components/ui/button'

import { Table } from "lucide-react"

// Menu items.
const items = [
  {
    title: "Candidatures",
    url: "/dashboard/applications",
    icon: Table,
  },
  // {
  //   title: "Entretiens",
  //   url: "#",
  //   icon: CalendarCheck,
  // }
]

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <form action="">
          <Button variant="outline">Se déconnecter</Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
