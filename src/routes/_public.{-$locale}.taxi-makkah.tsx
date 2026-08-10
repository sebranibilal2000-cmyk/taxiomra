import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف أحجز تاكسي في مكة؟", a: "يمكنك حجز تاكسي مكة عبر واتساب أو الاتصال. نوفر رحلات داخل مكة، من وإلى الحرم، ومن وإلى مطار جدة." },
  { q: "هل لديكم توصيل من مطار جدة إلى فنادق مكة؟", a: "نعم، نقدم خدمة توصيل مباشرة ومريحة من مطار الملك عبدالعزيز بجدة إلى جميع فنادق مكة المكرمة." },
  { q: "هل السيارات مهيأة للرحلات العائلية في مكة؟", a: "نعم، نوفر سيارات عائلية واسعة ومريحة لضمان راحة عائلتك خلال زيارة مكة." },
];

const FAQ_EN = [
  { q: "How can I book a taxi in Makkah?", a: "You can book a Makkah taxi via WhatsApp or phone. We offer trips within Makkah, to/from the Haram, and transfers to/from Jeddah Airport." },
  { q: "Do you provide transfers from Jeddah Airport to Makkah hotels?", a: "Yes, we offer direct and comfortable transfer services from King Abdulaziz International Airport in Jeddah to all hotels in Makkah." },
  { q: "Are vehicles suitable for family trips in Makkah?", a: "Yes, we provide spacious and comfortable family vehicles to ensure your family's comfort during your visit to Makkah." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-makkah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-makkah`;
    const title = ar ? "تاكسي مكة | توصيل للحرم وفنادق مكة - تاكسي العمرة" : "Makkah Taxi | Haram & Hotel Transfers - Omra Taxi";
    const description = ar ? "احجز تاكسي مكة للتنقل داخل المدينة أو من مطار جدة. خدمة موثوقة لزوار الحرم والعائلات بأسعار ثابتة. سيارات حديثة وسائقون محترفون." : "Book a Makkah taxi for city transfers or from Jeddah Airport. Reliable service for Haram visitors and families with fixed rates. Modern cars and professional drivers.";
    return {
      meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي مكة" : "Makkah Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "تاكسي مكة" : "Makkah Taxi", description, url, areaServed: "Makkah" })) }
      ]
    };
  },
  component: MakkahTaxiPage,
});

function MakkahTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي مكة" : "Makkah Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي مكة المكرمة: تنقل بكل روحانية" : "Makkah Taxi: Travel with Spirit"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "خدمة توصيل مريحة وموثوقة داخل مكة ومن مطار جدة. هدفنا راحتك وسلامتك." : "Comfortable and reliable transfer service within Makkah and from Jeddah airport. Your comfort and safety are our goal."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في مكة" : "Book taxi in Makkah")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Car, t_ar: "تنقل داخل مكة", t_en: "In-City Transfer" },
          { icon: Building2, t_ar: "توصيل للفنادق", t_en: "Hotel Transfers" },
          { icon: Plane, t_ar: "مطار جدة ← مكة", t_en: "Jeddah Airport → Makkah", path: "/jeddah-airport-taxi" }
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
      <section className="bg-gold/10 p-8 rounded-2xl border border-gold/20">
        <h2 className="text-2xl font-bold mb-4">{ar ? "لماذا تاكسي العمرة في مكة؟" : "Why Omra Taxi in Makkah?"}</h2>
        <ul className="space-y-3">
          {[ar ? "سائقون ذو خبرة بطرق مكة" : "Experienced drivers in Makkah roads", ar ? "أسعار واضحة ومنافسة" : "Competitive and clear prices", ar ? "سيارات مريحة للعائلات" : "Comfortable family cars"].map((item, i) => (
            <li key={i} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-gold" /> {item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
