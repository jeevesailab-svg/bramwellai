import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/articles.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { CtaButton } from "@/components/site/CtaButton";

const SITE_URL = "https://bramwellai.com";

type FAQItem = { question: string; answer: string };

const articleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug({ data: slug }),
  });

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(articleQueryOptions(params.slug));
    if (!article) {
      throw notFound();
    }
    return article;
  },
  head: ({ loaderData }) => {
    const article = loaderData;
    const url = `${SITE_URL}/articles/${article?.slug ?? ""}`;
    const faqItems: FAQItem[] = Array.isArray(article?.faq) ? (article.faq as FAQItem[]) : [];
    return {
      meta: [
        { title: `${article?.title ?? "Article"} | Bramwell AI` },
        { name: "description", content: article?.description ?? "" },
        { property: "og:title", content: article?.title ?? "Article" },
        { property: "og:url", content: url },
        { property: "og:description", content: article?.description ?? "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: article
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: article.title,
                description: article.description,
                author: { "@type": "Organization", name: "Bramwell AI" },
                publisher: {
                  "@type": "Organization",
                  name: "Bramwell AI",
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-horizontal.svg` },
                },
                datePublished: article.published_at,
                dateModified: article.updated_at,
                mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/articles/${article.slug}` },
              }),
            },
            ...(faqItems.length
              ? [
                  {
                    type: "application/ld+json",
                    children: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      mainEntity: faqItems.map((item) => ({
                        "@type": "Question",
                        name: item.question,
                        acceptedAnswer: { "@type": "Answer", text: item.answer },
                      })),
                    }),
                  },
                ]
              : []),
          ]
        : [],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  if (!article) return null;

  const faq = Array.isArray(article.faq) ? (article.faq as FAQItem[]) : [];

  const renderBody = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="mt-10 mb-4 text-2xl font-semibold tracking-tight">
            {block.replace("## ", "")}
          </h2>
        );
      }
      return (
        <p key={i} className="mb-4 leading-relaxed text-foreground/90">
          {block}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/articles" className="mb-8 inline-block text-sm text-muted-foreground hover:text-primary">
          &larr; Back to articles
        </Link>

        <article>
          <header className="mb-10">
            {article.cluster ? (
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {article.cluster}
              </span>
            ) : null}
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{article.title}</h1>

            {article.answer ? (
              <div className="mt-8 rounded-2xl border-l-4 border-primary bg-foreground/[0.03] p-6 text-lg italic text-foreground/90">
                {article.answer}
              </div>
            ) : null}
          </header>

          <div className="text-foreground/90">{renderBody(article.body_md)}</div>

          {faq.length > 0 ? (
            <section className="mt-16 border-t border-border pt-12">
              <h2 className="mb-8 text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faq.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-foreground/[0.02] p-6">
                    <h3 className="text-lg font-semibold tracking-tight">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <section className="mt-20 rounded-2xl border border-border bg-foreground/[0.02] p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to command the room?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Get your personalised communication score and a clear roadmap to speak like a CEO.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton href="/diagnostic" size="lg">
              Take the free diagnostic
            </CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
