import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const PATHWAY_WELCOMES: Record<string, string> = {
  graduate: "Welcome. Let us build the career story that lands you the role.",
  comeback: "Welcome back. Let us get your voice and your confidence ready.",
  confidence: "Let us get what you know out of your head and into the room.",
  executive: "Let us make sure you sound as senior as you are.",
  club: "You are on the Club. Bramwell is always here. What is coming up next?",
};

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
  validateSearch: (search: Record<string, unknown>) => ({
    checkout: typeof search.checkout === "string" ? search.checkout : undefined,
    pathway: typeof search.pathway === "string" ? search.pathway : undefined,
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
});

function PortalLayout() {
  const navigate = useNavigate();
  const { checkout, pathway: pathwayParam } = useSearch({ from: "/portal" });
  const [ready, setReady] = useState(false);
  const [welcome, setWelcome] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. Auth gate
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (cancelled) return;
      if (userErr || !userData.user) {
        navigate({ to: "/login", replace: true });
        return;
      }
      setUserId(userData.user.id);

      // 2. Active plan gate
      const { data: row } = await supabase
        .from("users")
        .select("payment_status, sessions_purchased, sessions_completed, access_expires_at, pathway, welcome_shown")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (cancelled) return;

      const isPaid = row?.payment_status === "paid";
      const hasSessionsLeft =
        (row?.sessions_purchased ?? 0) > (row?.sessions_completed ?? 0);
      const notExpired =
        !row?.access_expires_at || new Date(row.access_expires_at) > new Date();
      const hasActivePlan = isPaid && hasSessionsLeft && notExpired;

      if (!hasActivePlan) {
        navigate({ to: "/pricing", replace: true });
        return;
      }

      // Pathway welcome banner — show after successful checkout, or any time
      // the user has not yet seen it.
      const justPaid = checkout === "success";
      const shouldShow = justPaid || row?.welcome_shown === false;
      const pwKey = (pathwayParam || row?.pathway) as string | undefined;
      if (shouldShow && pwKey && PATHWAY_WELCOMES[pwKey]) {
        setWelcome(PATHWAY_WELCOMES[pwKey]);
      }

      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, checkout, pathwayParam]);

  const dismissWelcome = async () => {
    setWelcome(null);
    if (userId) {
      await supabase.from("users").update({ welcome_shown: true } as any).eq("id", userId);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your access…
      </div>
    );
  }

  return (
    <>
      {welcome && (
        <div
          className="relative border-b border-border px-6 py-4 text-center text-sm md:text-base"
          style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
        >
          <span className="font-medium">{welcome}</span>
          <button
            onClick={dismissWelcome}
            aria-label="Dismiss"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/15 px-2 py-1 text-xs hover:bg-black/25"
          >
            ✕
          </button>
        </div>
      )}
      <Outlet />
    </>
  );
}