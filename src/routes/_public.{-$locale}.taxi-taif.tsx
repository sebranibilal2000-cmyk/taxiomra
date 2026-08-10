import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Mountain, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "هل توفرون توصيل من جدة أو مكة إلى الطائف؟", a: "نعم، نحن متخصصون في تقديم خدمة التوصيل المباشر من مطار الملك عبدالعزيز بجدة ومن فنادق مكة المكرمة إلى جميع مناطق الطائف (الهدا، الشفا، وسط المدينة) بسيارات حديثة مريحة." },
  { q: "هل تتوفر سيارات للرحلات السياحية في الطائف؟", a: "بالتأكيد، لدينا سائقون محترفون على دراية كاملة بأجمل المواقع السياحية والمنتزهات في الطائف مثل جبل دكا ومنتزه الردف لضمان جولة سياحية ممتعة." },
  { q: "ما هي أنواع السيارات المتاحة لرحلات الطائف؟", a: "نوفر سيارات سيدان مريحة، وسيارات دفع رباعي عائلية واسعة تناسب طبيعة الطرق الجبلية في الطائف، بالإضافة إلى فانات للمجموعات الكبيرة." },
  { q: "هل يمكن حجز استقبال من مطار الطائف الدولي؟", a: "نعم، نوفر خدمة الاستقبال والتوصيل من وإلى مطار الطائف الدولي لجميع الوجهات المحلية والمدن المجاورة." },
];

const FAQ_EN = [
  { q: "Do you offer transfers from Jeddah or Makkah to Taif?", a: "Yes, we specialize in providing direct transfer services from Jeddah KAIA and Makkah hotels to all areas of Taif (Al Hada, Ash Shafa, City Center) with modern comfortable vehicles." },
  { q: "Are cars available for sightseeing tours in Taif?", a: "Certainly, we have professional drivers who are fully aware of the most beautiful tourist sites and parks in Taif, such as Jabal Daka and Arruddaf Park, to ensure an enjoyable tour." },
  { q: "What types of vehicles are available for Taif trips?", a: "We provide comfortable sedans, spacious family SUVs suitable for Taif's mountain roads, and vans for large groups." },
  { q: "Can I book a pickup from Taif International Airport?", a: "Yes, we provide meet-and-greet and transfer services to and from Taif International Airport to all local destinations and neighboring cities." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-taif")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-taif`;
    const title = ar ? "تاكسي الطائف | توصيل من مطار جدة ومكة للطائف - تاكسي العمرة" : "Taif Taxi | Transfers from Jeddah & Makkah to Taif - Omra Taxi";
    const description = ar ? "احجز تاكسي الطائف الآن. رحلات عائلية وسياحية مريحة، توصيل من مطار جدة ومكة المكرمة إلى الطائف بأسعار ثابتة وأمان تام." : "Book Taif taxi now. Comfortable family and tourist trips, transfers from Jeddah Airport and Makkah to Taif with fixed prices and full safety.";
    return {
      meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الطائف" : "Taif Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "تاكسي الطائف" : "Taif Taxi", description, url, areaServed: "Taif" })) }
      ]
    };
  },
  component: TaifTaxiPage,
});

function TaifTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي الطائف" : "Taif Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي الطائف: بوابة المصيف" : "Taif Taxi: The Gateway to the Summer Capital"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "رحلات يومية وسياحية من جدة ومكة إلى الطائف. استمتع بأجواء الطائف الرائعة مع خدماتنا المتميزة." : "Daily and tourist trips from Jeddah and Makkah to Taif. Enjoy Taif's wonderful atmosphere with our premium services."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في الطائف" : "Book taxi in Taif")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Mountain, t_ar: "رحلات سياحية", t_en: "Tourist Trips" },
          { icon: MapPin, t_ar: "مكة ← الطائف", t_en: "Makkah → Taif", path: "/taxi-makkah" },
          { icon: Plane, t_ar: "مطار جدة ← الطائف", t_en: "Jeddah Airport → Taif", path: "/jeddah-airport-taxi" }
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
