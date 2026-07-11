import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getBlogPost } from "@/lib/public.functions";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site-info";

const opts = (slug: string) => queryOptions({
  queryKey: ["public", "blog", slug],
  queryFn: async () => {
    const p = await getBlogPost({ data: { slug } });
    if (!p) throw notFound();
    return p;
  },
});

export const Route = createFileRoute("/_public/{-$locale}/{-$locale}/blog/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(opts(params.slug)),
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const title = loaderData.meta_title || loaderData.title_en;
    const desc = loaderData.meta_description || loaderData.excerpt_en || "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        ...(loaderData.cover_url ? [{ property: "og:image", content: loaderData.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: desc,
          image: loaderData.cover_url || undefined,
          datePublished: loaderData.published_at,
          author: { "@type": "Organization", name: SITE.brand.en },
        }),
      }],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Post not found</h1>
    </div>
  ),
});

function BlogPost() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const params = Route.useParams();
  const { data: p } = useSuspenseQuery(opts(params.slug));
  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {p.cover_url && <img src={p.cover_url} alt={ar ? p.title_ar : p.title_en} className="w-full aspect-[16/9] object-cover rounded-2xl mb-8" />}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{ar ? p.title_ar : p.title_en}</h1>
      {p.published_at && <div className="text-sm text-muted-foreground mb-8">{new Date(p.published_at).toLocaleDateString(locale === "ar" ? "ar" : "en")}</div>}
      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line leading-relaxed text-foreground">{ar ? p.content_ar : p.content_en}</div>
    </article>
  );
}
