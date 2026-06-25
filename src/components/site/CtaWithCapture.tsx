import { useState, type ReactNode } from "react";

type Pathway = "graduate" | "comeback" | "returner" | "pivot" | "executive" | "advisors";

const PATHWAY_LABELS: Record<Pathway, string> = {
  graduate: "Graduate",
  comeback: "Comeback",
  returner: "Returner",
  pivot: "Pivot",
  executive: "Executive",
  advisors: "Advisors",
};

async function fireKlaviyo(args: {
  email?: string;
  pathway: Pathway;
  source: string;
  ctaLabel: string;
}) {
  try {
    await fetch("/api/public/klaviyo-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: args.email,
        eventName: `Started Diagnostic, ${PATHWAY_LABELS[args.pathway]}`,
        pathway: args.pathway,
        source: args.source,
        properties: { cta_label: args.ctaLabel },
      }),
    });
  } catch {
    // non-blocking
  }
}

export function CtaWithCapture({
  href,
  pathway,
  source,
  children,
}: {
  href: string;
  pathway: Pathway;
  source: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const label = typeof children === "string" ? children : "CTA";

  function go(withEmail?: string) {
    if (typeof window !== "undefined" && withEmail) {
      try { window.sessionStorage.setItem("bramwell_lead_email", withEmail); } catch {/* noop */}
    }
    window.location.href = href;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fireKlaviyo({ email: email.trim(), pathway, source, ctaLabel: label });
    go(email.trim());
  }

  async function onSkip() {
    setSubmitting(true);
    await fireKlaviyo({ pathway, source, ctaLabel: label });
    go();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-95"
        style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" }}
      >
        {children}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-2 rounded-2xl border border-border bg-background/60 p-3 backdrop-blur sm:flex-row sm:items-center"
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="h-10 flex-1 rounded-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
        style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
      >
        {submitting ? "…" : "Continue →"}
      </button>
      <button
        type="button"
        onClick={onSkip}
        disabled={submitting}
        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:ml-2"
      >
        Skip
      </button>
    </form>
  );
}

export type { Pathway };