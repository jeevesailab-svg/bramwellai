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

export const Route = createFileRoute("/redundant")({
  component: RedundantPage,
  head: () => ({
    meta: [
      { title: "The Comeback Pathway, After Redundancy, Bramwell AI" },
      {
        name: "description",
        content: "Private voice coaching for professionals back in the market after redundancy. Own the gap. $199.",
      },
      { property: "og:title", content: "The Comeback Pathway, Bramwell AI" },
      {
        property: "og:description",
        content: "You haven't lost your capability. You've lost the fluency. Bramwell restores it before the panel ever sees you.",
      },
    ],
  }),
});

const PRIMARY = { label: "Start the Comeback Pathway, $199", href: "/pricing?pathway=comeback" };
const SECONDARY = { label: "Free diagnostic first →", href: "/diagnostic?autostart=1" };

function RedundantPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel={PRIMARY.label} ctaHref={PRIMARY.href} />
      <PageHero
        pathway="comeback"
        eyebrow="For professionals back in the market after redundancy"
        headline={
          <>
            They made you redundant.
            <br />
            <GoldText>Now explain it in sixty seconds.</GoldText>
          </>
        }
        subhead="You haven't interviewed in years. The panel will ask why you left in your first sixty seconds. Bramwell drills the answer, and every follow-up, until it lands without apology."
        primaryCta={PRIMARY}
        secondary={SECONDARY}
      />

      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            The redundancy isn't the problem.
            <br />
            <GoldText>How you talk about it is.</GoldText>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              It was a spreadsheet decision. It had nothing to do with your capability. But the panel doesn't know that yet, and they'll decide in the first answer you give.
            </p>
            <p>
              Sixty seconds to answer "what happened?" without sounding defensive, without over-explaining, without letting the redundancy become the story they remember.
            </p>
            <p className="font-medium text-foreground">
              Bramwell builds the answer, and the "why now?" and every follow-up, until it sounds inevitable, not apologetic.
            </p>
          </div>
        </div>
      </section>

      <PainAccordion
        title="You know your worth."
        highlight="The room doesn't know it yet."
        items={[
          {
            q: `"I can't answer 'why were you made redundant?' without sounding bad."`,
            a: `There's a version that makes you sound like someone who handled an impossible situation with professionalism. Bramwell builds it in your words and drills it until it lands without apology.`,
          },
          {
            q: `"I haven't interviewed in eight years. I don't remember how to do this."`,
            a: `You haven't lost the capability. You've lost the fluency. Different problem, different fix. Bramwell restores the fluency, out loud, under real pressure.`,
          },
          {
            q: `"I feel like damaged goods and I'm worried the panel can sense it."`,
            a: `They can, but only when it leaks into the voice. Bramwell silences the hedge words, the over-explanation, the unnecessary apology. What remains is two decades of proven output.`,
          },
          {
            q: `"I freeze on follow-up questions."`,
            a: `Probing feels hostile when you haven't prepared. Bramwell runs the follow-ups until your answers hold under pressure. They won't catch you, they'll run out of things to ask.`,
          },
          {
            q: `"I keep rehearsing but I still sound scripted."`,
            a: `Scripted sounds scripted because it is. Bramwell drills the underlying structure until the words are yours, delivered differently every time, landing the same way every time.`,
          },
        ]}
      />

      <HowItWorks
        title="One pathway."
        highlight="Built for coming back."
        steps={[
          { n: "01", t: "Free diagnostic", b: "Bramwell identifies the patterns in your delivery you can't hear yourself. Your Readiness Score tells you exactly where you stand." },
          { n: "02", t: "The Comeback Pathway", b: "Live voice coaching on the gap question, the 'why now?', the follow-ups. The moments where years out of the market become visible, and how to close them." },
          { n: "03", t: "Walk back in as the person you are", b: "Not the person who lost a job to a spreadsheet. The one with two decades of output the panel hasn't seen yet." },
        ]}
      />

      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <blockquote
            className="border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
            style={{ borderColor: "var(--primary)" }}
          >
            {`"I hadn't interviewed in eleven years. I thought I'd lost it. Turns out I just needed to practice out loud once, with something that actually pushed back."`}
            <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
             , Operations Director · made redundant after 14 years
            </footer>
          </blockquote>
        </div>
      </section>

      <FinalPricingCTA
        pathway="comeback"
        title="The Comeback Pathway. $199 AUD."
        highlight="Back in the market. On the front foot."
        body="Live voice coaching on the redundancy question, the gap, the follow-ups. One payment. No subscription."
        primary={PRIMARY}
        secondary={SECONDARY}
        urgency="Your next interview is the one that ends the gap. Or extends it."
      />

      <SiteFooter />
    </main>
  );
}