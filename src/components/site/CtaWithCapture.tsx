import { useState, type ReactNode } from "react";
import { CtaButton } from "@/components/site/CtaButton";

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
      <CtaButton as="button" onClick={() => setOpen(true)} size="md">
        {children}
      </CtaButton>
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
      <CtaButton as="button" size="sm" showArrow={false} className={submitting ? "opacity-60" : ""}>
        {submitting ? "…" : "Continue"}
      </CtaButton>
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