import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/errors")({ component: ErrorsPage });

function ErrorsPage() {
  const qc = useQueryClient();
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("open");
  const [search, setSearch] = useState("");

  const q = useQuery({
    queryKey: ["error-logs", level, status, search],
    queryFn: async () => {
      let query = supabase.from("error_logs").select("*").order("created_at", { ascending: false }).limit(500);
      if (level !== "all") query = query.eq("level", level);
      if (status === "open") query = query.eq("resolved", false);
      if (status === "resolved") query = query.eq("resolved", true);
      if (search) query = query.ilike("message", `%${search}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  const resolve = async (id: string, resolved: boolean) => {
    const { error } = await supabase.from("error_logs").update({ resolved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(resolved ? "Marked resolved" : "Reopened");
    qc.invalidateQueries({ queryKey: ["error-logs"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this error log?")) return;
    const { error } = await supabase.from("error_logs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["error-logs"] });
  };

  const cols: Column<any>[] = [
    { key: "when", header: "When", render: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</span> },
    { key: "level", header: "Level", render: (r) => (
      <Badge variant={r.level === "fatal" || r.level === "error" ? "destructive" : "secondary"} className="uppercase text-[10px]">{r.level}</Badge>
    )},
    { key: "source", header: "Src", render: (r) => <span className="text-xs">{r.source}</span> },
    { key: "message", header: "Message", render: (r) => (
      <div className="max-w-xl">
        <div className="text-sm font-medium truncate">{r.message}</div>
        {r.url && <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><ExternalLink className="h-3 w-3" /> {r.url}</div>}
      </div>
    )},
    { key: "status", header: "Status", render: (r) => r.resolved
      ? <Badge className="bg-emerald-600 hover:bg-emerald-600">Resolved</Badge>
      : <Badge variant="outline">Open</Badge>
    },
    { key: "actions", header: "", render: (r) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => resolve(r.id, !r.resolved)} title={r.resolved ? "Reopen" : "Mark resolved"}>
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => del(r.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Error Logs" description="Captured runtime errors from client and server. Investigate, resolve, or purge." />
      <div className="flex gap-2 flex-wrap mb-4">
        <Input placeholder="Search message…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="fatal">Fatal</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
