// Redirect Manager — CRUD for public 301/302 redirects.
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/redirects")({
  component: RedirectsPage,
});

type Row = {
  id: string;
  source_path: string;
  destination_path: string;
  status_code: number;
  active: boolean;
  created_at: string;
};

function RedirectsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["seo_redirects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_redirects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const [form, setForm] = useState({ source_path: "", destination_path: "", status_code: 301, active: true });

  const add = async () => {
    if (!form.source_path.startsWith("/") || !form.destination_path.startsWith("/")) {
      toast.error("Both paths must start with /");
      return;
    }
    if (form.source_path === form.destination_path) {
      toast.error("Source and destination must differ");
      return;
    }
    const { error } = await supabase.from("seo_redirects").insert(form as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Redirect added");
    setForm({ source_path: "", destination_path: "", status_code: 301, active: true });
    qc.invalidateQueries({ queryKey: ["seo_redirects"] });
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("seo_redirects").update({ active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["seo_redirects"] });
  };

  const del = async (id: string) => {
    await supabase.from("seo_redirects").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["seo_redirects"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Redirect Manager</h1>
        <p className="text-sm text-muted-foreground">Manage 301/302 URL redirects. Paths are locale-agnostic (leading /en or /ar is stripped before matching).</p>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 font-semibold">Add redirect</h2>
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <Label>From</Label>
            <Input placeholder="/old-path" value={form.source_path} onChange={(e) => setForm((f) => ({ ...f, source_path: e.target.value.trim() }))} />
          </div>
          <div className="md:col-span-2">
            <Label>To</Label>
            <Input placeholder="/new-path" value={form.destination_path} onChange={(e) => setForm((f) => ({ ...f, destination_path: e.target.value.trim() }))} />
          </div>
          <div>
            <Label>Code</Label>
            <Select value={String(form.status_code)} onValueChange={(v) => setForm((f) => ({ ...f, status_code: Number(v) }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="301">301 Permanent</SelectItem>
                <SelectItem value="302">302 Temporary</SelectItem>
                <SelectItem value="307">307 Preserve method</SelectItem>
                <SelectItem value="308">308 Permanent preserve</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} />
            Active
          </label>
          <Button onClick={add}><Plus className="mr-2 h-4 w-4" /> Add</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3 w-24">Code</th>
              <th className="p-3 w-24">Active</th>
              <th className="p-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono text-xs">{r.source_path}</td>
                <td className="p-3 font-mono text-xs">{r.destination_path}</td>
                <td className="p-3">{r.status_code}</td>
                <td className="p-3"><Switch checked={r.active} onCheckedChange={(v) => toggle(r.id, v)} /></td>
                <td className="p-3">
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && !isLoading && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No redirects yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
