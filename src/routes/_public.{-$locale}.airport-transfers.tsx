import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Plane, MessageCircle, Phone, Clock, Luggage, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/_public/{-$locale}/airport-transfers")({
  head: () => ({
    meta: [
      { title: "Airport Transfers — On-Time Chauffeur Service" },
      { name: "description", content: "Meet-and-greet airport transfers with flight tracking, fixed fares, and a chauffeur waiting at arrivals — 24/7." },
      { property: "og:title", content: "Airport Transfers" },
      { property: "og:description", content: "Meet-and-greet chauffeur transfers with flight tracking and fixed fares." },
      { property: "og:type", content: "website" },
      { name: "keywords", content: "airport transfer, airport taxi, chauffeur, meet and greet, Riyadh airport" },
    ],
    links: [],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(serviceJsonLd({
        name: "Airport Transfers",
        description: "Meet-and-greet chauffeur transfers with flight tracking, fixed fares and 60-minute complimentary wait time.",
        url: "/airport-transfers",
      })) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Airport Transfers", url: "/airport-transfers" },
      ])) },
    ],
  }),
  component: AirportTransfers,
});

function AirportTransfers() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const perks = [
    { icon: Clock, t: ar ? "متابعة رحلتك" : "Flight tracking", d: ar ? "نتابع موعد وصولك ونعدّل الالتقاط تلقائياً." : "We track your flight and adjust pickup automatically." },
    { icon: Luggage, t: ar ? "استقبال شخصي" : "Meet & greet", d: ar ? "السائق ينتظرك في القاعة بلوحة اسمك." : "Your chauffeur waits in arrivals with a name board." },
    { icon: ShieldCheck, t: ar ? "أسعار ثابتة" : "Fixed fares", d: ar ? "لا رسوم مفاجئة، السعر متفق عليه مسبقاً." : "No surprises — price agreed before you land." },
  ];
  return (
    <>
      <section className="container-tight py-16 md:py-24">
        <div className="max-w-3xl space-y-5">
          <span className="eyebrow"><span className="h-px w-8 bg-gold" /><Plane className="h-3 w-3" />{ar ? "نقل المطار" : "Airport Transfers"}</span>
          <h1 className="font-display text-5xl md:text-6xl leading-tight text-balance">
            {ar ? "من المطار إلى وجهتك، بدون توتر." : "From the airport to your door — effortlessly."}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            {ar
              ? "نراقب رحلتك، نستقبلك في القاعة، ونوصلك بسيارة تنفيذية أنيقة. زمن الانتظار المجاني حتى ٦٠ دقيقة."
              : "We monitor your flight, greet you in arrivals, and drive you in an executive vehicle. Up to 60 minutes complimentary wait time."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full h-12 px-6 bg-primary">
              <a href={waLink(ar ? "أرغب بحجز نقل مطار" : "I'd like to book an airport transfer")} target="_blank" rel="noopener">
                <MessageCircle className="h-5 w-5 me-2" />{ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6">
              <a href={telLink()}><Phone className="h-5 w-5 me-2" />{SITE.phone}</a>
            </Button>
          </div>
        </div>
        <div className="grid gap-6 mt-16 md:grid-cols-3">
          {perks.map((p) => (
            <div key={p.t} className="hover-lift rounded-2xl border border-border bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold mb-4"><p.icon className="h-5 w-5" /></div>
              <div className="font-display text-xl">{p.t}</div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
