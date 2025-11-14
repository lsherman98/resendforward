import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logs, Mail, Send, Settings } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { Link } from "@tanstack/react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    navMain: [
      {
        title: "Forwarding Rules",
        url: "/rules",
        icon: Mail,
      },
      {
        title: "Forwarding Events",
        url: "/forwarding",
        icon: Send,
      },
      {
        title: "Event Logs",
        url: "/logs",
        icon: Logs,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  };

  const user = pb.authStore.model;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/rules" className="flex items-center">
              Resend Forward
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="flex-1"></div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser email={user?.email} />
      </SidebarFooter>
    </Sidebar>
  );
}
