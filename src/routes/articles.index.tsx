import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublishedArticles } from "@/lib/articles.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { CtaButton } from "@/components/site/CtaButton";

const SITE_URL = "https://www.bramwellai.com";

const articlesQueryOptions = queryOptions({
  queryKey: ["published-articles"],
  queryFn: () => getPublishedArticles(),
});

export const Route = createFileRoute("/articles/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(articlesQueryOptions);
  },
  head: () => ({
    meta: [
      { title: "Articles | Bramwell AI" },
      { name: "description", content: "Expert insights on executive presence, voice coaching, and leadership communication." },
      { property: "og:title", content: "Articles | Bramwell AI" },
      { property: "og:url", content: `${SITE_URL}/articles` },
      { property: "og:description", content: "Expert insights on executive presence, voice coaching, and leadership communication." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/articles` }],
  }),
  component: ArticlesIndex,
});

function ArticlesIndex() {
  const { data: articles } = useSuspenseQuery(articlesQueryOptions);

  const groupedArticles = articles.reduce((acc, article) => {
    const cluster = article.cluster || "General";
    if (!acc[cluster]) acc[cluster] = [];
    acc[cluster].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Articles</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Practical advice and authoritative guides on developing your executive presence and communication skills.
          </p>
        </header>

        <div className="space-y-16">
          {Object.entries(groupedArticles).map(([cluster, clusterArticles]) => (
            <section key={cluster}>
              <h2 className="mb-8 border-b border-border pb-2 text-2xl font-semibold tracking-tight">{cluster}</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {clusterArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="group block rounded-2xl border border-border bg-foreground/[0.02] p-6 transition-colors hover:bg-foreground/[0.04]"
                  >
                    <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {article.description}
                    </p>
                    <div className="mt-4 text-sm font-medium text-primary">
                      Read article &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-24 rounded-2xl border border-border bg-foreground/[0.02] p-8 text-center md:p-12">
          <h2 className="text-3xl font-semibold tracking-tight">Find out why you're being ignored</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Get a personalised assessment of your executive presence and a clear roadmap for improvement.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton href="/diagnostic" size="lg">
              Take the free diagnostic
            </CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
