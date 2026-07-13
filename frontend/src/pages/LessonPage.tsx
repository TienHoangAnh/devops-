import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, CheckCircle, ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { LessonSectionView } from '@/components/lesson/LessonSection';
import { NotesPanel } from '@/components/lesson/NotesPanel';
import { formatDuration } from '@/lib/utils';
import type { Lesson } from '@/types';

export function LessonPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuthStore();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', slug],
    queryFn: () => api.get<Lesson>(`/lessons/${slug}`, accessToken),
    enabled: !!slug,
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      api.post('/progress', {
        lessonId: lesson!.id,
        completed: true,
        status: 'COMPLETED',
        percent: 100,
      }, accessToken),
    onSuccess: () => {
      toast.success('Lesson marked as complete!');
      queryClient.invalidateQueries({ queryKey: ['lesson', slug] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast.error('Sign in to save progress'),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () =>
      lesson?.isBookmarked
        ? api.delete(`/bookmarks/${lesson.id}`, accessToken)
        : api.post('/bookmarks', { lessonId: lesson!.id }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', slug] });
      toast.success(lesson?.isBookmarked ? 'Bookmark removed' : 'Bookmarked!');
    },
    onError: () => toast.error('Sign in to bookmark'),
  });

  if (isLoading) return <PageSkeleton />;
  if (!lesson) return <div className="p-8 text-center">Lesson not found</div>;

  const siblings = lesson.siblings || [];
  const currentIndex = siblings.findIndex((s) => s.slug === slug);
  const prev = siblings[currentIndex - 1];
  const next = siblings[currentIndex + 1];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/roadmap" className="hover:text-foreground">Roadmap</Link>
        <span>/</span>
        <Link to={`/chapter/${lesson.chapter.slug}`} className="hover:text-foreground">
          {lesson.chapter.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> {formatDuration(lesson.duration)}
              </span>
              {lesson.userProgress?.completed && (
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="h-4 w-4" /> Completed
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => bookmarkMutation.mutate()}
              title={isAuthenticated() ? 'Bookmark' : 'Sign in to bookmark'}
            >
              <Bookmark className={lesson.isBookmarked ? 'fill-primary text-primary' : ''} />
            </Button>
            {lesson.quiz && (
              <Link to={`/quiz/${lesson.slug}`}>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" /> Quiz
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {lesson.sections.map((section, i) => (
            <LessonSectionView key={section.id} section={section} defaultOpen={i === 0} />
          ))}
        </div>

        <div className="mb-8">
          <NotesPanel lessonId={lesson.id} initialContent={lesson.userNote?.content} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex gap-2">
            {prev && (
              <Button variant="outline" onClick={() => navigate(`/lesson/${prev.slug}`)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> {prev.title}
              </Button>
            )}
            {next && (
              <Button onClick={() => navigate(`/lesson/${next.slug}`)}>
                {next.title} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
          <Button
            variant={lesson.userProgress?.completed ? 'outline' : 'default'}
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {lesson.userProgress?.completed ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
