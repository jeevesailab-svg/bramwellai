import { createFileRoute } from "@tanstack/react-router";
import {
  SiteNav,
  SiteFooter,
  PageHero,
  HowItWorks,
  PainAccordion,
  FinalPricingCTA,
  GoldText,
} from "@/components/site/SiteChrome";

export const Route = createFileRoute("/returner")({
  component: ReturnerPage,
  head: () => ({
    meta: [
      { title: "The Comeback Pathway — Returning From a Career Gap — Bramwell AI" },
      {
        name: "description",
        content: "Private voice coaching for professionals returning from a career gap. Own the gap. $199.",
      },
      { property: "og:title", content: "Returning from a career gap — Bramwell AI" },
      {
        property: "og:description",
        content: "The gap question is coming. How you answer it decides whether they see the break — or the person who came back.",
      },
    ],
  }),
});

const PRIMARY = { label: "Start the Comeback Pathway — $199", href: "/pricing?pathway=comeback" };
const SECONDARY = { label: "Free diagnostic first →", href: "/diagnostic?autostart=1" };

function ReturnerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel={PRIMARY.label} ctaHref={PRIMARY.href} />
      <PageHero
        eyebrow="For professionals returning from a career gap"
        headline={
          <>
            You didn't leave the workforce.
            <br />
            <GoldText>The panel doesn't know that yet.</GoldText>
          </>
        }
        subhead="The gap question is coming. How you answer it decides whether they see the break — or the person who came back. Bramwell prepares you for every moment that could trip you up, before the room does."
        primaryCta={PRIMARY}
        secondary={SECONDARY}
      />

      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            The gap isn't what's costing you.
            <br />
            <GoldText>The apology is.</GoldText>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              You know what you did during the break. You know it was the right decision. You know your capability didn't
              disappear.
            </p>
            <p>
              But under the weight of the question, something shifts. The explanation runs long. You minimise what you did. An
              apology slips in that you didn't plan to give and can't take back.
            </p>
            <p className="font-medium text-foreground">The panel notices.</p>
            <p>
              Bramwell changes that — with a structure that makes the gap part of your story, not a hole in it. Delivered out
              loud, until it's unshakeable.
            </p>
          </div>
        </div>
      </section>

      <PainAccordion
        title="You're ready to go back."
        highlight="You just need to sound like it."
        items={[
          {
            q: `"I don't know how to explain the gap without it sounding like nothing."`,
            a: `What you did was real. The language you're using frames it as absence. Bramwell rebuilds the answer in terms of agency, capability, and readiness — what you were doing, not what you weren't.`,
          },
          {
            q: `"I'm worried they'll think I'm out of touch."`,
            a: `That perception forms in the first ninety seconds — mostly from voice. Bramwell calibrates register, confidence, pace. By the time they form the perception, it will be the wrong one.`,
          },
          {
            q: `"I keep apologising without meaning to."`,
            a: `The apology is structural — built into how most people answer that question. Bramwell finds it and removes it.`,
          },
          {
            q: `"I have to justify myself before we've even talked about the role."`,
            a: `The gap question should take sixty seconds, transition cleanly, and open into the conversation about what you can do. Bramwell builds that structure until it's automatic.`,
          },
          {
            q: `"I'm not sure how to talk about what I actually did — it wasn't work."`,
            a: `Caring for a parent, raising children, managing a health situation — these require exactly what senior employers say they want: resilience, prioritisation, decision-making under pressure. Bramwell translates it into the language the panel responds to.`,
          },
        ]}
      />

      <HowItWorks
        title="One pathway."
        highlight="Built for coming back clean."
        steps={[
          { n: "01", t: "Free diagnostic", b: "Bramwell listens to how you're currently telling your story — including the gap — and identifies exactly where it's costing you." },
          { n: "02", t: "The Comeback Pathway", b: "Live voice coaching on the gap, the 'why now?', the 'are you up to date?' — coached until your answer owns the question instead of apologising for it." },
          { n: "03", t: "Walk in telling the right story", b: "Not the one where you left and came back. The one where you made a decision, kept your head, and are exactly who they're looking for." },
        ]}
      />

      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <blockquote
            className="border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
            style={{ borderColor: "var(--primary)" }}
          >
            {`"Within two sessions my answers stopped wandering. I got the offer. I'd spent eight months getting nowhere."`}
            <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
              — Returning to work after maternity leave
            </footer>
          </blockquote>
        </div>
      </section>

      <FinalPricingCTA
        title="The Comeback Pathway. $199 AUD."
        highlight="Back in the room — on your terms."
        body="The gap question owned. The apology removed. The version of you the panel needs to hear."
        primary={PRIMARY}
        secondary={SECONDARY}
        urgency="The interview is coming. The question is which version of you walks into it."
      />

      <SiteFooter />
    </main>
  );
}