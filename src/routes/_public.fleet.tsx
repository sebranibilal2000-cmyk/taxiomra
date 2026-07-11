import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listVehicleCategories } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const opts = () => queryOptions({ queryKey: ["public", "fleet"], queryFn: () => listVehicleCategories() });

export const Route = createFileRoute("/_public/fleet")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: () => ({
    meta: [
      { title: "Our Fleet — Economy, Business, SUV, Van & Premium Taxis" },
      { name: "description", content: "Choose from economy, business, SUV, van and premium taxi categories. Modern, well-maintained fleet with licensed drivers." },
      { property: "og:title", content: "Our Fleet" },
      { property: "og:description", content: "Modern taxi fleet: economy, business, SUV, van and premium." },
      { property: "og:url", content: "/fleet" },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  component: Fleet,
});

function Fleet() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(opts());
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "أسطولنا" : "Our Fleet"}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{ar ? "اختر الفئة التي تناسبك" : "Pick the category that fits your trip"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((c: any) => {
          const tr = c.vehicle_category_translations?.find((t: any) => t.locale === locale) || c.vehicle_category_translations?.[0];
          return (
            <Card key={c.id} className="hover:shadow-lg transition"><CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3"><Car className="h-6 w-6" /></div>
              <h2 className="font-bold text-xl mb-1">{tr?.name ?? c.code}</h2>
              <p className="text-sm text-muted-foreground mb-4">{tr?.description ?? ""}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {c.seats} {ar ? "مقاعد" : "seats"}</span>
                <span className="text-primary font-semibold">{c.base_fare} • {c.price_per_km}/km</span>
              </div>
            </CardContent></Card>
          );
        })}
      </div>
    </div>
  );
}
