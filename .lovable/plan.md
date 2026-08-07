# Investment section for /founders

Add a clear pricing and payment path to the B2B founders page so ready buyers can self-serve, while still offering a qualification call for larger or unsure teams.

## What we will build

1. **Stripe product and price**
   - Product: `elite_sales_voice_ai_30day` — Elite Sales Team Voice AI Coach 30 Day Program.
   - Price: one-time USD $2,997.

2. **Investment section on /founders**
   - Inserted between the "What is included" and "Apply" sections.
   - Hero card: one clear price, exact deliverables, and a primary "Get Started" payment CTA.
   - Secondary path: "Prefer to talk first? Book a qualification call" linking to the Google Calendar.
   - Note on ongoing access: after the first 30 days, platform access continues at $79 per salesperson per month.

3. **Checkout wiring**
   - Clicking the investment CTA calls `createCheckoutSession` with the new price ID.
   - On success, opens Stripe embedded checkout.
   - Return URL sends the buyer to a new `/founders/thanks` confirmation page (or the existing `/portal/welcome` flow if it already handles one-time purchases).

4. **Post-purchase confirmation**
   - If no dedicated one-time purchase confirmation exists, create a lightweight `/founders/thanks` page that confirms enrolment and tells them what happens next (book onboarding call, calendar link, etc.).

## Outcome

A founder can land on /founders, see the investment, click through, and pay for the 30-day programme without a manual sales call. The existing application form remains for teams that prefer qualification first.
