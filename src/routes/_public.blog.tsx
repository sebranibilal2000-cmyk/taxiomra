import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listBlogPosts } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const opts = () => queryOptions({ queryKey: ["public", "blog"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/_public/blog")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: () => ({
    meta: [
      { title: "Blog — Taxi Travel Tips, Airport Guides & News" },
      { name: "description", content: "Travel tips, airport guides, city travel advice and taxi industry news from our team." },
      { property: "og:title", content: "Sur3a Taxi Blog" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(opts());
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "المدونة" : "Blog"}</h1>
        <p className="text-muted-foreground">{ar ? "نصائح للسفر ودليل المطارات وأخبار قطاع النقل" : "Travel tips, airport guides and industry news"}</p>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground">{ar ? "لا توجد مقالات منشورة بعد." : "No posts published yet."}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((p: any) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
              <Card className="h-full overflow-hidden hover:shadow-lg transition">
                {p.cover_image_url && <div className="aspect-[16/9] bg-muted overflow-hidden"><img src={p.cover_image_url} alt={ar ? p.title_ar : p.title_en} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" /></div>}
                <CardContent className="pt-5">
                  <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition">{ar ? p.title_ar : p.title_en}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{ar ? p.excerpt_ar : p.excerpt_en}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
