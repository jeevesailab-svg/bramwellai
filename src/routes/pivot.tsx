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

export const Route = createFileRoute("/pivot")({
  component: PivotPage,
  head: () => ({
    meta: [
      { title: "The Confidence Pathway — Career Pivot — Bramwell AI" },
      {
        name: "description",
        content: "Translate twelve years of proof into the language of the role you actually want. Private voice coaching for career pivots. $249.",
      },
      { property: "og:title", content: "The Confidence Pathway — Bramwell AI" },
      {
        property: "og:description",
        content: "You're more qualified than the person they're about to hire. You just can't make them feel it yet.",
      },
    ],
  }),
});

const PRIMARY = { label: "Start the Confidence Pathway — $249", href: "/pricing?pathway=confidence" };
const SECONDARY = { label: "Free diagnostic first →", href: "/diagnostic?autostart=1" };

function PivotPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel={PRIMARY.label} ctaHref={PRIMARY.href} />
      <PageHero
        eyebrow="For experienced professionals who keep losing the room"
        headline={
          <>
            Twelve years of proof.
            <br />
            <GoldText>Hiring for two years of the right title.</GoldText>
          </>
        }
        subhead="You're more qualified than the person they're about to hire. You just can't make them feel it yet. Bramwell translates what you've done into the language of the role you want — and drills you until it sounds native."
        primaryCta={PRIMARY}
        secondary={SECONDARY}
      />

      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            The problem isn't your experience.
            <br />
            <GoldText>It's speaking the wrong language.</GoldText>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              You've done the work. The track record is objectively stronger than most candidates in this process. But when the
              panel asks you to walk them through your background, what they hear is someone who was excellent — somewhere
              else, doing something else.
            </p>
            <p>
              The register is off. The examples are from the wrong world. You're losing to people with the exact title and half
              your ability.
            </p>
            <p className="font-medium text-foreground">
              Bramwell rebuilds your narrative in the language of the role you want — and drills you until it sounds like you've
              been saying it for years.
            </p>
          </div>
        </div>
      </section>

      <PainAccordion
        title="You've done the work."
        highlight="Now make them hear it."
        items={[
          {
            q: `"They went with someone with more direct experience."`,
            a: `"More direct experience" usually means someone who sounded more familiar to the panel — not someone who'd actually done more. The gap is in your framing, not your experience.`,
          },
          {
            q: `"I can't answer 'why are you making this move?' without sounding like I'm running away."`,
            a: `That question is an invitation to tell a story about ambition. Bramwell builds the pivot narrative — where you've been, what it taught you, why this role is the logical next move. A case, not an explanation.`,
          },
          {
            q: `"I sound like I'm from my old industry."`,
            a: `Industry vocabulary is a dialect. Bramwell finds where yours is bleeding through — the terms, the frameworks, the examples — and replaces them with the language of the room you're trying to enter.`,
          },
          {
            q: `"I can't work out which parts of my experience are relevant."`,
            a: `The edit matters as much as the content. Bramwell identifies the three to five moments that prove your capability for this specific role and builds your answers around them.`,
          },
          {
            q: `"I interview well but never make the final shortlist."`,
            a: `That usually means the panel liked you but couldn't see you in the role. Positioning problem, not performance problem. Bramwell fixes the positioning.`,
          },
        ]}
      />

      <HowItWorks
        title="One pathway."
        highlight="Built for the career you're moving into."
        steps={[
          { n: "01", t: "Free diagnostic", b: "Bramwell listens to how you're presenting your background and identifies where the language is costing you." },
          { n: "02", t: "The Confidence Pathway", b: "Live coaching on the pivot narrative, the experience translation, the 'why you, why now?' — drilled until it sounds owned, not rehearsed." },
          { n: "03", t: "Walk in sounding like you belong", b: "Not a candidate hoping for a chance. Someone who has clearly been building toward this — and has the capability to back it up." },
        ]}
      />

      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <blockquote
            className="border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
            style={{ borderColor: "var(--primary)" }}
          >
            {`"Three of us on the final shortlist. All qualified. I was the only one who knew exactly what I was going to say and exactly how I was going to say it."`}
            <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
              — Senior candidate, final-round offer · career pivot
            </footer>
          </blockquote>
        </div>
      </section>

      <FinalPricingCTA
        title="The Confidence Pathway. $249 AUD."
        highlight="Your career, on the terms you set."
        body="One focused pathway built for experienced candidates who need to sound as capable as they are — in the language of the room they're trying to enter."
        primary={PRIMARY}
        secondary={SECONDARY}
        urgency="The interview is coming. The question is which version of you walks into it."
      />

      <SiteFooter />
    </main>
  );
}