import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, Users, Luggage, MapPin, Clock, Shield, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const FAQ_AR = [
  { q: "كيف يمكنني حجز تاكسي في جدة؟", a: "يمكنك حجز تاكسي جدة بسهولة عبر واتساب أو الاتصال المباشر. نوفر خدمة فورية أو حجوزات مسبقة للرحلات الخاصة والعائلية وخدمات النقل لرجال الأعمال." },
  { q: "هل تتوفر خدمة التوصيل بين أحياء جدة؟", a: "نعم، نقدم خدمة التوصيل الاحترافي بين جميع أحياء ومناطق جدة الكبرى بما في ذلك الحمراء، الروضة، أبحر، حي الشاطئ، ومنطقة البلد التاريخية." },
  { q: "ما هي الوجهات المتاحة من مدينة جدة؟", a: "نوفر رحلات مباشرة من جدة إلى مكة المكرمة، المدينة المنورة، والطائف، بالإضافة إلى خدمة النقل المتخصصة من وإلى مطار الملك عبدالعزيز الدولي." },
  { q: "ما هي أنواع السيارات المتوفرة في أسطول جدة؟", a: "يتضمن أسطولنا سيارات سيدان حديثة مريحة، سيارات دفع رباعي واسعة للعائلات، وفانات كبيرة للرحلات الجماعية ونقل المعتمرين." },
];

const FAQ_EN = [
  { q: "How can I book a taxi in Jeddah?", a: "You can easily book a Jeddah taxi via WhatsApp or direct call. We offer instant pickups or pre-booked private transfers for business, families, and individuals." },
  { q: "Do you offer transfers between Jeddah districts?", a: "Yes, we provide professional transfers between all major Jeddah districts including Al Hamra, Al Rawdah, Obhur, Ash Shati, and the historical Al Balad area." },
  { q: "What destinations are available from Jeddah?", a: "We provide direct transfers from Jeddah to Makkah, Madinah, and Taif, in addition to specialized transport to and from King Abdulaziz International Airport (KAIA)." },
  { q: "What types of vehicles are available in the Jeddah fleet?", a: "Our fleet includes modern comfortable sedans, spacious SUVs for families, and large vans for group travel and Umrah transfers." },
];

export const Route = createFileRoute("/_public/{-$locale}/taxi-jeddah")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/taxi-jeddah`;
    const title = ar
      ? "تاكسي جدة | حجز توصيل داخل جدة بسيارات حديثة - تاكسي العمرة"
      : "Taxi Jeddah | Book Private Transfers in Jeddah - Omra Taxi";
    const description = ar
      ? "احجز تاكسي جدة الآن. نوفر سيارات حديثة مع سائقين محترفين للتوصيل داخل أحياء جدة، الرحلات العائلية، والشركات. خدمة موثوقة على مدار الساعة بأسعار ثابتة."
      : "Book your Jeddah taxi now. Modern cars with professional drivers for city transfers, family trips, and corporate travel. Reliable 24/7 service with fixed fares.";
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: ar 
            ? "تاكسي جدة, حجز تاكسي جدة, رقم تاكسي جدة, تاكسي في جدة, توصيل داخل جدة, سيارة مع سائق جدة" 
            : "Taxi Jeddah, Jeddah Taxi service, book taxi Jeddah, Jeddah private transfer, chauffeur Jeddah" 
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
              { name: ar ? "تاكسي جدة" : "Taxi Jeddah", url },
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
              name: ar ? "تاكسي جدة" : "Jeddah Taxi Service",
              description,
              url,
              areaServed: "Jeddah",
            })
          ),
        },
      ],
    };
  },
  component: TaxiJeddahPage,
});

function TaxiJeddahPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const faqs = ar ? FAQ_AR : FAQ_EN;

  return (
    <article className="container-tight py-16 md:py-24">
      <nav aria-label={ar ? "مسار التنقل" : "Breadcrumb"} className="text-sm text-muted-foreground mb-4">
        <Link to={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{ar ? "تاكسي جدة" : "Taxi Jeddah"}</span>
      </nav>

      <header className="max-w-3xl space-y-5 mb-12">
        <span className="eyebrow"><span className="h-px w-8 bg-gold" />{ar ? "خدمات التوصيل في جدة" : "Jeddah Transfer Services"}</span>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-balance">
          {ar
            ? "تاكسي جدة - الحل الأمثل للتنقل براحة وأمان"
            : "Taxi Jeddah - Your Ultimate Choice for Comfort & Safety"}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {ar
            ? "سواء كنت في رحلة عمل، زيارة عائلية، أو تحتاج للتنقل بين أحياء جدة ومطار الملك عبدالعزيز، نوفر لك أسطولاً من السيارات الحديثة والسائقين ذوي الخبرة لضمان وصولك في الموعد المحدد."
            : "Whether you are on a business trip, a family visit, or need to travel between Jeddah neighborhoods and KAIA airport, we provide a modern fleet and experienced drivers to ensure you arrive on time."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href={waLink(ar ? "أرغب بحجز تاكسي في جدة" : "I'd like to book a taxi in Jeddah")} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "حجز عبر واتساب" : "Book via WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
          </Button>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-3 mb-16">
        {[
          { icon: Clock, title_ar: "متاح 24/7", title_en: "Available 24/7", desc_ar: "خدماتنا متوفرة على مدار الساعة لتلبية احتياجاتك في أي وقت.", desc_en: "Our services are available around the clock to meet your needs anytime." },
          { icon: Shield, title_ar: "أمان وموثوقية", title_en: "Safe & Reliable", desc_ar: "سائقون محترفون ومعتمدون لضمان أقصى درجات الأمان.", desc_en: "Professional and vetted drivers to ensure maximum safety." },
          { icon: Plane, title_ar: "مطار جدة", title_en: "Jeddah Airport", desc_ar: "سهولة التوصيل من وإلى مطار الملك عبدالعزيز الدولي.", desc_en: "Easy transfers to and from King Abdulaziz International Airport.", path: "/jeddah-airport-taxi" },
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
            {item.path ? (
              <Link to={withLocale(locale, item.path)} className="group">
                <item.icon className="h-10 w-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{ar ? item.title_ar : item.title_en}</h3>
              </Link>
            ) : (
              <>
                <item.icon className="h-10 w-10 text-gold mb-4" />
                <h3 className="text-xl font-bold mb-2">{ar ? item.title_ar : item.title_en}</h3>
              </>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{ar ? item.desc_ar : item.desc_en}</p>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8 border-b pb-4">{ar ? "تغطية شاملة لخدمات النقل في جدة" : "Comprehensive Transfer Coverage in Jeddah"}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold inline-flex items-center gap-2"><Plane className="h-5 w-5 text-gold" /> {ar ? "نقل مطار الملك عبدالعزيز (JED)" : "King Abdulaziz Airport (JED) Transfers"}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ar 
                ? "سواء كنت قادماً إلى جدة أو مغادراً منها، نوفر خدمة استقبال وتوصيل دقيقة من وإلى مطار الملك عبدالعزيز الدولي. نضمن لك رحلة مريحة وسلسة وتتبعاً دقيقاً لمواعيد رحلات الطيران."
                : "Whether arriving in or departing from Jeddah, we provide precise meet-and-greet services from KAIA. We ensure a comfortable, smooth journey with accurate flight tracking."}
            </p>
            <Link to={withLocale(locale, "/jeddah-airport-taxi")} className="text-gold text-sm font-medium hover:underline inline-flex items-center">
              {ar ? "تفاصيل تاكسي المطار" : "Airport Taxi Details"} <ArrowRight className="h-4 w-4 ms-1 rtl:rotate-180" />
            </Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold inline-flex items-center gap-2"><Building2 className="h-5 w-5 text-gold" /> {ar ? "توصيل الفنادق والوجهات السياحية" : "Hotel & Tourist Transfers"}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ar 
                ? "نخدم جميع الفنادق الرئيسية في جدة والمناطق الحيوية مثل الواجهة البحرية، الكورنيش، ومنطقة البلد التاريخية. تنقل براحة تامة بين وجهاتك المفضلة في العروس."
                : "We serve all major hotels in Jeddah and vibrant areas like the Waterfront, Corniche, and the historic Al Balad district. Travel in total comfort between your favorite destinations."}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold inline-flex items-center gap-2"><MapPin className="h-5 w-5 text-gold" /> {ar ? "رحلات بين المدن (مكة والمدينة)" : "Intercity Trips (Makkah & Madinah)"}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ar 
                ? "نوفر مسارات مباشرة ومنتظمة من جدة إلى مكة المكرمة لخدمة المعتمرين والزوار، بالإضافة إلى رحلات خاصة إلى المدينة المنورة والطائف بأسعار ثابتة."
                : "We provide direct and regular routes from Jeddah to Makkah serving pilgrims and visitors, as well as private trips to Madinah and Taif at fixed prices."}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              <Link to={withLocale(locale, "/jeddah-to-makkah-taxi")} className="text-gold text-xs font-medium hover:underline">
                {ar ? "تاكسي جدة إلى مكة" : "Jeddah to Makkah Taxi"}
              </Link>
              <Link to={withLocale(locale, "/taxi-madinah")} className="text-gold text-xs font-medium hover:underline">
                {ar ? "تاكسي المدينة المنورة" : "Madinah Taxi"}
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold inline-flex items-center gap-2"><Users className="h-5 w-5 text-gold" /> {ar ? "خدمات النقل العائلي والخاص" : "Family & Private Transport"}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ar 
                ? "حلول نقل متكاملة للعائلات والمجموعات السياحية. سيارات واسعة ومريحة تضمن الخصوصية والأمان لجميع أفراد الأسرة خلال تجولهم في مدينة جدة."
                : "Integrated transport solutions for families and tourist groups. Spacious and comfortable vehicles ensure privacy and safety for all family members during their Jeddah tour."}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">{ar ? "لماذا تختار تاكسي العمرة؟" : "Why Choose Omra Taxi?"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t_ar: "سيارات حديثة", t_en: "Modern Cars", d_ar: "نستخدم أحدث موديلات السيارات المريحة.", d_en: "We use the latest comfortable car models." },
            { t_ar: "سائقون محترفون", t_en: "Professional Drivers", d_ar: "سائقونا مدربون وعلى دراية كاملة بطرق جدة.", d_en: "Our drivers are trained and fully aware of Jeddah roads." },
            { t_ar: "أسعار ثابتة", t_en: "Fixed Prices", d_ar: "لا توجد رسوم خفية، السعر متفق عليه مسبقاً.", d_en: "No hidden fees, price agreed upon in advance." },
            { t_ar: "سهولة الحجز", t_en: "Easy Booking", d_ar: "احجز رحلتك خلال ثوانٍ عبر واتساب.", d_en: "Book your trip in seconds via WhatsApp." },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-bold">{ar ? item.t_ar : item.t_en}</h4>
                <p className="text-xs text-muted-foreground">{ar ? item.d_ar : item.d_en}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8 border-b pb-4">{ar ? "الأسئلة الشائعة عن تاكسي جدة" : "FAQs about Jeddah Taxi"}</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">{f.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl mb-4">{ar ? "احجز تاكسي جدة الآن" : "Book Your Jeddah Taxi Now"}</h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {ar 
            ? "فريقنا بانتظار خدمتك على مدار الساعة. احصل على رحلة مريحة وآمنة داخل مدينة جدة." 
            : "Our team is waiting to serve you 24/7. Get a comfortable and safe ride within Jeddah."}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-soft h-14 px-8 text-lg rounded-full">
            <a href={waLink(ar ? "أرغب بحجز تاكسي في جدة" : "I'd like to book a taxi in Jeddah")} target="_blank" rel="noopener">
              <MessageCircle className="h-6 w-6 me-2" /> {ar ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-white/10 h-14 px-8 text-lg rounded-full">
            <a href={telLink()}>
              <Phone className="h-6 w-6 me-2" /> {SITE.phone}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
