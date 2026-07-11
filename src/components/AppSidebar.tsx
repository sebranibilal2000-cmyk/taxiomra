import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarCheck, Users, IdCard, Car, Layers, Route as RouteIcon,
  DollarSign, TicketPercent, CreditCard, Bell, BarChart3, UserCog, ShieldCheck, Settings, ScrollText, CarTaxiFront,
  FileText, HelpCircle, Newspaper, Globe,
} from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";

export function AppSidebar() {
  const { t } = useI18n();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => path === p || path.startsWith(p + "/");

  const groups: { label: string; items: { title: string; url: string; icon: any }[] }[] = [
    {
      label: t("overview"),
      items: [{ title: t("dashboard"), url: "/admin/dashboard", icon: LayoutDashboard }],
    },
    {
      label: t("operations"),
      items: [
        { title: t("bookings"), url: "/admin/bookings", icon: CalendarCheck },
        { title: t("customers"), url: "/admin/customers", icon: Users },
        { title: t("drivers"), url: "/admin/drivers", icon: IdCard },
      ],
    },
    {
      label: t("catalog"),
      items: [
        { title: t("fleet"), url: "/admin/fleet", icon: Car },
        { title: t("categories"), url: "/admin/categories", icon: Layers },
        { title: t("routes"), url: "/admin/routes", icon: RouteIcon },
      ],
    },
    {
      label: t("finance"),
      items: [
        { title: t("pricing"), url: "/admin/pricing", icon: DollarSign },
        { title: t("coupons"), url: "/admin/coupons", icon: TicketPercent },
        { title: t("payments"), url: "/admin/payments", icon: CreditCard },
      ],
    },
    {
      label: "CMS / Website",
      items: [
        { title: "Pages", url: "/admin/pages", icon: FileText },
        { title: "Blog", url: "/admin/blog", icon: Newspaper },
        { title: "FAQ", url: "/admin/faqs", icon: HelpCircle },
        { title: "Preview site", url: "/", icon: Globe },
      ],
    },
    {
      label: t("system"),
      items: [
        { title: t("notifications"), url: "/admin/notifications", icon: Bell },
        { title: t("reports"), url: "/admin/reports", icon: BarChart3 },
        { title: t("users"), url: "/admin/users", icon: UserCog },
        { title: t("roles"), url: "/admin/roles", icon: ShieldCheck },
        { title: t("settings"), url: "/admin/settings", icon: Settings },
        { title: t("audit"), url: "/admin/audit", icon: ScrollText },
      ],
    },
  ];


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <CarTaxiFront className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">{t("brand")}</span>
              <span className="text-[10px] text-muted-foreground">{t("admin_panel")}</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url as any} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>

                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
