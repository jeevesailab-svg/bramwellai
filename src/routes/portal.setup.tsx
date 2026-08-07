import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { extractKeyPhrases } from "@/lib/extract-key-phrases";

export const Route = createFileRoute("/portal/setup")({
  component: PortalSetupPage,
  head: () => ({
    meta: [
      { title: "Submit your context, Bramwell AI" },
      {
        name: "description",
        content:
          "Submit your CV and the target role description so Bramwell can calibrate your assessment and 30 day programme.",
      },
    ],
  }),
});

const MAX_CHARS = 20000;

function PortalSetupPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth gate + hydrate existing values
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: authErr } = await supabase.auth.getUser();
      if (cancelled) return;
      if (authErr || !data.user) {
        navigate({ to: "/login", replace: true });
        return;
      }
      setUserId(data.user.id);
      const { data: row } = await supabase
        .from("users")
        .select("cv_text, jd_text")
        .eq("id", data.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (row?.cv_text) setCvText(row.cv_text);
      if (row?.jd_text) setJdText(row.jd_text);
      setAuthChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (s: string) => void,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1_000_000) {
      setError("Please keep files under 1 MB. Paste the text directly if needed.");
      return;
    }
    try {
      const txt = await file.text();
      setter(txt.slice(0, MAX_CHARS));
      setError(null);
    } catch {
      setError("Couldn't read that file. Paste the text directly instead.");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setError(null);

    const cv = cvText.trim().slice(0, MAX_CHARS);
    const jd = jdText.trim().slice(0, MAX_CHARS);
    if (cv.length < 50) return setError("Your CV looks too short. Paste the full text.");
    if (jd.length < 50) return setError("The job description looks too short. Paste the full posting.");

    setSaving(true);
    const keyPhrases = extractKeyPhrases(jd, 7);
    const { error: updErr } = await supabase
      .from("users")
      .update({
        cv_text: cv,
        jd_text: jd,
        jd_key_phrases: keyPhrases.join(", "),
      })
      .eq("id", userId);
    setSaving(false);
    if (updErr) {
      console.error(updErr);
      setError("We couldn't save that. Please try again.");
      return;
    }
    setSavedAt(new Date());
    navigate({ to: "/portal/coach" });
  }

  const cvReady = cvText.trim().length >= 50;
  const jdReady = jdText.trim().length >= 50;
  const bothReady = cvReady && jdReady && !!savedAt;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="text-sm font-semibold tracking-wide">
            BRAMWELL AI
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-14 text-center md:px-10 md:pt-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Step 1 of 2, Context
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
            Submit the two documents required to calibrate your programme.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
            Your CV and the description of the role you are targeting. Both are used to
            calibrate the assessment questions to your industry, level and the language
            of the role.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <form onSubmit={save} className="space-y-8">
          <Card
            title="Your CV"
            subtitle="Paste the full text. Copy directly from a PDF if required."
            ready={cvReady}
          >
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value.slice(0, MAX_CHARS))}
              rows={12}
              placeholder="Paste your CV here"
              className="w-full resize-y rounded-lg border border-border/60 bg-card/50 p-4 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              disabled={!authChecked}
            />
            <FileRow
              label="Or upload a .txt file"
              onChange={(e) => handleFile(e, setCvText)}
              count={cvText.length}
            />
          </Card>

          <Card
            title="Target role description"
            subtitle="Paste the full posting. Key phrases are extracted and used in your assessment."
            ready={jdReady}
          >
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value.slice(0, MAX_CHARS))}
              rows={12}
              placeholder="Paste the role description here"
              className="w-full resize-y rounded-lg border border-border/60 bg-card/50 p-4 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              disabled={!authChecked}
            />
            <FileRow
              label="Or upload a .txt file"
              onChange={(e) => handleFile(e, setJdText)}
              count={jdText.length}
            />
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Stored on your private profile. Accessible only to you and Bramwell.
            </p>
            <button
              type="submit"
              disabled={saving || !authChecked}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--gradient-gold)" }}
            >
              {saving ? "Saving" : savedAt ? "Update" : "Save and continue"}
            </button>
          </div>

          {bothReady && (
            <div
              className="rounded-xl border border-primary/40 bg-card/60 p-5 text-sm"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <p className="font-semibold text-foreground">
                Context received.
              </p>
              <p className="mt-1 text-muted-foreground">
                Your assessment is calibrated and unlocks on the next step.
              </p>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

function Card({
  title,
  subtitle,
  ready,
  children,
}: {
  title: string;
  subtitle: string;
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-border/50 bg-card/40 p-5 md:p-6"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            ready
              ? "bg-primary/15 text-primary"
              : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {ready ? "Ready" : "Needed"}
        </span>
      </div>
      {children}
    </div>
  );
}

function FileRow({
  label,
  onChange,
  count,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
}) {
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
      <label className="cursor-pointer underline-offset-2 hover:underline">
        {label}
        <input
          type="file"
          accept=".txt,text/plain"
          onChange={onChange}
          className="hidden"
        />
      </label>
      <span>{count.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars</span>
    </div>
  );
}