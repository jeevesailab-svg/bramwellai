import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Records a completed coaching session and increments the user's
 * sessions_completed counter. Runs server-side with the service role so
 * the user can't tamper with session/usage counters via direct DB writes.
 */
export const recordCompletedSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        duration_minutes: z.number().int().min(1).max(240),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { userId } = context;

    const { data: row, error: rowErr } = await supabaseAdmin
      .from("users")
      .select(
        "pathway, sessions_purchased, sessions_completed, payment_status, access_expires_at",
      )
      .eq("id", userId)
      .maybeSingle();
    if (rowErr || !row) {
      console.error("recordCompletedSession: user lookup failed", rowErr);
      throw new Error("Unable to record session");
    }

    const purchased = row.sessions_purchased ?? 0;
    const completed = row.sessions_completed ?? 0;
    if (completed >= purchased) {
      throw new Error("No remaining sessions");
    }

    const sessionNumber = completed + 1;

    const { error: insertErr } = await supabaseAdmin.from("sessions").insert({
      user_id: userId,
      pathway: row.pathway,
      session_number: sessionNumber,
      duration_minutes: data.duration_minutes,
      session_status: "completed",
    });
    if (insertErr) {
      console.error("recordCompletedSession: insert failed", insertErr);
      throw new Error("Unable to record session");
    }

    const { error: updErr } = await supabaseAdmin
      .from("users")
      .update({ sessions_completed: sessionNumber })
      .eq("id", userId);
    if (updErr) {
      console.error("recordCompletedSession: update failed", updErr);
      throw new Error("Unable to record session");
    }

    return { sessions_completed: sessionNumber };
  });