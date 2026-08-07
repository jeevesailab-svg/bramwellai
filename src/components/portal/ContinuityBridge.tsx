import { useStripeCheckout } from "@/hooks/useStripeCheckout";

const ACCELERATOR_PRICE_ID = "accelerator_monthly";

export function ContinuityBridge({
  userId,
  email,
  sessionsCompleted,
  sessionsPurchased,
  latestScore,
  baselineScore,
}: {
  userId: string;
  email?: string | undefined;
  sessionsCompleted: number;
  sessionsPurchased: number;
  latestScore: number | null;
  baselineScore: number | null;
}) {
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();

  const total = sessionsPurchased || 30;
  const remaining = Math.max(total - sessionsCompleted, 0);

  // Only surface the bridge in the last week of the program, or once it is done.
  if (sessionsCompleted < Math.max(total - 6, 1)) return null;

  const finished = remaining === 0;
  const gained =
    latestScore !== null && baselineScore !== null ? latestScore - baselineScore : null;

  const start = () => {
    openCheckout({
      priceId: ACCELERATOR_PRICE_ID,
      ...(email ? { customerEmail: email } : {}),
      userId,
      returnUrl: `${window.location.origin}/portal?checkout=success&pathway=accelerator&session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-foreground/[0.03] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {finished ? "Your 30 days are complete" : `${remaining} sessions left`}
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        Grow your score
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {gained !== null && gained > 0 ? (
          <>
            You have moved from {baselineScore} to {latestScore}, a gain of {gained} points.
            Delivery is a habit, not a certificate. Members who keep practising every week keep
            climbing. Members who stop drift back within a month.
          </>
        ) : (
          <>
            Delivery is a habit, not a certificate. Keep one live session a week with Bramwell and
            your score keeps climbing instead of drifting back.
          </>
        )}
      </p>

      <ul className="mt-5 space-y-2 text-sm">
        {[
          "Weekly live voice sessions with Bramwell",
          "Scored every session on Structure, Specificity, Confidence Signals and Relevance",
          "Your score curve keeps building past Day 30",
          "Fresh scenarios pulled from your real role",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="text-muted-foreground">
              &middot;
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={start}
          className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Continue for $79 a month
        </button>
        <span className="text-xs text-muted-foreground">Cancel anytime.</span>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="relative mt-10 w-full max-w-xl rounded-2xl border border-border bg-background p-4">
            <button
              type="button"
              onClick={closeCheckout}
              className="absolute right-4 top-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
            <div className="pt-8">{checkoutElement}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
