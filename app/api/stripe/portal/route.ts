/**
 * POST /api/stripe/portal
 * Returns a Stripe Customer Portal URL so users can manage/cancel their sub.
 */
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!userRow?.stripeCustomerId) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.qari.co';

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer:   userRow.stripeCustomerId,
      return_url: `${origin}/qaida`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // Stripe throws when the portal hasn't been configured in the dashboard
    if (message.includes('configuration') || message.includes('portal')) {
      return NextResponse.json({ error: 'Portal not configured' }, { status: 503 });
    }
    console.error('Portal error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
