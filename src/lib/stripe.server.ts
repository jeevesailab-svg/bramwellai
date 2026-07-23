import Stripe from 'stripe';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = 'sandbox' | 'live';

const GATEWAY_STRIPE_BASE = 'https://connector-gateway.lovable.dev/stripe';

export function getConnectionApiKey(env: StripeEnv): string {
  return env === 'sandbox'
    ? getEnv('STRIPE_SANDBOX_API_KEY')
    : getEnv('STRIPE_LIVE_API_KEY');
}

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = getEnv('LOVABLE_API_KEY');

  return new Stripe(connectionApiKey, {
    apiVersion: '2026-03-25.dahlia',
    httpClient: Stripe.createFetchHttpClient(((input: URL | RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;
      const gatewayUrl = url.replace('https://api.stripe.com', GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(new Headers(init?.headers).entries()),
          'X-Connection-Api-Key': connectionApiKey,
          'Lovable-API-Key': lovableApiKey,
        },
      });
    }) as typeof fetch),
  });
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { message?: string; type?: string; code?: string; raw?: { message?: string; type?: string; code?: string } };
    const message = e.raw?.message ?? e.message;
    if (message) {
      const details = [e.raw?.type ?? e.type, e.raw?.code ?? e.code].filter(Boolean);
      return details.length ? `${message} (${details.join(', ')})` : message;
    }
  }
  return 'Stripe request failed';
}

export async function verifyWebhook(req: Request, env: StripeEnv): Promise<{ type: string; data: { object: any } }> {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const secret = env === 'sandbox'
    ? getEnv('PAYMENTS_SANDBOX_WEBHOOK_SECRET')
    : getEnv('PAYMENTS_LIVE_WEBHOOK_SECRET');

  if (!signature || !body) throw new Error('Missing signature or body');

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(',')) {
    const [key, value] = part.split('=', 2);
    if (key === 't') timestamp = value;
    if (key === 'v1') v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error('Invalid signature format');

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error('Webhook timestamp too old');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`));
  const expected = Buffer.from(new Uint8Array(signed)).toString('hex');

  if (!v1Signatures.includes(expected)) throw new Error('Invalid webhook signature');

  return JSON.parse(body);
}

/**
 * Bramwell pathway configuration - keyed by Stripe lookup_key (price_id).
 * Each entry drives the fulfillment write into `public.users` and the
 * pathway-specific welcome shown on /portal after purchase.
 */
export const PATHWAY_CONFIG = {
  graduate_sprint_onetime: {
    pathway: 'graduate',
    sessions: 3,
    minutes: 20,
    accessDays: 30,
    welcome: 'Welcome. Let us build the career story that lands you the role.',
    productName: 'Graduate Interview Sprint',
  },
  comeback_sprint_onetime: {
    pathway: 'comeback',
    sessions: 5,
    minutes: 25,
    accessDays: 30,
    welcome: 'Welcome back. Let us get your voice and your confidence ready.',
    productName: 'Career Comeback Sprint',
  },
  confidence_sprint_onetime: {
    pathway: 'confidence',
    sessions: 6,
    minutes: 30,
    accessDays: 60,
    welcome: 'Let us get what you know out of your head and into the room.',
    productName: 'Interview Confidence Sprint',
  },
  executive_sprint_onetime: {
    pathway: 'executive',
    sessions: 8,
    minutes: 30,
    accessDays: 90,
    welcome: 'Let us make sure you sound as senior as you are.',
    productName: 'Executive Communication Sprint',
  },
  career_confidence_club_monthly: {
    pathway: 'club',
    sessions: 9999,
    minutes: 45,
    accessDays: 31,
    welcome: 'You are on the Club. Bramwell is always here. What is coming up next?',
    productName: 'Career Confidence Club',
  },
} as const;

export type PriceId = keyof typeof PATHWAY_CONFIG;

export function getPathwayConfig(priceId: string) {
  return (PATHWAY_CONFIG as Record<string, typeof PATHWAY_CONFIG[PriceId]>)[priceId];
}