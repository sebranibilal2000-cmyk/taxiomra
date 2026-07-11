import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: [
      { title: "Taxi Pricing — Fixed Fares & Transparent Rates" },
      { name: "description", content: "Transparent taxi pricing: fixed airport fares, per-km city rates, and corporate contracts. No hidden fees." },
      { property: "og:title", content: "Pricing — Sur3a Taxi" },
      { property: "og:description", content: "Fixed airport fares, city rates, corporate contracts. No hidden fees." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const plans = [
    { name_ar: "الرحلات داخل المدينة", name_en: "City Rides", price: "15", unit_ar: "بداية السعر", unit_en: "starting", features_ar: ["أجرة ابتدائية", "سعر لكل كيلومتر", "متاح ٢٤ ساعة", "دفع نقدي أو بطاقة"], features_en: ["Base fare", "Per-km rate", "24/7 available", "Cash or card"] },
    { name_ar: "نقل المطار", name_en: "Airport Transfer", price: "80", unit_ar: "سعر ثابت", unit_en: "fixed", popular: true, features_ar: ["سعر ثابت مسبقاً", "تتبع الرحلات", "انتظار مجاني ١٥د", "استقبال في الصالة"], features_en: ["Pre-set fixed price", "Flight tracking", "15 min free wait", "Meet & greet"] },
    { name_ar: "عقود الشركات", name_en: "Corporate", price: "—", unit_ar: "حسب العقد", unit_en: "per contract", features_ar: ["فوترة شهرية", "سائق مخصص", "أولوية الحجز", "تقارير الرحلات"], features_en: ["Monthly billing", "Dedicated driver", "Priority booking", "Trip reports"] },
  ];
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "الأسعار" : "Pricing"}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{ar ? "أسعار شفافة بدون أي رسوم مخفية" : "Transparent pricing with no hidden fees"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name_en} className={p.popular ? "border-primary shadow-lg relative" : ""}>
            {p.popular && <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1">{ar ? "الأكثر طلباً" : "Most popular"}</div>}
            <CardContent className="pt-8 pb-6">
              <h3 className="font-bold text-xl mb-2">{ar ? p.name_ar : p.name_en}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{ar ? p.unit_ar : p.unit_en}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {(ar ? p.features_ar : p.features_en).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> {f}</li>
                ))}
              </ul>
              <Button asChild className="w-full"><a href={waLink()} target="_blank" rel="noopener">{ar ? "احجز الآن" : "Book now"}</a></Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center text-sm text-muted-foreground">
        {ar ? "الأسعار قد تتغير بحسب الطلب، الليل، وموقع الرحلة. للتأكد من السعر تواصل معنا." : "Prices may vary based on demand, night hours, and route. Contact us for exact quotes."}
      </div>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button asChild className="bg-green-600 hover:bg-green-700"><a href={waLink()} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4 me-2" />WhatsApp</a></Button>
        <Button asChild variant="outline"><a href={telLink()}><Phone className="h-4 w-4 me-2" />{SITE.phone}</a></Button>
      </div>
    </div>
  );
}
