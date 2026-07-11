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
import { Plus, Ban, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });

  const q = useQuery({
    queryKey: ["customers"],
    queryFn: async () => (await supabase.from("customers").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").insert({ full_name: form.full_name, phone: form.phone || null, email: form.email || null });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Created"); setForm({ full_name: "", phone: "", email: "" }); setOpen(false); qc.invalidateQueries({ queryKey: ["customers"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const columns: Column<any>[] = [
    { key: "full_name", header: t("name") },
    { key: "phone", header: t("phone") },
    { key: "email", header: t("email") },
    { key: "total_trips", header: locale === "ar" ? "الرحلات" : "Trips" },
    { key: "total_spent", header: locale === "ar" ? "الإنفاق" : "Spent", render: (r) => Number(r.total_spent).toFixed(2) },
    { key: "is_blocked", header: t("status"), render: (r) => r.is_blocked ? <Badge variant="destructive">Blocked</Badge> : <Badge className="bg-success/20 text-success border-success/30">Active</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title={t("customers")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new")} {t("customer")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t("name")}</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><Label>{t("phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
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
          <Button variant="ghost" size="sm" onClick={async () => {
            const { error } = await supabase.from("customers").update({ is_blocked: !r.is_blocked }).eq("id", r.id);
            if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["customers"] });
          }}>{r.is_blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}</Button>
        )}
      />
    </div>
  );
}
