import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listBlogPosts } from "@/lib/public.functions";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Clock } from "lucide-react";

const opts = () => queryOptions({ queryKey: ["public", "blog"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/_public/{-$locale}/blog")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: () => ({
    meta: [
      { title: "Journal — Travel Tips, Airport Guides & Chauffeur Stories" },
      { name: "description", content: "Travel notes, airport guides, and industry insights from our chauffeur team." },
      { property: "og:title", content: "The Journal — Sur3a Taxi" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function readingTime(text: string) { return Math.max(1, Math.round((text?.length ?? 0) / 1000)); }

function Blog() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(opts());
  const [featured, ...rest] = data;

  return (
    <section className="container-tight py-16 md:py-24">
      <div className="max-w-3xl space-y-5 mb-14">
        <span className="eyebrow"><span className="h-px w-8 bg-gold" />{ar ? "المدونة" : "The Journal"}</span>
        <h1 className="font-display text-5xl md:text-6xl leading-tight text-balance">
          {ar ? "قصص، أدلة، ونصائح من الطريق." : "Stories, guides & notes from the road."}
        </h1>
      </div>

      {data.length === 0 && (
        <p className="text-center text-muted-foreground py-16">{ar ? "لا توجد مقالات منشورة بعد." : "No articles published yet."}</p>
      )}

      {featured && (
        <Link to="/blog/$slug" params={{ slug: featured.slug }} className="group block mb-16">
          <article className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              {featured.cover_url ? (
                <img src={featured.cover_url} alt={ar ? featured.title_ar : featured.title_en} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-primary to-primary/60" />
              )}
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs uppercase tracking-[0.22em] text-gold">{ar ? "المقال المميز" : "Featured"}</div>
              <h2 className="font-display text-4xl leading-tight group-hover:text-gold transition-colors">{ar ? featured.title_ar : featured.title_en}</h2>
              <p className="text-muted-foreground line-clamp-3">{ar ? featured.excerpt_ar : featured.excerpt_en}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{readingTime((ar ? featured.excerpt_ar : featured.excerpt_en) ?? "")} min read</span>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                {ar ? "اقرأ المقال" : "Read article"} <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </div>
          </article>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="border-t border-border/60 pt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
              <article className="space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={ar ? p.title_ar : p.title_en} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary/40 to-muted" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-gold">{ar ? "دليل" : "Guide"}</span>
                  <span className="h-px w-6 bg-border" />
                  <span>{readingTime((ar ? p.excerpt_ar : p.excerpt_en) ?? "")} min</span>
                </div>
                <h3 className="font-display text-2xl leading-tight group-hover:text-gold transition-colors">{ar ? p.title_ar : p.title_en}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{ar ? p.excerpt_ar : p.excerpt_en}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
