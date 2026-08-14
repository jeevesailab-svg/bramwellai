import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://bramwellai.com";

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/diagnostic", changefreq: "weekly", priority: "0.9" },
  { path: "/program", changefreq: "weekly", priority: "0.9" },
  { path: "/articles", changefreq: "weekly", priority: "0.8" },
  { path: "/founders", changefreq: "monthly", priority: "0.7" },
  { path: "/signup", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articles: Array<{ slug: string; updated_at: string | null }> = [];
        try {
          const { data, error } = await supabase
            .from("articles")
            .select("slug, updated_at")
            .eq("published", true)
            .order("published_at", { ascending: false });
          if (error) throw error;
          articles = data ?? [];
        } catch (err) {
          console.error("sitemap: failed to load articles", err);
        }

        const urls = [
          ...STATIC_ROUTES.map(
            (r) =>
              `  <url><loc>${SITE_URL}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
          ),
          ...articles.map((a) => {
            const loc = `${SITE_URL}/articles/${escapeXml(a.slug)}`;
            const lastmod = a.updated_at
              ? `<lastmod>${new Date(a.updated_at).toISOString().slice(0, 10)}</lastmod>`
              : "";
            return `  <url><loc>${loc}</loc>${lastmod}<changefreq>monthly</changefreq><priority>0.7</priority></url>`;
          }),
        ].join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});