import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = ""; // empty = paths are host-relative; hosting resolves to absolute
const LOCALES = ["ar", "en"] as const;
type Locale = (typeof LOCALES)[number];

interface SitemapEntry {
  path: string; // locale-less path, e.g. "/about" or "/" or "/blog/foo"
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sb = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/services", changefreq: "weekly", priority: "0.9" },
          { path: "/airport-transfers", changefreq: "weekly", priority: "0.9" },
          { path: "/fleet", changefreq: "weekly", priority: "0.8" },
          { path: "/pricing", changefreq: "weekly", priority: "0.8" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/refund", changefreq: "yearly", priority: "0.3" },
          { path: "/cancellation", changefreq: "yearly", priority: "0.3" },
        ];
        try {
          const [{ data: pages }, { data: posts }] = await Promise.all([
            sb.from("cms_pages").select("slug,updated_at").eq("published", true),
            sb.from("blog_posts").select("slug,updated_at").eq("published", true),
          ]);
          for (const p of pages ?? [])
            entries.push({ path: `/p/${p.slug}`, lastmod: p.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.7" });
          for (const p of posts ?? [])
            entries.push({ path: `/blog/${p.slug}`, lastmod: p.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.6" });
        } catch {
          /* Data API unreachable — fall back to the static entries. */
        }

        const localizedPath = (path: string, locale: Locale) =>
          path === "/" ? `/${locale}` : `/${locale}${path}`;

        const buildUrl = (entry: SitemapEntry, locale: Locale) => {
          const loc = `${BASE_URL}${localizedPath(entry.path, locale)}`;
          const alternates = LOCALES.map(
            (l) =>
              `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${localizedPath(entry.path, l)}" />`,
          );
          alternates.push(
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${localizedPath(entry.path, "ar")}" />`,
          );
          return [
            `  <url>`,
            `    <loc>${loc}</loc>`,
            entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
            ...alternates,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        };

        const urls: string[] = [];
        for (const entry of entries) {
          for (const locale of LOCALES) {
            urls.push(buildUrl(entry, locale));
          }
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
