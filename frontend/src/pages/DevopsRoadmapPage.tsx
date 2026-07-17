import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, BookOpen, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

export interface Topic {
  id: string;
  title: string;
  summary: string;
  details: string[];
  recommended: string[];
}

export const topics: Topic[] = [
  {
    id: 'foundation',
    title: '1. Foundation',
    summary:
      'Xây dựng nền tảng Linux, Git, Networking và Automation - những kỹ năng cốt lõi của DevOps.',
    details: [
      'Python cơ bản để viết Automation Script.',
      'Bash Shell & Shell Scripting.',
      'Linux File System.',
      'Users & Groups.',
      'File Permission (chmod, chown).',
      'Package Management (apt, snap).',
      'Process Management (ps, top, htop, kill).',
      'Systemd & journalctl.',
      'Cron Jobs.',
      'SSH & SCP.',
      'Environment Variables.',
      'Git Workflow.',
      'Branch, Merge, Rebase.',
      'Pull Request & Conflict Resolution.',
      'Networking Fundamentals.',
      'OSI Model.',
      'TCP/IP.',
      'HTTP/HTTPS.',
      'DNS.',
      'TLS/SSL.',
      'SSH.',
      'Ports.',
      'CIDR.',
      'NAT.',
      'Firewall.',
      'Reverse Proxy.',
      'Load Balancer.',
      'Linux Networking Commands (curl, ping, dig, ss, traceroute).',
      'Automation Script bằng Python & Bash.',
    ],
    recommended: [
      'Ubuntu Linux',
      'Python',
      'Bash',
      'Git',
      'GitHub',
      'Networking Fundamentals',
    ],
  },

  {
    id: 'containers',
    title: '2. Containers & Web Infrastructure',
    summary:
      'Đóng gói ứng dụng bằng Docker và xây dựng hạ tầng web cơ bản.',
    details: [
      'Docker Architecture.',
      'Docker CLI.',
      'Docker Image.',
      'Container Lifecycle.',
      'Dockerfile.',
      'Multi-stage Build.',
      'Docker Volumes.',
      'Docker Network.',
      'Bind Mount.',
      'Docker Compose.',
      'Docker Registry.',
      'Docker Hub.',
      'Nginx Reverse Proxy.',
      'Virtual Host.',
      'Load Balancing.',
      'SSL/TLS.',
      "Let's Encrypt.",
      'HTTP Compression.',
      'Caching.',
      'Redis Cache.',
      'Redis Persistence.',
      'Session Storage.',
      'Pub/Sub (Overview).',
    ],
    recommended: [
      'Docker',
      'Docker Compose',
      'Docker Hub',
      'Dockerfile',
      'Nginx',
      'Redis',
    ],
  },

  {
    id: 'cloud',
    title: '3. Cloud & Infrastructure as Code',
    summary:
      'Triển khai ứng dụng trên AWS và quản lý hạ tầng bằng code.',
    details: [
      'AWS Global Infrastructure.',
      'IAM.',
      'EC2.',
      'VPC.',
      'Subnets.',
      'Internet Gateway.',
      'Route Table.',
      'Security Groups.',
      'Network ACL.',
      'Elastic IP.',
      'S3.',
      'RDS.',
      'CloudWatch.',
      'CloudTrail.',
      'Route53.',
      'Application Load Balancer (ALB).',
      'Terraform Basics.',
      'Providers.',
      'Resources.',
      'Variables.',
      'Outputs.',
      'Data Sources.',
      'Modules.',
      'State.',
      'Remote Backend.',
      'Workspaces.',
      'Ansible Inventory.',
      'Playbook.',
      'Variables.',
      'Templates.',
      'Handlers.',
      'Roles.',
    ],
    recommended: [
      'AWS',
      'Terraform',
      'Ansible',
      'CloudWatch',
    ],
  },

  {
    id: 'cicd',
    title: '4. CI/CD',
    summary:
      'Tự động hóa quy trình Build, Test và Deploy ứng dụng.',
    details: [
      'Continuous Integration.',
      'Continuous Delivery.',
      'GitHub Actions.',
      'Workflow.',
      'Runner.',
      'Environment.',
      'Build Pipeline.',
      'Lint.',
      'Unit Test.',
      'Docker Build.',
      'Docker Push.',
      'Artifact.',
      'Deployment.',
      'Rollback.',
      'Versioning.',
      'GitHub Secrets.',
      'AWS Secrets Manager.',
      'Artifact Management.',
    ],
    recommended: [
      'GitHub Actions',
      'Docker Hub',
      'GitHub Packages',
      'AWS Secrets Manager',
    ],
  },

  {
    id: 'kubernetes',
    title: '5. Kubernetes',
    summary:
      'Quản lý và triển khai container ở môi trường Production.',
    details: [
      'Kubernetes Architecture.',
      'Pod.',
      'ReplicaSet.',
      'Deployment.',
      'Service.',
      'Ingress.',
      'Persistent Volume.',
      'Persistent Volume Claim.',
      'ConfigMap.',
      'Secret.',
      'Namespace.',
      'StatefulSet.',
      'DaemonSet.',
      'Job & CronJob.',
      'RBAC.',
      'Horizontal Pod Autoscaler.',
      'Helm.',
      'Amazon EKS.',
      'ArgoCD (GitOps).',
    ],
    recommended: [
      'Kubernetes',
      'Helm',
      'Amazon EKS',
      'ArgoCD',
    ],
  },

  {
    id: 'observability',
    title: '6. Observability & Operations',
    summary:
      'Giám sát hệ thống bằng Metrics, Logs và Traces.',
    details: [
      'Three Pillars of Observability.',
      'Metrics.',
      'Logs.',
      'Traces.',
      'Prometheus.',
      'Node Exporter.',
      'PromQL.',
      'Alert Rules.',
      'Alertmanager.',
      'Grafana Dashboard.',
      'Loki.',
      'Promtail.',
      'Fluent Bit.',
      'ELK Stack (Overview).',
      'OpenTelemetry.',
      'Distributed Tracing.',
      'Application Monitoring.',
      'Infrastructure Monitoring.',
    ],
    recommended: [
      'Prometheus',
      'Grafana',
      'Alertmanager',
      'Loki',
      'OpenTelemetry',
    ],
  },

  {
    id: 'security',
    title: '7. DevSecOps, Production & Career',
    summary:
      'Bảo mật hệ thống, tối ưu Production và chuẩn bị đi làm DevOps.',
    details: [
      'IAM Best Practices.',
      'Secrets Management.',
      'Container Security.',
      'Infrastructure Security.',
      'Least Privilege.',
      'Trivy.',
      'Checkov.',
      'OPA (Overview).',
      'High Availability.',
      'Scaling.',
      'Backup & Restore.',
      'Disaster Recovery.',
      'Cost Optimization.',
      'System Design.',
      'Technical Portfolio.',
      'Technical Blog.',
      'CV.',
      'Mock Interview.',
    ],
    recommended: [
      'Trivy',
      'Checkov',
      'OPA',
      'GitHub Portfolio',
      'System Design',
    ],
  },
];

export function DevopsRoadmapPage() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: progress = [] } = useQuery({
    queryKey: ['roadmap-progress'],
    queryFn: () => api.get<{ topicId: string; completed: boolean }[]>('/progress/roadmap', accessToken),
    enabled: isAuthenticated(),
  });
  const completed = progress
    .filter((item) => item.completed && topics.some((topic) => topic.id === item.topicId))
    .map((item) => item.topicId);
  const updateProgress = useMutation({
    mutationFn: ({ topicId, completed: isCompleted }: { topicId: string; completed: boolean }) =>
      api.put(`/progress/roadmap/${topicId}`, { completed: isCompleted }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Preserve progress created by the previous browser-only implementation.
  // Once copied, the server becomes the source of truth for this user.
  useEffect(() => {
    if (!isAuthenticated()) return;

    let legacyTopicIds: string[] = [];
    try {
      const saved = window.localStorage.getItem('devops-roadmap-completed');
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        legacyTopicIds = parsed.filter(
          (id): id is string => typeof id === 'string' && topics.some((topic) => topic.id === id)
        );
      }
    } catch {
      return;
    }

    const missingTopicIds = legacyTopicIds.filter((topicId) => !completed.includes(topicId));
    if (!missingTopicIds.length) {
      if (legacyTopicIds.length) window.localStorage.removeItem('devops-roadmap-completed');
      return;
    }

    void Promise.all(
      missingTopicIds.map((topicId) => api.put(`/progress/roadmap/${topicId}`, { completed: true }, accessToken))
    ).then(() => {
      window.localStorage.removeItem('devops-roadmap-completed');
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });
  }, [accessToken, completed, isAuthenticated, queryClient]);

  const progressPercent = useMemo(() => {
    if (!topics.length) return 0;
    return Math.round((completed.length / topics.length) * 100);
  }, [completed]);

  const currentTopic = useMemo(() => {
    const nextTopic = topics.find((topic, index) => {
      if (completed.includes(topic.id)) return false;
      return index === 0 || completed.includes(topics[index - 1].id);
    });

    return nextTopic || topics[topics.length - 1];
  }, [completed]);

  const isUnlocked = (topicId: string) => {
    const index = topics.findIndex((topic) => topic.id === topicId);
    if (index <= 0) return true;
    return completed.includes(topics[index - 1].id);
  };

  const toggleComplete = (topicId: string) => {
    if (!isUnlocked(topicId)) return;
    if (!isAuthenticated()) return;
    updateProgress.mutate({ topicId, completed: !completed.includes(topicId) });
  };

  const completedCount = completed.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> DevOps Interactive Roadmap
          </p>
          <h1 className="text-3xl font-bold">Lộ trình học DevOps tổng quát Zero to Hero</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mỗi mục là một bước đi trong roadmap DevOps. Khi bạn hoàn thành một phần, hệ thống sẽ đánh dấu và chuyển sang phần tiếp theo.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 min-w-[260px]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Tiến độ</span>
            <span className="text-muted-foreground">{completedCount}/{topics.length} mục</span>
          </div>
          <Progress value={progressPercent} className="mb-2" />
          <p className="text-xs text-muted-foreground">{progressPercent}% hoàn thành</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {currentTopic?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{currentTopic?.summary}</p>
            <ul className="space-y-2 text-sm">
              {currentTopic?.details.map((item, index) => (
                <li key={item} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <Link to={`/learn/${currentTopic.id}/${index}`} className="text-primary hover:underline">{item}</Link>
                </li>
              ))}
            </ul>
            <div>
              <p className="mb-2 text-sm font-medium">Khuyến nghị học:</p>
              <div className="flex flex-wrap gap-2">
                {currentTopic?.recommended.map((item) => (
                  <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs">{item}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={() => toggleComplete(currentTopic.id)}>
                {completed.includes(currentTopic.id) ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã học'}
              </Button>
              {/* <Link to="/roadmap" className="text-sm text-primary hover:underline">Xem roadmap chung</Link> */}
              <Link to="/quiz" className="text-sm text-primary hover:underline">Ôn tập tổng hợp</Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {topics.map((topic, index) => {
            const isDone = completed.includes(topic.id);
            const isCurrent = currentTopic?.id === topic.id;
            const unlocked = index === 0 || completed.includes(topics[index - 1].id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleComplete(topic.id)}
                disabled={!unlocked}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${isCurrent ? 'border-primary bg-primary/5' : 'border-border bg-card'} ${unlocked ? 'hover:border-primary/30' : 'opacity-70'}`}
              >
                <div className="flex items-start gap-3">
                  {isDone ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" /> : unlocked ? <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" /> : <Lock className="mt-0.5 h-5 w-5 text-muted-foreground" />}
                  <div className="flex-1">
                    <div className="font-medium">{topic.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{topic.summary}</p>
                    {!unlocked && <p className="mt-2 text-xs text-muted-foreground">Hoàn thành mục trước để mở khóa.</p>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
