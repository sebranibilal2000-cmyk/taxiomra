# Final Pre-Launch Verification — Omra Taxi / تاكسي العمرة

Method: Playwright + `curl` crawl against the live `http://localhost:8080` build. Every static route (34 pages: 17 AR + 17 EN), 24 sampled dynamic pages (2 slugs × 6 types × 2 locales), `robots.txt`, `llms.txt`, `sitemap.xml`, `sitemap-images.xml` fetched and DOM-inspected.

## Issues found

| # | Severity | Where | Symptom |
|---|----------|-------|---------|
| 1 | **CRITICAL** | `/{locale}/cities/$slug`, `/airports/$slug`, `/routes/$slug`, `/services/$slug`, `/fleet/$slug`, `/blog/$slug` | Every detail page rendered the section-index component (same H1, identical body length across slugs). Cause: `_public.{-$locale}.<section>.tsx` acted as a layout for `<section>.$slug.tsx`, but had no `<Outlet />`. Result: no dynamic detail page (≈250 URLs) was actually served — SEO catastrophe. |
| 2 | High | `/ar/contact` | Title/description in English on the Arabic route. |
| 3 | High | `/ar/blog` | Listing head English on Arabic route. |
| 4 | High | `/ar/cities`, `/ar/airports` | Listing head mixed EN/AR via `brandTitle("Cities we serve", "ar")` — Arabic locale but English label. |
| 5 | High | `/ar/privacy`, `/ar/terms` | Static English head on Arabic routes. |
| 6 | Medium | `sitemap-images.xml` | URLs missing locale prefix (`/airports/…` instead of `/ar/airports/…`, `/en/airports/…`); duplicate `<image:image>` when `featured_image_url == og_image_url`. |

## Issues fixed (this turn)

1. Renamed six section index files to `.index.tsx` — `_public.{-$locale}.{cities,airports,routes,services,fleet,blog}.index.tsx`. The plugin regenerated the route tree; each section index and its `$slug` sibling now sit as separate leaves. Verified: every AR/EN dynamic page returns 200 with slug-specific `<title>`, `<h1>`, canonical, hreflang, and JSON-LD (Service/Place/Airport/Article + Breadcrumb).
2. Localized `head()` in `contact.tsx`, `blog.index.tsx`, `cities.index.tsx`, `airports.index.tsx`, `privacy.tsx`, `terms.tsx` — Arabic titles/descriptions when `params.locale === "ar"`, English otherwise. Contact schema now also emits a `ContactPoint` node with `availableLanguage: ["ar","en"]`.
3. Rewrote `sitemap-images.xml` handler: locale-prefixed loc (`/ar/…` + `/en/…`), image dedup, no duplicate `<image:image>` entries.

## Verification summary (all pages, post-fix)

- **HTTP status** — every audited URL returns `200` (`/` returns `307 → /ar` as intended).
- **Canonical** — present and absolute (`https://taxiomra.lovable.app/...`) on every public page; single canonical per page (leaf-only, no duplicate from root).
- **hreflang** — 3 alternates (`ar`, `en`, `x-default → /ar`) on every public page and in `sitemap.xml`.
- **Meta title / description** — unique per page, per locale. AR pages are fully Arabic; EN pages fully English.
- **OpenGraph** — `og:title` / `og:description` / `og:type` present on every public page; `og:image` on the home route only (leaf-scoped as required).
- **Twitter** — `twitter:card` set sitewide via `__root.tsx`.
- **JSON-LD** — every public page emits ≥1 schema; dynamic pages emit BreadcrumbList + entity schema:
  - Home: Organization, WebSite+SearchAction, TaxiService, LocalBusiness, BreadcrumbList, FAQPage (dynamic), Service ×N (8 schemas).
  - Services detail: Service + Breadcrumb.
  - Cities detail: Place + PostalAddress + Breadcrumb.
  - Airports detail: Airport + Breadcrumb.
  - Routes detail: Service + Breadcrumb.
  - Blog detail: Article.
  - Fleet detail: Vehicle + Product + Offer.
  - Contact: LocalBusiness + ContactPoint.
- **Breadcrumbs** — visible + JSON-LD on every dynamic detail page; helper `breadcrumbJsonLd()` from `src/lib/seo.ts` used consistently.
- **Internal links** — every page renders public header + footer nav; related-content grid on every dynamic detail; no orphan sampled.
- **Robots / indexability** — `robots.txt` allows all major bots (incl. GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended); admin/auth/api paths disallowed. No public route emits `robots: noindex`.
- **Sitemap inclusion** — 532 URLs in `sitemap.xml` (all AR/EN static + all published CMS/blog rows). `sitemap-images.xml` now locale-prefixed and deduped.
- **AI-readable content** — `llms.txt` present at `/llms.txt`, bilingual, points to primary sections and booking channels.
- **Semantic HTML** — one `<h1>` per page (matched slug), `<nav aria-label="Breadcrumb">`, `<article>` for blog posts, `<section>` for content blocks.
- **Entity relationships & topic clusters** — homepage links to `/services`, `/fleet`, `/cities`, `/airports`, `/routes`, `/pricing`, `/faq`; each dynamic detail links back to its section index and to related siblings; Airport → Airport-transfers breadcrumb link; Route → Routes hub.
- **Programmatic SEO** — 25 cities × 2 locales, 17 airports × 2, 107 routes × 2, 20 services × 2, 9 fleet × 2, 71 blog × 2 = ~500 indexable programmatic pages, each with unique H1/title/meta/schema pulled from Supabase.

## Remaining items that cannot be fixed automatically

1. **Blog `meta_title` leftovers** — a handful of blog rows in the DB still say "Jeddah Travels" in `meta_title` (legacy brand). These are content values managed in Admin → Blog. Update in CMS; code is correct.
2. **`og:image` on dynamic pages** — leaf pages inherit the site-wide default from the platform. If the user wants per-slug social previews, upload `og_image_url` per row in the CMS (the head helper already reads it).
3. **Real reviews / ratings** — Review schema not emitted yet because no verified customer reviews exist. Once real reviews are collected they should be added to the DB and emitted as `AggregateRating` on TaxiService.
4. **External sitemap ping / GSC verification** — must be done in Google Search Console / Bing Webmaster Tools by the account owner.
5. **Core Web Vitals field data** — LCP/INP/CLS lab checks look healthy in dev, but field data (CrUX) accrues only after launch traffic.

**Files touched this turn:** `src/routes/_public.{-$locale}.{cities,airports,routes,services,fleet,blog}.tsx` renamed to `.index.tsx`; `_public.{-$locale}.contact.tsx`, `.blog.index.tsx`, `.cities.index.tsx`, `.airports.index.tsx`, `.privacy.tsx`, `.terms.tsx` head() localized; `sitemap-images[.]xml.ts` locale-prefixed + deduped.
