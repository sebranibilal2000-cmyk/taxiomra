import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Car, Users, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف يمكنني حجز تاكسي في المدينة المنورة؟", a: "يمكنك الحجز بسهولة عبر واتساب أو الاتصال المباشر. نوفر خدمة استقبال من مطار الأمير محمد بن عبدالعزيز وتوصيل لجميع فنادق المنطقة المركزية." },
  { q: "هل توفرون خدمة النقل بين المدينة ومكة؟", a: "نعم، نحن متخصصون في الرحلات المباشرة بين المدينة المنورة ومكة المكرمة بسيارات حديثة ومريحة مجهزة للمسافات الطويلة." },
  { q: "أين أجد السائق في مطار المدينة المنورة؟", a: "سيكون السائق في انتظارك في صالة الوصول حاملاً لافتة باسمك، كما نتابع موعد وصول رحلتك لضمان وجودنا في الوقت المحدد." },
  { q: "هل تقدمون خدمات النقل لزيارات المعالم الدينية؟", a: "نعم، نوفر جولات سياحية وزيارات للمساجد التاريخية والمعالم الدينية في المدينة المنورة مع سائقين ذوي خبرة." },
];

const FAQ_EN = [
  { q: "How can I book a taxi in Madinah?", a: "You can book easily via WhatsApp or direct call. We offer pickups from Prince Mohammad bin Abdulaziz Airport and transfers to all Central Area hotels." },
  { q: "Do you offer transfers between Madinah and Makkah?", a: "Yes, we specialize in direct transfers between Madinah and Makkah with modern, comfortable cars equipped for long-distance travel." },
  { q: "Where do I meet my driver at Madinah Airport?", a: "Your driver will be waiting in the arrivals hall with a name sign. We also monitor your flight arrival time to ensure punctuality." },
  { q: "Do you provide transfers for religious sightseeing?", a: "Yes, we offer Ziyarah tours and visits to historical mosques and religious sites in Madinah with experienced drivers." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-madinah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-madinah`;
    const title = ar
      ? "تاكسي المدينة المنورة | حجز توصيل مطار المدينة وفنادق الحرم - تاكسي العمرة"
      : "Taxi Madinah | Book Madinah Airport Transfers & Hotel Rides - Omra Taxi";
    const description = ar
      ? "احجز تاكسي المدينة المنورة الآن. استقبال من مطار الأمير محمد بن عبدالعزيز، توصيل فنادق الحرم، ورحلات مكة والمدينة. خدمة موثوقة 24/7 بسيارات حديثة وأسعار ثابتة."
      : "Book your Madinah taxi now. Pickups from Prince Mohammad bin Abdulaziz Airport, Haram hotel transfers, and Makkah-Madinah trips. Reliable 24/7 service with modern cars.";
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: ar 
            ? "تاكسي المدينة المنورة, حجز تاكسي المدينة, مطار المدينة تاكسي, نقل المدينة مكة, سيارة مع سائق المدينة" 
            : "Taxi Madinah, Madinah taxi service, Madinah airport transfer, Madinah to Makkah taxi, Medina taxi" 
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: ar ? "الرئيسية" : "Home", url: `${SITE.url}/${locale}` },
              { name: ar ? "تاكسي المدينة المنورة" : "Taxi Madinah", url },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            serviceJsonLd({
              name: ar ? "تاكسي المدينة المنورة" : "Madinah Taxi Service",
              description,
              url,
              areaServed: "Madinah",
            })
          ),
        },
      ],
    };
  },
  component: TaxiMadinahPage,
});

function TaxiMadinahPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const faqs = ar ? FAQ_AR : FAQ_EN;

  return (
    <article className="container-tight py-16 md:py-24">
      <nav aria-label={ar ? "مسار التنقل" : "Breadcrumb"} className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{ar ? "تاكسي المدينة المنورة" : "Taxi Madinah"}</span>
      </nav>

      <header className="max-w-4xl space-y-6 mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5" /> {ar ? "خدمة طيبة الطيبة" : "Madinah Premium Service"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
          {ar
            ? "تاكسي المدينة المنورة - رحلة آمنة من المطار إلى الحرم"
            : "Taxi Madinah - A Safe Journey from Airport to Haram"}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          {ar
            ? "نقدم لكم أرقى خدمات النقل في مدينة رسول الله صلى الله عليه وسلم. توصيل من مطار الأمير محمد بن عبدالعزيز إلى جميع فنادق المدينة ومكة بأسعار ثابتة واحترافية عالية."
            : "We offer the finest transportation services in the City of the Prophet (PBUH). Transfers from Prince Mohammad bin Abdulaziz Airport to all Madinah and Makkah hotels with fixed prices."}
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild size="lg" className="rounded-full h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg">
            <a href={waLink(ar ? "أرغب بحجز تاكسي في المدينة المنورة" : "I'd like to book a taxi in Madinah")} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "احجز رحلتك عبر واتساب" : "Book via WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 border-border">
            <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
          </Button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
            <Plane className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">{ar ? "مطار المدينة (MED)" : "Madinah Airport (MED)"}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ar 
              ? "استقبال احترافي من صالة الوصول وتوصيل مباشر إلى مقر إقامتك دون انتظار."
              : "Professional meet-and-greet from the arrivals hall and direct transfer to your accommodation."}
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">{ar ? "المدينة ← مكة" : "Madinah → Makkah"}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ar 
              ? "رحلات مريحة بين الحرمين الشريفين مع إمكانية التوقف في ميقات ذي الحليفة."
              : "Comfortable trips between the two Holy Mosques with the option to stop at Miqat Dhu al-Hulayfah."}
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">{ar ? "خدمة 24 ساعة" : "24/7 Service"}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ar 
              ? "فريقنا متاح لخدمتكم طوال اليوم، حتى في أوقات الذروة والمواسم."
              : "Our team is available to serve you all day, even during peak times and seasons."}
          </p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl mb-8 border-b pb-4">{ar ? "لماذا تختارنا في المدينة المنورة؟" : "Why Choose Us in Madinah?"}</h2>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-bold">{ar ? "سائقون ذوو خبرة" : "Experienced Drivers"}</h4>
                <p className="text-sm text-muted-foreground">{ar ? "سائقونا يعرفون جميع مداخل ومخارج المنطقة المركزية بدقة." : "Our drivers know all the entrances and exits of the Central Area precisely."}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-bold">{ar ? "أسطول حديث ومكيف" : "Modern A/C Fleet"}</h4>
                <p className="text-sm text-muted-foreground">{ar ? "سيارات نظيفة ومجهزة لضمان راحتكم في حرارة الصيف." : "Clean, equipped cars to ensure your comfort during the summer heat."}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-bold">{ar ? "خدمة العائلات والمجموعات" : "Family & Group Service"}</h4>
                <p className="text-sm text-muted-foreground">{ar ? "فانات كبيرة تسع لجميع أفراد العائلة مع حقائبهم." : "Large vans seating all family members with their luggage."}</p>
              </div>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 space-y-6">
            <h3 className="text-2xl font-bold">{ar ? "المسافات والوقت التقريبي" : "Approximate Distance & Time"}</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>{ar ? "مطار المدينة ← الحرم" : "Madinah Airport → Haram"}</span>
                <span className="text-gold">20-30 min</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>{ar ? "المدينة ← مكة المكرمة" : "Madinah → Makkah"}</span>
                <span className="text-gold">4.5 - 5 hours</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>{ar ? "المدينة ← جدة" : "Madinah → Jeddah"}</span>
                <span className="text-gold" dir="ltr">4 - 4.5 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl mb-8 border-b pb-4">{ar ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-bold mb-3">{f.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl bg-muted border border-border p-10 md:p-16 text-center space-y-6">
        <h2 className="font-display text-3xl md:text-4xl">{ar ? "احجز رحلتك في المدينة الآن" : "Book Your Madinah Trip Now"}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {ar 
            ? "لا تترك تنقلاتك للصدفة. احجز مع تاكسي العمرة لضمان خدمة راقية تليق بزيارتك للمدينة المنورة." 
            : "Don't leave your transfers to chance. Book with Omra Taxi to ensure premium service worthy of your visit to Madinah."}
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button asChild size="lg" className="rounded-full bg-primary h-14 px-10">
            <a href={waLink(ar ? "أرغب بحجز تاكسي في المدينة المنورة" : "I'd like to book a taxi in Madinah")} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "واتساب مباشر" : "Direct WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-10">
            <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
          </Button>
        </div>
      </div>
    </article>
  );
}
