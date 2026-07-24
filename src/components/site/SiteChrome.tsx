"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CtaButton } from "@/components/site/CtaButton";
import { CtaWithCapture, type Pathway } from "./CtaWithCapture";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { label: "How It Works", href: "/#how" },
  { label: "Pathways", href: "/#pathways" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sign In", href: "/login" },
];

export function SiteNav({ ctaLabel = "Start your coaching now", ctaHref = "/diagnostic?autostart=1" }: { ctaLabel?: string; ctaHref?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <a href="/" className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-tight">Bramwell</span>
        <span className="text-xl font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
      </a>

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
            {link.label}
          </a>
        ))}
        <a href="/waitlist" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
          For Sales Teams
          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">Apply</span>
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <CtaButton href={ctaHref} size="sm" className="hidden sm:flex">
          {ctaLabel}
        </CtaButton>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background p-6">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href="/waitlist"
                  className="mt-2 flex items-center justify-between rounded-lg border border-border bg-white px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <span>For Sales Teams</span>
                  <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">Apply</span>
                </a>
              </SheetClose>
            </nav>
            <div className="mt-6">
              <SheetClose asChild>
                <CtaButton href={ctaHref} size="md" className="w-full">
                  {ctaLabel}
                </CtaButton>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <CtaButton href={href} size="md">
      {children}
    </CtaButton>
  );
}

export function GoldText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
      {children}
    </span>
  );
}

export function StatsBar({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="relative border-y border-border bg-white py-16 md:py-20" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3 md:gap-8 md:px-10">
        {stats.map((s) => (
          <div key={s.value} className="text-center md:text-left">
            <div
              className="bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              {s.value}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PainAccordion({
  title,
  highlight,
  items,
}: {
  title: string;
  highlight: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
          <br />
          <GoldText>{highlight}</GoldText>
        </h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.map((p) => (
            <details key={p.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-tight md:text-lg">
                <span>{p.q}</span>
                <span className="mt-1 text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{p.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Bramwell</span>
            <span className="text-lg font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Your data is private. Your voice recordings are yours. Bramwell never uses your sessions to train public models.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Bramwell</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/diagnostic?autostart=1" className="transition-colors hover:text-foreground">Start your coaching now</a>
            <a href="/#pathways" className="transition-colors hover:text-foreground">Pathways</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="/waitlist" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
              For Sales Teams
              <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">Apply</span>
            </a>
            <a href="/login" className="transition-colors hover:text-foreground">Sign In</a>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">For You</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/graduate" className="transition-colors hover:text-foreground">Graduates</a>
            <a href="/redundant" className="transition-colors hover:text-foreground">After Redundancy</a>
            <a href="/returner" className="transition-colors hover:text-foreground">Returners</a>
            <a href="/pivot" className="transition-colors hover:text-foreground">Career Pivots</a>
            <a href="/executive" className="transition-colors hover:text-foreground">Executives</a>
            <a href="/advisors" className="transition-colors hover:text-foreground">For Advisors</a>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-6 md:px-10">
        <p className="text-xs text-muted-foreground">© 2026 Bramwell AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* Shared layout primitives */

export function PageHero({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondary,
  pathway,
  badge,
}: {
  eyebrow: string;
  headline: ReactNode;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondary?: { label: string; href: string };
  pathway?: Pathway;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-12 text-center md:px-10 md:pb-32 md:pt-20">
        {badge ? (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
            {badge}
          </div>
        ) : null}
        <p
          className="mx-auto mb-8 text-xs font-medium uppercase tracking-[0.22em] md:text-sm"
          style={{ backgroundImage: "var(--gradient-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          {eyebrow}
        </p>
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          {subhead}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          {pathway ? (
            <CtaWithCapture href={primaryCta.href} pathway={pathway} source="hero_cta">
              {primaryCta.label}
            </CtaWithCapture>
          ) : (
            <GoldButton href={primaryCta.href}>{primaryCta.label}</GoldButton>
          )}
          {secondary ? (
            <a href={secondary.href} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ steps, title, highlight }: { title: string; highlight: string; steps: { n: string; t: string; b: string }[] }) {
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="mb-16 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
          <br />
          <GoldText>{highlight}</GoldText>
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-border pt-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalPricingCTA({
  title,
  highlight,
  body,
  primary,
  secondary,
  urgency,
  note,
  pathway,
}: {
  title: string;
  highlight: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  urgency?: string;
  note?: string;
  pathway?: Pathway;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border py-28 md:py-40" style={{ background: "var(--gradient-hero)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          {title}
          <br />
          <GoldText>{highlight}</GoldText>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{body}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          {pathway ? (
            <CtaWithCapture href={primary.href} pathway={pathway} source="final_cta">
              {primary.label}
            </CtaWithCapture>
          ) : (
            <GoldButton href={primary.href}>{primary.label}</GoldButton>
          )}
          {secondary ? (
            <a href={secondary.href} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {secondary.label}
            </a>
          ) : null}
        </div>
        {urgency ? <p className="mt-6 text-xs italic text-muted-foreground/80 md:text-sm">{urgency}</p> : null}
        {note ? <p className="mt-4 text-xs text-muted-foreground/70">{note}</p> : null}
      </div>
    </section>
  );
}