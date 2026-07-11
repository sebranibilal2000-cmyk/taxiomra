import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/audit")({ component: Audit });

function Audit() {
  const { t } = useI18n();
  const q = useQuery({
    queryKey: ["audit"],
    queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [],
  });
  const cols: Column<any>[] = [
    { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString() },
    { key: "action", header: "Action", render: (r) => <Badge variant="outline">{r.action}</Badge> },
    { key: "entity", header: "Entity" },
    { key: "entity_id", header: "ID", render: (r) => <span className="font-mono text-xs">{r.entity_id?.slice(0, 8) ?? "—"}</span> },
    { key: "user_id", header: "User", render: (r) => <span className="font-mono text-xs">{r.user_id?.slice(0, 8) ?? "system"}</span> },
  ];
  return (
    <div>
      <PageHeader title={t("audit")} description="Last 200 events" />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
