import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/coach")({
  component: PortalCoachPage,
  head: () => ({
    meta: [
      { title: "Coaching — Bramwell AI" },
      {
        name: "description",
        content:
          "Your live Bramwell coaching session. The voice coaching widget will activate here.",
      },
    ],
  }),
});

function PortalCoachPage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="text-sm font-semibold tracking-wide">
            BRAMWELL AI
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/portal/setup"
              className="text-muted-foreground hover:text-foreground"
            >
              Update CV / JD
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:px-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Step 2 of 2 — Live coaching
        </p>
        <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
          Bramwell is ready for you.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          The live voice coaching widget will activate here in the next step.
        </p>
      </section>
    </main>
  );
}