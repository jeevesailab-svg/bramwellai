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

export const Route = createFileRoute("/executive")({
  component: ExecutivePage,
  head: () => ({
    meta: [
      { title: "The Executive Pathway, Private Interview Coaching, Bramwell AI" },
      {
        name: "description",
        content: "Private executive interview preparation. No referral. No record. Available tonight. $499.",
      },
      { property: "og:title", content: "The Executive Pathway, Bramwell AI" },
      {
        property: "og:description",
        content: "The only preparation that happens entirely in private, and the only coach available the night before, with no referral and no record.",
      },
    ],
  }),
});

const PRIMARY = { label: "Start the Executive Pathway, $499", href: "/pricing?pathway=executive" };
const SECONDARY = { label: "Free diagnostic first →", href: "/diagnostic?autostart=1" };

function ExecutivePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel={PRIMARY.label} ctaHref={PRIMARY.href} />
      <PageHero
        pathway="executive"
        eyebrow="For senior leaders and executives"
        headline={
          <>
            You've hired hundreds of people.
            <br />
            <GoldText>Now you're the one being interviewed.</GoldText>
          </>
        }
        subhead="You know what panels look for. What you can't do is practise with anyone who knows you. Bramwell is private executive prep, available tonight, no referral, no record, no one notified."
        primaryCta={PRIMARY}
        secondary={SECONDARY}
      />

      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            The stakes are higher than ever.
            <br />
            <GoldText>The preparation options are worse than ever.</GoldText>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Practise with a colleague and they know you're looking. Hire a coach in your network and word gets back. At your level, needing to prepare is the one thing no one is supposed to see.
            </p>
            <p>
              So you rehearse alone. And in the first ten minutes, something doesn't land. The panel notices. They always notice.
            </p>
            <p className="font-medium text-foreground">
              Bramwell is the prep no one sees. No record. No referral. Tonight, if you need it.
            </p>
          </div>
        </div>
      </section>

      <PainAccordion
        title="You know what you're worth."
        highlight="The panel is about to decide if they agree."
        items={[
          {
            q: `"I can't let anyone in my network know I'm in the market."`,
            a: `No referral, no institutional access, no connection to your network. Your name, your sessions, your recordings, private to your account. The preparation happens entirely outside the world that knows you.`,
          },
          {
            q: `"I know how to lead a room. I'm not sure how to be led through one."`,
            a: `The interview room inverts everything you're used to. Bramwell coaches the executive interview dynamic, how to hold authority as the candidate, control pace, handle challenge without losing composure.`,
          },
          {
            q: `"I haven't formally interviewed in fifteen years. The format has changed."`,
            a: `Competency-based panels. Values-based questioning. Board presentations. Bramwell runs current executive formats, what they're really testing, and how to answer in the register that confirms you belong.`,
          },
          {
            q: `"My answers are good. I'm not sure they're landing the way I intend."`,
            a: `Intention and impact are different things. Bramwell provides the real-time audio feedback no colleague, no partner, no mental rehearsal can give you: exactly how you sound, and exactly what to change.`,
          },
          {
            q: `"It's a board appointment. Different conversation entirely."`,
            a: `Board-level interviews aren't about competency, they're about character, judgement, and fit. Bramwell calibrates to the specific room, including board-level appointments where what they're really deciding is whether you're the right person to trust.`,
          },
        ]}
      />

      {/* Privacy, distinct block */}
      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <div
            className="rounded-2xl border p-10 md:p-14"
            style={{ borderColor: "var(--primary)", background: "oklch(0.12 0.02 255)" }}
          >
            <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              The one thing that cannot get out.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                Your CV is private to your account. Your voice recordings are encrypted and never used to train public models. Your sessions are invisible to your organisation, your recruiter, and anyone in your network.
              </p>
              <p className="font-medium text-foreground">Bramwell does not know anyone you know.</p>
              <p className="italic text-muted-foreground/80">That is the point.</p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks
        title="Preparation at the level the role demands."
        highlight="Entirely on your terms."
        steps={[
          { n: "01", t: "Start directly, no referral", b: "No waitlist, no intake form, no institutional process. Your preparation begins the moment you decide it does." },
          { n: "02", t: "The Executive Pathway", b: "Live voice coaching calibrated for the executive interview, board register, competency frameworks, values-based questions, moments of challenge." },
          { n: "03", t: "Walk in as the decision", b: "Not the candidate. The decision. Certain, precise, entirely ready." },
        ]}
      />

      {/* Proof, quote + value contrast */}
      <section className="border-t border-border py-24" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <blockquote className="text-2xl italic leading-relaxed text-foreground/90 md:text-3xl">
            {`"Bramwell is the only coach that will never tell a soul."`}
          </blockquote>
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div className="text-left md:text-right">
              <div className="bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl" style={{ backgroundImage: "var(--gradient-gold)" }}>
                $5,000
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Per session with executive communications coaches. If you can get a referral.
              </p>
            </div>
            <div className="text-left">
              <div className="bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl" style={{ backgroundImage: "var(--gradient-gold)" }}>
                $499
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Tonight. No referral required. No one notified.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalPricingCTA
        pathway="executive"
        title="The Executive Pathway. $499 AUD."
        highlight="The interview that changes the next decade."
        body="The preparation that used to cost $5,000 an engagement, available tonight, privately, without a referral. One payment. No record."
        primary={PRIMARY}
        secondary={SECONDARY}
        note="No login required to begin. Your account is private. Nothing is shared."
      />

      <SiteFooter />
    </main>
  );
}