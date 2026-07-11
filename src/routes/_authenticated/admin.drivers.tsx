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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/drivers")({ component: Drivers });

function Drivers() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", license_number: "", license_expiry: "", vehicle_id: "" });

  const q = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => (await supabase.from("drivers").select("*, vehicle:vehicles(plate_number, make, model)").order("created_at", { ascending: false })).data ?? [],
  });
  const vehicles = useQuery({ queryKey: ["vh-lookup"], queryFn: async () => (await supabase.from("vehicles").select("id, plate_number").eq("status", "active")).data ?? [] });

  const create = useMutation({
    mutationFn: async () => {
      const payload: any = {
        full_name: form.full_name, phone: form.phone || null, email: form.email || null,
        license_number: form.license_number || null, license_expiry: form.license_expiry || null,
        vehicle_id: form.vehicle_id || null,
      };
      const { error } = await supabase.from("drivers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Created"); setOpen(false); setForm({ full_name: "", phone: "", email: "", license_number: "", license_expiry: "", vehicle_id: "" }); qc.invalidateQueries({ queryKey: ["drivers"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const columns: Column<any>[] = [
    { key: "full_name", header: t("name") },
    { key: "phone", header: t("phone") },
    { key: "license_number", header: "License" },
    { key: "vehicle", header: t("vehicle"), render: (r) => r.vehicle?.plate_number ?? "—" },
    { key: "total_trips", header: "Trips" },
    { key: "total_earnings", header: "Earnings", render: (r) => Number(r.total_earnings).toFixed(2) },
    { key: "status", header: t("status"), render: (r) => <StatusBadge value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title={t("drivers")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new")} {t("driver")}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>{t("name")}</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><Label>{t("phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>License #</Label><Input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} /></div>
                <div><Label>License Expiry</Label><Input type="date" value={form.license_expiry} onChange={(e) => setForm({ ...form, license_expiry: e.target.value })} /></div>
                <div className="col-span-2"><Label>{t("vehicle")}</Label>
                  <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>{(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_number}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={!form.full_name} onClick={() => create.mutate()}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable data={q.data ?? []} columns={columns} loading={q.isLoading}
        actions={(r) => (
          <Select value={r.status} onValueChange={async (v) => {
            const { error } = await supabase.from("drivers").update({ status: v as any }).eq("id", r.id);
            if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["drivers"] });
          }}>
            <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{["offline", "available", "on_trip", "on_break", "suspended"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
