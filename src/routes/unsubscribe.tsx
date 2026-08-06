import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Unsubscribe | Bramwell AI" },
      {
        name: "description",
        content:
          "Manage your Bramwell AI email preferences and unsubscribe from readiness emails.",
      },
      { property: "og:title", content: "Unsubscribe | Bramwell AI" },
      {
        property: "og:description",
        content: "Manage your Bramwell AI email preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

type State = "loading" | "ready" | "already" | "invalid" | "done" | "error";

function UnsubscribePage() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) {
      setState("invalid");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return setState("invalid");
        if (data.valid) return setState("ready");
        if (data.reason === "already_unsubscribed") return setState("already");
        setState("invalid");
      })
      .catch(() => setState("error"));
  }, []);

  async function confirm() {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) setState("done");
      else if (data.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Bramwell AI
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          Email preferences
        </h1>

        {state === "loading" && (
          <p className="mt-6 text-muted-foreground">Checking your link...</p>
        )}

        {state === "ready" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Confirm you would like to stop receiving emails from Bramwell.
            </p>
            <button
              type="button"
              onClick={confirm}
              disabled={busy}
              className="mt-8 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background disabled:opacity-60"
            >
              {busy ? "Unsubscribing..." : "Confirm unsubscribe"}
            </button>
          </>
        )}

        {state === "already" && (
          <p className="mt-6 text-muted-foreground">
            You are already unsubscribed. No further emails will be sent.
          </p>
        )}

        {state === "done" && (
          <p className="mt-6 text-muted-foreground">
            Done. You have been unsubscribed.
          </p>
        )}

        {state === "invalid" && (
          <p className="mt-6 text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        )}

        {state === "error" && (
          <p className="mt-6 text-muted-foreground">
            Something went wrong. Please try again later.
          </p>
        )}

        <a
          href="/"
          className="mt-10 inline-block text-sm text-muted-foreground underline"
        >
          Back to bramwellai.com
        </a>
      </div>
    </main>
  );
}
