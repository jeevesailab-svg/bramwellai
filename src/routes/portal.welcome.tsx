import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portal/welcome")({
  component: PortalWelcomePage,
  head: () => ({
    meta: [
      { title: "You're in. Start Day 1, Bramwell AI" },
      {
        name: "description",
        content:
          "Your 30 day Speak Like a CEO program is live. Three quick steps and your first scored session starts now.",
      },
      { property: "og:title", content: "You're in. Start Day 1, Bramwell AI" },
      {
        property: "og:description",
        content: "Three quick steps and your first scored session with Bramwell starts now.",
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
          Payment confirmed
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          {firstName ? `You're in, ${firstName}.` : "You're in."} Your first
          scored session starts in the next five minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          The 30 day program works because you speak on day one, not day seven.
          Three quick steps below and Bramwell will have you rebuilt your first
          answer before you close this tab.
        </p>

        {baseline !== null && (
          <div className="mt-6 rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Your starting influence score is{" "}
              <span className="font-semibold text-foreground">{baseline}</span>.
              Everything from here is measured against that number.
            </p>
          </div>
        )}

        <ol className="mt-10 space-y-4">
          <Step
            n={1}
            title="Give Bramwell your context"
            body="Paste your CV and the role or room you're preparing for. This is what makes the coaching specific instead of generic."
            done={setupDone === true}
            action={
              setupDone === true ? null : (
                <Link
                  to="/portal/setup"
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Add my context
                </Link>
              )
            }
          />
          <Step
            n={2}
            title="Run your first session, Week 1: Structure under pressure"
            body="Answer first, evidence second, then the so what. Bramwell asks, you answer, he scores you across Structure, Specificity, Confidence signals and Relevance."
          />
          <Step
            n={3}
            title="Rebuild one answer before you leave"
            body="You'll say the same answer twice. The second version is the one you take into the room. That is your day one win."
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
            {setupDone === false ? "Add my context, then start →" : "Start Day 1 now →"}
          </button>
          <Link
            to="/portal/coach"
            className="text-sm text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
          >
            Take me to the portal instead
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Your receipt is on its way by email. You can manage billing any time
          from the link at the top of the portal.
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
