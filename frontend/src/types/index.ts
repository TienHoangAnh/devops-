export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  streak?: number;
  studyMinutes?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  icon?: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  icon?: string;
  lessons?: LessonSummary[];
  flashcards?: Flashcard[];
  progressMap?: Record<string, string>;
  roadmap?: { id: string; title: string; slug: string };
  _count?: { lessons: number; flashcards: number };
}

export interface LessonSummary {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  duration: number;
}

export interface LessonSection {
  id: string;
  type: string;
  title?: string;
  content: string;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface Lesson extends LessonSummary {
  sections: LessonSection[];
  chapter: {
    id: string;
    title: string;
    slug: string;
    roadmap: { id: string; title: string; slug: string };
  };
  quiz?: { id: string; title: string; description?: string };
  userProgress?: { status: string; completed: boolean; percent: number } | null;
  userNote?: { content: string } | null;
  isBookmarked?: boolean;
  siblings?: LessonSummary[];
}

export interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  explanation?: string;
  order: number;
  points: number;
  metadata?: Record<string, unknown>;
  answers: { id: string; text: string; order: number; metadata?: Record<string, unknown> }[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  correct: number;
  wrong: number;
  percentage: number;
  saved: boolean;
  results: {
    questionId: string;
    correct: boolean;
    explanation?: string;
    correctAnswers: string[];
  }[];
}

export interface DashboardData {
  user: { name: string; streak: number; studyMinutes: number };
  stats: {
    completedLessons: number;
    totalLessons: number;
    completedChapters: number;
    totalChapters: number;
    progressPercent: number;
    quizAverage: number;
    studyHours: number;
    streak: number;
  };
  lastLesson: LessonSummary | null;
  continueLesson: LessonSummary | null;
  recommendedNext: LessonSummary | null;
  recentQuizzes: unknown[];
  chapterProgress?: { updatedAt: string; completed: boolean }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  order: number;
}
