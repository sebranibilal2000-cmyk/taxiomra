import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Book Your Taxi 24/7" },
      { name: "description", content: "Contact our taxi dispatch team via WhatsApp, phone or email. Available 24/7 for bookings and inquiries." },
      { property: "og:title", content: "Contact Sur3a Taxi" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: SITE.brand.en,
        telephone: SITE.phone,
        email: SITE.email,
        address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
        geo: { "@type": "GeoCoordinates", latitude: SITE.latitude, longitude: SITE.longitude },
        openingHours: "Mo-Su 00:00-23:59",
      }),
    }],
  }),
  component: Contact,
});

function Contact() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const channels = [
    { icon: MessageCircle, title: "WhatsApp", value: "+" + SITE.whatsapp, href: waLink(), cta: ar ? "افتح واتساب" : "Open WhatsApp", color: "bg-green-600 hover:bg-green-700" },
    { icon: Phone, title: ar ? "الاتصال" : "Phone", value: SITE.phone, href: telLink(), cta: ar ? "اتصل الآن" : "Call now" },
    { icon: Mail, title: ar ? "البريد" : "Email", value: SITE.email, href: `mailto:${SITE.email}`, cta: ar ? "أرسل بريداً" : "Send email" },
  ];
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "تواصل معنا" : "Contact Us"}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{ar ? "فريقنا متاح ٢٤ ساعة لخدمتك — اختر الطريقة الأنسب لك." : "Our team is available 24/7 — pick the channel that works best for you."}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {channels.map((c) => (
          <Card key={c.title}><CardContent className="pt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4"><c.icon className="h-7 w-7" /></div>
            <h3 className="font-bold mb-2">{c.title}</h3>
            <div className="text-sm text-muted-foreground mb-4 break-all">{c.value}</div>
            <Button asChild className={`w-full ${c.color ?? ""}`}><a href={c.href} target="_blank" rel="noopener">{c.cta}</a></Button>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> {ar ? "ساعات العمل" : "Business hours"}</h3>
          <p className="text-muted-foreground">{SITE.hours[locale]}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {ar ? "الموقع" : "Location"}</h3>
          <p className="text-muted-foreground">{SITE.address[locale]}</p>
        </CardContent></Card>
      </div>
    </div>
  );
}
