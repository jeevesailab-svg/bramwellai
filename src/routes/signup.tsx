import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, Field, Divider, GoogleIcon } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create your account — Bramwell AI" },
      { name: "description", content: "Start coaching with Bramwell AI in under a minute." },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/portal" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/portal",
        data: { first_name: firstName },
      },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal",
    });
    if (result.error) setError(result.error.message);
  }

  if (sent) {
    return (
      <AuthShell title="Check your inbox" subtitle="We sent a confirmation link to verify your email.">
        <p className="text-sm text-muted-foreground">
          Once confirmed, you'll be taken straight to your coaching dashboard.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Free voice diagnostic included. No card required.">
      <button
        type="button"
        onClick={onGoogle}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-foreground/5 text-sm font-medium transition hover:bg-foreground/10"
      >
        <GoogleIcon /> Continue with Google
      </button>
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="First name" type="text" value={firstName} onChange={setFirstName} required autoComplete="given-name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} required autoComplete="new-password" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
          style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}