import { useQuery } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Trophy, Flame, Clock, TrendingUp, ArrowRight, BarChart3, Award, Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore, useThemeStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/types';

function buildStudyDays(chapterProgress?: { updatedAt: string }[]): Set<string> {
  const days = new Set<string>();
  chapterProgress?.forEach((p) => {
    days.add(new Date(p.updatedAt).toISOString().slice(0, 10));
  });
  return days;
}

function LearningCalendar({ studyDays }: { studyDays: Set<string> }) {
  const days: { date: string; active: boolean }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, active: studyDays.has(key) });
  }

  return (
    <div className="grid grid-cols-10 sm:grid-cols-15 gap-1">
      {days.map((d) => (
        <div
          key={d.date}
          title={d.date}
          className={cn(
            'h-3 w-3 rounded-sm',
            d.active ? 'bg-primary' : 'bg-muted'
          )}
        />
      ))}
    </div>
  );
}

function Achievements({ stats }: { stats: DashboardData['stats'] }) {
  const badges = [
    { id: 'first', label: 'First Steps', desc: 'Complete 1 lesson', earned: stats.completedLessons >= 1, icon: '🎯' },
    { id: 'quiz', label: 'Quiz Master', desc: '80%+ quiz average', earned: stats.quizAverage >= 80, icon: '🏆' },
    { id: 'streak', label: 'On Fire', desc: '3-day streak', earned: stats.streak >= 3, icon: '🔥' },
    { id: 'half', label: 'Halfway Hero', desc: '50% roadmap done', earned: stats.progressPercent >= 50, icon: '⭐' },
    { id: 'linux', label: 'Chapter Explorer', desc: 'Complete 3 chapters', earned: stats.completedChapters >= 3, icon: '📚' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {badges.map((b) => (
        <div
          key={b.id}
          className={cn(
            'rounded-lg border p-3 text-center transition-opacity',
            b.earned ? 'border-primary/30 bg-primary/5' : 'border-border opacity-50'
          )}
        >
          <div className="text-2xl mb-1">{b.icon}</div>
          <p className="text-xs font-medium">{b.label}</p>
          <p className="text-[10px] text-muted-foreground">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { accessToken, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/progress/dashboard', accessToken),
  });

  if (isLoading) return <PageSkeleton />;
  if (!data) return null;

  const { stats, continueLesson, recommendedNext, recentQuizzes, chapterProgress } = data;
  const studyDays = buildStudyDays(chapterProgress);

  const statCards = [
    { icon: BookOpen, label: 'Lessons Done', value: `${stats.completedLessons}/${stats.totalLessons}`, color: 'text-blue-500' },
    { icon: Trophy, label: 'Quiz Average', value: `${stats.quizAverage}%`, color: 'text-yellow-500' },
    { icon: Flame, label: 'Streak', value: `${stats.streak} days`, color: 'text-orange-500' },
    { icon: Clock, label: 'Study Time', value: `${stats.studyHours}h`, color: 'text-green-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {data.user.name}!</h1>
        <p className="text-muted-foreground">Track your DevOps learning progress</p>
      </div>

      <Card className="mb-8 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Overall Progress
            </span>
            <span className="text-2xl font-bold text-primary">{stats.progressPercent}%</span>
          </div>
          <Progress value={stats.progressPercent} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {stats.completedChapters} of {stats.totalChapters} chapters completed
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="pt-6">
                <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(continueLesson || recommendedNext) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {continueLesson ? 'Continue Learning' : 'Recommended Next'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const lesson = continueLesson || recommendedNext!;
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {'chapter' in lesson ? (lesson as { chapter?: { title: string } }).chapter?.title : ''}
                      </p>
                    </div>
                    <Link to={`/lesson/${lesson.slug}`}>
                      <Button size="sm">
                        Continue <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No quizzes taken yet. Start a lesson!</p>
            ) : (
              <div className="space-y-3">
                {(recentQuizzes as { score: number; totalPoints: number; quiz: { lesson: { title: string; slug: string } } }[]).map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <Link to={`/lesson/${attempt.quiz.lesson.slug}`} className="hover:text-primary">
                      {attempt.quiz.lesson.title}
                    </Link>
                    <span className="font-medium">
                      {Math.round((attempt.score / attempt.totalPoints) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Learning Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Last 30 days activity</p>
            <LearningCalendar studyDays={studyDays} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Achievements stats={stats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BookmarksPage() {
  const { accessToken, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.get<{ id: string; lesson: { title: string; slug: string; description?: string; chapter: { title: string } } }[]>('/bookmarks', accessToken),
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Bookmarks</h1>
      {!bookmarks?.length ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            <p>No bookmarks yet. Bookmark lessons while studying!</p>
            <Link to="/roadmap"><Button className="mt-4">Browse Roadmap</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <Link key={b.id} to={`/lesson/${b.lesson.slug}`}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground">{b.lesson.chapter.title}</p>
                  <p className="font-medium">{b.lesson.title}</p>
                  {b.lesson.description && (
                    <p className="text-sm text-muted-foreground mt-1">{b.lesson.description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Card className="mb-4">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> {user?.role}</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </CardContent>
      </Card>
      <Button variant="destructive" onClick={logout}>Sign Out</Button>
    </div>
  );
}

export function AdminPage() {
  const { isAdmin, accessToken } = useAuthStore();
  const [tab, setTab] = useState<'overview' | 'users' | 'content'>('overview');

  if (!isAdmin()) return <Navigate to="/" replace />;

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<{ users: number; lessons: number; quizzes: number; attempts: number }>('/admin/stats', accessToken),
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<{ id: string; name: string; email: string; role: string; verified: boolean; streak: number; createdAt: string }[]>('/admin/users', accessToken),
    enabled: tab === 'users',
  });

  const { data: roadmaps } = useQuery({
    queryKey: ['admin-roadmaps'],
    queryFn: () => api.get<{ id: string; title: string; chapters: { id: string; title: string; lessons: { id: string; title: string; slug: string }[] }[] }[]>('/admin/roadmaps', accessToken),
    enabled: tab === 'content',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {(['overview', 'users', 'content'] as const).map((t) => (
          <Button key={t} variant={tab === t ? 'default' : 'outline'} size="sm" onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Users', value: stats?.users },
            { label: 'Lessons', value: stats?.lessons },
            { label: 'Quizzes', value: stats?.quizzes },
            { label: 'Quiz Attempts', value: stats?.attempts },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{s.value ?? '—'}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Streak</th>
                    <th className="pb-3">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{u.name}</td>
                      <td className="py-3 pr-4">{u.email}</td>
                      <td className="py-3 pr-4">{u.role}</td>
                      <td className="py-3 pr-4">{u.streak}</td>
                      <td className="py-3">{u.verified ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'content' && (
        <div className="space-y-4">
          {roadmaps?.map((rm) => (
            <Card key={rm.id}>
              <CardHeader><CardTitle>{rm.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {rm.chapters.map((ch) => (
                  <div key={ch.id}>
                    <p className="font-medium text-sm mb-1">{ch.title}</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      {ch.lessons.map((l) => (
                        <li key={l.id}>
                          <Link to={`/lesson/${l.slug}`} className="hover:text-primary">{l.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
