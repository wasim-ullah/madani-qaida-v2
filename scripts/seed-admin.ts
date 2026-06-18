/**
 * One-time script — promotes a Clerk user to admin in both Neon and Clerk.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Safe to run multiple times (idempotent).
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { createClerkClient } from '@clerk/backend';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_USER_ID = 'user_3FJMHHBSU3msbTGyk6m6VoDEbsv';

async function main() {
  const sql    = neon(process.env.DATABASE_URL!);
  const db     = drizzle(sql, { schema: { users } });
  const clerk  = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

  console.log(`⏳ Promoting ${ADMIN_USER_ID} to admin…`);

  // 1. Update Neon (upsert in case user row doesn't exist yet)
  await db
    .insert(users)
    .values({
      id:    ADMIN_USER_ID,
      email: 'admin@placeholder.local',   // will be overwritten by syncUser() on next login
      role:  'admin',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { role: 'admin', updatedAt: new Date() },
    });

  console.log('  ✓ Neon updated');

  // 2. Stamp role in Clerk publicMetadata
  await clerk.users.updateUserMetadata(ADMIN_USER_ID, {
    publicMetadata: { role: 'admin' },
  });

  console.log('  ✓ Clerk publicMetadata updated');
  console.log('✅ Done — user is now admin. Sign out and back in if already logged in.');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
