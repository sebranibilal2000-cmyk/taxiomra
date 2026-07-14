import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listCmsPages } from "@/lib/public.functions";
import { ArrowRight, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, absoluteUrl, brandTitle } from "@/lib/site-info";
import { breadcrumbJsonLd } from "@/lib/seo";

const opts = () =>
  queryOptions({
    queryKey: ["public", "cities"],
    queryFn: async () => await listCmsPages({ data: { type: "city" } }),
  });

export const Route = createFileRoute("/_public/{-$locale}/cities/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const isAr = locale === "ar";
    const path = `/${locale}/cities`;
    const url = absoluteUrl(path);
    const title = isAr
      ? `المدن التي نخدمها — تاكسي جدة ومكة والمدينة والطائف والرياض | ${SITE.brand.ar}`
      : brandTitle("Cities we serve — Jeddah, Makkah, Madinah, Taif, Riyadh", "en");
    const description = isAr
      ? "تغطية تاكسي وسائق خاص في جدة ومكة المكرمة والمدينة المنورة والطائف والرياض — توصيل مطار على مدار الساعة ورحلات بين المدن."
      : "Explore taxi and chauffeur coverage across Jeddah, Makkah, Madinah, Taif and Riyadh — 24/7 airport transfers and intercity rides.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `/${locale}` },
              { name: "Cities", url: path },
            ]),
          ),
        },
      ],
    };
  },
  component: CitiesIndex,
});

function CitiesIndex() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data: cities } = useSuspenseQuery(opts());

  return (
    <section className="container-tight py-16 md:py-24">
      <div className="max-w-3xl space-y-5 mb-14">
        <span className="eyebrow">
          <span className="h-px w-8 bg-gold" />
          {ar ? "المدن" : "Cities"}
        </span>
        <h1 className="font-display text-5xl md:text-6xl leading-tight text-balance">
          {ar ? "مدن نخدمها في المملكة." : "Cities we serve across the Kingdom."}
        </h1>
        <p className="text-lg text-muted-foreground">
          {ar
            ? `نغطي ${SITE.city} والمدن المقدسة والوجهات السياحية الرئيسية على مدار الساعة.`
            : `Coverage across ${SITE.city}, the holy cities, and the Kingdom's key destinations — 24/7.`}
        </p>
      </div>

      {cities.length === 0 ? (
        <p className="text-muted-foreground">
          {ar ? "سيتم إضافة صفحات المدن قريبًا." : "City pages will appear here soon."}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((c: any, i: number) => (
            <Link key={c.id} to="/cities/$slug" params={{ slug: c.slug }} className="group">
              <article className="hover-lift h-full flex flex-col rounded-2xl border border-border bg-card p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:bg-gold group-hover:text-primary transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-wider text-gold mb-2">
                  {ar ? "مدينة" : "City"}
                </div>
                <h2 className="font-display text-2xl mb-3">{ar ? c.title_ar : c.title_en}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {ar ? c.subtitle_ar : c.subtitle_en}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  {ar ? "تفاصيل" : "Discover"}{" "}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
