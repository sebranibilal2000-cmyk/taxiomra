import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle2, Car, MapPin, Clock, Shield, Star, Building2, Plane } from "lucide-react";
import { useI18n, withLocale } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getPriceForRoute } from "@/lib/pricing.functions";


const FAQ_AR = [
  { q: "كيف أحجز تاكسي في المدينة المنورة؟", a: "يمكنك الحجز بسهولة عبر واتساب أو الاتصال المباشر. نوفر رحلات للمسجد النبوي الشريف، المزارات النبوية، ومطار المدينة المنورة (PRINCE MOHAMMAD BIN ABDULAZIZ AIRPORT)." },
  { q: "هل توفرون خدمة التوصيل بين مكة والمدينة؟", a: `نعم، نقدم خدمة النقل المباشر والآمن بين الحرمين الشريفين بسعر يبدأ من ${getPriceForRoute('makkah-madinah')} ريال لسيارة السيدان.` },
  { q: "ما هي أهم الوجهات السياحية في المدينة التي تخدمونها؟", a: "نوفر رحلات للمزارات مثل مسجد قباء، وجبل أحد، ومقبرة البقيع، بالإضافة إلى المجمعات التجارية والفنادق المحيطة بالمسجد النبوي." },
  { q: "هل لديكم خدمة استقبال من مطار المدينة المنورة؟", a: "نعم، نوفر خدمة الاستقبال بالاسم من مطار الأمير محمد بن عبدالعزيز الدولي وتوصيلك إلى وجهتك بكل راحة وأمان." },
];

const FAQ_EN = [
  { q: "How to book a taxi in Madinah?", a: "You can book easily via WhatsApp or direct call. We provide trips to the Prophet's Mosque, holy sites, and Madinah Airport (Prince Mohammad Bin Abdulaziz International Airport)." },
  { q: "Do you offer transfers between Makkah and Madinah?", a: `Yes, we offer direct and safe transfer services between the two Holy Mosques starting from ${getPriceForRoute('makkah-madinah')} SAR for a sedan.` },
  { q: "What are the major sites you serve in Madinah?", a: "We provide trips to sites like Quba Mosque, Mount Uhud, and Al Baqi, as well as shopping malls and hotels surrounding the Prophet's Mosque." },
  { q: "Do you provide airport pickups at Madinah Airport?", a: "Yes, we offer meet-and-greet services at Prince Mohammad Bin Abdulaziz International Airport, taking you to your destination with comfort and safety." },
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
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Building2, t_ar: "زيارة المسجد النبوي", t_en: "Prophet's Mosque Visits" },
          { icon: Plane, t_ar: "مطار المدينة الدولي", t_en: "Madinah Airport (MED)" },
          { icon: MapPin, t_ar: "بين الحرمين الشريفين", t_en: "Makkah-Madinah Transfers", path: "/makkah-to-madinah-taxi" },
          { icon: Star, t_ar: "المزارات النبوية", t_en: "Historical Ziyarat Sites" },
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
    </article>
  );
}
