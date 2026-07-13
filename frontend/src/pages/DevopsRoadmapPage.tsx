import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, BookOpen, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Topic {
  id: string;
  title: string;
  summary: string;
  details: string[];
  recommended: string[];
}

const topics: Topic[] = [
  {
    id: 'foundation',
    title: '1. Foundation',
    summary:
      'Xây dựng nền tảng lập trình, Linux, Terminal, Git và Networking trước khi học DevOps.',
    details: [
      'Học Python để viết automation script.',
      'Làm quen Bash Shell và Linux command line.',
      'Hiểu File System, Process, Permission, SSH, Systemd.',
      'Thành thạo Git: branch, merge, rebase, pull request.',
      'Nắm Networking cơ bản: TCP/IP, DNS, HTTP/HTTPS, SSH, TLS, CIDR, NAT.',
      'Viết Bash/Python script tự động hóa công việc.',
    ],
    recommended: [
      'Python',
      'Bash',
      'Ubuntu Linux',
      'Git',
      'GitHub',
      'Networking Fundamentals',
    ],
  },

  {
    id: 'containers',
    title: '2. Containers & System Administration',
    summary:
      'Đóng gói ứng dụng bằng Docker và triển khai với Nginx, Redis.',
    details: [
      'Hiểu Image, Container, Volume, Network.',
      'Viết Dockerfile và tối ưu Docker Image.',
      'Sử dụng Docker Compose.',
      'Cấu hình Nginx Reverse Proxy.',
      'Load Balancing.',
      'SSL/TLS.',
      'Redis Cache.',
    ],
    recommended: [
      'Docker',
      'Docker Compose',
      'Dockerfile',
      'Nginx',
      'Redis',
    ],
  },

  {
    id: 'cloud',
    title: '3. AWS & Infrastructure as Code',
    summary:
      'Làm chủ AWS và tự động hóa hạ tầng bằng Terraform và Ansible.',
    details: [
      'AWS IAM.',
      'EC2.',
      'VPC.',
      'S3.',
      'RDS.',
      'CloudWatch.',
      'Terraform Modules.',
      'Terraform State.',
      'Terraform Backend.',
      'Terraform Variables.',
      'Ansible Inventory.',
      'Ansible Playbook.',
      'Ansible Roles.',
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
    title: '4. Continuous Integration & Delivery',
    summary:
      'Tự động hóa build, test và deploy ứng dụng.',
    details: [
      'GitHub Actions Workflow.',
      'Build & Test Pipeline.',
      'Docker Build & Push.',
      'Deploy Automation.',
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
    title: '5. Kubernetes & GitOps',
    summary:
      'Triển khai ứng dụng production trên Kubernetes và GitOps.',
    details: [
      'Pod.',
      'ReplicaSet.',
      'Deployment.',
      'Service.',
      'Ingress.',
      'ConfigMap.',
      'Secret.',
      'Namespace.',
      'StatefulSet.',
      'DaemonSet.',
      'Helm.',
      'ArgoCD.',
      'RBAC.',
      'Horizontal Pod Autoscaler.',
      'Amazon EKS.',
    ],
    recommended: [
      'Kubernetes',
      'Helm',
      'ArgoCD',
      'Amazon EKS',
    ],
  },

  {
    id: 'observability',
    title: '6. Observability & Operations',
    summary:
      'Theo dõi Metrics, Logs và Tracing để vận hành hệ thống production.',
    details: [
      'Prometheus Metrics.',
      'Alertmanager.',
      'Grafana Dashboard.',
      'Loki Logging.',
      'Promtail.',
      'OpenTelemetry.',
      'Distributed Tracing.',
      'System Monitoring.',
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
    title: '7. Security, Production & Career',
    summary:
      'Hoàn thiện kỹ năng DevSecOps, tối ưu hệ thống và chuẩn bị đi làm.',
    details: [
      'Container Security.',
      'Infrastructure Security.',
      'Trivy.',
      'Checkov.',
      'OPA.',
      'High Availability.',
      'Disaster Recovery.',
      'Cost Optimization.',
      'System Design.',
      'Portfolio.',
      'Technical Blog.',
      'CV & Mock Interview.',
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
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const saved = window.localStorage.getItem("devops-roadmap-completed");
      const parsed: string[] = saved ? JSON.parse(saved) : [];

      return parsed.filter(id =>
        topics.some(topic => topic.id === id)
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('devops-roadmap-completed', JSON.stringify(completed));
  }, [completed]);

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
    setCompleted((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]));
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
              {currentTopic?.details.map((item) => (
                <li key={item} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
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
              <Link to="/roadmap" className="text-sm text-primary hover:underline">Xem roadmap chung</Link>
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
