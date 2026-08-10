import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";


const FAQ_AR = [
  { q: "كيف يمكنني حجز تاكسي في مكة؟", a: "يمكنك حجز تاكسي مكة بسهولة عبر واتساب أو الاتصال المباشر. نوفر رحلات داخلية في مكة، وتوصيل للحرم المكي، وخدمات النقل إلى مطار جدة والمدينة المنورة." },
  { q: "ما هي خدمات النقل المتوفرة للمعتمرين؟", a: "نقدم خدمات متكاملة لنقل المعتمرين من مطار جدة إلى فنادق مكة، ورحلات التنقل بين مكة والمدينة المنورة، بالإضافة إلى التوصيل إلى محطة قطار الحرمين." },
  { q: "هل لديكم توصيل من مطار جدة إلى فنادق مكة؟", a: `نعم، نحن متخصصون في النقل من مطار الملك عبدالعزيز بجدة مباشرة إلى جميع فنادق مكة المكرمة بسعر يبدأ من ${getPriceForRoute('apt-jed-to-makkah')} ريال فقط.` },
  { q: "هل السيارات مهيأة للعائلات والمجموعات؟", a: "بالتأكيد، نوفر فانات وسيارات عائلية واسعة ومريحة لضمان راحة وسلامة العائلات خلال زيارتهم لمكة والمشاعر المقدسة." },
];

const FAQ_EN = [
  { q: "How can I book a taxi in Makkah?", a: "You can easily book a Makkah taxi via WhatsApp or direct call. We offer local trips in Makkah, Haram transfers, and transport services to Jeddah Airport and Madinah." },
  { q: "What transport services are available for pilgrims?", a: "We offer comprehensive services for Umrah pilgrims from Jeddah Airport to Makkah hotels, intercity transfers between Makkah and Madinah, and Haramain station pickups." },
  { q: "Do you provide transfers from Jeddah Airport to Makkah hotels?", a: `Yes, we specialize in direct transfers from KAIA in Jeddah to all Makkah hotels starting from only ${getPriceForRoute('apt-jed-to-makkah')} SAR.` },
  { q: "Are the vehicles suitable for families and groups?", a: "Certainly, we provide spacious and comfortable vans and family SUVs to ensure the comfort and safety of families visiting Makkah and the Holy Sites." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-makkah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-makkah`;
    const title = ar ? "تاكسي مكة | توصيل للحرم وفنادق مكة - تاكسي العمرة" : "Makkah Taxi | Private Umrah & Hotel Transfers - Umrah Taxi Saudi";
    const description = ar ? "احجز تاكسي مكة للتنقل داخل المدينة أو من مطار جدة. خدمة موثوقة لزوار الحرم والعائلات بأسعار ثابتة. سيارات حديثة وسائقون محترفون." : "Book your private Makkah taxi for Umrah transfers, Haram pickups, and hotel drop-offs. Professional private transportation in Makkah for pilgrims and families.";
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
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "تاكسي مكة المكرمة: تنقل بكل روحانية" : "Makkah Taxi & Private Umrah Transportation"}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{ar ? "خدمة توصيل مريحة وموثوقة داخل مكة ومن مطار جدة. هدفنا راحتك وسلامتك." : "Comfortable and reliable private transfer services in Makkah and from Jeddah Airport. We provide door-to-door transportation for Umrah pilgrims and international tourists."}</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full"><a href={waLink(ar ? "أرغب بحجز تاكسي في مكة" : "Book taxi in Makkah")}><MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز الآن" : "Book Now"}</a></Button>
        </div>
      </header>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Car, t_ar: "تنقل داخل مكة", t_en: "Makkah City Transfers" },
          { icon: Building2, t_ar: "نقل الحرم والفنادق", t_en: "Haram & Hotel Transfers" },
          { icon: Plane, t_ar: "مطار جدة ← مكة", t_en: "Jeddah Airport ← Makkah", path: "/jeddah-to-makkah-taxi" },
          { icon: MapPin, t_ar: "مكة ← المدينة", t_en: "Makkah ← Madinah", path: "/makkah-to-madinah-taxi" },
        ].map((s, i) => (
          <div key={i} className="p-6 border rounded-2xl bg-card hover:shadow-md transition-shadow">
            {s.path ? (
              <Link to={withLocale(locale, s.path)} className="group flex flex-col h-full">
                <s.icon className="h-10 w-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold group-hover:text-gold transition-colors">{ar ? s.t_ar : s.t_en}</h3>
              </Link>
            ) : (
              <div className="flex flex-col h-full">
                <s.icon className="h-10 w-10 text-gold mb-4" />
                <h3 className="font-bold">{ar ? s.t_ar : s.t_en}</h3>
              </div>
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
