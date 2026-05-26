import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell AI — Command the room. Be the one they remember." },
      {
        name: "description",
        content:
          "Bramwell is the always-on AI communication coach for high-stakes career moments. Sound as capable as you are.",
      },
      { property: "og:title", content: "Bramwell AI — Command the room." },
      {
        property: "og:description",
        content:
          "Always-on AI communication coaching for interviews, promotions, and the moments that matter.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
    </main>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span
            className="text-xl font-light tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            AI
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
          <a href="/login" className="transition-colors hover:text-foreground">Sign in</a>
        </nav>
        <a
          href="/benchmark"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-foreground/5 px-5 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
        >
          Free benchmark
        </a>
      </header>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.13 78 / 0.4), transparent)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-20 text-center md:px-10 md:pb-40 md:pt-32">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--primary)" }}
          />
          Always-on AI communication coach
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]">
          Command the room.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Be the one they remember.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bramwell is your private AI coach for the conversations that decide
          your career — interviews, promotions, board rooms. Rehearse out loud.
          Sound as capable as you are.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/benchmark"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Take the free benchmark
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-foreground/5 px-7 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
          >
            See pathways
          </a>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          No card required · 4-minute benchmark · Private by design
        </p>
      </div>
    </section>
  );
}
