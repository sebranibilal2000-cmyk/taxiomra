import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, Users, Luggage } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";

type Fare = {
  key: string;
  name_ar: string;
  name_en: string;
  pax: number;
  bags: number;
  makkah: string;
  madinah: string;
  jeddah: string;
};

const FARES: Fare[] = [
  { key: "sedan", name_ar: "سيدان (كامري / سوناتا)", name_en: "Sedan (Camry / Sonata)", pax: 3, bags: 3, makkah: "250 – 300", madinah: "850 – 950", jeddah: "120 – 160" },
  { key: "suv", name_ar: "دفع رباعي (جي إم سي / تاهو)", name_en: "SUV (GMC / Tahoe)", pax: 6, bags: 6, makkah: "400 – 500", madinah: "1,200 – 1,400", jeddah: "200 – 260" },
  { key: "van", name_ar: "فان (هايس / ستاركس)", name_en: "Van (Hiace / Staria)", pax: 11, bags: 12, makkah: "450 – 550", madinah: "1,300 – 1,500", jeddah: "220 – 280" },
  { key: "business", name_ar: "درجة الأعمال (مرسيدس)", name_en: "Business class (Mercedes)", pax: 3, bags: 3, makkah: "600 – 750", madinah: "1,600 – 1,900", jeddah: "300 – 380" },
];

const FAQ_AR = [
  { q: "كم سعر التاكسي من مطار جدة إلى مكة؟", a: "يتراوح السعر الثابت من مطار الملك عبدالعزيز إلى مكة المكرمة بين 250 و300 ريال لسيارة السيدان، و400 إلى 500 ريال للدفع الرباعي، و450 إلى 550 ريال للفان (حتى 11 راكباً). السعر يشمل الاستقبال والانتظار والحقائب، ولا توجد رسوم مخفية." },
  { q: "هل السعر ثابت أم يُحتسب بالعداد؟", a: "السعر ثابت ومتفق عليه قبل الرحلة، ولا يتأثر بالازدحام أو مدة الطريق. تحصل على تأكيد السعر عبر واتساب قبل الحجز." },
  { q: "كم تستغرق الرحلة من مطار جدة إلى مكة؟", a: "تستغرق الرحلة عادة من 60 إلى 90 دقيقة حسب حركة المرور وموسم العمرة والحج." },
  { q: "هل يشمل السعر الانتظار داخل صالة الوصول؟", a: "نعم، يشمل السعر استقبالاً داخل صالة الوصول مع لافتة باسمك، وانتظاراً مجانياً حتى 60 دقيقة بعد هبوط الطائرة." },
  { q: "كيف يتم الدفع؟", a: "يمكنك الدفع نقداً للسائق عند الوصول، أو عبر التحويل البنكي أو مدى. الحجز نفسه مجاني ولا يتطلب دفعاً مسبقاً." },
];

const FAQ_EN = [
  { q: "How much is a taxi from Jeddah Airport to Makkah?", a: "The fixed fare from King Abdulaziz International Airport to Makkah is SAR 250–300 for a sedan, SAR 400–500 for an SUV, and SAR 450–550 for a van seating up to 11 passengers. The price includes meet-and-greet, waiting time and luggage — no hidden fees." },
  { q: "Is the fare fixed or metered?", a: "The fare is fixed and agreed before the trip. Traffic or route length does not change it, and you receive written price confirmation on WhatsApp before booking." },
  { q: "How long does the Jeddah Airport to Makkah transfer take?", a: "The drive usually takes 60 to 90 minutes depending on traffic and the Umrah or Hajj season." },
  { q: "Does the price include airport waiting time?", a: "Yes. Your driver meets you inside the arrivals hall with a name sign and waits free of charge for up to 60 minutes after landing." },
  { q: "How do I pay?", a: "Pay the driver in cash on arrival, or by bank transfer or Mada. Booking itself is free and requires no prepayment." },
];

export const Route = createFileRoute("/_public/{-$locale}/guide/taxi-fares")({
  head: ({ params }) => {
    const locale = params.locale ?? "ar";
    const ar = locale === "ar";
    const url = `${SITE.url}/${locale}/guide/taxi-fares`;
    const title = ar
      ? "كم سعر التاكسي من مطار جدة إلى مكة؟ دليل الأسعار 2026"
      : "How Much is a Taxi from Jeddah Airport to Makkah? Fare Guide";
    const description = ar
      ? "دليل أسعار التوصيل من مطار جدة إلى مكة: تسعيرة ثابتة للسيدان والدفع الرباعي والفان، مدة الرحلة، ما يشمله السعر، وطرق الدفع مع تاكسي العمرة."
      : "Full fare guide for a taxi from Jeddah Airport to Makkah: fixed prices by vehicle type (sedan, SUV, van), trip duration, what the price includes and how to pay.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
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
              { name: ar ? "دليل الأسعار" : "Fare guide", url },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqPageJsonLd(ar ? FAQ_AR : FAQ_EN)),
        },
      ],
    };
  },
  component: FareGuide,
});

function FareGuide() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const faqs = ar ? FAQ_AR : FAQ_EN;
  const cur = ar ? "ريال" : "SAR";

  return (
    <article className="container-tight py-16 md:py-24">
      <nav aria-label={ar ? "مسار التنقل" : "Breadcrumb"} className="text-sm text-muted-foreground mb-4">
        <a href={withLocale(locale, "/")} className="hover:text-foreground">{ar ? "الرئيسية" : "Home"}</a>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{ar ? "دليل أسعار التاكسي" : "Taxi fare guide"}</span>
      </nav>

      <header className="max-w-3xl space-y-5 mb-12">
        <span className="eyebrow"><span className="h-px w-8 bg-gold" />{ar ? "دليل الأسعار" : "Fare guide"}</span>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-balance">
          {ar
            ? "كم سعر التاكسي من مطار جدة إلى مكة؟"
            : "How much is a taxi from Jeddah Airport to Makkah?"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {ar
            ? "الجواب المختصر: من 250 إلى 300 ريال لسيارة سيدان، ومن 400 إلى 500 ريال للدفع الرباعي، ومن 450 إلى 550 ريال للفان العائلي. جميع الأسعار ثابتة ومؤكدة قبل الرحلة وتشمل الاستقبال والحقائب."
            : "Short answer: SAR 250–300 for a sedan, SAR 400–500 for an SUV and SAR 450–550 for a family van. Every fare is fixed, confirmed before the trip, and includes meet-and-greet and luggage."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href={waLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "اطلب تسعيرة عبر واتساب" : "Get a fare on WhatsApp"}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={telLink()}><Phone className="h-5 w-5 me-2" /> {SITE.phone}</a>
          </Button>
        </div>
      </header>

      <section className="mb-14">
        <h2 className="font-display text-2xl md:text-3xl mb-6">
          {ar ? "الأسعار حسب نوع المركبة" : "Fares by vehicle type"}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">
              {ar ? "أسعار التاكسي الثابتة من مطار جدة" : "Fixed taxi fares from Jeddah Airport"}
            </caption>
            <thead className="bg-muted/60">
              <tr className="text-start">
                <th scope="col" className="p-4 text-start font-medium">{ar ? "المركبة" : "Vehicle"}</th>
                <th scope="col" className="p-4 text-start font-medium">{ar ? "السعة" : "Capacity"}</th>
                <th scope="col" className="p-4 text-start font-medium">{ar ? `مطار جدة ← مكة (${cur})` : `Jeddah Airport → Makkah (${cur})`}</th>
                <th scope="col" className="p-4 text-start font-medium">{ar ? `مطار جدة ← المدينة (${cur})` : `Jeddah Airport → Madinah (${cur})`}</th>
                <th scope="col" className="p-4 text-start font-medium">{ar ? `داخل جدة (${cur})` : `Within Jeddah (${cur})`}</th>
              </tr>
            </thead>
            <tbody>
              {FARES.map((f) => (
                <tr key={f.key} className="border-t border-border">
                  <th scope="row" className="p-4 text-start font-medium">
                    <span className="inline-flex items-center gap-2"><Car className="h-4 w-4 text-gold" />{ar ? f.name_ar : f.name_en}</span>
                  </th>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{f.pax}</span>
                      <span className="inline-flex items-center gap-1"><Luggage className="h-3.5 w-3.5" />{f.bags}</span>
                    </span>
                  </td>
                  <td className="p-4 font-medium">{f.makkah}</td>
                  <td className="p-4">{f.madinah}</td>
                  <td className="p-4">{f.jeddah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {ar
            ? "الأسعار إرشادية بالريال السعودي وتُثبَّت كتابياً عند التأكيد. قد ترتفع قليلاً في مواسم رمضان والحج أو للرحلات بين منتصف الليل والفجر."
            : "Prices are indicative in Saudi Riyal and are locked in writing on confirmation. They may rise slightly during Ramadan and Hajj or for midnight-to-dawn pickups."}
        </p>
      </section>

      <section className="mb-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7">
          <h2 className="font-display text-2xl mb-4">{ar ? "ما الذي يشمله السعر؟" : "What the fare includes"}</h2>
          <ul className="space-y-2.5 text-sm">
            {(ar
              ? ["استقبال داخل صالة الوصول مع لافتة باسمك", "انتظار مجاني حتى 60 دقيقة بعد الهبوط", "متابعة رحلة الطيران وتعديل الموعد تلقائياً", "الحقائب ومقاعد الأطفال عند الطلب", "مياه معدنية وواي فاي في المركبات الفاخرة", "بدون رسوم مخفية أو رسوم إلغاء قبل 6 ساعات"]
              : ["Meet-and-greet inside the arrivals hall with a name sign", "Free waiting up to 60 minutes after landing", "Flight tracking with automatic pickup adjustment", "Luggage handling and child seats on request", "Bottled water and Wi-Fi in premium vehicles", "No hidden fees, free cancellation up to 6 hours before"]
            ).map((t) => (
              <li key={t} className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span className="text-muted-foreground">{t}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7">
          <h2 className="font-display text-2xl mb-4">{ar ? "لماذا السعر ثابت؟" : "Why fares are fixed"}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {ar
              ? "التاكسي بالعداد أو سيارات المطار العشوائية قد تكلّفك ضعف السعر في مواسم الذروة، خاصة عند الازدحام على طريق مكة السريع. نحن نثبت السعر كتابياً قبل الرحلة، فلا يتغير مهما طال الطريق أو تأخرت الطائرة."
              : "Metered cabs and curbside airport cars can cost double during peak Umrah season, especially when the Makkah expressway is congested. We confirm your price in writing before departure, so it never changes — however long the drive or however late your flight."}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ar
              ? "المسافة بين مطار الملك عبدالعزيز ومكة المكرمة نحو 90 كم عبر طريق الحرمين، بزمن رحلة يتراوح بين 60 و90 دقيقة."
              : "King Abdulaziz International Airport is about 90 km from Makkah via the Haramain expressway, a 60–90 minute drive."}
          </p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-display text-2xl md:text-3xl mb-6">{ar ? "أسئلة شائعة عن الأسعار" : "Fare FAQs"}</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">{f.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl mb-3">
          {ar ? "احجز بسعر ثابت الآن" : "Book at a fixed price"}
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-2xl">
          {ar
            ? "أرسل رقم رحلتك ووجهتك، وسنؤكد لك السعر النهائي والسائق خلال دقائق."
            : "Send us your flight number and destination — we confirm your final price and driver within minutes."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full bg-gold text-primary hover:bg-gold-soft">
            <Link to={withLocale(locale, "/booking")}>{ar ? "احجز رحلتك" : "Book your ride"}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <a href={waLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-5 w-5 me-2" /> {ar ? "واتساب" : "WhatsApp"}
            </a>
          </Button>
        </div>
      </section>
    </article>
  );
}
