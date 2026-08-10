import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, MapPin, Clock, Shield, Star, Users, Car } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف يمكنني حجز تاكسي في مكة؟", a: "يمكنك الحجز بسهولة عبر واتساب أو الاتصال. نوفر خدمة التوصيل من الفندق إلى الحرم أو المشاعر المقدسة أو المطار على مدار الساعة." },
  { q: "هل توفرون خدمة النقل بين مكة وجدة؟", a: "نعم، نقدم خدمة النقل المباشر بين مكة وجدة (المطار، الفنادق، أو أي حي) بأسعار ثابتة تشمل جميع الرسوم." },
  { q: "هل السائقون على دراية بطرق مكة المكرمة؟", a: "بالتأكيد، سائقونا محترفون ولديهم خبرة طويلة في طرق مكة والمداخل والمخارج المؤدية للحرم والفنادق." },
  { q: "ما هي أنواع السيارات المتوفرة للعائلات في مكة؟", a: "نوفر سيارات عائلية واسعة (جي إم سي، تاهو) وفانات كبيرة (هايس) تتسع لـ 11 راكباً مع مساحة كبيرة للحقائب." },
];

const FAQ_EN = [
  { q: "How can I book a taxi in Makkah?", a: "You can easily book via WhatsApp or phone. We provide 24/7 transfers from hotels to the Haram, holy sites, or the airport." },
  { q: "Do you offer transfers between Makkah and Jeddah?", a: "Yes, we provide direct transfers between Makkah and Jeddah (Airport, hotels, or any district) at fixed prices including all fees." },
  { q: "Are the drivers familiar with Makkah roads?", a: "Absolutely. Our professional drivers have extensive experience with Makkah roads, entrances, and exits to the Haram and hotels." },
  { q: "What types of family vehicles are available in Makkah?", a: "We offer spacious family SUVs (GMC, Tahoe) and large vans (Hiace) seating up to 11 passengers with ample luggage space." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-makkah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-makkah`;
    const title = ar
      ? "تاكسي مكة | حجز توصيل من وإلى الحرم وفنادق مكة - تاكسي العمرة"
      : "Taxi Makkah | Book Transfers to Haram & Hotels - Omra Taxi";
    const description = ar
      ? "احجز تاكسي مكة الآن. نوفر سيارات حديثة مع سائقين محترفين للتوصيل داخل مكة، من وإلى مطار جدة، والرحلات العائلية. خدمة موثوقة 24/7 بأسعار ثابتة ومنافسة."
      : "Book your Makkah taxi now. Modern cars with professional drivers for transfers within Makkah, to/from Jeddah Airport, and family trips. Reliable 24/7 service at fixed rates.";
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: ar 
            ? "تاكسي مكة, حجز تاكسي مكة, رقم تاكسي مكة, تاكسي مكة جدة, تاكسي مكة المطار, سيارة مع سائق مكة" 
            : "Taxi Makkah, Makkah taxi service, book taxi Makkah, Makkah to Jeddah taxi, Makkah airport transfer" 
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
              { name: ar ? "تاكسي مكة" : "Taxi Makkah", url },
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
              name: ar ? "تاكسي مكة" : "Makkah Taxi Service",
              description,
              url,
              areaServed: "Makkah",
            })
          ),
        },
      ],
    };
  },
  component: TaxiMakkahPage,
});

function TaxiMakkahPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const faqs = ar ? FAQ_AR : FAQ_EN;

  return (
    <article className="container-tight py-16 md:py-24">
      <nav aria-label={ar ? "مسار التنقل" : "Breadcrumb"} className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{ar ? "تاكسي مكة" : "Taxi Makkah"}</span>
      </nav>

      <header className="max-w-3xl space-y-5 mb-12">
        <div className="flex items-center gap-2 text-gold">
          <Star className="h-4 w-4 fill-gold" />
          <span className="text-xs font-bold uppercase tracking-widest">{ar ? "خدمة المعتمرين والزوار" : "Pilgrim & Visitor Service"}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
          {ar
            ? "تاكسي مكة المكرمة - خدمات توصيل احترافية على مدار الساعة"
            : "Makkah Taxi Services - Professional Transfers 24/7"}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {ar
            ? "نحن ندرك قدسية وقتك في مكة المكرمة. نوفر لك خدمة توصيل موثوقة وسريعة من وإلى الحرم الشريف، الفنادق، ومطار جدة، بأسعار ثابتة لتتمكن من التركيز على عبادتك."
            : "We understand the sanctity of your time in Makkah. We provide reliable and fast transfer services to and from the Holy Mosque, hotels, and Jeddah Airport, with fixed prices so you can focus on your worship."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8">
            <a href={waLink(ar ? "أرغب بحجز تاكسي في مكة" : "I'd like to book a taxi in Makkah")} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8">
            <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-muted rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6">{ar ? "خدماتنا في العاصمة المقدسة" : "Our Services in the Holy City"}</h2>
          <ul className="space-y-4">
            {[
              { ar: "التوصيل من وإلى الحرم الشريف", en: "Transfers to/from the Holy Mosque" },
              { ar: "نقل المعتمرين من مطار جدة", en: "Umrah Pilgrims from Jeddah Airport" },
              { ar: "الرحلات العائلية الكبيرة", en: "Large Family Transfers" },
              { ar: "التنقل بين فنادق مكة", en: "Transfers Between Makkah Hotels" },
              { ar: "رحلات خاصة للمشاعر المقدسة", en: "Private Trips to Holy Sites" },
              { ar: "توصيل من مكة إلى المدينة المنورة", en: "Transfers from Makkah to Madinah" },
            ].map((s, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                <span className="text-muted-foreground">{ar ? s.ar : s.en}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{ar ? "لماذا تحجز معنا في مكة؟" : "Why Book With Us in Makkah?"}</h2>
          <div className="grid gap-4">
            {[
              { icon: Shield, t_ar: "أمان تام", t_en: "Total Safety", d_ar: "سائقون محترفون ومعتمدون.", d_en: "Professional and vetted drivers." },
              { icon: Clock, t_ar: "التزام بالمواعيد", t_en: "Punctuality", d_ar: "نصل في الموعد المحدد دائماً.", d_en: "We always arrive on the scheduled time." },
              { icon: Users, t_ar: "خصوصية العائلات", t_en: "Family Privacy", d_ar: "سيارات خاصة تحافظ على خصوصيتكم.", d_en: "Private cars to maintain your privacy." },
              { icon: MapPin, t_ar: "معرفة شاملة", t_en: "Expert Knowledge", d_ar: "دراية كاملة بجميع مناطق مكة.", d_en: "Full awareness of all Makkah areas." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 border rounded-2xl hover:bg-card transition-colors">
                <item.icon className="h-6 w-6 text-gold shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">{ar ? item.t_ar : item.t_en}</h4>
                  <p className="text-xs text-muted-foreground">{ar ? item.d_ar : item.d_en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-20">
        <h2 className="font-display text-3xl mb-10 text-center">{ar ? "أسطولنا في مكة" : "Our Fleet in Makkah"}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { ar: "سيدان (كامري / سوناتا)", en: "Sedan (Camry / Sonata)", cap: "3+3" },
            { ar: "دفع رباعي (جي إم سي / تاهو)", en: "SUV (GMC / Tahoe)", cap: "6+6" },
            { ar: "فان (هايس / ستاركس)", en: "Van (Hiace / Staria)", cap: "11+12" },
          ].map((v, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center">
              <Car className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="font-bold mb-2">{ar ? v.ar : v.en}</h3>
              <p className="text-xs text-muted-foreground mb-4">{ar ? "سعة الركاب والحقائب: " : "Pax & Bags: "}{v.cap}</p>
              <Button asChild variant="link" className="text-gold">
                <Link to={withLocale(locale, "/fleet")}>{ar ? "تفاصيل الأسطول" : "Fleet Details"}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl mb-8 border-b pb-4">{ar ? "الأسئلة الشائعة عن تاكسي مكة" : "Makkah Taxi FAQs"}</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">{f.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-14 relative overflow-hidden">
        <div className="relative z-10 text-center space-y-6">
          <h2 className="font-display text-3xl md:text-5xl">{ar ? "رحلتك في مكة تبدأ معنا" : "Your Makkah Journey Starts With Us"}</h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            {ar 
              ? "احجز تاكسي مكة الآن واستمتع براحة البال خلال تنقلاتك في العاصمة المقدسة. فريقنا متاح لخدمتك دائماً." 
              : "Book your Makkah taxi now and enjoy peace of mind during your transfers in the Holy City. Our team is always ready to serve you."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-soft h-14 px-10 rounded-full font-bold">
              <a href={waLink(ar ? "أرغب بحجز تاكسي في مكة" : "I'd like to book a taxi in Makkah")} target="_blank" rel="noopener">
                <MessageCircle className="h-5 w-5 me-2" /> {ar ? "تواصل فوراً عبر واتساب" : "Contact on WhatsApp"}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 hover:bg-white/10 h-14 px-10 rounded-full">
              <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>
    </article>
  );
}
