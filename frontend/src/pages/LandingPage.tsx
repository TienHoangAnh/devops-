import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal, Container, GitBranch, Cloud, Shield, Zap,
  ArrowRight, BookOpen, Trophy, BarChart3, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: BookOpen,
    title: 'Structured Learning Path',
    desc: '7-stage DevOps roadmap from Foundation to Production-ready DevSecOps.',
  },
  {
    icon: Terminal,
    title: 'Hands-on Labs',
    desc: 'Practice every topic with real DevOps labs and mini projects.',
  },
  {
    icon: Trophy,
    title: 'Quiz & Flashcards',
    desc: 'Review commands, concepts, and prepare for technical interviews.',
  },
  {
    icon: BarChart3,
    title: 'Learning Progress',
    desc: 'Track completed lessons, roadmap progress, achievements, and streaks.',
  },
  {
    icon: Zap,
    title: 'Cheat Sheets',
    desc: 'Quick references for Linux, Git, Docker, Kubernetes, Terraform, and more.',
  },
  {
    icon: Users,
    title: 'Project-based Learning',
    desc: 'Build real DevOps projects instead of only reading theory.',
  },
];

const chapters = [
  {
    icon: BookOpen,
    title: 'Foundation',
    color: 'text-blue-500',
  },
  {
    icon: Terminal,
    title: 'Containers',
    color: 'text-cyan-500',
  },
  {
    icon: Cloud,
    title: 'Cloud & IaC',
    color: 'text-orange-500',
  },
  {
    icon: GitBranch,
    title: 'CI/CD',
    color: 'text-purple-500',
  },
  {
    icon: Container,
    title: 'Kubernetes',
    color: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Observability',
    color: 'text-green-500',
  },
  {
    icon: Shield,
    title: 'DevSecOps',
    color: 'text-red-500',
  },
];

const stats = [
  { value: '7', label: 'Learning Stages' },
  { value: '120+', label: 'Lessons' },
  { value: '300+', label: 'Labs & Quiz Questions' },
  { value: '20+', label: 'Mini Projects' },
];

const faqs = [
  { q: 'Do I need to create an account?', a: 'No! Guests can access all lessons and quizzes. Create an account to save progress and sync across devices.' },
  { q: 'Is this suitable for beginners?', a: 'Absolutely. The roadmap starts with Linux fundamentals and progresses to advanced topics.' },
  { q: 'What technologies are covered?', a: 'Linux, Networking, Git, Docker, CI/CD, Kubernetes, Cloud, Terraform, Monitoring, and Security.' },
];

const testimonials = [
  { name: 'Minh Tran', role: 'DevOps Intern @ FPT', quote: 'The interactive terminal made Linux click for me. Best DevOps learning resource I\'ve used.', avatar: 'M' },
  { name: 'Sarah Chen', role: 'Junior SRE', quote: 'Structured roadmap + quizzes helped me land my first DevOps role. Highly recommend!', avatar: 'S' },
  { name: 'Alex Nguyen', role: 'CS Student', quote: 'Love that I can learn as guest and save progress after signing up. Clean UI too.', avatar: 'A' },
];

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Interactive DevOps Learning Platform
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Master DevOps
              <span className="block text-primary">Step by Step</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Master DevOps through structured roadmaps, interactive lessons, real-world labs,
              mini projects, quizzes, flashcards, and production-ready challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/roadmap">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lesson/linux-fundamentals">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Try Demo Lesson
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to learn DevOps</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            A complete learning management system built for modern DevOps education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <f.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="py-24 px-4 sm:px-6 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Your Learning Roadmap</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {chapters.map((ch, i) => (
              <motion.div
                key={ch.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-sm"
              >
                <ch.icon className={`h-5 w-5 ${ch.color}`} />
                <span className="font-medium">{String(i + 1).padStart(2, '0')} {ch.title}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/roadmap">
              <Button variant="outline">View Full Roadmap</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">What learners say</h2>
          <p className="text-muted-foreground text-center mb-12">Join developers mastering DevOps skills</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to start your DevOps journey?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of learners mastering DevOps skills.</p>
          <Link to="/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
