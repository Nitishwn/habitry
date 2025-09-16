export interface Challenge {
  id: string;
  name: string;
  duration: number;
  createdAt: string;
  image: string | null;
  completedDays: Set<number>;
  notes: Record<number, DayNote>;
  currentStreak: number;
  longestStreak: number;
  unit: 'days' | 'hours';
  isArchived: boolean;
}

export interface DayNote {
  text?: string;
  photo?: string;
  link?: string;
  mood?: string;
  timestamp: string;
}

export interface GridCell {
  day: number;
  completed: boolean;
  revealed: boolean;
}