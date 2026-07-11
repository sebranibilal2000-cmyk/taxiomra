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
import { resolveLocale } from "@/lib/locale-detect.functions";
import { resolveRedirect } from "@/lib/seo-tools.functions";

export const Route = createFileRoute("/_public/{-$locale}")({
  beforeLoad: async ({ params, location }) => {
    // 1) Redirect manager: check DB-managed 301/302 redirects (locale-agnostic path).
    try {
      const localeLess = location.pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
      const rd = await resolveRedirect({ data: { path: localeLess } });
      if (rd?.destination_path) {
        throw redirect({ href: rd.destination_path, replace: true });
      }
    } catch (e) {
      if (e && typeof e === "object" && "isRedirect" in e) throw e;
      // ignore lookup errors; continue with locale resolution
    }

    // 2) Bad locale slug → redirect to root; the layout without a param will
    //    re-run this beforeLoad and pick the preferred locale below.
    if (params.locale !== undefined && !isLocale(params.locale)) {
      throw redirect({ to: "/", replace: true });
    }

    // 3) Missing prefix → resolve preferred locale and redirect.
    if (!params.locale) {
      let preferred: Locale = DEFAULT_LOCALE;
      if (typeof window === "undefined") {
        try {
          preferred = (await resolveLocale()) as Locale;
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
  },
  loader: ({ location }) => ({ pathname: location.pathname }),
  head: ({ params, loaderData }) => {
    const locale = (params.locale ?? DEFAULT_LOCALE) as Locale;
    const pathname = loaderData?.pathname ?? `/${locale}`;
    const canonical = pathname;
    const alternates = LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: l,
      href: withLocale(l, pathname),
    }));
    return {
      meta: [
        { property: "og:locale", content: locale === "ar" ? "ar_SA" : "en_US" },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
        ...alternates,
        { rel: "alternate", hrefLang: "x-default", href: `/${DEFAULT_LOCALE}` },
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
