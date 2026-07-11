import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { CalendarCheck, DollarSign, Users, Car, Clock, ListChecks } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t, locale } = useI18n();

  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const iso = today.toISOString();

      const [tripsToday, activeTrips, pending, availDrivers, customers, revenueRes, weekly] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", iso),
        supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["assigned", "en_route", "in_progress"]),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("drivers").select("id", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "paid").gte("created_at", iso),
        supabase.from("bookings").select("created_at, final_fare, status").gte("created_at", new Date(Date.now() - 7 * 864e5).toISOString()),
      ]);

      const revenueToday = (revenueRes.data ?? []).reduce((a, b: any) => a + Number(b.amount || 0), 0);
      // build 7-day chart
      const byDay = new Map<string, { trips: number; revenue: number }>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
        byDay.set(d.toISOString().slice(0, 10), { trips: 0, revenue: 0 });
      }
      (weekly.data ?? []).forEach((row: any) => {
        const k = new Date(row.created_at).toISOString().slice(0, 10);
        const cur = byDay.get(k); if (cur) { cur.trips += 1; cur.revenue += Number(row.final_fare || 0); }
      });
      const chart = Array.from(byDay.entries()).map(([day, v]) => ({ day: day.slice(5), ...v }));

      return {
        tripsToday: tripsToday.count ?? 0,
        activeTrips: activeTrips.count ?? 0,
        pending: pending.count ?? 0,
        availDrivers: availDrivers.count ?? 0,
        customers: customers.count ?? 0,
        revenueToday,
        chart,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["dashboard-recent"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings")
        .select("id, code, status, final_fare, pickup_address, dropoff_address, created_at")
        .order("created_at", { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  const s = stats.data;
  const fmt = (n: number) => new Intl.NumberFormat(locale === "ar" ? "ar" : "en", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <PageHeader
        title={t("dashboard")}
        description={locale === "ar" ? "نظرة عامة على أداء اليوم" : "Today's operational overview"}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <StatCard label={t("trips_today")} value={s?.tripsToday ?? "—"} icon={CalendarCheck} tone="primary" />
        <StatCard label={t("revenue")} value={s ? fmt(s.revenueToday) : "—"} icon={DollarSign} tone="success" />
        <StatCard label={t("active_trips")} value={s?.activeTrips ?? "—"} icon={Clock} tone="chart2" />
        <StatCard label={t("pending_bookings")} value={s?.pending ?? "—"} icon={ListChecks} tone="warning" />
        <StatCard label={t("available_drivers")} value={s?.availDrivers ?? "—"} icon={Car} tone="primary" />
        <StatCard label={t("total_customers")} value={s?.customers ?? "—"} icon={Users} tone="chart2" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{locale === "ar" ? "الرحلات آخر 7 أيام" : "Trips (last 7 days)"}</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s?.chart ?? []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{locale === "ar" ? "الإيرادات (أسبوعياً)" : "Revenue (weekly)"}</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s?.chart ?? []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>{locale === "ar" ? "آخر الحجوزات" : "Recent Bookings"}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("code")}</TableHead>
                <TableHead>{t("pickup")}</TableHead>
                <TableHead>{t("dropoff")}</TableHead>
                <TableHead>{t("fare")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(recent.data ?? []).map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.code}</TableCell>
                  <TableCell className="max-w-40 truncate">{b.pickup_address}</TableCell>
                  <TableCell className="max-w-40 truncate">{b.dropoff_address}</TableCell>
                  <TableCell>{b.final_fare ? fmt(Number(b.final_fare)) : "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{b.status}</Badge></TableCell>
                </TableRow>
              ))}
              {(recent.data ?? []).length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">{t("no_data")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
