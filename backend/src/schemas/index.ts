import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8).max(100),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1),
});

export const progressSchema = z.object({
  lessonId: z.string(),
  status: z.enum(['LOCKED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  completed: z.boolean().optional(),
  percent: z.number().min(0).max(100).optional(),
  lastSection: z.string().optional(),
});

export const bookmarkSchema = z.object({
  lessonId: z.string(),
  type: z.string().default('lesson'),
  note: z.string().optional(),
});

export const noteSchema = z.object({
  lessonId: z.string(),
  content: z.string().min(1),
});

export const quizSubmitSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    answerIds: z.array(z.string()).optional(),
    textAnswer: z.string().optional(),
    orderedIds: z.array(z.string()).optional(),
    matches: z.record(z.string()).optional(),
  })),
  timeSpent: z.number().optional(),
});
