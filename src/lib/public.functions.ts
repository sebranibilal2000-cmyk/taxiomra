// Public read-only data via server publishable Supabase client (SSR-friendly).
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function serverPublic() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const listCmsPages = createServerFn({ method: "GET" })
  .inputValidator((input: { type?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const sb = serverPublic();
    let q = sb.from("cms_pages").select("*").eq("published", true).order("sort_order");
    if (data.type) q = q.eq("page_type", data.type as any);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const getCmsPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: row } = await sb.from("cms_pages").select("*").eq("slug", data.slug).eq("published", true).maybeSingle();
    return row;
  });

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data } = await sb
    .from("blog_posts")
    .select("id,slug,title_ar,title_en,excerpt_ar,excerpt_en,cover_url,tags,published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: row } = await sb.from("blog_posts").select("*").eq("slug", data.slug).eq("published", true).maybeSingle();
    return row;
  });

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data } = await sb.from("faqs").select("*").eq("published", true).order("sort_order");
  return data ?? [];
});

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data } = await sb.from("testimonials").select("*").eq("published", true).order("sort_order");
  return data ?? [];
});

export const listVehicleCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data } = await sb
    .from("vehicle_categories")
    .select("*, vehicle_category_translations(*)")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
});
