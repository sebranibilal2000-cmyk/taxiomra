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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/coupons")({ component: Coupons });

function Coupons() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount_type: "percent", discount_value: "10", max_uses: "", valid_until: "" });

  const q = useQuery({ queryKey: ["coupons"], queryFn: async () => (await supabase.from("coupons").select("*").order("created_at", { ascending: false })).data ?? [] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("coupons").insert({
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        valid_until: form.valid_until || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Created"); setOpen(false); qc.invalidateQueries({ queryKey: ["coupons"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const cols: Column<any>[] = [
    { key: "code", header: t("code"), render: (r) => <span className="font-mono font-medium">{r.code}</span> },
    { key: "discount_type", header: "Type" },
    { key: "discount_value", header: "Value" },
    { key: "used_count", header: "Used", render: (r) => `${r.used_count}${r.max_uses ? ` / ${r.max_uses}` : ""}` },
    { key: "valid_until", header: "Until", render: (r) => r.valid_until ? new Date(r.valid_until).toLocaleDateString() : "—" },
    { key: "is_active", header: t("status"), render: (r) => <Switch checked={r.is_active} onCheckedChange={async (v) => { await supabase.from("coupons").update({ is_active: v }).eq("id", r.id); qc.invalidateQueries({ queryKey: ["coupons"] }); }} /> },
  ];

  return (
    <div>
      <PageHeader title={t("coupons")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new")} coupon</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>{t("code")}</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="uppercase" /></div>
                <div><Label>Type</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="percent">Percent</SelectItem><SelectItem value="fixed">Fixed</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Value</Label><Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} /></div>
                <div><Label>Max uses</Label><Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} /></div>
                <div><Label>Valid until</Label><Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={!form.code} onClick={() => create.mutate()}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
