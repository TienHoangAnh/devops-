import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Reply, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type Comment = {
  id: string; content: string; createdAt: string;
  user: { id: string; name: string; avatar?: string | null; role: string };
  replies: Comment[];
};

function CommentForm({ lessonId, parentId, onDone }: { lessonId: string; parentId?: string; onDone: () => void }) {
  const { accessToken } = useAuthStore();
  const [content, setContent] = useState('');
  const mutation = useMutation({
    mutationFn: () => api.post('/comments', { lessonId, parentId, content }, accessToken),
    onSuccess: () => { setContent(''); onDone(); },
    onError: (error: Error) => toast.error(error.message || 'Could not post comment'),
  });
  return <div className="space-y-2">
    <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000}
      placeholder={parentId ? 'Write a reply…' : 'Share a question or learning tip…'}
      className="min-h-20 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    <Button size="sm" disabled={!content.trim() || mutation.isPending} onClick={() => mutation.mutate()}>
      {mutation.isPending ? 'Posting…' : parentId ? 'Reply' : 'Post comment'}
    </Button>
  </div>;
}

function CommentItem({ comment, lessonId, refresh }: { comment: Comment; lessonId: string; refresh: () => void }) {
  const { user, accessToken, isAuthenticated, isAdmin } = useAuthStore();
  const [replying, setReplying] = useState(false);
  const remove = useMutation({
    mutationFn: () => api.delete(`/comments/${comment.id}`, accessToken),
    onSuccess: refresh,
    onError: () => toast.error('Could not delete comment'),
  });
  const canDelete = user?.id === comment.user.id || isAdmin();
  return <div className="border-b border-border py-4 last:border-0">
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{comment.user.name.slice(0, 1).toUpperCase()}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm"><strong>{comment.user.name}</strong><span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span></div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{comment.content}</p>
        <div className="mt-2 flex gap-2">
          {isAuthenticated() && <Button variant="ghost" size="sm" onClick={() => setReplying(!replying)}><Reply className="mr-1 h-3.5 w-3.5" />Reply</Button>}
          {canDelete && <Button variant="ghost" size="sm" onClick={() => remove.mutate()} disabled={remove.isPending}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button>}
        </div>
        {replying && <div className="mt-3"><CommentForm lessonId={lessonId} parentId={comment.id} onDone={() => { setReplying(false); refresh(); }} /></div>}
        {comment.replies?.map((reply) => <div key={reply.id} className="ml-4 mt-3 border-l border-border pl-4"><CommentItem comment={reply} lessonId={lessonId} refresh={refresh} /></div>)}
      </div>
    </div>
  </div>;
}

export function CommentsPanel({ lessonId }: { lessonId: string }) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const key = ['comments', lessonId];
  const { data: comments = [], isLoading } = useQuery({ queryKey: key, queryFn: () => api.get<Comment[]>(`/comments/lesson/${lessonId}`) });
  const refresh = () => queryClient.invalidateQueries({ queryKey: key });
  return <Card>
    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MessageCircle className="h-5 w-5" />Discussion</CardTitle></CardHeader>
    <CardContent>
      {isAuthenticated() ? <CommentForm lessonId={lessonId} onDone={refresh} /> : <p className="text-sm text-muted-foreground">Sign in to ask a question or join the discussion.</p>}
      <div className="mt-4">{isLoading ? <p className="text-sm text-muted-foreground">Loading comments…</p> : comments.length ? comments.map((comment) => <CommentItem key={comment.id} comment={comment} lessonId={lessonId} refresh={refresh} />) : <p className="text-sm text-muted-foreground">No comments yet. Start the discussion.</p>}</div>
    </CardContent>
  </Card>;
}
