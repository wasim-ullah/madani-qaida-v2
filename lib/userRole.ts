import { auth, clerkClient } from '@clerk/nextjs/server';

export type Role = 'student' | 'teacher' | 'admin';

/**
 * Get the role from the current user's publicMetadata.
 * Defaults to 'student' if none is set.
 */
export async function getCurrentUserRole(): Promise<Role> {
  const { userId } = await auth();
  if (!userId) return 'student';
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.role as Role) ?? 'student';
}

/**
 * Set a role on any user. Only callable from server context.
 * Guards against non-admin callers must be done by the calling route.
 */
export async function setUserRole(targetUserId: string, role: Role) {
  const client = await clerkClient();
  await client.users.updateUserMetadata(targetUserId, {
    publicMetadata: { role },
  });
}

/**
 * Ensure a newly signed-up user has the default 'student' role.
 * Call this on first protected-page load if metadata is empty.
 */
export async function ensureDefaultRole() {
  const { userId } = await auth();
  if (!userId) return;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user.publicMetadata?.role) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'student' },
    });
  }
}
