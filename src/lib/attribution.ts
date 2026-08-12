/**
 * Client-side attribution capture.
 * Records where a visitor came from once, on first landing, and keeps it for the
 * whole browser session so every funnel event can be attributed to a source.
 */

const KEY = "bramwell_attribution";
const ANON_KEY = "bramwell_anon_id";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referral_code?: string;
  referrer?: string;
  landing_path?: string;
};

function inferSource(referrer: string): string | undefined {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("bramwellai.com")) return undefined;
    if (host.includes("google.")) return "google";
    if (host.includes("linkedin.")) return "linkedin";
    if (host.includes("tiktok.")) return "tiktok";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("youtube.") || host.includes("youtu.be")) return "youtube";
    if (host.includes("facebook.") || host.includes("fb.")) return "facebook";
    if (host.includes("reddit.")) return "reddit";
    if (host.includes("chatgpt.") || host.includes("openai.")) return "chatgpt";
    if (host.includes("perplexity.")) return "perplexity";
    return host;
  } catch {
    return undefined;
  }
}

export function anonId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(KEY);
    const existing: Attribution = existingRaw ? JSON.parse(existingRaw) : {};

    const incoming: Attribution = {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      utm_content: params.get("utm_content") ?? undefined,
      referral_code: params.get("ref") ?? undefined,
    };

    const hasIncoming = Object.values(incoming).some(Boolean);
    if (existingRaw && !hasIncoming) return existing;

    const referrer = document.referrer || "";
    const merged: Attribution = {
      ...existing,
      ...Object.fromEntries(Object.entries(incoming).filter(([, v]) => v)),
      referrer: existing.referrer ?? referrer,
      landing_path: existing.landing_path ?? window.location.pathname,
    };
    if (!merged.utm_source) merged.utm_source = inferSource(referrer);

    sessionStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return {};
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : captureAttribution();
  } catch {
    return {};
  }
}
