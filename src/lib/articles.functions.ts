import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const getPublishedArticles = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("slug, title, description, cluster, target_keyword, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching published articles:", error);
      throw error;
    }

    return data || [];
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching article by slug (${slug}):`, error);
      throw error;
    }

    return data;
  });
