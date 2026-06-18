/**
 * POST /api/admin/users/[userId]/role
 * Body: { role: 'student' | 'teacher' | 'admin' }
 *
 * Updates the user's role in both Neon and Clerk publicMetadata.
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

type Role = 'student' | 'teacher' | 'admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: adminId } = await auth();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const clerkAdmin = await client.users.getUser(adminId);
  if (clerkAdmin.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId } = await params;
  const { role } = (await req.json()) as { role: Role };

  const validRoles: Role[] = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Update Neon
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));

  // Sync to Clerk publicMetadata
  await client.users.updateUserMetadata(userId, { publicMetadata: { role } });

  return NextResponse.json({ ok: true });
}
