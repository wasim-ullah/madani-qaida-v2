/**
 * POST /api/migrate-localstorage
 *
 * Called once on a user's first login if they have existing LocalStorage data.
 * Accepts progress and teacherMarks from the client, writes them to Neon,
 * then marks migration as done (stored in a DB flag / LocalStorage sentinel).
 *
 * Idempotent — safe to call multiple times.
 */
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, progress, teacherMarks } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { progressData, marksData } = body as {
    progressData: Record<string, { stars: number; completed: boolean }>;
    marksData:    Record<string, { markState: string; itemType: string; note?: string }>;
  };

  // Migrate progress rows
  if (progressData) {
    for (const [lessonId, data] of Object.entries(progressData)) {
      await db
        .insert(progress)
        .values({
          userId,
          lessonId,
          starsEarned: data.stars ?? 0,
          completed:   data.completed ?? false,
          completedAt: data.completed ? new Date() : null,
        })
        .onConflictDoNothing();
    }
  }

  // Migrate teacher marks
  if (marksData) {
    for (const [itemId, data] of Object.entries(marksData)) {
      if (data.markState === 'unmarked') continue;
      await db
        .insert(teacherMarks)
        .values({
          teacherUserId: userId,
          itemId,
          itemType:  (data.itemType as 'letter' | 'word' | 'ayah') ?? 'letter',
          markState: (data.markState as 'needs-practice' | 'review-later' | 'mastered') ?? 'needs-practice',
          note:      data.note ?? null,
        })
        .onConflictDoNothing();
    }
  }

  return NextResponse.json({ ok: true });
}
