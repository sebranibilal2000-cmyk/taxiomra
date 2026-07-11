import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listCmsPages } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const opts = () => queryOptions({
  queryKey: ["public", "services"],
  queryFn: async () => ({
    services: await listCmsPages({ data: { type: "service" } }),
    airports: await listCmsPages({ data: { type: "airport" } }),
  }),
});

export const Route = createFileRoute("/_public/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: () => ({
    meta: [
      { title: "Taxi Services — Airport, Hotel & Corporate Transfers" },
      { name: "description", content: "Full range of taxi services: airport transfers, hotel transfers, corporate contracts, city rides. Book 24/7 via WhatsApp." },
      { property: "og:title", content: "Taxi Services" },
      { property: "og:description", content: "Airport, hotel and corporate transfers with fixed fares." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(opts());
  const all = [...data.services, ...data.airports];
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "خدماتنا" : "Our Services"}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{ar ? "خدمات نقل شاملة تناسب كل الاحتياجات" : "Complete transportation solutions for every need"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {all.map((s) => (
          <Link key={s.id} to="/p/$slug" params={{ slug: s.slug }}>
            <Card className="h-full hover:border-primary hover:shadow-lg transition group">
              <CardContent className="pt-6">
                <div className="inline-block rounded-lg bg-primary/10 text-primary text-xs font-semibold px-2 py-1 mb-3">{s.page_type}</div>
                <h2 className="font-bold text-lg mb-2">{ar ? s.title_ar : s.title_en}</h2>
                <p className="text-sm text-muted-foreground mb-4">{ar ? s.subtitle_ar : s.subtitle_en}</p>
                <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  {ar ? "تفاصيل" : "Details"} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
