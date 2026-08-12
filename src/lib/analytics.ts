declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;

export function initGA() {
  if (typeof window === "undefined") return;
  if (!measurementId) {
    console.warn("Google Analytics measurement ID is not configured");
    return;
  }
  if (window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false });
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params ?? {});
}

/**
 * Dual-write tracking: GA4 for the marketing UI, our own database for the
 * growth dashboard so analysis never depends on an external tool.
 */
export async function trackFunnel(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>,
  opts?: { email?: string; diagnosticSessionId?: string }
) {
  if (typeof window === "undefined") return;

  const clean = Object.fromEntries(
    Object.entries(properties ?? {}).filter(([, v]) => v !== null && v !== undefined)
  ) as Record<string, string | number | boolean>;

  trackEvent(eventName, clean);

  try {
    const { getAttribution, anonId } = await import("@/lib/attribution");
    const attr = getAttribution();
    const body = JSON.stringify({
      eventName,
      sessionId: anonId(),
      diagnosticSessionId: opts?.diagnosticSessionId,
      email: opts?.email,
      path: window.location.pathname,
      referrer: attr.referrer,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      referral_code: attr.referral_code,
      properties: clean,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/public/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // never block the user
  }
}
