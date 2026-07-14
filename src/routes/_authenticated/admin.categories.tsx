import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({ component: Categories });

function Categories() {
  const { t, locale } = useI18n();
  const ar = locale === "ar";
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["cats-full"], queryFn: async () => (await supabase.from("vehicle_categories").select("*").order("sort_order")).data ?? [] });

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("vehicle_categories").update(patch).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["cats-full"] });
  };

  const cols: Column<any>[] = [
    {
      key: "featured_image_url",
      header: "",
      render: (r) =>
        r.featured_image_url ? (
          <img src={r.featured_image_url} alt={r.code} width={64} height={40} loading="lazy" decoding="async" className="h-10 w-16 object-cover rounded-md border" />
        ) : (
          <div className="h-10 w-16 rounded-md border bg-muted" />
        ),
    },
    { key: "code", header: t("code"), render: (r) => <span className="font-medium uppercase">{r.code}</span> },
    { key: "seats", header: t("seats"), render: (r) => <Input type="number" defaultValue={r.seats} className="w-20 h-8" onBlur={(e) => update(r.id, { seats: Number(e.target.value) })} /> },
    { key: "base_fare", header: ar ? "الأجرة الأساسية" : "Base", render: (r) => <Input type="number" step="0.01" defaultValue={r.base_fare} className="w-24 h-8" onBlur={(e) => update(r.id, { base_fare: Number(e.target.value) })} /> },
    { key: "price_per_km", header: ar ? "لكل كم" : "Per km", render: (r) => <Input type="number" step="0.01" defaultValue={r.price_per_km} className="w-24 h-8" onBlur={(e) => update(r.id, { price_per_km: Number(e.target.value) })} /> },
    { key: "price_per_min", header: ar ? "لكل دقيقة" : "Per min", render: (r) => <Input type="number" step="0.01" defaultValue={r.price_per_min} className="w-24 h-8" onBlur={(e) => update(r.id, { price_per_min: Number(e.target.value) })} /> },
    { key: "is_active", header: t("status"), render: (r) => <Switch checked={r.is_active} onCheckedChange={(v) => update(r.id, { is_active: v })} /> },
    { key: "a", header: "", render: () => (
      <Button asChild size="sm" variant="outline"><Link to={"/admin/fleet" as any}><Plus className="h-3.5 w-3.5 me-1" />{ar ? "إضافة مركبة" : "Add vehicle"}</Link></Button>
    ) },
  ];

  return (
    <div>
      <PageHeader title={t("categories")} description={ar ? "اقتصادية · قياسية · أعمال · دفع رباعي · فان · بريميوم" : "Economy · Standard · Business · SUV · Van · Premium"} />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
