import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import * as React from "react";
import { render } from "@react-email/render";
import { TEMPLATES } from "@/lib/email-templates/registry";
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

export async function sendReceiptEmail(opts: {
  to: string;
  firstName: string | null;
  productName: string;
  amountCents: number;
  currency: string;
  pathwayWelcome: string;
  pathway?: string;
}) {
  const SENDER_DOMAIN = "notify.bramwellai.com";
  const isB2B = opts.pathway === "founders";
  const portalUrl = isB2B
    ? "https://calendar.app.google/QWKYUsrzx2k44UE76"
    : process.env.PUBLIC_APP_URL
      ? `${process.env.PUBLIC_APP_URL}/portal/welcome`
      : "https://www.bramwellai.com/portal/welcome";
  const amount = `${opts.currency.toUpperCase()} $${(opts.amountCents / 100).toFixed(2)}`;

  const template = TEMPLATES["enrolment-confirmed"];
  const templateData = {
    firstName: opts.firstName || undefined,
    productName: opts.productName,
    amount,
    portalUrl,
    nextStepLabel: isB2B ? "Book your kickoff call" : undefined,
    nextStepDescription: isB2B
      ? "Your implementation begins with a 30-minute kickoff call. We will confirm your team size, sales process, and the recorded calls we need to analyse."
      : undefined,
  };
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const supabase = getSupabase();
  const messageId = crypto.randomUUID();
  const recipient = opts.to.toLowerCase();

  const { data: suppressed } = await supabase
    .from("suppressed_emails")
    .select("id")
    .eq("email", recipient)
    .maybeSingle();
  if (suppressed) {
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "enrolment-confirmed",
      recipient_email: opts.to,
      status: "suppressed",
    });
    return;
  }

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: "enrolment-confirmed",
    recipient_email: opts.to,
    status: "pending",
  });

  // Unsubscribe token (one per address) — required by the send API.
  let unsubscribeToken: string | undefined;
  const { data: existingToken } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token")
    .eq("email", recipient)
    .maybeSingle();
  if (existingToken?.token) {
    unsubscribeToken = existingToken.token;
  } else {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const generated = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert({ token: generated, email: recipient }, { onConflict: "email", ignoreDuplicates: true });
    const { data: stored } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", recipient)
      .maybeSingle();
    unsubscribeToken = stored?.token || generated;
  }

  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: opts.to,
      from: `Bramwell AI <noreply@${SENDER_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: "enrolment-confirmed",
      idempotency_key: messageId,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    console.error("Failed to enqueue enrolment email", enqueueError);
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "enrolment-confirmed",
      recipient_email: opts.to,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
  }
}

async function grantAccess(opts: {
  userId: string;
  priceId: string;
  customerId: string;
  subscriptionId?: string;
  email?: string;
}) {
  const cfg = getPathwayConfig(opts.priceId);
  if (!cfg) {
    console.error("Unknown priceId in fulfillment:", opts.priceId);
    return null;
  }
  const expiresAt = new Date(Date.now() + cfg.accessDays * 86400 * 1000).toISOString();
  const update: Record<string, unknown> = {
    id: opts.userId,
    pathway: cfg.pathway,
    payment_status: "paid",
    sessions_purchased: cfg.sessions,
    minutes_per_session: cfg.minutes,
    access_expires_at: expiresAt,
    stripe_customer_id: opts.customerId,
    welcome_shown: false,
  };
  if (opts.email) update.email = opts.email;
  if (opts.subscriptionId) {
    update.stripe_subscription_id = opts.subscriptionId;
    update.subscription_status = "active";
    update.subscription_price_id = opts.priceId;
    update.subscription_cancel_at_period_end = false;
  } else {
    update.stripe_payment_id = opts.customerId;
  }
  // Upsert as a defensive fallback: if the auth.users -> public.users
  // trigger ever failed (or this user predates it), insert the row
  // rather than silently no-op'ing the payment.
  const { error } = await getSupabase()
    .from("users")
    .upsert(update, { onConflict: "id" });
  if (error) console.error("grantAccess upsert failed", error);
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
  const cfg = getPathwayConfig(priceId);
  if (userId && cfg) {
    await grantAccess({ userId, priceId, customerId, subscriptionId: subId, email });
  } else if (!cfg) {
    console.error("Unknown priceId in fulfillment:", priceId);
  }

  // Send receipt (even without userId if we know the product config)
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
      pathway: cfg.pathway,
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