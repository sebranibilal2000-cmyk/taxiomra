import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/contacts")({ component: ContactsAdmin });

const STATUSES = ["new", "in_progress", "converted", "closed", "spam"] as const;

function ContactsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["contacts-admin"],
    queryFn: async () => (await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [selected, setSelected] = useState<any>(null);

  const updateOne = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("contact_submissions").update({ ...patch, handled_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["contacts-admin"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["contacts-admin"] });
  };

  const badge = (s: string) => {
    const map: Record<string, string> = {
      new: "bg-primary/15 text-primary",
      in_progress: "bg-yellow-500/15 text-yellow-700",
      converted: "bg-green-600/15 text-green-700",
      closed: "bg-muted text-muted-foreground",
      spam: "bg-destructive/15 text-destructive",
    };
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[s]}`}>{s.replace("_", " ")}</span>;
  };

  const cols: Column<any>[] = [
    { key: "when", header: "When", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span> },
    { key: "who", header: "From", render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground flex gap-3">
          {r.email && <a href={`mailto:${r.email}`}><Mail className="inline h-3 w-3 me-1" />{r.email}</a>}
          {r.phone && <a href={`tel:${r.phone}`}><Phone className="inline h-3 w-3 me-1" />{r.phone}</a>}
        </div>
      </div>
    ) },
    { key: "msg", header: "Message", render: (r) => <span className="text-sm line-clamp-2 max-w-md">{r.message}</span> },
    { key: "status", header: "Status", render: (r) => badge(r.status) },
    { key: "a", header: "", render: (r) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => setSelected(r)}><ExternalLink className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  const counts = STATUSES.map((s) => ({ s, n: (q.data ?? []).filter((r: any) => r.status === s).length }));

  return (
    <div>
      <PageHeader title="Contact Submissions" description="Inbound messages from the public contact form — stored in CRM for follow-up." />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {counts.map((c) => (
          <div key={c.s} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.s.replace("_", " ")}</div>
            <div className="font-display text-3xl mt-1">{c.n}</div>
          </div>
        ))}
      </div>
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} onRowClick={(r) => setSelected(r)} />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.name}
                  {badge(selected.status)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  {selected.email && <a href={`mailto:${selected.email}`}><Mail className="inline h-3 w-3 me-1" />{selected.email}</a>}
                  {selected.phone && <a href={`tel:${selected.phone}`}><Phone className="inline h-3 w-3 me-1" />{selected.phone}</a>}
                </div>
                {selected.page_url && <Badge variant="outline" className="text-xs">{selected.page_url}</Badge>}
                <div className="rounded-lg border border-border bg-muted/30 p-4 whitespace-pre-line">{selected.message}</div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Internal notes</label>
                  <Textarea defaultValue={selected.notes ?? ""} rows={3} onBlur={(e) => updateOne(selected.id, { notes: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Status</label>
                  <Select defaultValue={selected.status} onValueChange={(v) => updateOne(selected.id, { status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button asChild variant="outline"><a href={`https://wa.me/${(selected.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener">Reply via WhatsApp</a></Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
