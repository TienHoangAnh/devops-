import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import { paramString } from '../utils/params.js';

const router = Router();

router.get('/roadmaps', async (_req, res) => {
  const roadmaps = await prisma.roadmap.findMany({
    orderBy: { order: 'asc' },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });
  res.json(roadmaps);
});

router.get('/roadmaps/:slug', async (req, res) => {
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: paramString(req.params.slug) },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true, title: true, slug: true, description: true,
              order: true, duration: true,
            },
          },
          _count: { select: { flashcards: true } },
        },
      },
    },
  });

  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found' });
  }

  res.json(roadmap);
});

router.get('/chapters/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  const chapter = await prisma.chapter.findFirst({
    where: { slug: paramString(req.params.slug) },
    include: {
      roadmap: { select: { id: true, title: true, slug: true } },
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true, title: true, slug: true, description: true,
          order: true, duration: true,
        },
      },
      flashcards: { orderBy: { order: 'asc' } },
    },
  });

  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  let progressMap: Record<string, string> = {};
  if (req.user) {
    const progress = await prisma.progress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: chapter.lessons.map((l: { id: string }) => l.id) },
      },
    });
    progressMap = Object.fromEntries(progress.map((p: { lessonId: string; status: string }) => [p.lessonId, p.status]));
  }

  res.json({ ...chapter, progressMap });
});

router.get('/lessons/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  const lesson = await prisma.lesson.findFirst({
    where: { slug: paramString(req.params.slug) },
    include: {
      chapter: {
        select: {
          id: true, title: true, slug: true,
          roadmap: { select: { id: true, title: true, slug: true } },
        },
      },
      sections: { orderBy: { order: 'asc' } },
      tags: { include: { tag: true } },
      quiz: { select: { id: true, title: true, description: true } },
    },
  });

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  let userProgress = null;
  let userNote = null;
  let isBookmarked = false;

  if (req.user) {
    [userProgress, userNote] = await Promise.all([
      prisma.progress.findUnique({
        where: { userId_lessonId: { userId: req.user.id, lessonId: lesson.id } },
      }),
      prisma.userNote.findUnique({
        where: { userId_lessonId: { userId: req.user.id, lessonId: lesson.id } },
      }),
    ]);

    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: req.user.id, lessonId: lesson.id },
    });
    isBookmarked = !!bookmark;
  }

  const siblings = await prisma.lesson.findMany({
    where: { chapterId: lesson.chapterId },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, slug: true, order: true },
  });

  res.json({ ...lesson, userProgress, userNote, isBookmarked, siblings });
});

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();

    if (q.length < 2) {
      return res.json({
        lessons: [],
        sections: [],
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
      orderBy: {
        order: 'asc', // hoặc id nếu chưa có order
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        order: true,

        chapter: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },

        // nếu schema có Topic thì thêm
      },
    });

    const sections = await prisma.lessonSection.findMany({
      where: {
        AND: [
          {
            type: {
              in: [
                'THEORY',
                'CHEAT_SHEET',
                'CODE',
                'PRACTICE',
                'INTERACTIVE',
                'SUMMARY',
              ],
            },
          },
          {
            content: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
      select: {
        id: true,
        type: true,
        content: true,

        lesson: {
          select: {
            id: true,
            slug: true,
            title: true,
            order: true,

            chapter: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },

          },
        },
      },
    });

    res.json({
      lessons,
      sections,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Search failed',
    });
  }
});

export default router;
