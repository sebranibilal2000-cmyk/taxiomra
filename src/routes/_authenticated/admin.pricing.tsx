import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pricing")({ component: Pricing });

function Pricing() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => (await supabase.from("pricing_rules").select("*, category:vehicle_categories(code)").order("created_at")).data ?? [],
  });

  const upd = async (id: string, patch: any) => {
    const { error } = await supabase.from("pricing_rules").update(patch).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["pricing"] });
  };

  const ar = locale === "ar";
  const cols: Column<any>[] = [
    { key: "category", header: t("category"), render: (r) => r.category?.code ?? "—" },
    { key: "min_fare", header: ar ? "الحد الأدنى" : "Min fare", render: (r) => <Input type="number" step="0.01" defaultValue={r.min_fare} className="w-24 h-8" onBlur={(e) => upd(r.id, { min_fare: Number(e.target.value) })} /> },
    { key: "waiting_per_min", header: ar ? "انتظار/دقيقة" : "Waiting/min", render: (r) => <Input type="number" step="0.01" defaultValue={r.waiting_per_min} className="w-24 h-8" onBlur={(e) => upd(r.id, { waiting_per_min: Number(e.target.value) })} /> },
    { key: "airport_fee", header: ar ? "رسوم المطار" : "Airport fee", render: (r) => <Input type="number" step="0.01" defaultValue={r.airport_fee} className="w-24 h-8" onBlur={(e) => upd(r.id, { airport_fee: Number(e.target.value) })} /> },
    { key: "night_start_hour", header: ar ? "بداية الليل" : "Night start", render: (r) => <Input type="number" defaultValue={r.night_start_hour} className="w-20 h-8" onBlur={(e) => upd(r.id, { night_start_hour: Number(e.target.value) })} /> },
    { key: "night_end_hour", header: ar ? "نهاية الليل" : "Night end", render: (r) => <Input type="number" defaultValue={r.night_end_hour} className="w-20 h-8" onBlur={(e) => upd(r.id, { night_end_hour: Number(e.target.value) })} /> },
    { key: "night_surcharge_pct", header: ar ? "% الليل" : "Night %", render: (r) => <Input type="number" step="0.01" defaultValue={r.night_surcharge_pct} className="w-24 h-8" onBlur={(e) => upd(r.id, { night_surcharge_pct: Number(e.target.value) })} /> },
    { key: "is_active", header: t("status"), render: (r) => <Switch checked={r.is_active} onCheckedChange={(v) => upd(r.id, { is_active: v })} /> },
  ];

  return (
    <div>
      <PageHeader title={t("pricing")} description={locale === "ar" ? "قواعد التسعير لكل فئة" : "Pricing rules per category"} />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
