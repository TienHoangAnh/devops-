import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Flame, Clock, Trophy, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSkeleton } from '@/components/ui/skeleton';
import type { DashboardData } from '@/types';

export function ProfilePage() {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/progress/dashboard', accessToken),
  });

  if (isLoading) return <PageSkeleton />;

  const stats = data?.stats;

  const roadmapTopics = [
  'foundation',
  'containers',
  'cloud',
  'cicd',
  'kubernetes',
  'observability',
  'security',
];

const completedRoadmap = (() => {
  try {
    const saved = localStorage.getItem('devops-roadmap-completed');
    if (!saved) return [];
    const parsed: string[] = JSON.parse(saved);

    return parsed.filter((id) => roadmapTopics.includes(id));
  } catch {
    return [];
  }
})();

const roadmapProgress = Math.round(
  (completedRoadmap.length / roadmapTopics.length) * 100
);

const currentStage =
  roadmapTopics.find((id) => !completedRoadmap.includes(id)) ??
  roadmapTopics[roadmapTopics.length - 1];
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.role === 'ADMIN' ? 'Administrator' : 'Learner'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium">DevOps Hub</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {stats && (
          <Card>
  <CardHeader>
    <CardTitle>DevOps Roadmap Progress</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-blue-500" />
        <div>
          <p className="text-2xl font-bold">
            {completedRoadmap.length}/{roadmapTopics.length}
          </p>
          <p className="text-xs text-muted-foreground">
            Stages completed
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="text-2xl font-bold">
            {roadmapProgress}%
          </p>
          <p className="text-xs text-muted-foreground">
            Overall progress
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Flame className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-lg font-bold capitalize">
            {currentStage}
          </p>
          <p className="text-xs text-muted-foreground">
            Current stage
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-green-500" />
        <div>
          <p className="text-2xl font-bold">
            {roadmapTopics.length - completedRoadmap.length}
          </p>
          <p className="text-xs text-muted-foreground">
            Stages remaining
          </p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
        )}
      </motion.div>
    </div>
  );
}
