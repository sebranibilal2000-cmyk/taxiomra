import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";

const FAQ_AR = [
  { q: "هل توفرون توصيل من الطائف إلى مكة المكرمة؟", a: "نعم، نقدم خدمة توصيل خاصة وآمنة من مدينة الطائف إلى مكة المكرمة، تشمل الاستقبال من الفنادق أو المواقع المحددة." },
  { q: "كيف أحجز سيارة من الطائف إلى مكة؟", a: "يمكنك الحجز بسهولة عبر واتساب، وسيقوم فريقنا بتأكيد تفاصيل الرحلة وتوفير السيارة المناسبة في الوقت المحدد." },
];

const FAQ_EN = [
  { q: "Do you offer transfers from Taif to Makkah?", a: "Yes, we provide private and safe transfer services from the city of Taif to Makkah, including pickups from hotels or specific locations." },
  { q: "How can I book a taxi from Taif to Makkah?", a: "You can book easily via WhatsApp, and our team will confirm the trip details and provide the appropriate vehicle at the scheduled time." },
];

export const Route = createFileRoute("/_public/{-$locale}/taif-to-makkah-taxi")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taif-to-makkah-taxi`;
    const title = ar ? "تاكسي من الطائف إلى مكة | حجز خاص - تاكسي العمرة" : "Taif to Makkah Taxi | Private Transfer - Umrah Taxi Saudi";
    const description = ar ? "احجز تاكسي من الطائف إلى مكة المكرمة. خدمة توصيل آمنة وموثوقة لجميع رحلاتك بين المدن." : "Book your private Taif to Makkah taxi. Safe and reliable transfer service for your intercity travel.";
    return {
      meta: [
        { title }, { name: "description", content: description }, 
        { property: "og:title", content: title }, { property: "og:description", content: description }, 
        { property: "og:url", content: url },
        { name: "keywords", content: ar ? "توصيل من الطائف الى مكة، تاكسي الطائف مكة" : "Taif to Makkah taxi, Taif to Makkah transfer, taxi from Taif to Makkah" }
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الطائف إلى مكة" : "Taif to Makkah Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "توصيل من الطائف إلى مكة" : "Taif to Makkah Taxi", description, url, areaServed: "Makkah" })) }
      ]
    };
  },
  component: TaifToMakkahTaxiPage,
});

function TaifToMakkahTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي الطائف إلى مكة" : "Taif to Makkah Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي من الطائف إلى مكة" : "Taif to Makkah Taxi"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "خدمة توصيل خاصة ومباشرة من الطائف إلى مكة المكرمة. نوفر لك الراحة والأمان في طريق عودتك." : "Direct and private taxi service from Taif to Makkah. We provide comfort and safety for your return journey."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي من الطائف إلى مكة" : "Book taxi from Taif to Makkah")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
    </article>
  );
}
