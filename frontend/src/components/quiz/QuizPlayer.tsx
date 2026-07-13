import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Quiz, QuizResult, QuizQuestion } from '@/types';

interface QuizPlayerProps {
  quiz: Quiz;
  onSubmit: (answers: unknown[], timeSpent: number) => Promise<QuizResult>;
  lessonSlug: string;
}

export function QuizPlayer({ quiz, onSubmit }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(() => Date.now());

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const formatted = quiz.questions.map((q) => ({
      questionId: q.id,
      ...((answers[q.id] as object) || {}),
    }));
    try {
      const res = await onSubmit(formatted, timeSpent);
      setResult(res);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">{result.percentage}%</h2>
            <p className="text-muted-foreground">
              {result.correct}/{result.totalPoints} correct
              {!result.saved && ' · Sign in to save your score'}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {quiz.questions.map((q, i) => {
            const r = result.results.find((res) => res.questionId === q.id);
            return (
              <Card key={q.id} className={cn(r?.correct ? 'border-success/30' : 'border-destructive/30')}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    {r?.correct ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <CardTitle className="text-base font-medium">
                      {i + 1}. {q.question}
                    </CardTitle>
                  </div>
                </CardHeader>
                {r?.explanation && (
                  <CardContent className="text-sm text-muted-foreground pl-11">
                    {r.explanation}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <Button onClick={() => { setResult(null); setAnswers({}); }} variant="outline" className="w-full">
          Try Again
        </Button>
      </motion.div>
    );
  }

  const answered = Object.keys(answers).length;
  const progress = (answered / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{answered}/{quiz.questions.length} answered</span>
        </div>
        <Progress value={progress} />
      </div>

      {quiz.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          value={answers[q.id]}
          onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
        />
      ))}

      <Button
        onClick={handleSubmit}
        disabled={submitting || answered < quiz.questions.length}
        className="w-full"
        size="lg"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </Button>
    </div>
  );
}

function QuestionCard({
  question, index, value, onChange,
}: {
  question: QuizQuestion;
  index: number;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const val = value as { answerIds?: string[]; textAnswer?: string; orderedIds?: string[]; matches?: Record<string, string> } | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {index + 1}. {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {(question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') && (
          question.answers.map((a) => (
            <button
              key={a.id}
              onClick={() => onChange({ answerIds: [a.id] })}
              className={cn(
                'w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors',
                val?.answerIds?.includes(a.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-accent'
              )}
            >
              {a.text}
            </button>
          ))
        )}

        {question.type === 'FILL_BLANK' && (
          <input
            type="text"
            placeholder="Type your answer..."
            value={val?.textAnswer || ''}
            onChange={(e) => onChange({ textAnswer: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
          />
        )}

        {question.type === 'ORDERING' && (
          <div className="space-y-2">
            {(val?.orderedIds
              ? val.orderedIds.map((id) => question.answers.find((a) => a.id === id)!)
              : [...question.answers].sort((a, b) => a.order - b.order)
            ).map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm">
                <span className="text-muted-foreground w-6">{i + 1}.</span>
                {a.text}
                <div className="ml-auto flex gap-1">
                  <Button
                    variant="ghost" size="sm"
                    disabled={i === 0}
                    onClick={() => {
                      const ids = val?.orderedIds || question.answers.sort((a, b) => a.order - b.order).map((x) => x.id);
                      const next = [...ids];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange({ orderedIds: next });
                    }}
                  >↑</Button>
                  <Button
                    variant="ghost" size="sm"
                    disabled={i === question.answers.length - 1}
                    onClick={() => {
                      const ids = val?.orderedIds || question.answers.sort((a, b) => a.order - b.order).map((x) => x.id);
                      const next = [...ids];
                      [next[i], next[i + 1]] = [next[i + 1], next[i]];
                      onChange({ orderedIds: next });
                    }}
                  >↓</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === 'MATCHING' && (
          <div className="space-y-3">
            {((question.metadata?.pairs as { left: string; right: string }[]) || []).map((pair) => (
              <div key={pair.left} className="flex items-center gap-3">
                <span className="font-medium w-32">{pair.left}</span>
                <select
                  value={val?.matches?.[pair.left] || ''}
                  onChange={(e) => onChange({
                    matches: { ...val?.matches, [pair.left]: e.target.value },
                  })}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  {question.answers.map((a) => (
                    <option key={a.id} value={a.text}>{a.text}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {question.type === 'DRAG_DROP' && (
          <div className="flex flex-wrap gap-2">
            {question.answers.map((a) => {
              const order = val?.orderedIds || [];
              const pos = order.indexOf(a.metadata?.id as string || a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    const id = (a.metadata?.id as string) || a.id;
                    const current = val?.orderedIds || [];
                    if (current.includes(id)) {
                      onChange({ orderedIds: current.filter((x) => x !== id) });
                    } else {
                      onChange({ orderedIds: [...current, id] });
                    }
                  }}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm',
                    (val?.orderedIds || []).includes((a.metadata?.id as string) || a.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  )}
                >
                  {pos >= 0 ? `${pos + 1}. ` : ''}{a.text}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
