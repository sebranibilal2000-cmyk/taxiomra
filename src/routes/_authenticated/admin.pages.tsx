import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/pages")({ component: PagesAdmin });

const TYPES = ["service", "city", "route", "airport", "custom"];

function PagesAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["pages-admin"], queryFn: async () => (await supabase.from("cms_pages").select("*").order("sort_order")).data ?? [] });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [type, setType] = useState("service");

  const save = async (fd: FormData) => {
    const kw = String(fd.get("keywords") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const payload: any = {
      slug: fd.get("slug"),
      page_type: type,
      title_en: fd.get("title_en"),
      title_ar: fd.get("title_ar"),
      subtitle_en: fd.get("subtitle_en") || null,
      subtitle_ar: fd.get("subtitle_ar") || null,
      body_en: fd.get("body_en") || null,
      body_ar: fd.get("body_ar") || null,
      og_image_url: fd.get("og_image_url") || null,
      meta_title: fd.get("meta_title") || null,
      meta_description: fd.get("meta_description") || null,
      og_title: fd.get("og_title") || null,
      og_description: fd.get("og_description") || null,
      canonical_url: fd.get("canonical_url") || null,
      robots: fd.get("robots") || "index,follow",
      schema_type: fd.get("schema_type") || null,
      keywords: kw.length ? kw : null,
      sort_order: Number(fd.get("sort_order") || 0),
      published: fd.get("published") === "on",
    };
    const res = editing
      ? await supabase.from("cms_pages").update(payload).eq("id", editing.id)
      : await supabase.from("cms_pages").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["pages-admin"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("cms_pages").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["pages-admin"] });
  };

  const cols: Column<any>[] = [
    { key: "title_en", header: "Title", render: (r) => <div><div className="font-medium">{r.title_en}</div><div className="text-xs text-muted-foreground">/p/{r.slug}</div></div> },
    { key: "page_type", header: "Type", render: (r) => <span className="text-xs uppercase text-muted-foreground">{r.page_type}</span> },
    { key: "published", header: "Published", render: (r) => <Switch checked={r.published} onCheckedChange={async (v) => { await supabase.from("cms_pages").update({ published: v }).eq("id", r.id); qc.invalidateQueries({ queryKey: ["pages-admin"] }); }} /> },
    { key: "a", header: "", render: (r) => (
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setType(r.page_type); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <PageHeader title="CMS Pages" description="Service, city, airport and route landing pages for the public website." />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setType("service"); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-2" /> New Page</Button></DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit page" : "New page"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); void save(new FormData(e.currentTarget)); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Slug</label><Input name="slug" defaultValue={editing?.slug} required /></div>
                <div><label className="text-sm">Type</label>
                  <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Title (EN)</label><Input name="title_en" defaultValue={editing?.title_en} required /></div>
                <div><label className="text-sm">Title (AR)</label><Input name="title_ar" defaultValue={editing?.title_ar} dir="rtl" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Subtitle (EN)</label><Input name="subtitle_en" defaultValue={editing?.subtitle_en} /></div>
                <div><label className="text-sm">Subtitle (AR)</label><Input name="subtitle_ar" defaultValue={editing?.subtitle_ar} dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Body (EN)</label><Textarea name="body_en" defaultValue={editing?.body_en} rows={8} /></div>
                <div><label className="text-sm">Body (AR)</label><Textarea name="body_ar" defaultValue={editing?.body_ar} rows={8} dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">OG image URL</label><Input name="og_image_url" defaultValue={editing?.og_image_url} type="url" /></div>
                <div><label className="text-sm">Sort order</label><Input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Meta title</label><Input name="meta_title" defaultValue={editing?.meta_title} /></div>
                <div><label className="text-sm">Meta description</label><Input name="meta_description" defaultValue={editing?.meta_description} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">OG title</label><Input name="og_title" defaultValue={editing?.og_title} /></div>
                <div><label className="text-sm">OG description</label><Input name="og_description" defaultValue={editing?.og_description} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-sm">Canonical URL</label><Input name="canonical_url" defaultValue={editing?.canonical_url} placeholder="/p/slug" /></div>
                <div><label className="text-sm">Robots</label><Input name="robots" defaultValue={editing?.robots ?? "index,follow"} /></div>
                <div><label className="text-sm">Schema.org</label>
                  <Select defaultValue={editing?.schema_type ?? ""} name="schema_type">
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="TaxiService">TaxiService</SelectItem>
                      <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
                      <SelectItem value="FAQPage">FAQPage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><label className="text-sm">Keywords (comma-separated)</label><Input name="keywords" defaultValue={editing?.keywords?.join(", ") ?? ""} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={editing?.published} /> Published</label>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
