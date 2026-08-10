import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Star, Car } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف أحجز تاكسي في الطائف؟", a: "احجز بسهولة عبر واتساب. نوفر توصيلاً من وإلى مطار الطائف، المعالم السياحية، ومكة المكرمة." },
  { q: "هل تتوفر رحلات من الطائف إلى مكة؟", a: "نعم، نقدم رحلات مباشرة ومريحة بين الطائف ومكة المكرمة." },
];

const FAQ_EN = [
  { q: "How to book a taxi in Taif?", a: "Book easily via WhatsApp. We provide transfers to/from Taif Airport, tourist spots, and Makkah." },
  { q: "Are trips from Taif to Makkah available?", a: "Yes, we offer comfortable direct trips between Taif and Makkah." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-taif")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-taif`;
    const title = ar ? "تاكسي الطائف | حجز توصيل سريع ومريح - تاكسي العمرة" : "Taxi Taif | Reliable Transfers - Omra Taxi";
    const description = ar ? "احجز تاكسي الطائف الآن. توصيل المطار، جولات سياحية، ورحلات إلى مكة بسيارات حديثة." : "Book your Taif taxi. Airport transfers, sightseeing, and Makkah trips with modern cars.";
    return {
      meta: [{ title }, { name: "description", content: description }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الطائف" : "Taxi Taif", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) }
      ],
    };
  },
  component: () => <TaxiCityPage city={ {ar: "الطائف", en: "Taif"} } faqs={FAQ_AR} faqsEn={FAQ_EN} />,
});

function TaxiCityPage({ city, faqs, faqsEn }: { city: { ar: string; en: string }, faqs: any[], faqsEn: any[] }) {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl mb-6">{ar ? `تاكسي ${city.ar}` : `Taxi ${city.en}`}</h1>
        <p className="text-lg text-muted-foreground">{ar ? `خدمة نقل مريحة في ${city.ar}، احجز رحلتك الآن.` : `Reliable transport in ${city.en}, book your ride now.`}</p>
        <div className="flex gap-4 mt-6">
           <Button asChild><a href={waLink()}><MessageCircle className="me-2"/>{ar ? "واتساب" : "WhatsApp"}</a></Button>
        </div>
      </header>
      <section className="space-y-6">
        {(ar ? faqs : faqsEn).map((f, i) => (
          <div key={i} className="p-6 border rounded-2xl bg-card">
            <h3 className="font-bold mb-2">{f.q}</h3>
            <p className="text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
