import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";

const FAQ_AR = [
  { q: "هل تتوفر خدمة تاكسي من مكة إلى الطائف؟", a: "نعم، نقدم رحلات خاصة ومريحة من فنادق مكة المكرمة إلى مدينة الطائف السياحية، مع خيارات سيارات مناسبة للطرق الجبلية." },
  { q: "ما هي مدة الرحلة من مكة إلى الطائف؟", a: "تستغرق الرحلة حوالي ساعة ونصف إلى ساعتين حسب الوجهة المحددة داخل الطائف وحركة المرور." },
  { q: "هل يمكنني حجز رحلة يومية سياحية للطائف؟", a: "نعم، يمكنك التنسيق معنا للحجز لرحلة يومية مريحة لاستكشاف معالم الطائف والعودة." },
];

const FAQ_EN = [
  { q: "Is there a taxi service from Makkah to Taif?", a: "Yes, we offer private and comfortable transfers from Makkah hotels to Taif, with vehicle options suitable for mountain roads." },
  { q: "How long is the trip from Makkah to Taif?", a: "The trip usually takes around 1.5 to 2 hours depending on traffic and your specific destination in Taif." },
  { q: "Can I book a private day trip to Taif?", a: "Yes, you can coordinate with us to book a comfortable day trip to explore Taif's landmarks and return." },
];

export const Route = createFileRoute("/_public/{-$locale}/makkah-to-taif-taxi")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/makkah-to-taif-taxi`;
    const title = ar ? "تاكسي من مكة إلى الطائف | توصيل خاص بأسعار ثابتة - تاكسي العمرة" : "Makkah to Taif Taxi | Private Transfers - Umrah Taxi Saudi";
    const description = ar ? "احجز تاكسي من مكة إلى الطائف. خدمة توصيل مريحة بسيارات مهيأة للطرق الجبلية. احجز رحلتك الآن مع تاكسي العمرة." : "Private Makkah to Taif taxi transfers. Comfortable and reliable service for your trip to the mountains. Book your transfer today.";
    return {
      meta: [
        { title }, { name: "description", content: description }, 
        { property: "og:title", content: title }, { property: "og:description", content: description }, 
        { property: "og:url", content: url },
        { name: "keywords", content: ar ? "توصيل من مكة الى الطائف، تاكسي مكة الطائف، حجز سيارة لمكة الطائف" : "Makkah to Taif taxi, Makkah to Taif transfer, taxi from Makkah to Taif, private transfer Makkah to Taif" }
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي مكة إلى الطائف" : "Makkah to Taif Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "توصيل من مكة إلى الطائف" : "Makkah to Taif Taxi", description, url, areaServed: "Taif" })) }
      ]
    };
  },
  component: MakkahToTaifTaxiPage,
});

function MakkahToTaifTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي مكة إلى الطائف" : "Makkah to Taif Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي من مكة إلى الطائف" : "Makkah to Taif Taxi"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "استمتع برحلة مريحة من أجواء مكة الحارة إلى مرتفعات الطائف الباردة. نوفر لك سيارات آمنة للطرق الجبلية." : "Travel comfortably from Makkah to the cool mountains of Taif. We offer safe vehicles designed for mountain roads."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي من مكة إلى الطائف" : "Book taxi from Makkah to Taif")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
    </article>
  );
}
