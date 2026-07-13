import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, validateBody } from '../middleware/auth.js';
import { progressSchema, bookmarkSchema, noteSchema } from '../schemas/index.js';
import { paramString } from '../utils/params.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const progress = await prisma.progress.findMany({
    where: { userId: req.user!.id },
    include: {
      lesson: {
        select: {
          id: true, title: true, slug: true,
          chapter: {
            select: {
              title: true, slug: true,
              roadmap: { select: { title: true, slug: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(progress);
});

router.post('/', authenticate, validateBody(progressSchema), async (req: AuthRequest, res: Response) => {
  const { lessonId, status, completed, percent, lastSection } = req.body;

  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId: req.user!.id, lessonId } },
    create: {
      userId: req.user!.id,
      lessonId,
      status: status || 'IN_PROGRESS',
      completed: completed || false,
      percent: percent || 0,
      lastSection,
    },
    update: {
      ...(status && { status }),
      ...(completed !== undefined && { completed }),
      ...(percent !== undefined && { percent }),
      ...(lastSection && { lastSection }),
    },
  });

  if (completed) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (user) {
      const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
      let newStreak = user.streak;
      if (!lastStudy) {
        newStreak = 1;
      } else {
        const diff = Math.floor((today.getTime() - lastStudy.setHours(0, 0, 0, 0)) / 86400000);
        if (diff === 1) newStreak = user.streak + 1;
        else if (diff > 1) newStreak = 1;
      }
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { streak: newStreak, lastStudyDate: new Date() },
      });
    }
  }

  res.json(progress);
});

router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [user, progress, quizAttempts, totalLessons, totalChapters] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, studyMinutes: true, name: true },
    }),
    prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true, title: true, slug: true,
            chapter: { select: { id: true, title: true, slug: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        quiz: {
          include: {
            lesson: { select: { title: true, slug: true } },
          },
        },
      },
    }),
    prisma.lesson.count(),
    prisma.chapter.count(),
  ]);

  const completedLessons = progress.filter((p: { completed: boolean }) => p.completed).length;
  const completedChapters = new Set(
    progress
      .filter((p: { completed: boolean; lesson: { chapter: { id: string } } }) => p.completed)
      .map((p: { lesson: { chapter: { id: string } } }) => p.lesson.chapter.id)
  ).size;

  const quizAverage = quizAttempts.length
    ? Math.round(
        quizAttempts.reduce((sum: number, a: { score: number; totalPoints: number }) => sum + (a.score / a.totalPoints) * 100, 0) / quizAttempts.length
      )
    : 0;

  const lastProgress = progress[0];
  const inProgressLesson = progress.find((p: { completed: boolean; percent: number }) => !p.completed && p.percent > 0);

  const allLessons = await prisma.lesson.findMany({
    orderBy: [{ chapter: { order: 'asc' } }, { order: 'asc' }],
    select: {
      id: true, title: true, slug: true,
      chapter: { select: { title: true, slug: true } },
    },
  });

  const completedIds = new Set(progress.filter((p: { completed: boolean }) => p.completed).map((p: { lessonId: string }) => p.lessonId));
  const recommendedNext = allLessons.find((l: { id: string }) => !completedIds.has(l.id));

  res.json({
    user,
    stats: {
      completedLessons,
      totalLessons,
      completedChapters,
      totalChapters,
      progressPercent: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
      quizAverage,
      studyHours: Math.round((user?.studyMinutes || 0) / 60 * 10) / 10,
      streak: user?.streak || 0,
    },
    lastLesson: lastProgress?.lesson || null,
    continueLesson: inProgressLesson?.lesson || null,
    recommendedNext,
    recentQuizzes: quizAttempts,
    chapterProgress: progress,
  });
});

export default router;

const bookmarkRouter = Router();

bookmarkRouter.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: req.user!.id },
    include: {
      lesson: {
        select: {
          id: true, title: true, slug: true, description: true,
          chapter: { select: { title: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookmarks);
});

bookmarkRouter.post('/', authenticate, validateBody(bookmarkSchema), async (req: AuthRequest, res: Response) => {
  const { lessonId, type, note } = req.body;

  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_lessonId_type: { userId: req.user!.id, lessonId, type: type || 'lesson' },
    },
    create: { userId: req.user!.id, lessonId, type: type || 'lesson', note },
    update: { note },
  });

  res.json(bookmark);
});

bookmarkRouter.delete('/:lessonId', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.bookmark.deleteMany({
    where: { userId: req.user!.id, lessonId: paramString(req.params.lessonId) },
  });
  res.json({ message: 'Bookmark removed' });
});

const notesRouter = Router();

notesRouter.get('/:lessonId', authenticate, async (req: AuthRequest, res: Response) => {
  const note = await prisma.userNote.findUnique({
    where: {
      userId_lessonId: { userId: req.user!.id, lessonId: paramString(req.params.lessonId) },
    },
  });
  res.json(note);
});

notesRouter.post('/', authenticate, validateBody(noteSchema), async (req: AuthRequest, res: Response) => {
  const { lessonId, content } = req.body;

  const note = await prisma.userNote.upsert({
    where: { userId_lessonId: { userId: req.user!.id, lessonId } },
    create: { userId: req.user!.id, lessonId, content },
    update: { content },
  });

  res.json(note);
});

notesRouter.delete('/:lessonId', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.userNote.deleteMany({
    where: { userId: req.user!.id, lessonId: paramString(req.params.lessonId) },
  });
  res.json({ message: 'Note deleted' });
});

export { bookmarkRouter, notesRouter };
