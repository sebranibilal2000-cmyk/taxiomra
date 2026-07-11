import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, FileText, Search, Languages, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  aiGenerateSeoMeta, aiGenerateBlogDraft, aiRewriteContent, aiPriceExplanation,
  listAiDrafts, reviewAiDraft,
} from "@/lib/ai-generators.functions";
import { useHasPermission } from "@/lib/rbac";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/ai-studio")({ component: AiStudio });

function AiStudio() {
  const { locale } = useI18n();
  const gate = useHasPermission("ai.view");
  if (!gate.loading && !gate.allowed) return <div className="p-8 text-muted-foreground">Not authorized</div>;

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "استوديو الذكاء الاصطناعي" : "AI Studio"}
        description={locale === "ar" ? "إنشاء مسودات المحتوى وSEO بمراجعة بشرية إلزامية" : "SEO, content & booking helpers — every output is a draft awaiting human approval"}
      />

      <Tabs defaultValue="seo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="seo"><Search className="h-3.5 w-3.5 me-2" />SEO</TabsTrigger>
          <TabsTrigger value="content"><FileText className="h-3.5 w-3.5 me-2" />Content</TabsTrigger>
          <TabsTrigger value="rewrite"><Languages className="h-3.5 w-3.5 me-2" />Rewrite / Translate</TabsTrigger>
          <TabsTrigger value="price"><Sparkles className="h-3.5 w-3.5 me-2" />Price explanation</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="seo"><SeoMetaTool /></TabsContent>
        <TabsContent value="content"><BlogDraftTool /></TabsContent>
        <TabsContent value="rewrite"><RewriteTool /></TabsContent>
        <TabsContent value="price"><PriceTool /></TabsContent>
        <TabsContent value="drafts"><DraftsList /></TabsContent>
      </Tabs>
    </div>
  );
}

function SeoMetaTool() {
  const gen = useServerFn(aiGenerateSeoMeta);
  const [topic, setTopic] = useState("");
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [context, setContext] = useState("");
  const m = useMutation({
    mutationFn: () => gen({ data: { topic, locale, context: context || undefined } }),
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
    onSuccess: () => toast.success("Draft saved for review"),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Meta title & description</CardTitle><CardDescription>Generates SEO-optimized meta tags. Never publishes automatically.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Topic — e.g. Airport transfer Jeddah to Makkah" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Textarea placeholder="Additional context (route length, USP, target city)" value={context} onChange={(e) => setContext(e.target.value)} rows={3} />
        <div className="flex items-center gap-3">
          <Select value={locale} onValueChange={(v: any) => setLocale(v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ar">العربية</SelectItem></SelectContent>
          </Select>
          <Button onClick={() => m.mutate()} disabled={!topic.trim() || m.isPending}>
            <Sparkles className="h-4 w-4 me-2" />{m.isPending ? "Generating…" : "Generate"}
          </Button>
        </div>
        {m.data && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 mt-4">
            <div><span className="text-xs text-muted-foreground">Title</span><div className="font-medium">{(m.data as any).title}</div></div>
            <div><span className="text-xs text-muted-foreground">Description</span><div className="text-sm">{(m.data as any).description}</div></div>
            {(m.data as any).keywords?.length > 0 && (
              <div className="flex flex-wrap gap-1">{(m.data as any).keywords.map((k: string) => <Badge key={k} variant="outline">{k}</Badge>)}</div>
            )}
            <div className="text-xs text-muted-foreground pt-2">Draft #{(m.data as any).draft_id?.slice(0, 8)} — review in the Drafts tab.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BlogDraftTool() {
  const gen = useServerFn(aiGenerateBlogDraft);
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const m = useMutation({
    mutationFn: () => gen({ data: { title, outline: outline.split("\n").filter(Boolean), locale, tone: "luxury" } }),
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
    onSuccess: () => toast.success("Blog draft saved"),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Blog draft</CardTitle><CardDescription>800–1400 words, structured, luxury tone. Requires human review before publishing.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Article title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Optional outline — one heading per line" value={outline} onChange={(e) => setOutline(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <Select value={locale} onValueChange={(v: any) => setLocale(v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ar">العربية</SelectItem></SelectContent>
          </Select>
          <Button onClick={() => m.mutate()} disabled={!title.trim() || m.isPending}>
            <Sparkles className="h-4 w-4 me-2" />{m.isPending ? "Writing…" : "Draft article"}
          </Button>
        </div>
        {m.data && (m.data as any).content_markdown && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3 mt-4">
            <div className="font-display text-xl">{(m.data as any).title}</div>
            <div className="text-sm text-muted-foreground italic">{(m.data as any).excerpt}</div>
            <div className="text-xs whitespace-pre-wrap max-h-80 overflow-auto bg-background rounded p-3">{(m.data as any).content_markdown}</div>
            <div className="text-xs text-muted-foreground">Draft #{(m.data as any).draft_id?.slice(0, 8)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RewriteTool() {
  const gen = useServerFn(aiRewriteContent);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"rewrite" | "expand" | "summarize" | "translate">("rewrite");
  const [target, setTarget] = useState<"en" | "ar">("ar");
  const m = useMutation({
    mutationFn: () => gen({ data: { text, mode, target_locale: mode === "translate" ? target : undefined } }),
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
    onSuccess: () => toast.success("Draft saved"),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Rewrite / Expand / Summarize / Translate</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste source text" value={text} onChange={(e) => setText(e.target.value)} rows={8} />
        <div className="flex flex-wrap items-center gap-3">
          <Select value={mode} onValueChange={(v: any) => setMode(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rewrite">Rewrite</SelectItem>
              <SelectItem value="expand">Expand</SelectItem>
              <SelectItem value="summarize">Summarize</SelectItem>
              <SelectItem value="translate">Translate</SelectItem>
            </SelectContent>
          </Select>
          {mode === "translate" && (
            <Select value={target} onValueChange={(v: any) => setTarget(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="en">→ English</SelectItem><SelectItem value="ar">→ Arabic</SelectItem></SelectContent>
            </Select>
          )}
          <Button onClick={() => m.mutate()} disabled={!text.trim() || m.isPending}>
            {m.isPending ? "Working…" : "Run"}
          </Button>
        </div>
        {m.data && (m.data as any).text && (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap mt-4">
            {(m.data as any).text}
            <div className="text-xs text-muted-foreground pt-3">Draft #{(m.data as any).draft_id?.slice(0, 8)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PriceTool() {
  const gen = useServerFn(aiPriceExplanation);
  const [base, setBase] = useState("200");
  const [distance, setDistance] = useState("85");
  const [duration, setDuration] = useState("70");
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const m = useMutation({
    mutationFn: () => gen({ data: { base_fare: +base, distance_km: +distance, duration_min: +duration, locale, currency: "SAR" } }),
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Price explanation</CardTitle><CardDescription>Warm, transparent fare breakdown for a customer.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-xs text-muted-foreground">Base fare</label><Input value={base} onChange={(e) => setBase(e.target.value)} type="number" /></div>
          <div><label className="text-xs text-muted-foreground">Distance (km)</label><Input value={distance} onChange={(e) => setDistance(e.target.value)} type="number" /></div>
          <div><label className="text-xs text-muted-foreground">Duration (min)</label><Input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" /></div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={locale} onValueChange={(v: any) => setLocale(v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ar">العربية</SelectItem></SelectContent>
          </Select>
          <Button onClick={() => m.mutate()} disabled={m.isPending}>Generate</Button>
        </div>
        {m.data && (m.data as any).text && (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm mt-4">{(m.data as any).text}</div>
        )}
      </CardContent>
    </Card>
  );
}

function DraftsList() {
  const list = useServerFn(listAiDrafts);
  const review = useServerFn(reviewAiDraft);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"draft" | "approved" | "rejected" | "applied">("draft");
  const q = useQuery({
    queryKey: ["ai-drafts", filter],
    queryFn: () => list({ data: { status: filter, limit: 100 } }),
  });
  const m = useMutation({
    mutationFn: (v: { id: string; decision: "approve" | "reject" }) =>
      review({ data: { draft_id: v.id, decision: v.decision } }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["ai-drafts"] }); },
  });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Drafts pending review</CardTitle></div>
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {(q.data ?? []).map((d: any) => (
          <div key={d.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{d.kind}</Badge>
                {d.locale && <Badge variant="secondary">{d.locale}</Badge>}
                <span className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3 me-1" />{new Date(d.created_at).toLocaleString()}</span>
              </div>
              {d.status === "draft" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => m.mutate({ id: d.id, decision: "approve" })}><CheckCircle2 className="h-3.5 w-3.5 me-1" />Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => m.mutate({ id: d.id, decision: "reject" })}><XCircle className="h-3.5 w-3.5 me-1" />Reject</Button>
                </div>
              )}
            </div>
            <pre className="text-xs whitespace-pre-wrap bg-muted/30 rounded p-3 max-h-48 overflow-auto">{JSON.stringify(d.output, null, 2)}</pre>
          </div>
        ))}
        {(q.data ?? []).length === 0 && !q.isLoading && <div className="text-sm text-muted-foreground">No drafts.</div>}
      </CardContent>
    </Card>
  );
}
