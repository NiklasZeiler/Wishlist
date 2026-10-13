export type Priority = 'niedrig' | 'mittel' | 'hoch';

export const PRIORITIES: readonly Priority[] = ['niedrig', 'mittel', 'hoch'];

export interface Wish {
  id: string;
  wish: string;
  description: string;
  priority: Priority;
  link: string;
  image: string;
  completed: boolean;
  public: boolean;
  // Misspelled on purpose: this is the field name already stored in Firestore.
  owener: string;
}

export interface NewWish {
  wish: string;
  description: string;
  link: string;
  priority: Priority;
}

export interface FeedbackEntry {
  id: string;
  feedback: string;
  likes: number;
}

export function normalizePriority(value: unknown): Priority {
  const lower = typeof value === 'string' ? value.toLowerCase() : '';
  return PRIORITIES.find((priority) => priority === lower) ?? 'niedrig';
}
