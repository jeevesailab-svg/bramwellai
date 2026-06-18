import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { GoldText } from "@/components/site/SiteChrome";

const schema = z.object({
  institution: z
    .string()
    .trim()
    .min(2, "Please enter your institution")
    .max(120, "Institution name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid work email")
    .max(180, "Email is too long"),
});

function makeCode(seed: string) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  return `B${h.toString(36).slice(0, 5).toUpperCase()}${t}`;
}

export function InstitutionalAccess() {
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://bramwellai.com";

  const referralUrl = useMemo(() => {
    if (!submitted) return "";
    const params = new URLSearchParams({
      ref: submitted.code,
      inst: institution.slice(0, 60),
      autostart: "1",
    });
    return `${origin}/diagnostic?${params.toString()}`;
  }, [submitted, institution, origin]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ institution, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    const code = makeCode(`${parsed.data.email}|${parsed.data.institution}`);
    setSubmitted({ code });

    // Fire the referral email automatically (mailto opens user's client pre-filled).
    const url = `${origin}/diagnostic?ref=${code}&inst=${encodeURIComponent(parsed.data.institution.slice(0, 60))}&autostart=1`;
    const subject = `Your Bramwell pilot referral link — ${parsed.data.institution}`;
    const body =
      `Hi,\n\nYou're in. Here's your private referral link for the Bramwell free 50-student pilot:\n\n${url}\n\n` +
      `Share this link with up to 50 students on your caseload. They get the full Readiness Diagnostic free — no signup, no login wall.\n\n` +
      `We'll send a cohort report (anonymised) once 10+ students complete it.\n\n— Bramwell`;
    const mailto = `mailto:${encodeURIComponent(parsed.data.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Use a hidden anchor so popup blockers don't intercept.
    if (typeof window !== "undefined") {
      const a = document.createElement("a");
      a.href = mailto;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="access"
      className="relative overflow-hidden border-t border-border py-28 md:py-40"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--primary)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
          Free pilot — early access
        </div>
        <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          50 students. Free.
          <br />
          <GoldText>Your private referral link, in your inbox.</GoldText>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          The first 50 students from your institution get the full Bramwell Readiness Diagnostic
          free. No login wall, no IT integration. Enter your details — we send the referral link to
          your inbox the moment you submit.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 max-w-xl space-y-3 text-left"
            noValidate
          >
            <div>
              <label htmlFor="inst" className="sr-only">Institution</label>
              <input
                id="inst"
                type="text"
                required
                maxLength={120}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institution (e.g. University of Manchester)"
                className="w-full rounded-md border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Work email</label>
              <input
                id="email"
                type="email"
                required
                maxLength={180}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                className="w-full rounded-md border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {error ? (
              <p className="text-xs text-destructive" role="alert">{error}</p>
            ) : null}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
              style={{ background: "var(--gradient-gold)" }}
            >
              Send my free 50-student pilot link
            </button>
            <p className="text-center text-[11px] text-muted-foreground/70">
              We'll email your referral link instantly. No spam, no sales call.
            </p>
          </form>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-border bg-background/70 p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
              ✓ Link sent to {email}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Your private pilot link for <span className="font-medium text-foreground">{institution}</span>:
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <code className="flex-1 truncate text-xs text-foreground md:text-sm">{referralUrl}</code>
              <button
                type="button"
                onClick={copyLink}
                className="rounded border border-border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Share with up to 50 students. We'll send an anonymised cohort report once 10+ complete it.
            </p>
            <a
              href={referralUrl}
              className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--primary)" }}
            >
              Preview the diagnostic →
            </a>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/diagnostic"
            search={{ autostart: "1" }}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Or try the Free Diagnostic yourself
          </Link>
        </div>
      </div>
    </section>
  );
}