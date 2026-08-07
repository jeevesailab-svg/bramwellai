import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portal/welcome")({
  component: PortalWelcomePage,
  head: () => ({
    meta: [
      { title: "Enrolment confirmed, Bramwell AI" },
      {
        name: "description",
        content:
          "Your enrolment in the Speak Like a CEO program is confirmed. Complete the Executive Communication Baseline Assessment to unlock your 30 day programme.",
      },
      { property: "og:title", content: "Enrolment confirmed, Bramwell AI" },
      {
        property: "og:description",
        content:
          "Complete the Executive Communication Baseline Assessment to unlock your 30 day programme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function PortalWelcomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [setupDone, setSetupDone] = useState<boolean | null>(null);
  const [baseline, setBaseline] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (cancelled || !userData.user) return;
      const { data: row } = await supabase
        .from("users")
        .select("first_name, cv_text, jd_text, last_readiness_score")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (cancelled) return;
      setFirstName(row?.first_name?.trim() || "");
      setBaseline(row?.last_readiness_score ?? null);
      setSetupDone(
        !!row?.cv_text && row.cv_text.trim().length >= 50 &&
          !!row?.jd_text && row.jd_text.trim().length >= 50,
      );
      await supabase
        .from("users")
        .update({ welcome_shown: true } as any)
        .eq("id", userData.user.id);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startNow = () => {
    navigate({ to: setupDone ? "/portal/coach" : "/portal/setup" });
  };

  return (
    <main className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Enrolment confirmed
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          {firstName ? `${firstName}, welcome to the Speak Like a CEO program.` : "Welcome to the Speak Like a CEO program."}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Your first task is the Executive Communication Baseline Assessment. It
          measures your current communication profile and sets the benchmark for
          your personalised 30 day programme. Complete it before Day 1, in one
          sitting.
        </p>

        {baseline !== null && (
          <div className="mt-6 rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Your recorded baseline influence score is{" "}
              <span className="font-semibold text-foreground">{baseline}</span>.
              All subsequent sessions are measured against this benchmark.
            </p>
          </div>
        )}

        <ol className="mt-10 space-y-4">
          <Step
            n={1}
            title="Submit your context"
            body="Provide your CV and the role you are preparing for. Bramwell uses both to calibrate the assessment to your industry and level."
            done={setupDone === true}
            action={
              setupDone === true ? null : (
                <Link
                  to="/portal/setup"
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Submit context
                </Link>
              )
            }
          />
          <Step
            n={2}
            title="Complete the baseline assessment"
            body="Bramwell asks, you respond as you normally would. Your response is scored across Structure, Specificity, Confidence Signals and Relevance. Allow 20 to 30 minutes."
          />
          <Step
            n={3}
            title="Receive your Day 1 rebuild"
            body="One response is rebuilt to executive standard and returned to you verbatim. Your programme unlocks automatically on completion."
          />
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={startNow}
            disabled={setupDone === null}
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold shadow-sm transition hover:opacity-95 disabled:opacity-60"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--primary-foreground)",
            }}
          >
            {setupDone === false ? "Submit context to begin" : "Begin the assessment"}
          </button>
          <Link
            to="/portal/coach"
            className="text-sm text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
          >
            Go to the portal
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          A receipt has been sent to your email. Billing can be managed from the
          portal at any time.
        </p>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  body,
  done,
  action,
}: {
  n: number;
  title: string;
  body: string;
  done?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-xl border border-border bg-card p-5">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        style={
          done
            ? { background: "var(--gradient-gold)", color: "var(--primary-foreground)" }
            : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
        }
      >
        {done ? "✓" : n}
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </li>
  );
}
