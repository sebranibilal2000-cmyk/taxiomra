import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPricingData } from "@/lib/pricing.functions";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_public/{-$locale}/guide/taxi-fares")({
  loader: ({ context }) => context.queryClient.ensureQueryData({
    queryKey: ["pricing-data"],
    queryFn: getPricingData,
  }),
  component: PricingPage,
});

function PricingPage() {
  const { data: routes } = useSuspenseQuery({
    queryKey: ["pricing-data"],
    queryFn: getPricingData,
  });
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
    { id: "intercity", label: ar ? "بين المدن" : "Intercity" },
  ];

  const filtered = routes.filter((r) => {
    const matchesSearch =
      r.from_ar.includes(search) || r.from_en.toLowerCase().includes(search.toLowerCase()) ||
      r.to_ar.includes(search) || r.to_en.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-display text-center mb-8">{ar ? "دليل أسعار Taxiomra" : "Taxiomra Fare Guide"}</h1>
      
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          className="pl-10" 
          placeholder={ar ? "ابحث عن مسار (مثال: مطار جدة)..." : "Search route (e.g. Jeddah Airport)..."} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap justify-center mb-8 h-auto">
          {categories.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="px-6">{c.label}</TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <div className="grid gap-4">
              {filtered.filter(r => c.id === "all" || r.category === c.id).map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-lg font-medium">{ar ? `${r.from_ar} ← ${r.to_ar}` : `${r.from_en} → ${r.to_en}`}</div>
                    <div className="flex gap-4 text-sm font-semibold text-gold">
                      {r.sedan && <span>سيدان: {r.sedan}</span>}
                      {r.suv && <span>SUV: {r.suv}</span>}
                      {r.van && <span>فان: {r.van}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
