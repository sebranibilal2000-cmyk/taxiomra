import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExportMenu } from "@/components/ExportMenu";
import { useHasPermission } from "@/lib/rbac";
import { useI18n } from "@/lib/i18n";
import { rangeFromKey } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/admin/audit")({ component: Audit });

function Audit() {
  const { t, locale } = useI18n();
  const gate = useHasPermission("audit.view");
  const [rangeKey, setRangeKey] = useState<"7d"|"30d"|"90d"|"365d"|"mtd"|"ytd">("30d");
  const [q, setQ] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [tab, setTab] = useState("activity");
  const range = useMemo(() => rangeFromKey(rangeKey), [rangeKey]);

  const activity = useQuery({
    queryKey: ["activity", rangeKey],
    enabled: gate.allowed && tab === "activity",
    queryFn: async () => (await supabase.from("activity_events")
      .select("*")
      .gte("created_at", range.start.toISOString())
      .lte("created_at", range.end.toISOString())
      .order("created_at", { ascending: false }).limit(1000)).data ?? [],
  });

  const audit = useQuery({
    queryKey: ["audit", rangeKey],
    enabled: gate.allowed && tab === "audit",
    queryFn: async () => (await supabase.from("audit_logs")
      .select("*")
      .gte("created_at", range.start.toISOString())
      .lte("created_at", range.end.toISOString())
      .order("created_at", { ascending: false }).limit(1000)).data ?? [],
  });

  const source = tab === "activity" ? (activity.data ?? []) : (audit.data ?? []);
  const entityKey = tab === "activity" ? "entity_type" : "entity";

  const entities = useMemo(() => Array.from(new Set(source.map((r: any) => r[entityKey]).filter(Boolean))), [source, entityKey]);
  const filtered = useMemo(() => {
    return source.filter((r: any) => {
      if (entityFilter !== "all" && r[entityKey] !== entityFilter) return false;
      if (q.trim() && !JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [source, q, entityFilter, entityKey]);

  const activityCols: Column<any>[] = [
    { key: "created_at", header: "When", render: (r) => new Date(r.created_at).toLocaleString() },
    { key: "entity_type", header: "Entity", render: (r) => <Badge variant="outline">{r.entity_type}</Badge> },
    { key: "event_type", header: "Event", render: (r) => <Badge variant="secondary">{r.event_type}</Badge> },
    { key: "from_value", header: "From", render: (r) => r.from_value ? <span className="text-xs text-muted-foreground">{r.from_value}</span> : "—" },
    { key: "to_value", header: "To", render: (r) => r.to_value ? <span className="text-xs">{r.to_value}</span> : "—" },
    { key: "message", header: "Message", render: (r) => <span className="text-xs">{r.message}</span> },
    { key: "actor_id", header: "Actor", render: (r) => <span className="font-mono text-[10px]">{r.actor_id?.slice(0, 8) ?? "system"}</span> },
  ];

  const auditCols: Column<any>[] = [
    { key: "created_at", header: "When", render: (r) => new Date(r.created_at).toLocaleString() },
    { key: "action", header: "Action", render: (r) => <Badge variant="outline">{r.action}</Badge> },
    { key: "entity", header: "Entity" },
    { key: "entity_id", header: "Record", render: (r) => <span className="font-mono text-[10px]">{r.entity_id?.slice(0, 8) ?? "—"}</span> },
    { key: "user_id", header: "User", render: (r) => <span className="font-mono text-[10px]">{r.user_id?.slice(0, 8) ?? "system"}</span> },
    { key: "metadata", header: "Metadata", render: (r) => <span className="text-[10px] text-muted-foreground max-w-md truncate block">{r.metadata ? JSON.stringify(r.metadata) : "—"}</span> },
  ];

  const exportRows = filtered.map((r: any) => ({
    when: new Date(r.created_at).toISOString(),
    entity: r[entityKey],
    event: r.event_type ?? r.action,
    from: r.from_value,
    to: r.to_value,
    message: r.message,
    actor: r.actor_id ?? r.user_id,
    metadata: r.metadata ? JSON.stringify(r.metadata) : "",
  }));

  if (!gate.loading && !gate.allowed) return <div className="p-8 text-center text-muted-foreground">Not authorized</div>;

  return (
    <div>
      <PageHeader
        title={t("audit")}
        description={locale === "ar" ? "سجل نشاط شامل مع بحث وتصفية" : "Full activity trail with search, filters and export"}
        actions={
          <div className="flex items-center gap-2">
            <Select value={rangeKey} onValueChange={(v: any) => setRangeKey(v)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="mtd">MTD</SelectItem>
                <SelectItem value="ytd">YTD</SelectItem>
                <SelectItem value="365d">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
            <ExportMenu module="audit" filename={`audit-${tab}-${rangeKey}`} title={`${tab === "activity" ? "Activity events" : "Audit log"}`} rows={exportRows} columns={[
              { key: "when", label: "When" }, { key: "entity", label: "Entity" }, { key: "event", label: "Event" },
              { key: "from", label: "From" }, { key: "to", label: "To" }, { key: "message", label: "Message" },
              { key: "actor", label: "Actor" }, { key: "metadata", label: "Metadata" },
            ]} />
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Activity events</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <Card className="mb-4">
          <CardContent className="pt-6 flex flex-wrap items-center gap-3">
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Entity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {entities.map((e) => <SelectItem key={e as string} value={e as string}>{e as string}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">{filtered.length} of {source.length}</div>
          </CardContent>
        </Card>

        <TabsContent value="activity">
          <DataTable data={filtered} columns={activityCols} loading={activity.isLoading} />
        </TabsContent>
        <TabsContent value="audit">
          <DataTable data={filtered} columns={auditCols} loading={audit.isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
