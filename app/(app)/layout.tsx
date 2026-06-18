import AppShell from '@/components/AppShell';
import { TeacherProvider } from '@/hooks/useTeacherMarks';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherProvider>
      <AppShell>{children}</AppShell>
    </TeacherProvider>
  );
}
