// Central SEO helpers: JSON-LD builders + breadcrumb helpers used across public routes.
import { SITE } from "./site-info";

type Loc = { en: string; ar?: string; url: string };

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: SITE.brand.en,
    alternateName: SITE.brand.ar,
    telephone: SITE.phone,
    email: SITE.email,
    url: "/",
    image: "/og-cover.jpg",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: SITE.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.latitude, longitude: SITE.longitude },
    areaServed: { "@type": "City", name: SITE.city },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "00:00", closes: "23:59",
    }],
    sameAs: Object.values(SITE.socials).filter(Boolean),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.brand.en,
    url: "/",
    logo: "/logo.png",
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "reservations",
      areaServed: SITE.country,
      availableLanguage: ["en", "ar"],
    }],
  };
}

export function breadcrumbJsonLd(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}

export function articleJsonLd(p: {
  title: string; description?: string; image?: string;
  datePublished?: string; dateModified?: string; author?: string; url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    image: p.image,
    datePublished: p.datePublished,
    dateModified: p.dateModified ?? p.datePublished,
    author: { "@type": "Person", name: p.author ?? SITE.brand.en },
    publisher: {
      "@type": "Organization",
      name: SITE.brand.en,
      logo: { "@type": "ImageObject", url: "/logo.png" },
    },
    mainEntityOfPage: p.url,
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function serviceJsonLd(s: { name: string; description?: string; areaServed?: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@type": "TaxiService", name: SITE.brand.en, telephone: SITE.phone },
    areaServed: s.areaServed ?? SITE.city,
    url: s.url,
  };
}

export function vehicleJsonLd(v: { name: string; description?: string; image?: string; brand?: string; seatingCapacity?: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: v.name,
    description: v.description,
    image: v.image,
    brand: v.brand ? { "@type": "Brand", name: v.brand } : undefined,
    vehicleSeatingCapacity: v.seatingCapacity,
  };
}

// Build a full <head> block from a CMS page's SEO fields.
export function buildCmsHead(p: {
  slug: string;
  title_en: string; title_ar: string;
  meta_title?: string | null; meta_description?: string | null;
  subtitle_en?: string | null; subtitle_ar?: string | null;
  og_title?: string | null; og_description?: string | null;
  og_image_url?: string | null; twitter_card?: string | null;
  robots?: string | null; canonical_url?: string | null;
  keywords?: string[] | null; schema_type?: string | null;
  custom_schema?: unknown;
}) {
  const title = p.meta_title || p.title_en;
  const desc = p.meta_description || p.subtitle_en || "";
  // Canonical + og:url are emitted by the public layout (URL-aware). Only add
  // page-specific meta here to avoid duplicate canonical/og:url tags.
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: desc },
    { name: "robots", content: p.robots || "index,follow" },
    { property: "og:title", content: p.og_title || title },
    { property: "og:description", content: p.og_description || desc },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: p.twitter_card || "summary_large_image" },
    { name: "twitter:title", content: p.og_title || title },
    { name: "twitter:description", content: p.og_description || desc },
  ];
  if (p.keywords?.length) meta.push({ name: "keywords", content: p.keywords.join(", ") });
  if (p.og_image_url) meta.push({ property: "og:image", content: p.og_image_url }, { name: "twitter:image", content: p.og_image_url });
  const scripts: any[] = [];
  if (p.schema_type) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(
        p.schema_type === "Service"
          ? serviceJsonLd({ name: title, description: desc, url: `/${p.slug}` })
          : p.schema_type === "FAQPage"
          ? { "@context": "https://schema.org", "@type": "FAQPage", name: title }
          : localBusinessJsonLd(),
      ),
    });
  }
  if (p.custom_schema && typeof p.custom_schema === "object") {
    scripts.push({ type: "application/ld+json", children: JSON.stringify(p.custom_schema) });
  }
  return { meta, links: [] as Array<Record<string, string>>, scripts };
}

export const _loc = (l: Loc) => l;
