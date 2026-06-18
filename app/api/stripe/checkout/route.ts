/**
 * POST /api/stripe/checkout
 * Body: { plan: 'monthly' | 'yearly' }
 *
 * Creates a Stripe Checkout Session and returns { url }.
 * Attaches the Clerk userId as metadata so the webhook can link the
 * subscription back to the correct Neon user row.
 */
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, PlanKey } from '@/lib/stripe';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = (await req.json()) as { plan: PlanKey };
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  // Look up (or create) the Stripe customer for this user
  const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  let customerId = userRow?.stripeCustomerId ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userRow?.email ?? undefined,
      name:  userRow?.name  ?? undefined,
      metadata: { clerkUserId: userId },
    });
    customerId = customer.id;

    await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId));
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://qari.co';

  const session = await stripe.checkout.sessions.create({
    customer:   customerId,
    mode:       'subscription',
    line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
      metadata: { clerkUserId: userId },
    },
    success_url: `${origin}/qaida?subscribed=1`,
    cancel_url:  `${origin}/pricing`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
