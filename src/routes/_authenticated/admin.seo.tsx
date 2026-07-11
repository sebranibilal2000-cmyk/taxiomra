// SEO Manager — audit dashboard: missing/duplicate metadata, broken links, slug validation.
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { runSeoAudit } from "@/lib/seo-tools.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: SeoManager,
});

function Metric({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${warn && value > 0 ? "text-destructive" : ""}`}>{value}</div>
    </Card>
  );
}

function SeoManager() {
  const audit = useServerFn(runSeoAudit);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["seo-audit"],
    queryFn: () => audit(),
  });

  const c = data?.counts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">SEO Manager</h1>
          <p className="text-sm text-muted-foreground">Audit metadata, detect duplicates, find broken links, validate slugs.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Re-run audit
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Running audit…</p>}

      {c && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            <Metric label="CMS Pages" value={c.pages} />
            <Metric label="Blog Posts" value={c.posts} />
            <Metric label="Missing Title" value={c.missingTitle} warn />
            <Metric label="Missing Description" value={c.missingDescription} warn />
            <Metric label="Short Description" value={c.shortDescription} warn />
            <Metric label="Long Title (>70)" value={c.longTitle} warn />
            <Metric label="Missing OG Image" value={c.missingImage} warn />
            <Metric label="Invalid Slug" value={c.invalidSlug} warn />
            <Metric label="Duplicate Titles" value={c.duplicateTitles} warn />
            <Metric label="Duplicate Descriptions" value={c.duplicateDescriptions} warn />
            <Metric label="Broken Internal Links" value={c.brokenLinks} warn />
          </div>

          <IssueList title="Missing meta title" rows={data.missingTitle} />
          <IssueList title="Missing meta description" rows={data.missingDescription} />
          <IssueList title="Meta description too short (<60 chars)" rows={data.shortDescription} />
          <IssueList title="Meta title too long (>70 chars)" rows={data.longTitle} />
          <IssueList title="Missing OG image" rows={data.missingImage} />
          <IssueList title="Invalid slug format" rows={data.invalidSlug} />

          {data.duplicateTitles.length > 0 && (
            <Card className="p-4">
              <h2 className="mb-3 font-semibold">Duplicate titles</h2>
              <ul className="space-y-2 text-sm">
                {data.duplicateTitles.map((d, i) => (
                  <li key={i}>
                    <span className="font-medium">"{d.title}"</span>
                    <ul className="ml-4 mt-1 list-disc text-muted-foreground">
                      {d.rows.map((r) => <li key={`${r.entity}-${r.id}`}>{r.label} ({r.slug})</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {data.duplicateDescriptions.length > 0 && (
            <Card className="p-4">
              <h2 className="mb-3 font-semibold">Duplicate descriptions</h2>
              <ul className="space-y-2 text-sm">
                {data.duplicateDescriptions.map((d, i) => (
                  <li key={i}>
                    <span className="line-clamp-1 font-medium">"{d.description.slice(0, 100)}…"</span>
                    <ul className="ml-4 mt-1 list-disc text-muted-foreground">
                      {d.rows.map((r) => <li key={`${r.entity}-${r.id}`}>{r.label} ({r.slug})</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {data.brokenLinks.length > 0 && (
            <Card className="p-4">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-destructive" /> Broken internal links</h2>
              <ul className="space-y-1 text-sm">
                {data.brokenLinks.map((b, i) => (
                  <li key={i} className="flex items-center justify-between border-b py-1">
                    <span className="text-muted-foreground">from <code>{b.pageSlug}</code></span>
                    <code className="text-destructive">{b.href}</code>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {c.missingTitle + c.missingDescription + c.brokenLinks + c.duplicateTitles === 0 && (
            <Card className="flex items-center gap-3 p-4 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>No critical SEO issues detected.</span>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function IssueList({ title, rows }: { title: string; rows: { entity: string; id: string; slug: string; label: string }[] }) {
  if (!rows.length) return null;
  return (
    <Card className="p-4">
      <h2 className="mb-3 flex items-center gap-2 font-semibold">
        <Badge variant="destructive">{rows.length}</Badge>
        {title}
      </h2>
      <ul className="grid gap-1 text-sm md:grid-cols-2">
        {rows.map((r) => (
          <li key={`${r.entity}-${r.id}`} className="truncate text-muted-foreground">
            <span className="text-foreground">{r.label}</span> · <code>{r.slug}</code>
          </li>
        ))}
      </ul>
    </Card>
  );
}
