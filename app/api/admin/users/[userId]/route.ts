/**
 * GET /api/admin/users/[userId]
 * Returns full detail for one user: profile, subscription history, override, audit log.
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions, accessOverrides, accessAuditLog } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: adminId } = await auth();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(adminId);
  if (clerkUser.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId } = await params;

  const [user]     = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const subs       = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
  const [override] = await db.select().from(accessOverrides).where(eq(accessOverrides.userId, userId)).limit(1);
  const audit      = await db.select().from(accessAuditLog).where(eq(accessAuditLog.targetUserId, userId)).orderBy(desc(accessAuditLog.createdAt)).limit(50);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user, subscriptions: subs, override: override ?? null, audit });
}
