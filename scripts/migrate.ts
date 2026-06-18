/**
 * Run once to apply all pending migrations to Neon.
 * Usage: npx tsx scripts/migrate.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db  = drizzle(sql);
  console.log('⏳ Running migrations…');
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  console.log('✅ Migrations complete');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
