import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in, Bramwell AI" },
      { name: "description", content: "Sign in to your Bramwell AI coaching account." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/portal" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal",
    });
    if (result.error) setError(result.error.message);
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to continue your sessions.">
    <button
      type="button"
      onClick={onGoogle}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-foreground/5 text-sm font-medium transition hover:bg-foreground/10"
    >
      <GoogleIcon /> Continue with Google
    </button>
    <Divider />
    <form onSubmit={onEmailSubmit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-full text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
        style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
    <p className="mt-8 text-center text-sm text-muted-foreground">
      New here?{" "}
      <Link to="/signup" className="font-medium text-foreground hover:underline">
        Create an account
      </Link>
    </p>
  </AuthShell>;
}

/* shared UI */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16" style={{ background: "var(--gradient-hero)" }}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-gold)" }} />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-10 flex items-baseline justify-center gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span className="text-xl font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
        </Link>
        <div className="rounded-2xl border border-border bg-background/70 p-8 backdrop-blur md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}

export function Field({ label, type, value, onChange, required, autoComplete }: { label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-border bg-foreground/5 px-4 text-sm text-foreground outline-none transition focus:border-foreground/40"
      />
    </label>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.3 12 2.3 6.7 2.3 2.5 6.6 2.5 12s4.2 9.7 9.5 9.7c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"/>
    </svg>
  );
}