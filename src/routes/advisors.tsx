import { createFileRoute } from "@tanstack/react-router";
import {
  SiteNav,
  SiteFooter,
  PageHero,
  StatsBar,
  HowItWorks,
  FinalPricingCTA,
  GoldText,
} from "@/components/site/SiteChrome";

export const Route = createFileRoute("/advisors")({
  component: AdvisorsPage,
  head: () => ({
    meta: [
      { title: "Bramwell AI for Career Advisors — The coach in the room when you can't be" },
      {
        name: "description",
        content:
          "The private voice coach for your students — available at 11pm the night before, for every student on your caseload. Institutional early access for employability teams.",
      },
      { property: "og:title", content: "Bramwell AI for Career Advisors" },
      {
        property: "og:description",
        content: "The private voice coach that's there when you can't be — the night before, for the student who needs it most.",
      },
    ],
  }),
});

function AdvisorsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel="Get Early Access" ctaHref="#access" />
      <PageHero
        pathway="advisors"
        eyebrow="For career advisors and employability teams"
        headline={
          <>
            You can't be in the room.
            <br />
            <GoldText>Bramwell can.</GoldText>
          </>
        }
        subhead="A private voice coach for every student on your caseload. Available 11pm Sunday before Monday's interview. No booking, no waitlist, no extra advisor hours."
        primaryCta={{ label: "Get Early Access for Your Institution", href: "#access" }}
        secondary={{ label: "See how it works", href: "#how" }}
      />

      <StatsBar
        stats={[
          { value: "30%", label: "Of 2025 graduates work in their field. The gap is communication, not qualification." },
          { value: "53%", label: "Of employers say graduates can't communicate at the level the job requires." },
          { value: "300–1,000", label: "Students per advisor. Bramwell scales the coaching you can't." },
        ]}
      />

      {/* Pain — stacked list */}
      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            You've seen this student.
          </h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {[
              "The student who practiced every answer with you — then froze when the panel asked a follow-up.",
              "The one who knows their CV cold but speaks in a register ten years younger than the role.",
              "The mature-age returner who came to every session and still apologises for the gap.",
              "The graduate who is more qualified than half the shortlist — and sounds the least confident in the room.",
            ].map((line) => (
              <p key={line} className="py-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>You coach them all week. You run mocks until Friday afternoon.</p>
            <p>
              You can't be there Sunday night when the panic hits. You can't be in every student's headphones in the forty-eight hours that decide the outcome.
            </p>
            <p className="font-medium text-foreground">Bramwell can.</p>
          </div>
        </div>
      </section>

      {/* Three features */}
      <section className="border-t border-border py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="mb-16 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            What Bramwell does for your students.
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Live voice — not text prompts",
                b: "Bramwell listens to how they actually sound. Real-time feedback on cadence, structure, conviction. The delivery problems that cost them the room — fixed before the panel hears them.",
              },
              {
                t: "Available the moment they need it",
                b: "11pm the night before. Sunday before Monday's interview. Bramwell has no other clients. It never books out.",
              },
              {
                t: "Calibrated to their situation",
                b: "The graduate. The returner. The pivot. Each pathway is built for a specific moment — not a generic interview module.",
              },
            ].map((f) => (
              <div key={f.t} className="border-t border-border pt-6">
                <h3 className="text-xl font-semibold tracking-tight">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional angle */}
      <section className="border-t border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Close the gap your institution can't close any other way.
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Your KPIs — GOS results, QS employability ranking, field-aligned employment — live or die in a room you aren't in
              and can't enter.
            </p>
            <p className="font-medium text-foreground">What you can control is what your students walk in with.</p>
            <p>
              Bramwell works at the point of impact: voice-level, real-time, in the forty-eight hours before the decision.
              Referring it isn't a risk. It's the most useful thing you can put in a student's hands the week of their interview.
            </p>
          </div>
          <blockquote
            className="mt-12 border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
            style={{ borderColor: "var(--primary)" }}
          >
            {`"It's the only coach that's there at 11pm the night before. That's the only time I needed it."`}
            <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
              — Senior PM, Series B Fintech · former graduate student
            </footer>
          </blockquote>
        </div>
      </section>

      <HowItWorks
        title="Simple to refer."
        highlight="Transformative to use."
        steps={[
          { n: "01", t: "Share a link", b: "No institutional login. No IT integration. No procurement. You refer it. They use it." },
          { n: "02", t: "Free 5-minute diagnostic", b: "Students hear their Readiness Score and their three biggest gaps — in their own voice, by something that isn't you." },
          { n: "03", t: "Practice until it's owned", b: "Live two-way voice coaching on the exact questions their panel is likely to ask. Bramwell doesn't move on until the answer is ready." },
        ]}
      />

      <FinalPricingCTA
        pathway="advisors"
        title="Institutional early access."
        highlight="Now open to a small group."
        body="Bulk access, referral codes, and outcome reporting for employability teams. Request early access — or send a student to the free diagnostic today."
        primary={{ label: "Request Institutional Access", href: "mailto:hello@bramwellai.com?subject=Institutional%20access" }}
        secondary={{ label: "Try the Free Diagnostic", href: "/diagnostic?autostart=1" }}
      />

      <SiteFooter />
    </main>
  );
}