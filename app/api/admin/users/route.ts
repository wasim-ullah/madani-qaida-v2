/**
 * GET /api/admin/users?search=&page=1
 * Returns paginated user list with subscription status and override status.
 * Admin only.
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions, accessOverrides } from '@/lib/db';
import { eq, ilike, or, desc } from 'drizzle-orm';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify admin
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  if (clerkUser.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Build query
  const baseQuery = db
    .select({
      id:               users.id,
      email:            users.email,
      name:             users.name,
      role:             users.role,
      createdAt:        users.createdAt,
      subStatus:        subscriptions.status,
      subEnd:           subscriptions.currentPeriodEnd,
      overrideStatus:   accessOverrides.overrideStatus,
    })
    .from(users)
    .leftJoin(subscriptions,   eq(subscriptions.userId, users.id))
    .leftJoin(accessOverrides, eq(accessOverrides.userId, users.id))
    .orderBy(desc(users.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  const rows = search
    ? await baseQuery.where(
        or(
          ilike(users.email, `%${search}%`),
          ilike(users.name,  `%${search}%`),
        )
      )
    : await baseQuery;

  return NextResponse.json({ users: rows, page, pageSize: PAGE_SIZE });
}
