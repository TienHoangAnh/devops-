import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Flashcard } from '@/types';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return null;

  const card = cards[index];

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {index + 1} of {cards.length}
        </span>
        <Button variant="ghost" size="sm" onClick={() => { setFlipped(false); setIndex(0); }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      <div
        className="perspective-1000 cursor-pointer h-48"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-card p-6 text-center font-medium text-lg shadow-sm"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {card.front}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-6 text-center text-sm"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {card.back}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => { setFlipped(false); setIndex((i) => (i - 1 + cards.length) % cards.length); }}>
          Previous
        </Button>
        <Button size="sm" onClick={next}>Next</Button>
      </div>
    </div>
  );
}
