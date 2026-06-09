import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  type StripeEnv,
  createStripeClient,
  getPathwayConfig,
  verifyWebhook,
} from "@/lib/stripe.server";

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function sendReceiptEmail(opts: {
  to: string;
  firstName: string | null;
  productName: string;
  amountCents: number;
  currency: string;
  pathwayWelcome: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
    console.warn("Resend not configured; skipping receipt email");
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || "Bramwell AI <onboarding@resend.dev>";
  const portalUrl = process.env.PUBLIC_APP_URL
    ? `${process.env.PUBLIC_APP_URL}/portal`
    : "https://bramwellai.lovable.app/portal";
  const amount = (opts.amountCents / 100).toFixed(2);
  const greeting = opts.firstName ? `Hi ${opts.firstName},` : "Hi,";
  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#ffffff;color:#0a0a0a;padding:32px;max-width:560px;margin:0 auto;">
    <h1 style="font-size:22px;margin:0 0 16px;">You're in. Welcome to Bramwell.</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${opts.pathwayWelcome}</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">Your purchase: <strong>${opts.productName}</strong> — ${opts.currency.toUpperCase()} $${amount}.</p>
    <a href="${portalUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;">Open your portal →</a>
    <p style="font-size:13px;line-height:1.6;margin:32px 0 0;color:#666;">Reply to this email if anything is off — a real human reads it.</p>
    <p style="font-size:12px;color:#999;margin-top:32px;">Bramwell AI</p>
  </body></html>`;

  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: `Welcome to Bramwell — your ${opts.productName} is ready`,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
  }
}

async function grantAccess(opts: {
  userId: string;
  priceId: string;
  customerId: string;
  subscriptionId?: string;
}) {
  const cfg = getPathwayConfig(opts.priceId);
  if (!cfg) {
    console.error("Unknown priceId in fulfillment:", opts.priceId);
    return null;
  }
  const expiresAt = new Date(Date.now() + cfg.accessDays * 86400 * 1000).toISOString();
  const update: Record<string, unknown> = {
    pathway: cfg.pathway,
    payment_status: "paid",
    sessions_purchased: cfg.sessions,
    minutes_per_session: cfg.minutes,
    access_expires_at: expiresAt,
    stripe_customer_id: opts.customerId,
    welcome_shown: false,
  };
  if (opts.subscriptionId) {
    update.stripe_subscription_id = opts.subscriptionId;
    update.subscription_status = "active";
    update.subscription_price_id = opts.priceId;
    update.subscription_cancel_at_period_end = false;
  } else {
    update.stripe_payment_id = opts.customerId;
  }
  const { error } = await getSupabase().from("users").update(update).eq("id", opts.userId);
  if (error) console.error("grantAccess update failed", error);
  return cfg;
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const stripe = createStripeClient(env);
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price", "subscription"],
  });

  const item = full.line_items?.data?.[0];
  const priceObj = item?.price as any;
  const priceId = priceObj?.lookup_key || session.metadata?.priceId;
  const userId = session.metadata?.userId || (full.subscription as any)?.metadata?.userId;
  const customerId = typeof full.customer === "string" ? full.customer : full.customer?.id;
  const subId = full.subscription
    ? typeof full.subscription === "string"
      ? full.subscription
      : full.subscription.id
    : undefined;
  const email = full.customer_details?.email || session.customer_email || undefined;

  if (!priceId || !customerId) {
    console.error("checkout.session.completed missing priceId/customer", { priceId, customerId });
    return;
  }

  // Always record the sale
  await getSupabase().from("transactions").upsert(
    {
      user_id: userId || null,
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof full.payment_intent === "string" ? full.payment_intent : full.payment_intent?.id,
      stripe_subscription_id: subId || null,
      stripe_customer_id: customerId,
      price_id: priceId,
      product_id:
        typeof priceObj?.product === "string" ? priceObj.product : priceObj?.product?.id || null,
      pathway: getPathwayConfig(priceId)?.pathway || null,
      amount_cents: full.amount_total ?? 0,
      currency: full.currency || "aud",
      status: "completed",
      environment: env,
      customer_email: email || null,
    },
    { onConflict: "stripe_session_id" },
  );

  // Grant access (requires userId)
  let cfg = null;
  if (userId) {
    cfg = await grantAccess({ userId, priceId, customerId, subscriptionId: subId });
  }

  // Send receipt
  if (email && cfg) {
    let firstName: string | null = null;
    if (userId) {
      const { data } = await getSupabase()
        .from("users")
        .select("first_name")
        .eq("id", userId)
        .maybeSingle();
      firstName = (data?.first_name as string | null) ?? null;
    }
    await sendReceiptEmail({
      to: email,
      firstName,
      productName: cfg.productName,
      amountCents: full.amount_total ?? 0,
      currency: full.currency || "aud",
      pathwayWelcome: cfg.welcome,
    });
  }
}

async function handleSubscriptionUpdated(sub: any, env: StripeEnv) {
  const userId = sub.metadata?.userId;
  if (!userId) return;
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.lookup_key || sub.metadata?.priceId;
  const periodEnd = item?.current_period_end ?? sub.current_period_end;
  const update: Record<string, unknown> = {
    subscription_status: sub.status,
    subscription_cancel_at_period_end: !!sub.cancel_at_period_end,
  };
  if (priceId) update.subscription_price_id = priceId;
  // If user cancelled (cancel_at_period_end=true) OR Stripe will end it,
  // keep access through the end of the current billing period.
  if (periodEnd) {
    update.access_expires_at = new Date(periodEnd * 1000).toISOString();
  }
  await getSupabase().from("users").update(update).eq("id", userId);
}

async function handleSubscriptionDeleted(sub: any, env: StripeEnv) {
  const userId = sub.metadata?.userId;
  if (!userId) return;
  // The period already ended (Stripe fires this at end of period when
  // cancel_at_period_end was set). Revoke access now.
  await getSupabase()
    .from("users")
    .update({
      subscription_status: "canceled",
      payment_status: "expired",
      access_expires_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

async function handleInvoicePaid(invoice: any, env: StripeEnv) {
  // Record renewal payments + push access_expires_at forward.
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  if (!subId) return;
  const stripe = createStripeClient(env);
  const sub = await stripe.subscriptions.retrieve(subId);
  const userId = (sub.metadata as any)?.userId;
  if (!userId) return;
  const item = (sub as any).items?.data?.[0];
  const priceId = item?.price?.lookup_key;
  const periodEnd = item?.current_period_end ?? (sub as any).current_period_end;

  await getSupabase().from("transactions").insert({
    user_id: userId,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: subId,
    stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id,
    price_id: priceId || "career_confidence_club_monthly",
    amount_cents: invoice.amount_paid ?? 0,
    currency: invoice.currency || "aud",
    status: "completed",
    environment: env,
    customer_email: invoice.customer_email || null,
    pathway: "club",
  });

  if (periodEnd) {
    await getSupabase()
      .from("users")
      .update({
        payment_status: "paid",
        subscription_status: sub.status,
        access_expires_at: new Date(periodEnd * 1000).toISOString(),
      })
      .eq("id", userId);
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "invoice.paid":
    case "invoice.payment_succeeded":
      await handleInvoicePaid(event.data.object, env);
      break;
    default:
      console.log("Unhandled Stripe event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook missing valid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});