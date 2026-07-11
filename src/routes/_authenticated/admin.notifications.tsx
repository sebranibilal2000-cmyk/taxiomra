import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/notifications")({ component: Notifs });

function Notifs() {
  const { t } = useI18n();
  const q = useQuery({ queryKey: ["notifs"], queryFn: async () => (await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [] });
  const cols: Column<any>[] = [
    { key: "title", header: "Title" },
    { key: "body", header: "Body" },
    { key: "type", header: "Type", render: (r) => r.type ? <Badge variant="outline">{r.type}</Badge> : "—" },
    { key: "is_read", header: "Read", render: (r) => r.is_read ? "✓" : "—" },
    { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString() },
  ];
  return (
    <div>
      <PageHeader title={t("notifications")} />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
