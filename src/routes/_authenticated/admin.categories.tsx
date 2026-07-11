import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({ component: Categories });

function Categories() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["cats-full"], queryFn: async () => (await supabase.from("vehicle_categories").select("*").order("sort_order")).data ?? [] });

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("vehicle_categories").update(patch).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["cats-full"] });
  };

  const cols: Column<any>[] = [
    { key: "code", header: t("code"), render: (r) => <span className="font-medium uppercase">{r.code}</span> },
    { key: "seats", header: t("seats"), render: (r) => <Input type="number" defaultValue={r.seats} className="w-20 h-8" onBlur={(e) => update(r.id, { seats: Number(e.target.value) })} /> },
    { key: "base_fare", header: "Base", render: (r) => <Input type="number" step="0.01" defaultValue={r.base_fare} className="w-24 h-8" onBlur={(e) => update(r.id, { base_fare: Number(e.target.value) })} /> },
    { key: "price_per_km", header: "Per km", render: (r) => <Input type="number" step="0.01" defaultValue={r.price_per_km} className="w-24 h-8" onBlur={(e) => update(r.id, { price_per_km: Number(e.target.value) })} /> },
    { key: "price_per_min", header: "Per min", render: (r) => <Input type="number" step="0.01" defaultValue={r.price_per_min} className="w-24 h-8" onBlur={(e) => update(r.id, { price_per_min: Number(e.target.value) })} /> },
    { key: "is_active", header: t("status"), render: (r) => <Switch checked={r.is_active} onCheckedChange={(v) => update(r.id, { is_active: v })} /> },
  ];

  return (
    <div>
      <PageHeader title={t("categories")} description="Economy · Standard · Business · SUV · Van · Premium" />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
