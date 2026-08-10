import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف أحجز تاكسي في المدينة المنورة؟", a: "عبر واتساب أو الاتصال. نوفر رحلات للمسجد النبوي، المزارات، ومطار المدينة." },
  { q: "هل توفرون خدمة التوصيل بين مكة والمدينة؟", a: "نعم، هذه من خدماتنا الأساسية، نوفر رحلات مريحة وآمنة بين الحرمين الشريفين." },
];

const FAQ_EN = [
  { q: "How to book a taxi in Madinah?", a: "Via WhatsApp or call. We provide trips to Prophet's Mosque, sites, and Madinah Airport." },
  { q: "Do you offer transfers between Makkah and Madinah?", a: "Yes, this is one of our core services, providing comfortable trips between the two Holy Mosques." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-madinah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-madinah`;
    const title = ar ? "تاكسي المدينة المنورة | توصيل للمسجد النبوي والمطار - تاكسي العمرة" : "Madinah Taxi | Prophet's Mosque & Airport Transfers - Omra Taxi";
    const description = ar ? "احجز تاكسي المدينة المنورة الآن. خدمة استقبال من المطار وتوصيل للمسجد النبوي والفنادق بأسعار ثابتة. سيارات حديثة وسائقون محترفون." : "Book Madinah taxi now. Airport meet & greet, Prophet's Mosque and hotel transfers at fixed rates. Modern cars and professional drivers.";
    return {
      meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` }, { name: ar ? "تاكسي المدينة" : "Madinah Taxi", url }])) },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)) },
        { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({ name: ar ? "تاكسي المدينة" : "Madinah Taxi", description, url, areaServed: "Madinah" })) }
      ]
    };
  },
  component: MadinahTaxiPage,
});

function MadinahTaxiPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <article className="container-tight py-16">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{ar ? "تاكسي المدينة المنورة" : "Madinah Taxi"}</span>
      </nav>
      <header className="space-y-6 mb-16">
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي المدينة المنورة: راحة زوار المسجد النبوي" : "Madinah Taxi: Comfort for Visitors"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "نفتخر بخدمتكم في طيبة الطيبة. توصيل آمن ومريح لجميع وجهاتكم في المدينة المنورة." : "We are proud to serve you in Madinah. Safe and comfortable transfers to all your destinations."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في المدينة" : "Book taxi in Madinah")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[{icon: Building2, t: ar ? "للمسجد النبوي" : "To Prophet's Mosque"}, {icon: Plane, t: ar ? "مطار المدينة" : "Madinah Airport"}, {icon: MapPin, t: ar ? "بين مكة والمدينة" : "Makkah-Madinah Transfer"}].map((s, i) => (
          <div key={i} className="p-6 border rounded-2xl bg-card">
            <s.icon className="h-10 w-10 text-gold mb-4" />
            <h3 className="font-bold">{s.t}</h3>
          </div>
        ))}
      </section>
    </article>
  );
}
