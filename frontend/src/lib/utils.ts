import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getSectionIcon(type: string): string {
  const icons: Record<string, string> = {
    OVERVIEW: '📋',
    OBJECTIVES: '🎯',
    THEORY: '📖',
    ARCHITECTURE: '🏗️',
    IMAGES: '🖼️',
    VIDEO: '🎬',
    EXAMPLE: '💡',
    CODE: '💻',
    INTERACTIVE: '⚡',
    PRACTICE: '✏️',
    SOLUTION: '✅',
    SUMMARY: '📝',
    CHEAT_SHEET: '📌',
    REFERENCES: '🔗',
  };
  return icons[type] || '📄';
}
