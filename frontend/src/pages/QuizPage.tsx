import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { PageSkeleton } from '@/components/ui/skeleton';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import type { Quiz, QuizResult } from '@/types';

export function QuizPage() {
  const { slug } = useParams();
  const { accessToken } = useAuthStore();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', slug],
    queryFn: () => api.get<Quiz>(`/quiz/${slug}`, accessToken),
    enabled: !!slug,
  });

  const handleSubmit = async (answers: unknown[], timeSpent: number) => {
    return api.post<QuizResult>('/quiz/submit', {
      quizId: quiz!.id,
      answers,
      timeSpent,
    }, accessToken);
  };

  if (isLoading) return <PageSkeleton />;
  if (!quiz) return <div className="p-8 text-center">Quiz not found</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to={`/lesson/${slug}`} className="hover:text-foreground">← Back to Lesson</Link>
      </nav>
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      {quiz.description && <p className="text-muted-foreground mb-8">{quiz.description}</p>}
      <QuizPlayer quiz={quiz} onSubmit={handleSubmit} lessonSlug={slug!} />
    </div>
  );
}
