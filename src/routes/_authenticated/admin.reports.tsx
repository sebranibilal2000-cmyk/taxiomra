import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { CalendarCheck, DollarSign, Users, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/reports")({ component: Reports });

function Reports() {
  const { t, locale } = useI18n();
  const q = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const [bookings, drivers, customers, routes] = await Promise.all([
        supabase.from("bookings").select("created_at, total_fare, status, route_id, route:routes(name)").gte("created_at", since),
        supabase.from("drivers").select("full_name, total_trips, total_earnings").order("total_trips", { ascending: false }).limit(10),
        supabase.from("customers").select("full_name, total_trips, total_spent").order("total_spent", { ascending: false }).limit(10),
        supabase.from("routes").select("id, name"),
      ]);

      const byDay = new Map<string, { day: string; trips: number; revenue: number }>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
        const k = d.toISOString().slice(0, 10);
        byDay.set(k, { day: k.slice(5), trips: 0, revenue: 0 });
      }
      const totals = { trips: 0, revenue: 0, completed: 0 };
      const routeCount = new Map<string, number>();
      (bookings.data ?? []).forEach((b: any) => {
        const k = new Date(b.created_at).toISOString().slice(0, 10);
        const cur = byDay.get(k); if (cur) { cur.trips++; cur.revenue += Number(b.total_fare || 0); }
        totals.trips++; totals.revenue += Number(b.total_fare || 0);
        if (b.status === "completed") totals.completed++;
        if (b.route?.name) routeCount.set(b.route.name, (routeCount.get(b.route.name) ?? 0) + 1);
      });
      const popular = Array.from(routeCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
      return {
        chart: Array.from(byDay.values()),
        totals,
        topDrivers: drivers.data ?? [],
        topCustomers: customers.data ?? [],
        popular,
      };
    },
  });

  const d = q.data;
  const fmt = (n: number) => new Intl.NumberFormat(locale === "ar" ? "ar" : "en", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <PageHeader title={t("reports")} description={locale === "ar" ? "آخر 30 يوماً" : "Last 30 days"} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={locale === "ar" ? "إجمالي الرحلات" : "Total Trips"} value={d?.totals.trips ?? "—"} icon={CalendarCheck} tone="primary" />
        <StatCard label={locale === "ar" ? "الإيرادات" : "Revenue"} value={d ? fmt(d.totals.revenue) : "—"} icon={DollarSign} tone="success" />
        <StatCard label={locale === "ar" ? "مكتملة" : "Completed"} value={d?.totals.completed ?? "—"} icon={Car} tone="chart2" />
        <StatCard label={locale === "ar" ? "أعلى سائقون" : "Top Drivers"} value={d?.topDrivers.length ?? "—"} icon={Users} tone="warning" />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>{locale === "ar" ? "الرحلات اليومية" : "Daily Trips"}</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d?.chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" /><YAxis /><Tooltip />
              <Bar dataKey="trips" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{locale === "ar" ? "أفضل السائقين" : "Top Drivers"}</CardTitle></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>{t("name")}</TableHead><TableHead>Trips</TableHead><TableHead>Earn</TableHead></TableRow></TableHeader>
              <TableBody>{(d?.topDrivers ?? []).map((r: any) => <TableRow key={r.full_name}><TableCell>{r.full_name}</TableCell><TableCell>{r.total_trips}</TableCell><TableCell>{Number(r.total_earnings).toFixed(0)}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{locale === "ar" ? "أفضل العملاء" : "Top Customers"}</CardTitle></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>{t("name")}</TableHead><TableHead>Trips</TableHead><TableHead>Spent</TableHead></TableRow></TableHeader>
              <TableBody>{(d?.topCustomers ?? []).map((r: any) => <TableRow key={r.full_name}><TableCell>{r.full_name}</TableCell><TableCell>{r.total_trips}</TableCell><TableCell>{Number(r.total_spent).toFixed(0)}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{locale === "ar" ? "أشهر المسارات" : "Popular Routes"}</CardTitle></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>Route</TableHead><TableHead>Trips</TableHead></TableRow></TableHeader>
              <TableBody>{(d?.popular ?? []).map((r) => <TableRow key={r.name}><TableCell>{r.name}</TableCell><TableCell>{r.count}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
