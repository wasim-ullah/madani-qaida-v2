import AppShell from '@/components/AppShell';
import { TeacherProvider } from '@/hooks/useTeacherMarks';
import { ensureDefaultRole } from '@/lib/userRole';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Stamp 'student' role on first sign-in if publicMetadata is empty
  await ensureDefaultRole();

  return (
    <TeacherProvider>
      <AppShell>{children}</AppShell>
    </TeacherProvider>
  );
}
