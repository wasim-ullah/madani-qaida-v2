/**
 * GET /api/admin/audit-log?page=1
 * Returns paginated global audit log, joined with target user email.
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, accessAuditLog, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  if (clerkUser.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const page   = Math.max(1, parseInt(new URL(req.url).searchParams.get('page') ?? '1', 10));
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await db
    .select({
      id:             accessAuditLog.id,
      targetUserId:   accessAuditLog.targetUserId,
      targetEmail:    users.email,
      adminId:        accessAuditLog.adminId,
      previousStatus: accessAuditLog.previousStatus,
      newStatus:      accessAuditLog.newStatus,
      reason:         accessAuditLog.reason,
      createdAt:      accessAuditLog.createdAt,
    })
    .from(accessAuditLog)
    .leftJoin(users, eq(users.id, accessAuditLog.targetUserId))
    .orderBy(desc(accessAuditLog.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  return NextResponse.json({ entries: rows, page, pageSize: PAGE_SIZE });
}
