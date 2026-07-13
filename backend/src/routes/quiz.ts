import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, optionalAuth, validateBody } from '../middleware/auth.js';
import { quizSubmitSchema } from '../schemas/index.js';
import { paramString } from '../utils/params.js';

const router = Router();

function gradeAnswer(
  question: {
    type: string;
    answers: { id: string; text: string; isCorrect: boolean; order: number; metadata: unknown }[];
    metadata: unknown;
  },
  submission: {
    answerIds?: string[];
    textAnswer?: string;
    orderedIds?: string[];
    matches?: Record<string, string>;
  }
): boolean {
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE': {
      const correctIds = question.answers.filter((a: { isCorrect: boolean }) => a.isCorrect).map((a: { id: string }) => a.id);
      const submitted = submission.answerIds || [];
      return correctIds.length === submitted.length &&
        correctIds.every((id) => submitted.includes(id));
    }
    case 'FILL_BLANK': {
      const correct = question.answers.find((a) => a.isCorrect);
      return correct?.text.toLowerCase().trim() === submission.textAnswer?.toLowerCase().trim();
    }
    case 'ORDERING': {
      const correctOrder = [...question.answers].sort((a, b) => a.order - b.order).map((a) => a.id);
      const submitted = submission.orderedIds || [];
      return JSON.stringify(correctOrder) === JSON.stringify(submitted);
    }
    case 'MATCHING': {
      const meta = question.metadata as { pairs?: { left: string; right: string }[] } | null;
      if (!meta?.pairs || !submission.matches) return false;
      return meta.pairs.every((pair) => submission.matches![pair.left] === pair.right);
    }
    case 'DRAG_DROP': {
      const meta = question.metadata as { correctOrder?: string[] } | null;
      if (!meta?.correctOrder || !submission.orderedIds) return false;
      return JSON.stringify(meta.correctOrder) === JSON.stringify(submission.orderedIds);
    }
    default:
      return false;
  }
}

router.get('/:lessonSlug', async (req, res) => {
  const lesson = await prisma.lesson.findFirst({
    where: { slug: paramString(req.params.lessonSlug) },
    select: { id: true },
  });

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: lesson.id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: {
          answers: {
            orderBy: { order: 'asc' },
            select: { id: true, text: true, order: true, metadata: true },
          },
        },
      },
    },
  });

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  res.json(quiz);
});

router.post('/submit', optionalAuth, validateBody(quizSubmitSchema), async (req: AuthRequest, res: Response) => {
  const { quizId, answers, timeSpent } = req.body;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { include: { answers: true } },
      lesson: { select: { id: true, title: true } },
    },
  });

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  let correct = 0;
  let wrong = 0;
  let score = 0;
  const results: {
    questionId: string;
    correct: boolean;
    explanation: string | null;
    correctAnswers: string[];
  }[] = [];

  for (const question of quiz.questions) {
    const submission = answers.find((a: { questionId: string }) => a.questionId === question.id);
    const isCorrect = submission ? gradeAnswer(question, submission) : false;

    if (isCorrect) {
      correct++;
      score += question.points;
    } else {
      wrong++;
    }

    results.push({
      questionId: question.id,
      correct: isCorrect,
      explanation: question.explanation,
      correctAnswers: question.answers.filter((a: { isCorrect: boolean }) => a.isCorrect).map((a: { text: string }) => a.text),
    });
  }

  const totalPoints = quiz.questions.reduce((sum: number, q: { points: number }) => sum + q.points, 0);

  let attempt = null;
  if (req.user) {
    attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId,
        score,
        totalPoints,
        correct,
        wrong,
        answers: answers,
        timeSpent,
      },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        studyMinutes: { increment: Math.ceil((timeSpent || 300) / 60) },
        lastStudyDate: new Date(),
      },
    });
  }

  res.json({
    score,
    totalPoints,
    correct,
    wrong,
    percentage: Math.round((score / totalPoints) * 100),
    results,
    saved: !!req.user,
    attemptId: attempt?.id,
    lessonTitle: quiz.lesson.title,
  });
});

router.get('/attempts/me', authenticate, async (req: AuthRequest, res: Response) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      quiz: {
        include: {
          lesson: {
            select: {
              title: true, slug: true,
              chapter: { select: { title: true, slug: true } },
            },
          },
        },
      },
    },
  });
  res.json(attempts);
});

export default router;
