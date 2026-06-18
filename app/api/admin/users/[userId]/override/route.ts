/**
 * POST /api/admin/users/[userId]/override
 * Body: { status: 'granted' | 'revoked' | null, reason?: string }
 *
 * Sets or clears an access override for a user and writes an audit log entry.
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, accessOverrides, accessAuditLog } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(
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
  const { status, reason } = (await req.json()) as {
    status: 'granted' | 'revoked' | null;
    reason?: string;
  };

  // Read previous override for audit log
  const [existing] = await db
    .select({ overrideStatus: accessOverrides.overrideStatus })
    .from(accessOverrides)
    .where(eq(accessOverrides.userId, userId))
    .limit(1);

  if (status === null) {
    // Clear override
    await db.delete(accessOverrides).where(eq(accessOverrides.userId, userId));
  } else if (existing) {
    // Row already exists — update it
    await db
      .update(accessOverrides)
      .set({ overrideStatus: status, reason: reason ?? null, setByAdminId: adminId, updatedAt: new Date() })
      .where(eq(accessOverrides.userId, userId));
  } else {
    // No row yet — insert
    await db
      .insert(accessOverrides)
      .values({ userId, overrideStatus: status, reason: reason ?? null, setByAdminId: adminId });
  }

  // Write audit log
  await db.insert(accessAuditLog).values({
    targetUserId:   userId,
    adminId,
    previousStatus: existing?.overrideStatus ?? null,
    newStatus:      status,
    reason:         reason ?? null,
  });

  return NextResponse.json({ ok: true });
}
