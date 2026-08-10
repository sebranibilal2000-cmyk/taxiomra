import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Star, Car } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف أحجز تاكسي في الرياض؟", a: "احجز بسهولة عبر واتساب. نوفر توصيلاً من وإلى مطار الملك خالد وجميع أحياء الرياض." },
  { q: "هل تتوفر رحلات طويلة من الرياض؟", a: "نعم، نقدم خدمة النقل بين الرياض والمدن الأخرى عند الطلب." },
];

const FAQ_EN = [
  { q: "How to book a taxi in Riyadh?", a: "Book easily via WhatsApp. We provide transfers to/from KKIA and all Riyadh districts." },
  { q: "Are long-distance trips available from Riyadh?", a: "Yes, we offer inter-city transfers from Riyadh upon request." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-riyadh")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-riyadh`;
    const title = ar ? "تاكسي الرياض | حجز سيارة مع سائق - تاكسي العمرة" : "Taxi Riyadh | Professional Chauffeur - Omra Taxi";
    const description = ar ? "احجز تاكسي الرياض الآن. توصيل المطار، مشاوير داخل الرياض، ورحلات بين المدن." : "Book your Riyadh taxi. Airport transfers, city rides, and inter-city trips.";
    return {
      meta: [{ title }, { name: "description", content: description }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي الرياض" : "Taxi Riyadh", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) }
      ],
    };
  },
  component: () => <TaxiCityPage city={ {ar: "الرياض", en: "Riyadh"} } faqs={FAQ_AR} faqsEn={FAQ_EN} />,
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
