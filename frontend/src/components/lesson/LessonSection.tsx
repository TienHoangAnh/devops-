import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { Terminal } from './Terminal';
import { getSectionIcon } from '@/lib/utils';
import type { LessonSection } from '@/types';

interface LessonSectionViewProps {
  section: LessonSection;
  defaultOpen?: boolean;
}

export function LessonSectionView({ section, defaultOpen = false }: LessonSectionViewProps) {
  const [open, setOpen] = useState(defaultOpen);

  const title = section.title || section.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div id={section.type.toLowerCase()} className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{getSectionIcon(section.type)}</span>
          <span className="font-semibold">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }}>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-border p-6"
        >
          {section.type === 'INTERACTIVE' ? (
            <Terminal commands={(section.metadata?.commands as { input: string; output: string }[]) || []} />
          ) : section.type === 'VIDEO' ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={section.content}
                title={title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <MarkdownContent content={section.content} />
          )}
        </motion.div>
      )}
    </div>
  );
}
