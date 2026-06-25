import { createFileRoute } from "@tanstack/react-router";
import {
  SiteNav,
  SiteFooter,
  PageHero,
  StatsBar,
  HowItWorks,
  PainAccordion,
  FinalPricingCTA,
  GoldText,
} from "@/components/site/SiteChrome";

export const Route = createFileRoute("/graduate")({
  component: GraduatePage,
  head: () => ({
    meta: [
      { title: "The Graduate Pathway, Bramwell AI" },
      {
        name: "description",
        content:
          "You spent four years becoming qualified. You have ninety seconds to prove it. Private voice coaching for your first serious interview. $99.",
      },
      { property: "og:title", content: "The Graduate Pathway, Bramwell AI" },
      {
        property: "og:description",
        content: "Private voice coaching that makes you sound as capable as you already are, before the panel decides you don't.",
      },
    ],
  }),
});

const PRIMARY = { label: "Start the Graduate Pathway, $99", href: "/pricing?pathway=graduate" };
const SECONDARY = { label: "Free diagnostic first →", href: "/diagnostic?autostart=1" };

function GraduatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel={PRIMARY.label} ctaHref={PRIMARY.href} />
      <PageHero
        pathway="graduate"
        eyebrow="For graduates entering the room for the first time"
        headline={
          <>
            Four years to qualify.
            <br />
            <GoldText>Ninety seconds to prove it.</GoldText>
          </>
        }
        subhead="The graduates who get hired don't have better degrees. They sound more ready. Bramwell drills you on the exact questions you'll face, out loud, under pressure, until you do too."
        primaryCta={PRIMARY}
        secondary={SECONDARY}
      />

      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            They're not rejecting your CV.
            <br />
            <GoldText>They're rejecting how you sound on the day.</GoldText>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              You know the degree. You know the internship. You know why you're a fit. But under pressure it comes out rushed, vague, junior.
            </p>
            <p className="font-medium text-foreground">That's a preparation problem, not a you problem.</p>
            <p>
              The candidate who wins sounds like they've already done the job. Bramwell builds that sound, before the panel hears the real one.
            </p>
          </div>
        </div>
      </section>

      <PainAccordion
        title="You're ready for the role."
        highlight="You're just not ready for the room."
        items={[
          {
            q: `"I don't have enough experience to sound confident."`,
            a: `You have more than you think, you're framing it wrong. Bramwell mines what you've actually done and drills you on delivering it in the language of the role.`,
          },
          {
            q: `"They're going to ask something I can't answer."`,
            a: `Six questions decide most graduate interviews. Bramwell runs you through all of them, under pressure, until your worst answer beats most candidates' best.`,
          },
          {
            q: `"I freeze when there's silence after my answer."`,
            a: `Silence usually means the panel is writing. Bramwell trains you on what happens after you speak, the follow-ups, the probes, until silence stops feeling like a verdict.`,
          },
          {
            q: `"I ramble through 'tell me about yourself.'"`,
            a: `That question has a structure. Bramwell installs it until it runs automatically, in the thirty seconds where everything is decided.`,
          },
          {
            q: `"I don't know how to make my degree sound relevant."`,
            a: `Translation from academic to professional is a skill. Most graduates never learn it. Bramwell teaches it, specifically, in your words, for the role you're applying for.`,
          },
        ]}
      />

      <HowItWorks
        title="One pathway."
        highlight="Built for exactly this moment."
        steps={[
          { n: "01", t: "Free diagnostic", b: "Bramwell listens, identifies your three biggest gaps, and gives you your Readiness Score." },
          { n: "02", t: "The Graduate Pathway", b: "Live two-way voice coaching on the questions you'll actually face. The answers that actually land. Drilled until they're yours." },
          { n: "03", t: "Walk in differently", b: "Not memorised. Not rehearsed. Owned. The version of you the panel hears is the best one." },
        ]}
      />

      <StatsBar
        stats={[
          { value: "340", label: "Applicants per graduate role. Same degree. One sounds ready." },
          { value: "5 min", label: "Free diagnostic. No card. Your Readiness Score on the spot." },
          { value: "$99", label: "One-time. No subscription. The interview that starts your career." },
        ]}
      />

      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <blockquote
            className="border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
            style={{ borderColor: "var(--primary)" }}
          >
            {`"I walked in knowing exactly how I sounded. That changed everything."`}
            <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
             , Director, FTSE 100 · on her first senior panel
            </footer>
          </blockquote>
        </div>
      </section>

      <FinalPricingCTA
        pathway="graduate"
        title="The Graduate Pathway. $99 AUD."
        highlight="The interview that starts your career."
        body="Live voice coaching on the questions you'll actually face. One payment. No subscription."
        primary={PRIMARY}
        secondary={SECONDARY}
        urgency="Your interview is coming. Walk in prepared, or walk in hoping."
      />

      <SiteFooter />
    </main>
  );
}