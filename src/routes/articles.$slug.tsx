import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/articles.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import React from "react";

const SITE_URL = "https://www.bramwellai.com";

const articleQueryOptions = (slug: string) => queryOptions({
  queryKey: ["article", slug],
  queryFn: () => getArticleBySlug({ data: slug }),
});

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(articleQueryOptions(params.slug));
    if (!article) {
      throw notFound();
    }
  },
  errorComponent: ({ error }) => {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link to="/articles" className="text-primary hover:underline">
          Back to all articles
        </Link>
      </div>
    );
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  if (!article) return null;

  const faq = Array.isArray(article.faq) ? article.faq : [];
  
  const renderBody = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{block.replace("## ", "")}</h2>;
      }
      return <p key={i} className="mb-4 leading-relaxed">{block}</p>;
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": "Bramwell AI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bramwell AI",
      "logo": {
        "@type": "ImageObject",
        "url": "${SITE_URL}/logo-horizontal.svg"
      }
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${SITE_URL}/articles/${article.slug}"
    }
  };

  return (
    <article className="min-h-screen bg-background">
      <Helmet>
        <title>{`${article.title} | Bramwell AI`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`${SITE_URL}/articles/${article.slug}`} />
        <meta property="og:url" content={`${SITE_URL}/articles/${article.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="container max-w-3xl mx-auto px-4 py-16">
        <Link to="/articles" className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block">
          &larr; Back to articles
        </Link>

        <header className="mb-12">
          {article.cluster && (
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
              {article.cluster}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>
          
          {article.answer && (
            <div className="p-6 bg-muted rounded-xl mb-8 italic text-lg border-l-4 border-primary">
              {article.answer}
            </div>
          )}
        </header>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          {renderBody(article.body_md)}
        </div>

        {faq.length > 0 && (
          <section className="mt-16 border-t pt-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faq.map((item: any, i: number) => (
                <div key={i} className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-20 sticky bottom-8 left-0 right-0 z-10 px-4">
          <div className="max-w-xl mx-auto p-6 bg-primary text-primary-foreground rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 backdrop-blur-sm bg-opacity-95">
            <div className="text-center md:text-left">
              <p className="font-bold text-lg">Ready to command the room?</p>
              <p className="text-sm opacity-90">Get your personalized communication score.</p>
            </div>
            <Link
              to="/diagnostic"
              className="whitespace-nowrap rounded-md bg-background px-6 py-2 text-sm font-medium text-primary hover:bg-background/90 transition-colors"
            >
              Take the free diagnostic
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
