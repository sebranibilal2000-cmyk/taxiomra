import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/routes")({ component: RoutesPage });

function RoutesPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", origin: "", destination: "", distance_km: "", duration_min: "", fixed_price: "" });

  const q = useQuery({ queryKey: ["routes"], queryFn: async () => (await supabase.from("routes").select("*").order("created_at", { ascending: false })).data ?? [] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("routes").insert({
        name: form.name, origin: form.origin, destination: form.destination,
        distance_km: form.distance_km ? Number(form.distance_km) : null,
        duration_min: form.duration_min ? Number(form.duration_min) : null,
        fixed_price: form.fixed_price ? Number(form.fixed_price) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Created"); setOpen(false); qc.invalidateQueries({ queryKey: ["routes"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const cols: Column<any>[] = [
    { key: "name", header: t("name") },
    { key: "origin", header: t("pickup") },
    { key: "destination", header: t("dropoff") },
    { key: "distance_km", header: "km" },
    { key: "duration_min", header: "min" },
    { key: "fixed_price", header: "Fixed price", render: (r) => r.fixed_price ? Number(r.fixed_price).toFixed(2) : "—" },
    { key: "is_active", header: t("status"), render: (r) => <Switch checked={r.is_active} onCheckedChange={async (v) => { await supabase.from("routes").update({ is_active: v }).eq("id", r.id); qc.invalidateQueries({ queryKey: ["routes"] }); }} /> },
  ];

  return (
    <div>
      <PageHeader title={t("routes")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new")} route</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>{t("name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="col-span-2"><Label>{t("pickup")}</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} /></div>
                <div className="col-span-2"><Label>{t("dropoff")}</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
                <div><Label>km</Label><Input type="number" value={form.distance_km} onChange={(e) => setForm({ ...form, distance_km: e.target.value })} /></div>
                <div><Label>min</Label><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
                <div className="col-span-2"><Label>Fixed price</Label><Input type="number" value={form.fixed_price} onChange={(e) => setForm({ ...form, fixed_price: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={!form.name || !form.origin || !form.destination} onClick={() => create.mutate()}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
