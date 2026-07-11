import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CookieConsent } from "@/components/CookieConsent";
import { SITE } from "@/lib/site-info";
import {
  isLocale,
  LOCALES,
  DEFAULT_LOCALE,
  pickLocaleFromAcceptLanguage,
  withLocale,
  type Locale,
} from "@/lib/i18n";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/_public/{-$locale}")({
  // Detect the request origin server-side so canonical / hreflang / og:url
  // are absolute URLs (required by crawlers).
  beforeLoad: async ({ params, location }) => {
    // Bad locale slug → redirect to the same URL without the bogus prefix,
    // letting the fallback path below pick the preferred locale.
    if (params.locale !== undefined && !isLocale(params.locale)) {
      throw redirect({ to: "/", replace: true });
    }

    // Missing prefix: pick preferred locale and 301-redirect.
    if (!params.locale) {
      let preferred: Locale = DEFAULT_LOCALE;
      if (typeof window === "undefined") {
        // SSR: read Accept-Language from the incoming request if available.
        try {
          const { getRequest } = await import("@tanstack/react-start/server");
          const req = getRequest();
          preferred = pickLocaleFromAcceptLanguage(req?.headers.get("accept-language"));
        } catch {
          preferred = DEFAULT_LOCALE;
        }
      } else {
        const stored = window.localStorage.getItem("locale");
        preferred = stored === "ar" || stored === "en" ? stored : DEFAULT_LOCALE;
      }
      const target = withLocale(preferred, location.pathname);
      throw redirect({ to: target, replace: true });
    }

    const origin = await getRequestOrigin().catch(() => "");
    return { locale: params.locale as Locale, origin };
  },
  loader: ({ context }) => ({ locale: (context as any).locale as Locale, origin: (context as any).origin as string }),
  head: ({ loaderData, params }) => {
    const locale = (loaderData?.locale ?? params.locale ?? DEFAULT_LOCALE) as Locale;
    const origin = loaderData?.origin ?? "";
    // Build absolute URLs when possible; fall back to path-relative.
    const pathForLocale = (l: Locale) => `${origin}/${l}`;
    const canonical = origin ? pathForLocale(locale) : `/${locale}`;
    const alternates = LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: l,
      href: origin ? pathForLocale(l) : `/${l}`,
    }));
    return {
      meta: [
        { property: "og:locale", content: locale === "ar" ? "ar_SA" : "en_US" },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
        ...alternates,
        { rel: "alternate", hrefLang: "x-default", href: origin ? `${origin}/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: SITE.brand[locale],
            telephone: SITE.phone,
            email: SITE.email,
            inLanguage: locale,
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
    };
  },
  component: PublicLayout,
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
