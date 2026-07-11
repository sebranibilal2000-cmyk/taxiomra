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
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({ component: BlogAdmin });

type Row = any;

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

function BlogAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["blog-admin"], queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);

  const save = async (form: FormData): Promise<void> => {
    const payload: any = {
      slug: (form.get("slug") as string) || slugify(form.get("title_en") as string),
      title_en: form.get("title_en"),
      title_ar: form.get("title_ar"),
      excerpt_en: form.get("excerpt_en"),
      excerpt_ar: form.get("excerpt_ar"),
      content_en: form.get("content_en"),
      content_ar: form.get("content_ar"),
      cover_url: form.get("cover_url") || null,
      meta_title: form.get("meta_title") || null,
      meta_description: form.get("meta_description") || null,
      published: form.get("published") === "on",
      published_at: form.get("published") === "on" ? new Date().toISOString() : null,
    };
    const res = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["blog-admin"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["blog-admin"] });
  };

  const cols: Column<Row>[] = [
    { key: "title_en", header: "Title", render: (r) => <div><div className="font-medium">{r.title_en}</div><div className="text-xs text-muted-foreground">{r.slug}</div></div> },
    { key: "published", header: "Published", render: (r) => <Switch checked={r.published} onCheckedChange={async (v) => { await supabase.from("blog_posts").update({ published: v, published_at: v ? new Date().toISOString() : null }).eq("id", r.id); qc.invalidateQueries({ queryKey: ["blog-admin"] }); }} /> },
    { key: "actions", header: "", render: (r) => (
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><PageHeader title="Blog Posts" description="Manage your blog / news articles for the public website." />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-2" /> New Post</Button></DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
            <form action={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Title (EN)</label><Input name="title_en" defaultValue={editing?.title_en} required /></div>
                <div><label className="text-sm">Title (AR)</label><Input name="title_ar" defaultValue={editing?.title_ar} dir="rtl" /></div>
              </div>
              <div><label className="text-sm">Slug</label><Input name="slug" defaultValue={editing?.slug} placeholder="auto-generated from title" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Excerpt (EN)</label><Textarea name="excerpt_en" defaultValue={editing?.excerpt_en} rows={2} /></div>
                <div><label className="text-sm">Excerpt (AR)</label><Textarea name="excerpt_ar" defaultValue={editing?.excerpt_ar} rows={2} dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Content (EN)</label><Textarea name="content_en" defaultValue={editing?.content_en} rows={8} /></div>
                <div><label className="text-sm">Content (AR)</label><Textarea name="content_ar" defaultValue={editing?.content_ar} rows={8} dir="rtl" /></div>
              </div>
              <div><label className="text-sm">Cover image URL</label><Input name="cover_url" defaultValue={editing?.cover_url} type="url" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm">Meta title</label><Input name="meta_title" defaultValue={editing?.meta_title} /></div>
                <div><label className="text-sm">Meta description</label><Input name="meta_description" defaultValue={editing?.meta_description} /></div>
              </div>
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
