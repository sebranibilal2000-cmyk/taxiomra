import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "هل توفرون استقبال من مطار الملك خالد بالرياض؟", a: "نعم، نقدم خدمة الاستقبال والتوصيل من وإلى مطار الملك خالد الدولي لجميع أحياء الرياض." },
  { q: "هل لديكم رحلات بين الرياض ومكة؟", a: "نعم، نوفر سيارات حديثة مخصصة للرحلات الطويلة بين الرياض ومكة المكرمة بأسعار تنافسية." },
];

const FAQ_EN = [
  { q: "Do you provide airport pickups at King Khalid Airport?", a: "Yes, we offer meet and greet transfer services to and from King Khalid International Airport for all Riyadh districts." },
  { q: "Do you have trips between Riyadh and Makkah?", a: "Yes, we provide modern cars dedicated for long-distance trips between Riyadh and Makkah at competitive prices." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-riyadh")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-riyadh`;
    const title = ar ? "تاكسي الرياض | حجز توصيل مطار الرياض والرحلات الطويلة - تاكسي العمرة" : "Riyadh Taxi | Book Riyadh Airport & Long Distance Transfers - Omra Taxi";
    const description = ar ? "احجز تاكسي الرياض الآن. خدمات توصيل احترافية داخل العاصمة، استقبال من مطار الملك خالد، ورحلات بين المدن بسيارات فاخرة وحديثة." : "Book Riyadh taxi now. Professional transfer services within the capital, King Khalid Airport meet & greet, and inter-city trips with luxury modern cars.";
    return {
      meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الرياض" : "Riyadh Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "تاكسي الرياض" : "Riyadh Taxi", description, url, areaServed: "Riyadh" })) }
      ]
    };
  },
  component: RiyadhTaxiPage,
});

function RiyadhTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي الرياض" : "Riyadh Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي الرياض: تنقل بذكاء في العاصمة" : "Riyadh Taxi: Travel Smart in the Capital"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "نوفر لك حلول تنقل متكاملة في مدينة الرياض، من المطار وإلى أي وجهة داخل أو خارج المدينة." : "We provide integrated mobility solutions in Riyadh, from the airport to any destination inside or outside the city."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في الرياض" : "Book taxi in Riyadh")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Plane, t_ar: "مطار الملك خالد", t_en: "King Khalid Airport" },
          { icon: Building2, t_ar: "أحياء الرياض", t_en: "Riyadh Districts" },
          { icon: MapPin, t_ar: "رحلات بين المدن", t_en: "Inter-City Trips", path: "/taxi-makkah" }
        ].map((s, i) => (
          <div key={i} className="p-6 border rounded-2xl bg-card">
            {s.path ? (
              <Link to={withLocale(locale, s.path)} className="group">
                <s.icon className="h-10 w-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold group-hover:text-gold transition-colors">{ar ? s.t_ar : s.t_en}</h3>
              </Link>
            ) : (
              <>
                <s.icon className="h-10 w-10 text-gold mb-4" />
                <h3 className="font-bold">{ar ? s.t_ar : s.t_en}</h3>
              </>
            )}
          </div>
        ))}
      </section>
    </article>
  );
}
