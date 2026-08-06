import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portal/")({
  component: PortalGate,
});

function PortalGate() {
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (cancelled || !userData.user) return;
      const { data: row } = await supabase
        .from("users")
        .select("cv_text, jd_text")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (cancelled) return;
      const ready =
        !!row?.cv_text && row.cv_text.trim().length >= 50 &&
        !!row?.jd_text && row.jd_text.trim().length >= 50;
      navigate({ to: ready ? "/portal/coach" : "/portal/setup", replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Loading your portal…
    </div>
  );
}