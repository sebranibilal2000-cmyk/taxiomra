import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPricingData } from "@/lib/pricing.functions";
import { useI18n, withLocale } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Car, Info } from "lucide-react";
import { SITE, waLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";

const FAQ = [
  { q_ar: "كم سعر التاكسي من مكة إلى جدة؟", a_ar: `يبدأ السعر من ${getPriceForRoute('makkah-jeddah-apt', 'sedan') || '190'} ريال لسيارة السيدان. نؤكد السعر النهائي قبل الرحلة.`, q_en: "How much is a taxi from Makkah to Jeddah?", a_en: `Fares start from ${getPriceForRoute('makkah-jeddah-apt', 'sedan') || '190'} SAR for a sedan. We confirm the final fare before your trip.` },
  { q_ar: "هل الأسعار ثابتة؟", a_ar: "نعم، جميع الأسعار ثابتة ومعروفة مسبقاً قبل الحجز.", q_en: "Are fares fixed?", a_en: "Yes, all fares are fixed and known before you book." }
];

export const Route = createFileRoute("/_public/{-$locale}/guide/taxi-fares")({
  loader: ({ context }) => context.queryClient.ensureQueryData({
    queryKey: ["pricing-data"],
    queryFn: getPricingData,
  }),
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const title = ar ? "دليل أسعار تاكسي العمرة" : "Omra Taxi Fare Guide";
    return {
      meta: [{ title }, { name: "description", content: ar ? "شاهد أسعارنا الشاملة لجميع المسارات والمطارات." : "View our comprehensive fare guide for all routes and airports." }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(FAQ.map(f => ({ q: ar ? f.q_ar : f.q_en, a: ar ? f.a_ar : f.a_en })))) }
      ]
    };
  },
  component: PricingPage,
});

function PricingPage() {
  const { data: routes } = useSuspenseQuery({ queryKey: ["pricing-data"], queryFn: getPricingData });
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all", label: ar ? "الكل" : "All" },
    { id: "jeddah", label: ar ? "جدة" : "Jeddah" },
    { id: "makkah", label: ar ? "مكة" : "Makkah" },
    { id: "madinah", label: ar ? "المدينة" : "Madinah" },
    { id: "taif", label: ar ? "الطائف" : "Taif" },
    { id: "airport", label: ar ? "المطارات" : "Airports" },
  ];

  const filtered = routes.filter((r) => 
    (r.from_ar + r.from_en + r.to_ar + r.to_en).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <article className="container py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display mb-4">{ar ? "دليل أسعار Taxiomra" : "Taxiomra Fare Guide"}</h1>
        <p className="text-muted-foreground">{ar ? "أسعارنا ثابتة، شفافة، وبدون رسوم مخفية." : "Transparent, fixed fares, with no hidden fees."}</p>
      </header>

      <div className="max-w-md mx-auto mb-12 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input className="pl-10" placeholder={ar ? "ابحث عن مسار..." : "Search route..."} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap justify-center mb-8">
          {categories.map((c) => <TabsTrigger key={c.id} value={c.id} className="px-6">{c.label}</TabsTrigger>)}
        </TabsList>
        {categories.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <div className="grid gap-4">
              {filtered.filter(r => c.id === "all" || r.category === c.id).map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-lg font-medium">{ar ? `${r.from_ar} ← ${r.to_ar}` : `${r.from_en} → ${r.to_en}`}</div>
                    <div className="flex gap-4 text-sm font-semibold">
                      {r.sedan && <span className="text-muted-foreground">{ar ? "سيدان:" : "Sedan:"} <span className="text-gold">{r.sedan}</span></span>}
                      {r.suv && <span className="text-muted-foreground">SUV: <span className="text-gold">{r.suv}</span></span>}
                      {r.van && <span className="text-muted-foreground">{ar ? "فان:" : "Van:"} <span className="text-gold">{r.van}</span></span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-16 bg-muted p-8 rounded-2xl">
        <h2 className="text-2xl font-display mb-6">{ar ? "أسئلة شائعة" : "FAQs"}</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold mb-2">{ar ? f.q_ar : f.q_en}</h3>
            <p className="text-muted-foreground">{ar ? f.a_ar : f.a_en}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
