import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, validateBody } from '../middleware/auth.js';
import { commentSchema } from '../schemas/index.js';
import { paramString } from '../utils/params.js';

const router = Router();
const author = { select: { id: true, name: true, avatar: true, role: true } };

router.get('/lesson/:lessonId', async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { lessonId: paramString(req.params.lessonId), parentId: null },
    include: { user: author, replies: { include: { user: author }, orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(comments);
});

router.post('/', authenticate, validateBody(commentSchema), async (req: AuthRequest, res) => {
  const { lessonId, parentId, content } = req.body;
  if (parentId) {
    const parent = await prisma.comment.findFirst({ where: { id: parentId, lessonId } });
    if (!parent) return res.status(400).json({ error: 'Invalid parent comment' });
  }
  const comment = await prisma.comment.create({
    data: { lessonId, parentId, content, userId: req.user!.id }, include: { user: author },
  });
  res.status(201).json(comment);
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  const comment = await prisma.comment.findUnique({ where: { id: paramString(req.params.id) } });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.userId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Not allowed' });
  await prisma.comment.delete({ where: { id: comment.id } });
  res.status(204).end();
});

export default router;
