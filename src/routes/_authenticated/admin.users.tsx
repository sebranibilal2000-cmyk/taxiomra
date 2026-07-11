import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/users")({ component: Users });

const ROLES = ["admin", "manager", "dispatcher", "accountant", "driver"] as const;

function Users() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("*");
      const roleMap = new Map<string, string[]>();
      (roles ?? []).forEach((r) => { roleMap.set(r.user_id, [...(roleMap.get(r.user_id) ?? []), r.role]); });
      return (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] }));
    },
  });

  const addRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["users"] });
  };

  const cols: Column<any>[] = [
    { key: "full_name", header: t("name"), render: (r) => r.full_name ?? "—" },
    { key: "email", header: t("email") },
    { key: "phone", header: t("phone") },
    { key: "roles", header: "Roles", render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.roles.length === 0 ? <span className="text-muted-foreground text-xs">—</span> : r.roles.map((x: string) => <Badge key={x} variant="secondary">{x}</Badge>)}
      </div>
    )},
    { key: "is_active", header: t("status"), render: (r) => <Badge variant={r.is_active ? "secondary" : "destructive"} className={r.is_active ? "bg-success/20 text-success border-success/30" : ""}>{r.is_active ? "Active" : "Inactive"}</Badge> },
  ];

  return (
    <div>
      <PageHeader title={t("users")} />
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading}
        actions={(r) => (
          <Select onValueChange={(v) => addRole(r.id, v)}>
            <SelectTrigger className="w-36 h-8"><SelectValue placeholder="+ role" /></SelectTrigger>
            <SelectContent>{ROLES.filter((x) => !r.roles.includes(x)).map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
