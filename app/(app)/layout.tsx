import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import AppShell from '@/components/AppShell';
import { TeacherProvider } from '@/hooks/useTeacherMarks';
import { syncUser } from '@/lib/syncUser';
import LocalStorageMigration from '@/components/LocalStorageMigration';
import { getUserAccessStatus } from '@/lib/access';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Upsert user row in Neon + stamp default role if missing
  const user = await syncUser();

  // Admins always bypass the paywall
  if (user?.role !== 'admin') {
    const { userId } = await auth();
    const access = await getUserAccessStatus(userId!);

    if (access !== 'allowed') {
      // 'denied' (revoked) → still send to pricing so they see a message
      // 'no-subscription' → pricing page to subscribe
      redirect('/pricing');
    }
  }

  return (
    <TeacherProvider>
      <LocalStorageMigration />
      <AppShell>{children}</AppShell>
    </TeacherProvider>
  );
}
