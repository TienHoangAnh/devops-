import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Terminal } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchResult {
  lessons: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    chapter: { title: string; slug: string };
  }[];
  commands: {
    id: string;
    type: string;
    content: string;
    lesson: { title: string; slug: string };
  }[];
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.get<SearchResult>(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  });

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="mx-auto mt-[10vh] max-w-xl px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="search"
                placeholder="Search lessons, commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent py-4 text-sm outline-none"
                autoFocus
              />
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {query.length < 2 && (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  Type at least 2 characters to search
                </p>
              )}

              {query.length >= 2 && isFetching && (
                <p className="p-4 text-sm text-muted-foreground text-center">Searching...</p>
              )}

              {query.length >= 2 && !isFetching && data && (
                <>
                  {data.lessons.length === 0 && data.commands.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground text-center">No results found</p>
                  )}

                  {data.lessons.length > 0 && (
                    <div className="mb-2">
                      <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">Lessons</p>
                      {data.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${lesson.slug}`}
                          onClick={onClose}
                          className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.chapter.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {data.commands.length > 0 && (
                    <div>
                      <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">Commands & Content</p>
                      {data.commands.map((section) => (
                        <Link
                          key={section.id}
                          to={`/lesson/${section.lesson.slug}`}
                          onClick={onClose}
                          className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
                        >
                          <Terminal className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{section.lesson.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{section.content.slice(0, 80)}...</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex gap-4">
              <span><kbd className={cn('px-1.5 py-0.5 rounded bg-muted')}>Esc</kbd> close</span>
              <span><kbd className={cn('px-1.5 py-0.5 rounded bg-muted')}>Ctrl+K</kbd> toggle</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen]);
}
