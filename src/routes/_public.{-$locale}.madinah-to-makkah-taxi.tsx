import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";

const FAQ_AR = [
  { q: "كم تستغرق الرحلة من المدينة إلى مكة بالتاكسي؟", a: "تستغرق الرحلة حوالي 4 إلى 5 ساعات عبر طريق الهجرة السريع، مع توفير سيارات مريحة ومكيفة." },
  { q: "هل يمكن حجز استقبال من مطار المدينة (MED)؟", a: "نعم، نقدم خدمة استقبال احترافية من مطار المدينة المنورة وتوصيل مباشر إلى فنادق مكة المكرمة." },
  { q: "هل الخدمة متاحة للعائلات؟", a: "بالتأكيد، نوفر خيارات واسعة من السيارات العائلية والفانات التي تتسع لجميع أفراد الأسرة مع حقائبهم." },
];

const FAQ_EN = [
  { q: "How long is the taxi ride from Madinah to Makkah?", a: "The journey takes approximately 4 to 5 hours via the Al-Hijrah Highway, with comfortable, air-conditioned vehicles for your Umrah transfer." },
  { q: "Can I book a pickup from Madinah Airport (MED)?", a: "Yes, we offer professional meet-and-greet services from Madinah Airport and direct transfers to your hotel in Makkah." },
  { q: "Is this service suitable for families?", a: "Absolutely, we provide a wide range of family vehicles and vans that can comfortably accommodate your family and luggage." },
];

export const Route = createFileRoute("/_public/{-$locale}/madinah-to-makkah-taxi")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/madinah-to-makkah-taxi`;
    const title = ar 
      ? "تاكسي من المدينة إلى مكة | توصيل خاص بأسعار ثابتة - تاكسي العمرة" 
      : "Madinah to Makkah Taxi | Private Umrah Transfer - Umrah Taxi Saudi";
    const description = ar 
      ? "احجز تاكسي من المدينة المنورة إلى مكة المكرمة. خدمة توصيل خاصة، سيارات حديثة، سائقون محترفون لرحلة آمنة ومريحة بين الحرمين." 
      : "Book your private Madinah to Makkah taxi for a smooth and safe Umrah transfer. Professional chauffeurs, modern vehicles, and 24/7 service.";
    return {
      meta: [
        { title }, { name: "description", content: description }, 
        { property: "og:title", content: title }, { property: "og:description", content: description }, 
        { property: "og:url", content: url },
        { name: "keywords", content: ar 
          ? "توصيل من المدينة الى مكة، تاكسي المدينة مكة، حجز سيارة من المدينة الى مكة" 
          : "Madinah to Makkah taxi, Madinah to Makkah transfer, taxi from Madinah to Makkah, private transfer Madinah to Makkah" }
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي المدينة إلى مكة" : "Madinah to Makkah Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "توصيل من المدينة إلى مكة" : "Madinah to Makkah Taxi", description, url, areaServed: "Makkah" })) }
      ]
    };
  },
  component: MadinahToMakkahTaxiPage,
});

function MadinahToMakkahTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي المدينة إلى مكة" : "Madinah to Makkah Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي من المدينة المنورة إلى مكة" : "Madinah to Makkah Taxi"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "نقل خاص ومريح بين أطهر بقاع الأرض. خدمة موثوقة من المدينة إلى مكة بسيارات حديثة." : "Safe and comfortable private transfer between the two holy cities. Reliable Madinah to Makkah taxi services for your spiritual journey."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي من المدينة إلى مكة" : "Book taxi from Madinah to Makkah")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
    </article>
  );
}
