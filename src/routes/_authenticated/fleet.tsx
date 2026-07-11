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

export const Route = createFileRoute("/_authenticated/fleet")({ component: Fleet });

function Fleet() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ plate_number: "", make: "", model: "", year: "", color: "", seats: "4", category_id: "" });

  const q = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => (await supabase.from("vehicles").select("*, category:vehicle_categories(code)").order("created_at", { ascending: false })).data ?? [],
  });
  const cats = useQuery({ queryKey: ["cats"], queryFn: async () => (await supabase.from("vehicle_categories").select("*").order("sort_order")).data ?? [] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("vehicles").insert({
        plate_number: form.plate_number, make: form.make || null, model: form.model || null,
        year: form.year ? Number(form.year) : null, color: form.color || null,
        seats: Number(form.seats || 4), category_id: form.category_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Created"); setOpen(false); qc.invalidateQueries({ queryKey: ["vehicles"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const columns: Column<any>[] = [
    { key: "plate_number", header: t("plate"), render: (r) => <span className="font-mono">{r.plate_number}</span> },
    { key: "make", header: "Make", render: (r) => `${r.make ?? ""} ${r.model ?? ""}`.trim() || "—" },
    { key: "year", header: "Year" },
    { key: "color", header: "Color" },
    { key: "seats", header: t("seats") },
    { key: "category", header: t("category"), render: (r) => r.category?.code ?? "—" },
    { key: "status", header: t("status"), render: (r) => <StatusBadge value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title={t("fleet")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new")} {t("vehicle")}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("plate")}</Label><Input value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} /></div>
                <div><Label>{t("seats")}</Label><Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /></div>
                <div><Label>Make</Label><Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></div>
                <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
                <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></div>
                <div><Label>Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
                <div className="col-span-2"><Label>{t("category")}</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>{(cats.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={!form.plate_number} onClick={() => create.mutate()}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable data={q.data ?? []} columns={columns} loading={q.isLoading}
        actions={(r) => (
          <Select value={r.status} onValueChange={async (v) => {
            const { error } = await supabase.from("vehicles").update({ status: v as any }).eq("id", r.id);
            if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["vehicles"] });
          }}>
            <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{["active", "maintenance", "retired"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
