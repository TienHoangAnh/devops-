import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StickyNote, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

interface NotesPanelProps {
  lessonId: string;
  initialContent?: string | null;
}

export function NotesPanel({ lessonId, initialContent }: NotesPanelProps) {
  const { accessToken, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(initialContent || '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setContent(initialContent || '');
    setDirty(false);
  }, [initialContent, lessonId]);

  const saveMutation = useMutation({
    mutationFn: () => api.post('/notes', { lessonId, content }, accessToken),
    onSuccess: () => {
      toast.success('Notes saved');
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
    },
    onError: () => toast.error('Sign in to save notes'),
  });

  if (!isAuthenticated()) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Sign in to take notes on this lesson
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <StickyNote className="h-5 w-5" /> My Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setDirty(true); }}
          placeholder="Write your notes here..."
          rows={5}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          onClick={() => saveMutation.mutate()}
          disabled={!dirty || saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-1" />
          {saveMutation.isPending ? 'Saving...' : 'Save Notes'}
        </Button>
      </CardContent>
    </Card>
  );
}
