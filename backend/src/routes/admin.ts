import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/stats', async (_req, res) => {
  const [users, lessons, quizzes, attempts] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.quiz.count(),
    prisma.quizAttempt.count(),
  ]);
  res.json({ users, lessons, quizzes, attempts });
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true,
      verified: true, streak: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(user);
});

router.get('/roadmaps', async (_req, res) => {
  const roadmaps = await prisma.roadmap.findMany({
    include: { chapters: { include: { lessons: true } } },
    orderBy: { order: 'asc' },
  });
  res.json(roadmaps);
});

router.post('/roadmaps', async (req, res) => {
  const roadmap = await prisma.roadmap.create({ data: req.body });
  res.status(201).json(roadmap);
});

router.put('/roadmaps/:id', async (req, res) => {
  const roadmap = await prisma.roadmap.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(roadmap);
});

router.delete('/roadmaps/:id', async (req, res) => {
  await prisma.roadmap.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

router.post('/chapters', async (req, res) => {
  const chapter = await prisma.chapter.create({ data: req.body });
  res.status(201).json(chapter);
});

router.put('/chapters/:id', async (req, res) => {
  const chapter = await prisma.chapter.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(chapter);
});

router.delete('/chapters/:id', async (req, res) => {
  await prisma.chapter.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

router.post('/lessons', async (req, res) => {
  const { sections, ...lessonData } = req.body;
  const lesson = await prisma.lesson.create({
    data: {
      ...lessonData,
      sections: sections ? { create: sections } : undefined,
    },
    include: { sections: true },
  });
  res.status(201).json(lesson);
});

router.put('/lessons/:id', async (req, res) => {
  const lesson = await prisma.lesson.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(lesson);
});

router.delete('/lessons/:id', async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

router.post('/quizzes', async (req: AuthRequest, res: Response) => {
  const { questions, ...quizData } = req.body;
  const quiz = await prisma.quiz.create({
    data: {
      ...quizData,
      questions: questions ? {
        create: questions.map((q: { answers?: unknown[] }) => ({
          ...q,
          answers: q.answers ? { create: q.answers } : undefined,
        })),
      } : undefined,
    },
    include: { questions: { include: { answers: true } } },
  });
  res.status(201).json(quiz);
});

router.delete('/quizzes/:id', async (req, res) => {
  await prisma.quiz.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

export default router;
