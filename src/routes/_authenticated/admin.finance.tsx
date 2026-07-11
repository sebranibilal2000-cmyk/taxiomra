import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Receipt, AlertCircle, PieChart as PieIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fmtMoney, periodRange } from "@/lib/finance";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/finance")({ component: Finance });

const PIE_COLORS = ["var(--color-gold)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)"];

function Finance() {
  const { locale } = useI18n();
  const ar = locale === "ar";

  const q = useQuery({
    queryKey: ["finance-overview"],
    queryFn: async () => {
      const today = periodRange("today").since;
      const week = periodRange("week").since;
      const month = periodRange("month").since;
      const year = periodRange("year").since;

      const [payAll, expAll, invOutstanding, dailyBookings, byMethod, byVehicle, byDriver] = await Promise.all([
        supabase.from("payments").select("amount, paid_amount, status, method, created_at, currency").gte("created_at", year),
        supabase.from("expenses").select("amount, category, expense_date").gte("expense_date", year.slice(0, 10)),
        supabase.from("invoices").select("total_amount, paid_amount, status").in("status", ["issued", "partially_paid", "overdue"]),
        supabase.from("bookings").select("created_at, total_fare, status, vehicle_id, driver_id, vehicle:vehicles(plate_number, make, model), driver:drivers(full_name)").gte("created_at", month),
        supabase.from("payments").select("method, paid_amount, amount, status").eq("status", "paid").gte("created_at", month),
        supabase.from("bookings").select("total_fare, vehicle:vehicles(plate_number)").eq("status", "completed").gte("created_at", month),
        supabase.from("bookings").select("total_fare, driver:drivers(full_name)").eq("status", "completed").gte("created_at", month),
      ]);

      const sum = (rows: any[], k: string, since?: string) =>
        rows.filter((r) => !since || (r.created_at ?? r.expense_date) >= since).reduce((a, r) => a + Number(r[k] || 0), 0);

      const paidPay = (payAll.data ?? []).filter((p) => p.status === "paid" || p.status === "partially_paid");
      const revToday = sum(paidPay, "paid_amount", today);
      const revWeek = sum(paidPay, "paid_amount", week);
      const revMonth = sum(paidPay, "paid_amount", month);
      const revYear = sum(paidPay, "paid_amount");
      const expToday = sum(expAll.data ?? [], "amount", today.slice(0, 10));
      const expMonth = sum(expAll.data ?? [], "amount", month.slice(0, 10));
      const expYear = sum(expAll.data ?? [], "amount");
      const outstanding = (invOutstanding.data ?? []).reduce((a, i: any) => a + (Number(i.total_amount || 0) - Number(i.paid_amount || 0)), 0);

      // Daily 30-day chart
      const byDay = new Map<string, { day: string; revenue: number; expenses: number }>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
        const k = d.toISOString().slice(0, 10);
        byDay.set(k, { day: k.slice(5), revenue: 0, expenses: 0 });
      }
      paidPay.forEach((p: any) => {
        const k = new Date(p.created_at).toISOString().slice(0, 10);
        const cur = byDay.get(k); if (cur) cur.revenue += Number(p.paid_amount || 0);
      });
      (expAll.data ?? []).forEach((e: any) => {
        const cur = byDay.get(e.expense_date); if (cur) cur.expenses += Number(e.amount || 0);
      });
      const chart = Array.from(byDay.values());

      // Payment method breakdown
      const methodMap = new Map<string, number>();
      (byMethod.data ?? []).forEach((p: any) => methodMap.set(p.method, (methodMap.get(p.method) ?? 0) + Number(p.paid_amount || 0)));
      const methodChart = Array.from(methodMap.entries()).map(([name, value]) => ({ name, value }));

      // Expense categories
      const catMap = new Map<string, number>();
      (expAll.data ?? []).forEach((e: any) => {
        if (e.expense_date >= month.slice(0, 10)) catMap.set(e.category, (catMap.get(e.category) ?? 0) + Number(e.amount || 0));
      });
      const catChart = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

      // Revenue by vehicle / driver (top 5)
      const vmap = new Map<string, number>();
      (byVehicle.data ?? []).forEach((b: any) => {
        const k = b.vehicle?.plate_number || (ar ? "بدون مركبة" : "Unassigned");
        vmap.set(k, (vmap.get(k) ?? 0) + Number(b.total_fare || 0));
      });
      const vehicleTop = Array.from(vmap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

      const dmap = new Map<string, number>();
      (byDriver.data ?? []).forEach((b: any) => {
        const k = b.driver?.full_name || (ar ? "غير محدد" : "Unassigned");
        dmap.set(k, (dmap.get(k) ?? 0) + Number(b.total_fare || 0));
      });
      const driverTop = Array.from(dmap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

      // Avg booking value
      const completedBookings = (dailyBookings.data ?? []).filter((b: any) => b.status === "completed");
      const avgBooking = completedBookings.length ? completedBookings.reduce((a, b: any) => a + Number(b.total_fare || 0), 0) / completedBookings.length : 0;

      return {
        revToday, revWeek, revMonth, revYear,
        expToday, expMonth, expYear,
        profit: revMonth - expMonth,
        outstanding, avgBooking,
        chart, methodChart, catChart, vehicleTop, driverTop,
      };
    },
  });

  const s = q.data;
  const fmt = (n: number) => fmtMoney(n, "SAR", locale);

  return (
    <div>
      <PageHeader
        eyebrow={ar ? "الإدارة المالية" : "Finance"}
        title={ar ? "لوحة المالية التنفيذية" : "Executive Finance Overview"}
        description={ar ? "الإيرادات، المصروفات، الربح، والمقاييس المالية الرئيسية" : "Revenue, expenses, profit, and key financial KPIs"}
        actions={<div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/admin/invoices">{ar ? "الفواتير" : "Invoices"}</Link></Button>
          <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/admin/expenses">{ar ? "المصروفات" : "Expenses"}</Link></Button>
        </div>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label={ar ? "إيرادات اليوم" : "Revenue Today"} value={s ? fmt(s.revToday) : "—"} icon={DollarSign} tone="success" />
        <StatCard label={ar ? "إيرادات الأسبوع" : "Revenue Week"} value={s ? fmt(s.revWeek) : "—"} icon={TrendingUp} tone="primary" />
        <StatCard label={ar ? "إيرادات الشهر" : "Revenue Month"} value={s ? fmt(s.revMonth) : "—"} icon={TrendingUp} tone="chart2" />
        <StatCard label={ar ? "إيرادات السنة" : "Revenue Year"} value={s ? fmt(s.revYear) : "—"} icon={Wallet} tone="chart2" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
        <StatCard label={ar ? "مصروفات الشهر" : "Expenses Month"} value={s ? fmt(s.expMonth) : "—"} icon={TrendingDown} tone="warning" />
        <StatCard label={ar ? "صافي الربح" : "Net Profit"} value={s ? fmt(s.profit) : "—"} icon={TrendingUp} tone={s && s.profit >= 0 ? "success" : "warning"} />
        <StatCard label={ar ? "مستحق التحصيل" : "Outstanding"} value={s ? fmt(s.outstanding) : "—"} icon={AlertCircle} tone="warning" />
        <StatCard label={ar ? "متوسط الحجز" : "Avg Booking"} value={s ? fmt(s.avgBooking) : "—"} icon={Receipt} tone="primary" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 mt-6">
        <Card className="xl:col-span-2 rounded-2xl border-border/70">
          <CardHeader>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold mb-1">30 days</div>
            <CardTitle className="font-display text-xl">{ar ? "الإيرادات مقابل المصروفات" : "Revenue vs Expenses"}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s?.chart ?? []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name={ar ? "الإيرادات" : "Revenue"} stroke="var(--color-gold)" strokeWidth={2} fill="url(#rev2)" />
                <Area type="monotone" dataKey="expenses" name={ar ? "المصروفات" : "Expenses"} stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#exp2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70">
          <CardHeader>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold mb-1">{ar ? "الشهر" : "Month"}</div>
            <CardTitle className="font-display text-xl flex items-center gap-2"><PieIcon className="h-5 w-5 text-gold" />{ar ? "طرق الدفع" : "Payment Methods"}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={s?.methodChart ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={90} paddingAngle={2}>
                  {(s?.methodChart ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => fmt(Number(v))} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card className="rounded-2xl border-border/70">
          <CardHeader><CardTitle className="font-display text-lg">{ar ? "المصروفات حسب الفئة" : "Expenses by Category"}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(s?.catChart ?? []).length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              {(s?.catChart ?? []).sort((a, b) => b.value - a.value).map((c, i) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="capitalize">{c.name.replace(/_/g, " ")}</span>
                  </div>
                  <span className="font-mono">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70">
          <CardHeader><CardTitle className="font-display text-lg">{ar ? "أفضل 5 مركبات" : "Top 5 Vehicles"}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(s?.vehicleTop ?? []).length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              {(s?.vehicleTop ?? []).map((v) => (
                <div key={v.name} className="flex items-center justify-between text-sm">
                  <span className="font-mono">{v.name}</span>
                  <span className="font-mono text-gold">{fmt(v.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70">
          <CardHeader><CardTitle className="font-display text-lg">{ar ? "أفضل 5 سائقين" : "Top 5 Drivers"}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(s?.driverTop ?? []).length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              {(s?.driverTop ?? []).map((v) => (
                <div key={v.name} className="flex items-center justify-between text-sm">
                  <span>{v.name}</span>
                  <span className="font-mono text-gold">{fmt(v.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
