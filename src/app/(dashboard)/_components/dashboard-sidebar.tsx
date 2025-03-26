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
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

import { Table } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Candidatures",
    url: "/applications",
    icon: Table,
  },
  // {
  //   title: "Entretiens",
  //   url: "#",
  //   icon: CalendarCheck,
  // }
];

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashjob</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
  );
}
