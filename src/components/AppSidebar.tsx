import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarCheck, Users, IdCard, Car, Layers, Route as RouteIcon,
  DollarSign, TicketPercent, CreditCard, Bell, BarChart3, UserCog, ShieldCheck, Settings, ScrollText, CarTaxiFront,
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
      items: [{ title: t("dashboard"), url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: t("operations"),
      items: [
        { title: t("bookings"), url: "/bookings", icon: CalendarCheck },
        { title: t("customers"), url: "/customers", icon: Users },
        { title: t("drivers"), url: "/drivers", icon: IdCard },
      ],
    },
    {
      label: t("catalog"),
      items: [
        { title: t("fleet"), url: "/fleet", icon: Car },
        { title: t("categories"), url: "/categories", icon: Layers },
        { title: t("routes"), url: "/routes", icon: RouteIcon },
      ],
    },
    {
      label: t("finance"),
      items: [
        { title: t("pricing"), url: "/pricing", icon: DollarSign },
        { title: t("coupons"), url: "/coupons", icon: TicketPercent },
        { title: t("payments"), url: "/payments", icon: CreditCard },
      ],
    },
    {
      label: t("system"),
      items: [
        { title: t("notifications"), url: "/notifications", icon: Bell },
        { title: t("reports"), url: "/reports", icon: BarChart3 },
        { title: t("users"), url: "/users", icon: UserCog },
        { title: t("roles"), url: "/roles", icon: ShieldCheck },
        { title: t("settings"), url: "/settings", icon: Settings },
        { title: t("audit"), url: "/audit", icon: ScrollText },
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
                      <Link to={item.url} className="flex items-center gap-2">
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
