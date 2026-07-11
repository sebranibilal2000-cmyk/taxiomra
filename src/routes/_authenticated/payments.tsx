import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/payments")({ component: Payments });

function Payments() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await supabase.from("payments").select("*, booking:bookings(code, customer:customers(full_name))").order("created_at", { ascending: false })).data ?? [],
  });
  const cols: Column<any>[] = [
    { key: "booking", header: "Booking", render: (r) => <span className="font-mono text-xs">{r.booking?.code ?? "—"}</span> },
    { key: "customer", header: t("customer"), render: (r) => r.booking?.customer?.full_name ?? "—" },
    { key: "amount", header: "Amount", render: (r) => Number(r.amount).toFixed(2) },
    { key: "method", header: "Method" },
    { key: "transaction_ref", header: "Ref" },
    { key: "status", header: t("status"), render: (r) => <StatusBadge value={r.status} /> },
    { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString() },
  ];
  return (
    <div>
      <PageHeader title={t("payments")} />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading}
        actions={(r) => (
          <Select value={r.status} onValueChange={async (v) => {
            const patch: any = { status: v };
            if (v === "paid") patch.paid_at = new Date().toISOString();
            const { error } = await supabase.from("payments").update(patch).eq("id", r.id);
            if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["payments"] });
          }}>
            <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{["pending", "paid", "failed", "refunded"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
