import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Circle, PlayCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { FlashcardDeck } from '@/components/lesson/FlashcardDeck';
import type { Chapter } from '@/types';

interface RoadmapStep {
  id: string;
  title: string;
  summary: string;
  details: string[];
  recommended: string[];
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: 'step-1',
    title: '1. Ngôn ngữ lập trình',
    summary: 'Bắt đầu với Python, Go hoặc JavaScript để tự động hóa.',
    details: ['Biết biến, hàm, cấu trúc dữ liệu.', 'Viết script để tự động hóa tác vụ.', 'Làm quen với CLI và debug.'],
    recommended: ['Python', 'Go', 'JavaScript'],
  },
  {
    id: 'step-2',
    title: '2. Hệ điều hành',
    summary: 'Hiểu Linux, file system, process và permissions.',
    details: ['Quản lý package và service.', 'Làm quen với Ubuntu/Debian.', 'Theo dõi tài nguyên và lỗi hệ thống.'],
    recommended: ['Linux', 'Ubuntu', 'Shell'],
  },
  {
    id: 'step-3',
    title: '3. Terminal & Shell',
    summary: 'Thành thạo terminal để thao tác server hiệu quả.',
    details: ['Grep, sed, awk, ssh, curl.', 'Viết shell script.', 'Sử dụng tệp tin và logs.'],
    recommended: ['Bash', 'PowerShell', 'Vim'],
  },
  {
    id: 'step-4',
    title: '4. Git & Version Control',
    summary: 'Quản lý thay đổi và hợp tác bằng Git.',
    details: ['Commit, branch, merge, rebase.', 'Pull request và code review.', 'Quản lý repo trên GitHub.'],
    recommended: ['Git', 'GitHub', 'Branching'],
  },
  {
    id: 'step-5',
    title: '5. Containers',
    summary: 'Cô lập ứng dụng bằng Docker.',
    details: ['Image, container, volume, network.', 'Viết Dockerfile.', 'Dùng Docker Compose.'],
    recommended: ['Docker', 'Compose', 'Image'],
  },
  {
    id: 'step-6',
    title: '6. Network & Protocol',
    summary: 'Hiểu cách service giao tiếp với nhau.',
    details: ['IP, DNS, HTTP/HTTPS, TCP/UDP.', 'SSH, TLS và firewall.', 'Debug mạng bằng curl, ping.'],
    recommended: ['DNS', 'HTTP', 'SSH'],
  },
  {
    id: 'step-7',
    title: '7. Web Server & Proxy',
    summary: 'Triển khai và bảo vệ ứng dụng bằng web server.',
    details: ['Nginx/Caddy và reverse proxy.', 'Load balancer và TLS termination.', 'Caching và routing.'],
    recommended: ['Nginx', 'Proxy', 'TLS'],
  },
  {
    id: 'step-8',
    title: '8. Cloud Platform',
    summary: 'Triển khai service lên cloud.',
    details: ['VM, storage, networking.', 'IAM và security basics.', 'Deploy app cơ bản.'],
    recommended: ['AWS', 'Azure', 'GCP'],
  },
  {
    id: 'step-9',
    title: '9. CI/CD',
    summary: 'Tự động hóa build, test và release.',
    details: ['Pipeline build/test/deploy.', 'GitHub Actions hoặc GitLab CI.', 'Rollback và secret management.'],
    recommended: ['Actions', 'Jenkins', 'Pipeline'],
  },
  {
    id: 'step-10',
    title: '10. IaC & Provisioning',
    summary: 'Quản lý hạ tầng bằng mã.',
    details: ['Terraform, Ansible hoặc Pulumi.', 'Tạo và xoá infra bằng code.', 'Quản lý state và biến môi trường.'],
    recommended: ['Terraform', 'Ansible', 'IaC'],
  },
  {
    id: 'step-11',
    title: '11. Monitoring & Logs',
    summary: 'Theo dõi hệ thống và phát hiện sự cố.',
    details: ['Metrics, logs và alerting.', 'Grafana, Prometheus, Loki.', 'Dashboard và incident response.'],
    recommended: ['Prometheus', 'Grafana', 'Logs'],
  },
  {
    id: 'step-12',
    title: '12. Security & Secrets',
    summary: 'Bảo mật toàn bộ pipeline và môi trường.',
    details: ['TLS, IAM, least privilege.', 'Vault hoặc secrets manager.', 'Hardening và audit.'],
    recommended: ['Vault', 'Secrets', 'TLS'],
  },
  {
    id: 'step-13',
    title: '13. Kubernetes',
    summary: 'Vận hành nhiều container ở quy mô lớn.',
    details: ['Pod, deployment, service, ingress.', 'Scaling và self-healing.', 'Helm và cluster operations.'],
    recommended: ['Kubernetes', 'Helm', 'Ingress'],
  },
];

export function RoadmapPage() {
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('devops-roadmap-steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('devops-roadmap-steps', JSON.stringify(completed));
  }, [completed]);

  const progressPercent = useMemo(() => {
    if (!roadmapSteps.length) return 0;
    return Math.round((completed.length / roadmapSteps.length) * 100);
  }, [completed]);

  const currentStep = useMemo(() => {
    const next = roadmapSteps.find((step, index) => {
      if (completed.includes(step.id)) return false;
      return index === 0 || completed.includes(roadmapSteps[index - 1].id);
    });
    return next || roadmapSteps[roadmapSteps.length - 1];
  }, [completed]);

  const isUnlocked = (stepId: string) => {
    const index = roadmapSteps.findIndex((step) => step.id === stepId);
    if (index <= 0) return true;
    return completed.includes(roadmapSteps[index - 1].id);
  };

  const toggleComplete = (stepId: string) => {
    if (!isUnlocked(stepId)) return;
    setCompleted((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> DevOps Learning Path
            </p>
            <h1 className="text-3xl font-bold">Lộ trình học DevOps tổng quát Zero to Hero </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Mỗi bước đại diện cho một vùng kiến thức cần nắm trước khi đi sâu hơn vào DevOps thực tế.
            </p>
          </div>
          <div className="min-w-[260px] rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Tiến độ</span>
              <span className="text-muted-foreground">{completed.length}/{roadmapSteps.length} bước</span>
            </div>
            <Progress value={progressPercent} className="mb-2" />
            <p className="text-xs text-muted-foreground">{progressPercent}% hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Bước hiện tại</h2>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary">{currentStep.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{currentStep.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentStep.recommended.map((item) => (
                <span key={item} className="rounded-full bg-background px-3 py-1 text-xs">{item}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Cách dùng</p>
            <p className="mt-2">Hoàn thành bước hiện tại để mở bước tiếp theo. Đây là lộ trình học theo trình tự logic từ nền tảng đến vận hành hệ thống.</p>
          </div>
        </div>

        <div className="space-y-3">
          {roadmapSteps.map((step, index) => {
            const isDone = completed.includes(step.id);
            const unlocked = isUnlocked(step.id);
            const isCurrent = currentStep.id === step.id;
            return (
              <motion.button
                key={step.id}
                type="button"
                whileHover={unlocked ? { x: 4 } : {}}
                onClick={() => toggleComplete(step.id)}
                disabled={!unlocked}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${isCurrent ? 'border-primary bg-primary/5' : 'border-border bg-card'} ${unlocked ? 'hover:border-primary/30' : 'opacity-70'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${isDone ? 'bg-success/15 text-success' : unlocked ? 'bg-muted text-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {isDone ? <CheckCircle className="h-5 w-5" /> : unlocked ? <Circle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{step.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.details.slice(0, 2).map((item) => (
                        <span key={item} className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                    {!unlocked && <p className="mt-3 text-xs text-muted-foreground">Hoàn thành bước trước để mở khóa.</p>}
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ChapterPage() {
  const { slug } = useParams();
  const token = useAuthStore((s) => s.accessToken);

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', slug],
    queryFn: () => api.get<Chapter>(`/chapters/${slug}`, token),
    enabled: !!slug,
  });

  if (isLoading) return <PageSkeleton />;
  if (!chapter) return <div className="p-8 text-center">Chapter not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/roadmap" className="hover:text-foreground">Roadmap</Link>
        <span className="mx-2">/</span>
        <span>{chapter.title}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold">{chapter.title}</h1>
      <p className="mb-8 text-muted-foreground">{chapter.description}</p>

      <div className="mb-12 space-y-3">
        <h2 className="text-lg font-semibold">Lessons</h2>
        {chapter.lessons?.map((lesson, i) => {
          const status = chapter.progressMap?.[lesson.id];
          return (
            <Link key={lesson.id} to={`/lesson/${lesson.slug}`}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30"
              >
                <span className="w-6 text-sm font-mono text-muted-foreground">{i + 1}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                </div>
                {status === 'COMPLETED' && <CheckCircle className="h-4 w-4 text-success" />}
                {status === 'IN_PROGRESS' && <PlayCircle className="h-4 w-4 text-primary" />}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </Link>
          );
        })}
      </div>

      {chapter.flashcards && chapter.flashcards.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Flashcards</h2>
          <FlashcardDeck cards={chapter.flashcards} />
        </div>
      )}
    </div>
  );
}
