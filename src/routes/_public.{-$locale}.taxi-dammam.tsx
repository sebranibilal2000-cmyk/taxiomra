import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "هل توفرون خدمة التوصيل لمطار الدمام؟", a: "نعم، نقدم خدمة التوصيل والاستقبال من مطار الملك فهد الدولي بالدمام لجميع مدن المنطقة الشرقية." },
  { q: "هل تتوفر رحلات من الدمام إلى مكة؟", a: "نعم، نوفر خدمة الرحلات الطويلة من المنطقة الشرقية إلى مكة المكرمة والمدينة المنورة بسيارات مريحة." },
];

const FAQ_EN = [
  { q: "Do you provide transfers to Dammam Airport?", a: "Yes, we offer transfer and meet-and-greet services from King Fahd International Airport in Dammam to all Eastern Province cities." },
  { q: "Are there trips from Dammam to Makkah?", a: "Yes, we provide long-distance trip services from the Eastern Province to Makkah and Madinah with comfortable vehicles." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-dammam")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-dammam`;
    const title = ar ? "تاكسي الدمام | توصيل مطار الملك فهد والمنطقة الشرقية - تاكسي العمرة" : "Dammam Taxi | King Fahd Airport & Eastern Province Transfers - Omra Taxi";
    const description = ar ? "احجز تاكسي الدمام الآن. خدمة موثوقة في المنطقة الشرقية، توصيل من مطار الملك فهد، ورحلات لجميع مناطق المملكة بأسعار ثابتة." : "Book Dammam taxi now. Reliable service in the Eastern Province, King Fahd Airport transfers, and trips to all regions of the Kingdom at fixed rates.";
    return {
      meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الدمام" : "Dammam Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "تاكسي الدمام" : "Dammam Taxi", description, url, areaServed: "Dammam" })) }
      ]
    };
  },
  component: DammamTaxiPage,
});

function DammamTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي الدمام" : "Dammam Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي الدمام: خيارك الموثوق في الشرقية" : "Dammam Taxi: Your Reliable Choice in the East"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "خدمات توصيل متميزة في مدينة الدمام، الخبر، والظهران. استقبال من المطار وتوصيل لكل وجهاتكم." : "Premium transfer services in Dammam, Khobar, and Dhahran. Airport pickups and transfers to all your destinations."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في الدمام" : "Book taxi in Dammam")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Plane, t_ar: "مطار الملك فهد", t_en: "King Fahd Airport" },
          { icon: Building2, t_ar: "المنطقة الشرقية", t_en: "Eastern Province" },
          { icon: MapPin, t_ar: "رحلات بين المدن", t_en: "Inter-City Trips", path: "/taxi-riyadh" }
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
