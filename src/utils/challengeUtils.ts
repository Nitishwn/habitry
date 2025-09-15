import { Challenge, DayNote } from '../types';

export const createChallenge = (name: string, duration: number): Challenge => ({
  id: crypto.randomUUID(),
  name,
  duration,
  createdAt: new Date().toISOString(),
  image: null,
  completedDays: new Set(),
  notes: {},
  currentStreak: 0,
  longestStreak: 0,
});

export const calculateStreaks = (completedDays: Set<number>): { current: number; longest: number } => {
  if (completedDays.size === 0) return { current: 0, longest: 0 };

  const sortedDays = Array.from(completedDays).sort((a, b) => a - b);
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] + 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak from the highest day
  const maxDay = Math.max(...sortedDays);
  let checkDay = maxDay;
  while (completedDays.has(checkDay)) {
    currentStreak++;
    checkDay--;
  }

  return { current: currentStreak, longest: longestStreak };
};

export const getGridDimensions = (totalDays: number): { rows: number; cols: number } => {
  if (totalDays <= 25) return { rows: 5, cols: 5 };
  if (totalDays <= 100) return { rows: 10, cols: 10 };
  if (totalDays <= 225) return { rows: 15, cols: 15 };
  
  const cols = Math.ceil(Math.sqrt(totalDays));
  const rows = Math.ceil(totalDays / cols);
  return { rows, cols };
};