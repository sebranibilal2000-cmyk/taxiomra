import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";


const FAQ_AR = [
  { q: "هل توفرون استقبال من مطار الملك خالد بالرياض (RUH)؟", a: "نعم، نقدم خدمة الاستقبال بالاسم والتوصيل الاحترافي من وإلى مطار الملك خالد الدولي لجميع أحياء الرياض، الفنادق، ومركز الملك عبدالله المالي." },
  { q: "ما هي مناطق التغطية لتاكسي الرياض؟", a: "نخدم جميع أحياء العاصمة بما في ذلك المناطق التجارية الكبرى (العليا، النخيل، الملقا) والمناطق السياحية مثل الدرعية، بالإضافة إلى الرحلات الطويلة خارج المدينة." },
  { q: "هل لديكم رحلات من الرياض إلى مكة المكرمة؟", a: `نعم، نوفر سيارات حديثة فاخرة ومريحة مخصصة للرحلات الطويلة بين الرياض ومكة المكرمة (بأسعار تبدأ من ${getPriceForRoute('riyadh-makkah') || 'اطلب السعر'}).` },
  { q: "هل تتوفر خدمات النقل لرجال الأعمال في الرياض؟", a: "بالتأكيد، نوفر سيارات فاخرة وسائقين محترفين للتنقل بين الاجتماعات والمؤتمرات داخل مدينة الرياض مع الالتزام التام بالمواعيد." },
];

const FAQ_EN = [
  { q: "Do you provide airport pickups at King Khalid Airport (RUH)?", a: "Yes, we offer meet-and-greet services and professional transfers to and from King Khalid International Airport for all Riyadh districts, hotels, and KAFD." },
  { q: "What are the coverage areas for Riyadh Taxi?", a: "We serve all capital districts, including major business areas (Olaya, An Nakheel, Al Malqa), tourist sites like Diriyah, and long-distance trips outside the city." },
  { q: "Do you have trips from Riyadh to Makkah?", a: `Yes, we provide modern luxury cars for long-distance trips between Riyadh and Makkah (from ${getPriceForRoute('riyadh-makkah') || 'Request Quote'}).` },
  { q: "Are business transport services available in Riyadh?", a: "Certainly, we provide premium cars and professional drivers for transit between meetings and conferences within Riyadh with full commitment to punctuality." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-riyadh")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-riyadh`;
    const title = ar ? "تاكسي الرياض | حجز توصيل مطار الرياض والرحلات الطويلة - تاكسي العمرة" : "Riyadh Taxi | Riyadh Airport & City Transfers - Umrah Taxi Saudi";
    const description = ar ? "احجز تاكسي الرياض الآن. خدمات توصيل احترافية داخل العاصمة، استقبال من مطار الملك خالد، ورحلات بين المدن بسيارات فاخرة وحديثة." : "Book your private Riyadh taxi for King Khalid Airport (RUH) pickups, business district transfers, and hotel drop-offs. Professional 24/7 private transportation in Riyadh.";
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
