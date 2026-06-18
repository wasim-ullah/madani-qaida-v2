/**
 * Single source of truth for "can this user access the platform".
 *
 * Check order:
 * 1. Admin override 'granted'  → allow (beats Stripe)
 * 2. Admin override 'revoked'  → deny  (beats Stripe)
 * 3. No override               → check Stripe subscription status
 *    active | trialing          → allow
 *    everything else            → deny
 */
import { db } from '@/lib/db';
import { accessOverrides, subscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export type AccessStatus = 'allowed' | 'denied' | 'no-subscription';

export async function getUserAccessStatus(userId: string): Promise<AccessStatus> {
  // 1. Check for an admin override
  const [override] = await db
    .select()
    .from(accessOverrides)
    .where(eq(accessOverrides.userId, userId))
    .limit(1);

  if (override?.overrideStatus === 'granted') return 'allowed';
  if (override?.overrideStatus === 'revoked')  return 'denied';

  // 2. Fall through to Stripe subscription
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
      )
    )
    .orderBy(subscriptions.createdAt)
    .limit(1);

  if (!sub) return 'no-subscription';

  const activeStatuses = ['active', 'trialing'] as const;
  return (activeStatuses as readonly string[]).includes(sub.status)
    ? 'allowed'
    : 'denied';
}
