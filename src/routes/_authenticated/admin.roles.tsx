import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

const ROLES = ["admin", "manager", "dispatcher", "accountant", "driver"];

export const Route = createFileRoute("/_authenticated/roles")({ component: Roles });

function Roles() {
  const { t, locale } = useI18n();
  const q = useQuery({
    queryKey: ["role-perms"],
    queryFn: async () => {
      const [perms, rp] = await Promise.all([
        supabase.from("permissions").select("*").order("code"),
        supabase.from("role_permissions").select("*"),
      ]);
      const byRole = new Map<string, Set<string>>();
      (rp.data ?? []).forEach((r: any) => {
        if (!byRole.has(r.role)) byRole.set(r.role, new Set());
        byRole.get(r.role)!.add(r.permission_id);
      });
      return { perms: perms.data ?? [], byRole };
    },
  });

  return (
    <div>
      <PageHeader title={t("roles")} description={locale === "ar" ? "الأدوار المتاحة والصلاحيات" : "Available roles & permissions"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => {
          const perms = q.data?.perms.filter((p) => q.data?.byRole.get(role)?.has(p.id)) ?? [];
          return (
            <Card key={role}>
              <CardHeader><CardTitle className="capitalize flex items-center justify-between">{role}<Badge variant="secondary">{perms.length}</Badge></CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {perms.length === 0 ? <span className="text-sm text-muted-foreground">—</span> :
                    perms.map((p) => <Badge key={p.id} variant="outline" className="font-mono text-[10px]">{p.code}</Badge>)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
