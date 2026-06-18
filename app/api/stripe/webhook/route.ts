/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe events and keeps the `subscriptions` table in sync.
 * Handles:
 *   checkout.session.completed       → create/update subscription row
 *   customer.subscription.updated    → update status, period, price
 *   customer.subscription.deleted    → mark as canceled
 *
 * Must be called with the raw body (no JSON parsing by Next.js).
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db, subscriptions, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

async function resolveClerkUserId(
  customerId: string,
  metadata?: Stripe.Metadata | null,
): Promise<string | null> {
  // 1. Prefer metadata set at checkout
  if (metadata?.clerkUserId) return metadata.clerkUserId;

  // 2. Fall back to looking up the customer row in our DB
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  return row?.id ?? null;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const userId = await resolveClerkUserId(session.customer as string, sub.metadata);
        if (!userId) break;

        await upsertSubscription(userId, sub);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveClerkUserId(sub.customer as string, sub.metadata);
        if (!userId) break;

        await upsertSubscription(userId, sub);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveClerkUserId(sub.customer as string, sub.metadata);
        if (!userId) break;

        await db
          .update(subscriptions)
          .set({ status: 'canceled', updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(userId: string, sub: Stripe.Subscription) {
  const priceId   = sub.items.data[0]?.price.id ?? '';
  // current_period_end moved to subscription items in newer API versions; fall back gracefully
  const rawEnd    = (sub as unknown as Record<string, unknown>).current_period_end
                    ?? sub.items.data[0]?.current_period_end
                    ?? 0;
  const periodEnd = new Date((rawEnd as number) * 1000);

  await db
    .insert(subscriptions)
    .values({
      id:                   sub.id,   // use Stripe sub id as PK
      userId,
      stripeSubscriptionId: sub.id,
      stripePriceId:        priceId,
      status:               sub.status as 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete',
      currentPeriodEnd:     periodEnd,
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        status:          sub.status as 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete',
        stripePriceId:   priceId,
        currentPeriodEnd: periodEnd,
        updatedAt:       new Date(),
      },
    });
}
