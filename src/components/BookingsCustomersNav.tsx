import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BookingsCustomersNav() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isCustomers = path.startsWith("/admin/customers");
  const tabs = [
    { to: "/admin/bookings", active: !isCustomers, icon: CalendarCheck, label: ar ? "الحجوزات" : "Bookings" },
    { to: "/admin/customers", active: isCustomers, icon: Users, label: ar ? "العملاء" : "Customers" },
  ] as const;
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1 mb-4">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
            t.active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <t.icon className="h-4 w-4" />
          {t.label}
        </Link>
      ))}
    </div>
  );
}
