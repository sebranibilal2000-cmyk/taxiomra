import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listCmsPages, listTestimonials, listFaqs } from "@/lib/public.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Clock, Shield, MapPin, CreditCard, Star, ArrowRight, Plane, Building2, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";

const homeOpts = () => queryOptions({
  queryKey: ["public", "home"],
  queryFn: async () => ({
    services: await listCmsPages({ data: { type: "service" } }),
    airports: await listCmsPages({ data: { type: "airport" } }),
    cities: await listCmsPages({ data: { type: "city" } }),
    testimonials: await listTestimonials(),
    faqs: await listFaqs(),
  }),
});

export const Route = createFileRoute("/_public/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeOpts()),
  head: () => ({
    meta: [
      { title: "Sur3a Taxi — Book a Taxi 24/7 via WhatsApp or Phone" },
      { name: "description", content: "Professional taxi service. Book 24/7 via WhatsApp or phone. Airport transfers, hotel pickups, corporate contracts. Fixed fares, pro drivers." },
      { property: "og:title", content: "Sur3a Taxi — 24/7 Taxi Booking" },
      { property: "og:description", content: "Book a taxi in seconds via WhatsApp or phone. Airport transfers, city rides, corporate contracts." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(homeOpts());

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Clock className="h-3.5 w-3.5" /> {SITE.hours[locale]}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {ar ? "احجز تاكسي في ثوانٍ عبر الواتساب أو الاتصال" : "Book a taxi in seconds via WhatsApp or phone"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              {ar
                ? "خدمة تاكسي احترافية على مدار الساعة — نقل مطار، نقل فنادق، عقود شركات، سائقون معتمدون وأسعار ثابتة."
                : "Professional 24/7 taxi service — airport transfers, hotel pickups, corporate contracts, licensed drivers and fixed fares."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href={waLink(ar ? "أرغب بحجز تاكسي" : "I'd like to book a taxi")} target="_blank" rel="noopener">
                  <MessageCircle className="h-5 w-5 me-2" /> {ar ? "احجز عبر واتساب" : "Book on WhatsApp"}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={telLink()}>
                  <Phone className="h-5 w-5 me-2" /> {SITE.phone}
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />{ar ? "سائقون معتمدون" : "Licensed drivers"}</span>
              <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />{ar ? "أسعار ثابتة" : "Fixed fares"}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{ar ? "تغطية واسعة" : "Citywide coverage"}</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
              <div className="text-primary-foreground/90 text-9xl font-black">🚕</div>
            </div>
            <div className="absolute -bottom-6 -start-6 bg-card border rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="text-sm">
                <div className="font-bold">{ar ? "استجابة فورية" : "Instant response"}</div>
                <div className="text-muted-foreground">{ar ? "خلال دقيقة عبر واتساب" : "Under 1 min on WhatsApp"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{ar ? "خدماتنا" : "Our Services"}</h2>
          <p className="text-muted-foreground mt-3">
            {ar ? "حلول نقل شاملة تلبي احتياجات كل عميل" : "Complete transfer solutions for every kind of trip"}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Plane, slug: "airport-transfer", ar: "نقل المطار", en: "Airport Transfer", desc_ar: "توصيل من وإلى المطار على مدار الساعة", desc_en: "24/7 pickup and drop-off to any airport" },
            { icon: Building2, slug: "hotel-transfer", ar: "نقل الفنادق", en: "Hotel Transfers", desc_ar: "خدمة مخصصة لضيوف الفنادق", desc_en: "Dedicated hotel guest transfers" },
            { icon: Briefcase, slug: "corporate", ar: "نقل الشركات", en: "Corporate Transfers", desc_ar: "عقود شهرية وحلول للشركات", desc_en: "Monthly contracts and business solutions" },
          ].map((s) => (
            <Link key={s.slug} to="/p/$slug" params={{ slug: s.slug }}>
              <Card className="h-full hover:border-primary hover:shadow-lg transition-all group">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{ar ? s.ar : s.en}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{ar ? s.desc_ar : s.desc_en}</p>
                  <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                    {ar ? "اعرف المزيد" : "Learn more"} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities */}
      {data.cities.length > 0 && (
        <section className="bg-muted/30 border-y">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-2">{ar ? "المدن التي نخدمها" : "Cities we cover"}</h2>
            <p className="text-muted-foreground mb-8">{ar ? "خدمة تاكسي في مدنك المفضلة" : "Reliable taxi service in your favorite cities"}</p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.cities.map((c) => (
                <Link key={c.id} to="/p/$slug" params={{ slug: c.slug }} className="rounded-xl border bg-card p-5 hover:border-primary hover:shadow-md transition">
                  <MapPin className="h-5 w-5 text-primary mb-2" />
                  <div className="font-semibold">{ar ? c.title_ar : c.title_en}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{ar ? c.subtitle_ar : c.subtitle_en}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">{ar ? "ماذا يقول عملاؤنا" : "What our customers say"}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {data.testimonials.slice(0, 3).map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4">"{ar ? t.quote_ar : t.quote_en}"</p>
                  <div className="text-sm">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-muted-foreground text-xs">{ar ? t.role_ar : t.role_en}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* FAQ preview */}
      {data.faqs.length > 0 && (
        <section className="bg-muted/30 border-y">
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">{ar ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h2>
            <Accordion type="single" collapsible className="bg-card rounded-xl border">
              {data.faqs.slice(0, 4).map((f) => (
                <AccordionItem key={f.id} value={f.id} className="px-4">
                  <AccordionTrigger className="text-start">{ar ? f.question_ar : f.question_en}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{ar ? f.answer_ar : f.answer_en}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-6">
              <Button asChild variant="outline"><Link to="/faq">{ar ? "كل الأسئلة" : "See all questions"}</Link></Button>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-10 md:p-16 text-primary-foreground text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ar ? "جاهز لحجز رحلتك؟" : "Ready to book your ride?"}</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            {ar ? "تواصل معنا الآن عبر الواتساب أو الاتصال المباشر — استجابة فورية على مدار الساعة."
              : "Reach out now via WhatsApp or a direct call — instant response, 24/7."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
              <a href={waLink()} target="_blank" rel="noopener"><MessageCircle className="h-5 w-5 me-2" />WhatsApp</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={telLink()}><Phone className="h-5 w-5 me-2" />{SITE.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
