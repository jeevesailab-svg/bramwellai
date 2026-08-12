import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublishedArticles } from "@/lib/articles.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.bramwellai.com";

const articlesQueryOptions = queryOptions({
  queryKey: ["published-articles"],
  queryFn: () => getPublishedArticles(),
});

export const Route = createFileRoute("/articles")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(articlesQueryOptions);
  },
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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Articles | Bramwell AI</title>
        <meta name="description" content="Expert insights on executive presence, voice coaching, and leadership communication." />
        <link rel="canonical" href={`${SITE_URL}/articles`} />
        <meta property="og:url" content={`${SITE_URL}/articles`} />
        <meta property="og:title" content="Articles | Bramwell AI" />
        <meta property="og:description" content="Expert insights on executive presence, voice coaching, and leadership communication." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Articles</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical advice and authoritative guides on developing your executive presence and communication skills.
          </p>
        </header>

        <div className="space-y-16">
          {Object.entries(groupedArticles).map(([cluster, clusterArticles]) => (
            <section key={cluster}>
              <h2 className="text-2xl font-bold mb-8 border-b pb-2">{cluster}</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {clusterArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="group block p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      Read article &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-24 p-8 md:p-12 rounded-2xl bg-primary text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">Find out why you're being ignored</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Get a personalized assessment of your executive presence and a clear roadmap for improvement.
          </p>
          <Link
            to="/diagnostic"
            className="inline-flex items-center justify-center rounded-md bg-background px-8 py-3 text-lg font-medium text-primary hover:bg-background/90 transition-colors"
          >
            Take the free diagnostic
          </Link>
        </section>
      </div>
    </div>
  );
}
