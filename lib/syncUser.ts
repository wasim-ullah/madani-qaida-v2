/**
 * Called server-side on every authenticated page load.
 * - Upserts the user row in Neon (creates if first visit)
 * - Stamps default role 'student' in Clerk publicMetadata if missing
 */
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
  const name  = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
  const role  = (clerkUser.publicMetadata?.role as 'student' | 'teacher' | 'admin') ?? 'student';

  // Stamp default role in Clerk if missing
  if (!clerkUser.publicMetadata?.role) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'student' },
    });
  }

  // Upsert into Neon users table
  await db
    .insert(users)
    .values({ id: userId, email, name, role })
    .onConflictDoUpdate({
      target: users.id,
      set: { email, name, updatedAt: new Date() },
    });

  return { userId, email, name, role };
}
