import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CookieConsent } from "@/components/CookieConsent";
import { SITE } from "@/lib/site-info";

export const Route = createFileRoute("/_public/{-$locale}/{-$locale}")({
  component: PublicLayout,
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: SITE.brand.en,
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressCountry: SITE.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: SITE.latitude, longitude: SITE.longitude },
          areaServed: SITE.city,
          openingHours: "Mo-Su 00:00-23:59",
        }),
      },
    ],
  }),
});

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <WhatsAppFab />
      <CookieConsent />
    </div>
  );
}
