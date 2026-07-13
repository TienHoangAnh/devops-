import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Command {
  input: string;
  output: string;
}

interface TerminalProps {
  commands?: Command[];
}

export function Terminal({ commands = [] }: TerminalProps) {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'Welcome to DevOps Terminal Simulator' },
    { type: 'output', text: 'Type "help" for available commands' },
  ]);
  const [input, setInput] = useState('');
  const [cmdIndex, setCmdIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'input' as const, text: `$ ${input}` }];

    if (input === 'help') {
      newHistory.push({
        type: 'output',
        text: 'Available: pwd, ls, mkdir, cd, touch, cat, docker ps, help, clear',
      });
    } else if (input === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else {
      const match = commands.find((c) => c.input === input.trim());
      if (match) {
        if (match.output) newHistory.push({ type: 'output', text: match.output });
        setCmdIndex((i) => i + 1);
      } else {
        const partial = commands[cmdIndex];
        if (partial && input.trim() === partial.input) {
          if (partial.output) newHistory.push({ type: 'output', text: partial.output });
          setCmdIndex((i) => i + 1);
        } else {
          newHistory.push({ type: 'output', text: `bash: ${input}: command not found` });
          newHistory.push({ type: 'output', text: `Hint: try "${commands[cmdIndex]?.input || 'help'}"` });
        }
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border border-border shadow-lg"
    >
      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-zinc-400 ml-2 font-mono">terminal — bash</span>
      </div>
      <div className="bg-zinc-950 p-4 font-mono text-sm h-72 overflow-y-auto">
        {history.map((line, i) => (
          <div
            key={i}
            className={line.type === 'input' ? 'text-green-400' : 'text-zinc-300 whitespace-pre-wrap'}
          >
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-green-400 mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-zinc-100 outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
