import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "";

interface SitemapEntry { path: string; lastmod?: string; changefreq?: string; priority?: string }

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
          { path: "/fleet", changefreq: "weekly", priority: "0.8" },
          { path: "/pricing", changefreq: "weekly", priority: "0.8" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
        ];
        try {
          const [{ data: pages }, { data: posts }] = await Promise.all([
            sb.from("cms_pages").select("slug,updated_at").eq("published", true),
            sb.from("blog_posts").select("slug,updated_at").eq("published", true),
          ]);
          for (const p of pages ?? []) entries.push({ path: `/p/${p.slug}`, lastmod: p.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.7" });
          for (const p of posts ?? []) entries.push({ path: `/blog/${p.slug}`, lastmod: p.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.6" });
        } catch {}

        const urls = entries.map((e) => [
          `  <url>`,
          `    <loc>${BASE_URL}${e.path}</loc>`,
          e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
          e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
          e.priority ? `    <priority>${e.priority}</priority>` : null,
          `  </url>`,
        ].filter(Boolean).join("\n"));

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
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
