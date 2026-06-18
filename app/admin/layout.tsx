/**
 * Admin layout — server-side guard.
 * Only users with role === 'admin' in publicMetadata may proceed.
 * Everyone else is sent to /qaida.
 */
import { redirect } from 'next/navigation';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';

export const metadata = { title: 'Admin — Madani Qaida' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const role = clerkUser.publicMetadata?.role as string | undefined;

  if (role !== 'admin') redirect('/qaida');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-6 shrink-0">
        <span className="font-bold text-indigo-400 text-lg">⚙️ Admin</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/users"     className="hover:text-indigo-300 transition">Users</Link>
          <Link href="/admin/audit-log" className="hover:text-indigo-300 transition">Audit Log</Link>
        </nav>
        <div className="ml-auto">
          <Link href="/qaida" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Back to app
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
