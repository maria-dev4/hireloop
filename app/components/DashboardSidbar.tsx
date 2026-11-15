"use client"

import {
  BarChart3,
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"

type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCard },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
 
  recruiter: [
    { id: "overview", name: "Overview", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "post-job", name: "Post a Job", url: "/dashboard/recruiter/post-job", icon: PlusCircle },
    { id: "jobs", name: "My Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },

    { id: "candidates", name: "Candidates", url: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { id: "company", name: "Company", url: "/dashboard/recruiter/company", icon: Building2 },
  ],

  admin: [
    { id: "overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { id: "recruiters", name: "Recruiters", url: "/dashboard/admin/recruiters", icon: Building2 },
    { id: "jobs", name: "Job Posts", url: "/dashboard/admin/jobs", icon: Briefcase },
    { id: "reports", name: "Reports", url: "/dashboard/admin/reports", icon: BarChart3 },
    { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const role = (session?.user?.role || "seeker") as Role
  const menuItems = menuItemsByRole[role] ?? menuItemsByRole.seeker

  const isActive = (item: MenuItem) =>
    item.url === `/dashboard/${role}`
      ? pathname === item.url
      : pathname.startsWith(item.url)

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {isPending
              ? null
              : menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive(item)}
                      render={<a href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
