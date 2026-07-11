import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserPlus2, Star, StarOff, ListTree } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/bookings")({ component: BookingsPage });

const BOOKING_STATUSES = ["pending", "confirmed", "assigned", "en_route", "on_trip", "picked_up", "completed", "cancelled", "no_show"] as const;
const STATUS_LABELS: Record<string,string> = {
  pending: "Pending", confirmed: "Confirmed", assigned: "Driver Assigned", en_route: "En Route",
  on_trip: "On Trip", picked_up: "Picked Up", completed: "Completed", cancelled: "Cancelled", no_show: "No Show",
};

function BookingsPage() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const bookings = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, code, status, total_fare, pickup_location, dropoff_location, pickup_at, distance_km, customer:customers(full_name), driver:drivers(full_name), category:vehicle_categories(code)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const cats = useQuery({ queryKey: ["cats"], queryFn: async () => (await supabase.from("vehicle_categories").select("*").eq("is_active", true).order("sort_order")).data ?? [] });
  const customers = useQuery({ queryKey: ["cust-lookup"], queryFn: async () => (await supabase.from("customers").select("id, full_name, phone").order("full_name")).data ?? [] });
  const drivers = useQuery({ queryKey: ["drv-lookup"], queryFn: async () => (await supabase.from("drivers").select("id, full_name").eq("is_active", true).order("full_name")).data ?? [] });

  const columns: Column<any>[] = [
    { key: "code", header: t("code"), render: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { key: "customer", header: t("customer"), render: (r) => r.customer?.full_name ?? "—" },
    { key: "driver", header: t("driver"), render: (r) => r.driver?.full_name ?? "—" },
    { key: "category", header: t("category"), render: (r) => r.category?.code ?? "—" },
    { key: "pickup_location", header: t("pickup"), render: (r) => <span className="truncate max-w-40 inline-block">{r.pickup_location}</span> },
    { key: "dropoff_location", header: t("dropoff"), render: (r) => <span className="truncate max-w-40 inline-block">{r.dropoff_location}</span> },
    { key: "total_fare", header: t("fare"), render: (r) => Number(r.total_fare || 0).toFixed(2) },
    { key: "status", header: t("status"), render: (r) => <StatusBadge value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title={t("bookings")}
        description={locale === "ar" ? "إدارة كافة الحجوزات" : "Manage all bookings"}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new_booking")}</Button></DialogTrigger>
            <NewBookingDialog
              customers={customers.data ?? []}
              cats={cats.data ?? []}
              drivers={drivers.data ?? []}
              onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["bookings"] }); qc.invalidateQueries({ queryKey: ["dashboard-stats"] }); }}
            />
          </Dialog>
        }
      />
      <DataTable data={bookings.data ?? []} columns={columns} loading={bookings.isLoading}
        actions={(r) => (
          <Select value={r.status} onValueChange={async (v) => {
            const patch: any = { status: v };
            if (v === "on_trip") patch.started_at = new Date().toISOString();
            if (v === "completed") patch.completed_at = new Date().toISOString();
            const { error } = await supabase.from("bookings").update(patch).eq("id", r.id);
            if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["bookings"] }); }
          }}>
            <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["pending", "assigned", "en_route", "on_trip", "completed", "cancelled", "no_show"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

function NewBookingDialog({ customers, cats, drivers, onDone }: { customers: any[]; cats: any[]; drivers: any[]; onDone: () => void }) {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({
    customer_id: "",
    category_id: "",
    driver_id: "",
    pickup_location: "",
    dropoff_location: "",
    distance_km: "10",
    duration_min: "20",
    waiting_min: "0",
    airport_fee: "0",
    notes: "",
  });

  const cat = cats.find((c) => c.id === form.category_id);
  const distanceKm = Number(form.distance_km || 0);
  const durationMin = Number(form.duration_min || 0);
  const waitingMin = Number(form.waiting_min || 0);
  const airportFee = Number(form.airport_fee || 0);
  const baseFare = Number(cat?.base_fare ?? 0);
  const distanceFare = distanceKm * Number(cat?.price_per_km ?? 0);
  const timeFare = durationMin * Number(cat?.price_per_min ?? 0);
  const waitingFare = waitingMin * 0.5;
  const now = new Date();
  const isNight = now.getHours() >= 22 || now.getHours() < 6;
  const subtotal = baseFare + distanceFare + timeFare + waitingFare + airportFee;
  const night = isNight ? subtotal * 0.15 : 0;
  const totalFare = subtotal + night;

  const create = useMutation({
    mutationFn: async () => {
      const payload: any = {
        customer_id: form.customer_id,
        category_id: form.category_id || null,
        driver_id: form.driver_id || null,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        distance_km: distanceKm,
        duration_min: durationMin,
        waiting_min: waitingMin,
        base_fare: baseFare,
        distance_fare: distanceFare,
        time_fare: timeFare,
        waiting_fare: waitingFare,
        airport_fee: airportFee,
        night_surcharge: night,
        total_fare: totalFare,
        status: form.driver_id ? "assigned" : "pending",
        notes: form.notes || null,
      };
      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(locale === "ar" ? "تم إنشاء الحجز" : "Booking created"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{t("new_booking")}</DialogTitle></DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>{t("customer")}</Label>
          <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v })}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>{t("category")}</Label>
          <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1 md:col-span-2"><Label>{t("pickup")}</Label><Input value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} /></div>
        <div className="space-y-1 md:col-span-2"><Label>{t("dropoff")}</Label><Input value={form.dropoff_location} onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })} /></div>
        <div className="space-y-1"><Label>{t("distance_km")}</Label><Input type="number" value={form.distance_km} onChange={(e) => setForm({ ...form, distance_km: e.target.value })} /></div>
        <div className="space-y-1"><Label>{t("duration_min")}</Label><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
        <div className="space-y-1"><Label>Waiting min</Label><Input type="number" value={form.waiting_min} onChange={(e) => setForm({ ...form, waiting_min: e.target.value })} /></div>
        <div className="space-y-1"><Label>Airport fee</Label><Input type="number" value={form.airport_fee} onChange={(e) => setForm({ ...form, airport_fee: e.target.value })} /></div>
        <div className="space-y-1 md:col-span-2">
          <Label>{t("assign_driver")}</Label>
          <Select value={form.driver_id} onValueChange={(v) => setForm({ ...form, driver_id: v })}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1 md:col-span-2"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </div>
      <div className="rounded-lg border p-3 bg-muted/40 text-sm space-y-1">
        <div className="flex justify-between"><span>Base</span><span>{baseFare.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Distance</span><span>{distanceFare.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Time</span><span>{timeFare.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Waiting</span><span>{waitingFare.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Airport</span><span>{airportFee.toFixed(2)}</span></div>
        {isNight && <div className="flex justify-between text-warning"><span>Night surcharge (15%)</span><span>{night.toFixed(2)}</span></div>}
        <div className="flex justify-between font-bold pt-1 border-t"><span>{t("estimated_fare")}</span><span>{totalFare.toFixed(2)}</span></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onDone()}>{t("cancel")}</Button>
        <Button disabled={!form.customer_id || !form.pickup_location || !form.dropoff_location || create.isPending} onClick={() => create.mutate()}>
          <UserPlus2 className="h-4 w-4 me-1" /> {t("book_now")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
