import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getCmsPage } from "@/lib/public.functions";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { buildCmsHead, breadcrumbJsonLd } from "@/lib/seo";

const opts = (slug: string) => queryOptions({
  queryKey: ["public", "page", slug],
  queryFn: async () => {
    const p = await getCmsPage({ data: { slug } });
    if (!p) throw notFound();
    return p;
  },
});

export const Route = createFileRoute("/_public/p/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(opts(params.slug)),
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const head = buildCmsHead(loaderData as any);
    head.scripts = [
      ...(head.scripts ?? []),
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: loaderData.title_en, url: `/p/${params.slug}` },
      ])) },
    ];
    return head;
  },
  component: PageDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
    </div>
  ),
});

function PageDetail() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const params = Route.useParams();
  const { data: p } = useSuspenseQuery(opts(params.slug));

  return (
    <>
      <section className="bg-gradient-to-br from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
          <div className="inline-block rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-4">{p.page_type}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{ar ? p.title_ar : p.title_en}</h1>
          <p className="text-lg text-muted-foreground">{ar ? p.subtitle_ar : p.subtitle_en}</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line leading-relaxed text-foreground">
          {ar ? p.body_ar : p.body_en}
        </div>
        <div className="mt-10 rounded-2xl border bg-muted/30 p-6 text-center">
          <h2 className="text-xl font-bold mb-3">{ar ? "احجز هذه الخدمة الآن" : "Book this service now"}</h2>
          <p className="text-sm text-muted-foreground mb-5">{ar ? "تواصل مع فريق الحجز مباشرة عبر واتساب أو الاتصال." : "Contact our dispatch team directly via WhatsApp or a phone call."}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700"><a href={waLink((ar ? p.title_ar : p.title_en) + " — " + (ar ? "أرغب بالحجز" : "I'd like to book"))} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4 me-2" />WhatsApp</a></Button>
            <Button asChild variant="outline"><a href={telLink()}><Phone className="h-4 w-4 me-2" />{SITE.phone}</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}
