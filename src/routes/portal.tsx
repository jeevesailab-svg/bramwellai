import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

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

      // 2. Active plan gate
      const { data: row } = await supabase
        .from("users")
        .select("payment_status, sessions_purchased, sessions_completed, access_expires_at")
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

      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your access…
      </div>
    );
  }

  return <Outlet />;
}