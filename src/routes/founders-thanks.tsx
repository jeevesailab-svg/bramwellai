import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/founders-thanks")({
  component: FoundersThanksPage,
  head: () => ({
    meta: [
      { title: "Thank You | Elite Sales Team Voice AI Coach | Bramwell AI" },
      {
        name: "description",
        content:
          "Your enrolment is confirmed. We will contact you within one business day to schedule your implementation kickoff.",
      },
      { property: "og:title", content: "Thank You | Elite Sales Team Voice AI Coach" },
      {
        property: "og:description",
        content:
          "Your enrolment is confirmed. We will contact you within one business day to schedule your implementation kickoff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function FoundersThanksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel="Get Started" ctaHref="/founders" />

      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Enrolment confirmed
          </span>

          <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-6xl">
            Thank you. Your team is next.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Your Elite Sales Team Voice AI Coach implementation is confirmed. We will contact you
            within one business day to schedule your kickoff and collect the materials we need to build
            your private coach.
          </p>

          <div className="mt-12 rounded-2xl border border-border bg-muted p-8 text-left md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What happens next
            </p>
            <ol className="mt-6 space-y-4 text-muted-foreground">
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">1.</span>
                <span>You will receive a confirmation email with your enrolment record.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">2.</span>
                <span>We will email you within one business day to book your 30-minute kickoff call.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">3.</span>
                <span>
                  On the call we confirm your team size, sales process, and the recorded calls we need
                  to analyse.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">4.</span>
                <span>Implementation begins. Day 1 to Day 30, we build and roll out your private coach.</span>
              </li>
            </ol>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://calendar.app.google/QWKYUsrzx2k44UE76"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-9 text-base font-semibold text-background transition hover:opacity-90"
            >
              Book your kickoff call <span>→</span>
            </a>
            <a
              href="/founders"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-border px-9 text-base font-semibold transition hover:bg-accent"
            >
              Back to the programme
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
