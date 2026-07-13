import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/blog")({ component: BlogAdmin });

const STATUSES = ["draft", "published", "scheduled", "archived"] as const;

function slugify(s: string) {
  return (s || "").toLowerCase().trim().replace(/[^\w\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

function BlogAdmin() {
  const { locale } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["blog-admin"], queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [] });
  const cats = useQuery({ queryKey: ["blog-cats"], queryFn: async () => (await supabase.from("blog_categories").select("id,name_en,name_ar").order("name_en")).data ?? [] });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const save = async (fd: FormData): Promise<void> => {
    const tags = String(fd.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const kw = String(fd.get("keywords") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const status = String(fd.get("status") || "draft");
    const scheduledRaw = String(fd.get("scheduled_at") || "");
    const payload: any = {
      slug: (fd.get("slug") as string) || slugify(fd.get("title_en") as string),
      title_en: fd.get("title_en"),
      title_ar: fd.get("title_ar"),
      excerpt_en: fd.get("excerpt_en") || null,
      excerpt_ar: fd.get("excerpt_ar") || null,
      content_en: fd.get("content_en") || null,
      content_ar: fd.get("content_ar") || null,
      cover_url: fd.get("cover_url") || null,
      og_image_url: fd.get("og_image_url") || null,
      meta_title: fd.get("meta_title") || null,
      meta_description: fd.get("meta_description") || null,
      canonical_url: fd.get("canonical_url") || null,
      keywords: kw.length ? kw : null,
      tags: tags.length ? tags : null,
      category_id: (fd.get("category_id") as string) || null,
      featured: fd.get("featured") === "on",
      status,
      scheduled_at: scheduledRaw ? new Date(scheduledRaw).toISOString() : null,
    };
    const res = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["blog-admin"] });
  };

  const del = async (id: string) => {
    if (!confirm(locale === "ar" ? "حذف المقال؟" : "Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["blog-admin"] });
  };

  const setPublished = async (r: any, v: boolean) => {
    await supabase.from("blog_posts").update({ status: v ? "published" : "draft", published_at: v ? new Date().toISOString() : null }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["blog-admin"] });
  };

  const cols: Column<any>[] = [
    { key: "title_en", header: "Title", render: (r) => (
      <div><div className="font-medium">{locale === "ar" ? r.title_ar || r.title_en : r.title_en}</div>
        <div className="text-xs text-muted-foreground">/blog/{r.slug}</div></div>
    )},
    { key: "status", header: "Status", render: (r) => <Badge variant="outline">{r.status || (r.published ? "published" : "draft")}</Badge> },
    { key: "featured", header: "Featured", render: (r) => r.featured ? "★" : "" },
    { key: "published", header: "Live", render: (r) => <Switch checked={r.status === "published"} onCheckedChange={(v) => setPublished(r, v)} /> },
    { key: "actions", header: "", render: (r) => (
      <div className="flex gap-1 justify-end">
        {r.status === "published" && <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer"><Button size="icon" variant="ghost"><ExternalLink className="h-4 w-4" /></Button></a>}
        <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  const scheduledDefault = editing?.scheduled_at ? new Date(editing.scheduled_at).toISOString().slice(0, 16) : "";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title={locale === "ar" ? "المدونة" : "Blog Posts"} description={locale === "ar" ? "إدارة المقالات ومحتوى SEO" : "Manage bilingual articles and SEO for the public blog."} />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-2" /> {locale === "ar" ? "مقال جديد" : "New Post"}</Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? (locale === "ar" ? "تحرير" : "Edit post") : (locale === "ar" ? "مقال جديد" : "New post")}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); void save(new FormData(e.currentTarget)); }} className="space-y-4">
              <Tabs defaultValue="content">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="publish">Publish</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm">Title (EN) *</label><Input name="title_en" defaultValue={editing?.title_en} required /></div>
                    <div><label className="text-sm">Title (AR) *</label><Input name="title_ar" defaultValue={editing?.title_ar} dir="rtl" required /></div>
                  </div>
                  <div><label className="text-sm">Slug</label><Input name="slug" defaultValue={editing?.slug} placeholder="auto-generated from title" pattern="[a-z0-9-]+" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm">Excerpt (EN)</label><Textarea name="excerpt_en" defaultValue={editing?.excerpt_en} rows={2} /></div>
                    <div><label className="text-sm">Excerpt (AR)</label><Textarea name="excerpt_ar" defaultValue={editing?.excerpt_ar} rows={2} dir="rtl" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm">Content (EN)</label><Textarea name="content_en" defaultValue={editing?.content_en} rows={12} /></div>
                    <div><label className="text-sm">Content (AR)</label><Textarea name="content_ar" defaultValue={editing?.content_ar} rows={12} dir="rtl" /></div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-3 pt-4">
                  <div><label className="text-sm">Cover image URL</label><Input name="cover_url" defaultValue={editing?.cover_url} type="url" /></div>
                  <div><label className="text-sm">OG / Social image URL</label><Input name="og_image_url" defaultValue={editing?.og_image_url} type="url" /></div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-3 pt-4">
                  <div><label className="text-sm">Meta title</label><Input name="meta_title" defaultValue={editing?.meta_title} maxLength={70} /></div>
                  <div><label className="text-sm">Meta description</label><Textarea name="meta_description" defaultValue={editing?.meta_description} rows={2} maxLength={160} /></div>
                  <div><label className="text-sm">Keywords (comma separated)</label><Input name="keywords" defaultValue={editing?.keywords?.join(", ") ?? ""} /></div>
                  <div><label className="text-sm">Tags (comma separated)</label><Input name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} /></div>
                  <div><label className="text-sm">Canonical URL</label><Input name="canonical_url" defaultValue={editing?.canonical_url} placeholder="auto" /></div>
                </TabsContent>

                <TabsContent value="publish" className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm">Status</label>
                      <Select name="status" defaultValue={editing?.status ?? "draft"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><label className="text-sm">Category</label>
                      <Select name="category_id" defaultValue={editing?.category_id ?? ""}>
                        <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {(cats.data ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{locale === "ar" ? c.name_ar || c.name_en : c.name_en}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><label className="text-sm">Scheduled at</label><Input type="datetime-local" name="scheduled_at" defaultValue={scheduledDefault} /></div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={editing?.featured} /> Featured</label>
                </TabsContent>
              </Tabs>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{locale === "ar" ? "إلغاء" : "Cancel"}</Button>
                <Button type="submit">{locale === "ar" ? "حفظ" : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={q.data ?? []} columns={cols} loading={q.isLoading} />
    </div>
  );
}
