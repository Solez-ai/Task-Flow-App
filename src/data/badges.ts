
import { Badge } from '@/types/badges';

// Default badges that can be earned
export const defaultBadges: Badge[] = [
  {
    id: 'task-5',
    name: 'Task Master',
    description: 'Completed 5 tasks in a day',
    category: 'task',
    icon: '✅',
    condition: 'Complete 5 tasks in a single day',
    earned: false
  },
  {
    id: 'task-10',
    name: 'Productivity Champion',
    description: 'Completed 10 tasks in a day',
    category: 'task',
    icon: '🏆',
    condition: 'Complete 10 tasks in a single day',
    earned: false
  },
  {
    id: 'streak-3',
    name: 'Consistency Starter',
    description: 'Maintained a 3-day streak',
    category: 'streak',
    icon: '🔥',
    condition: 'Maintain a 3-day streak of completing tasks',
    earned: false
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    category: 'streak',
    icon: '📆',
    condition: 'Maintain a 7-day streak of completing tasks',
    earned: false
  },
  {
    id: 'time-1h',
    name: 'Hour of Power',
    description: 'Focused for 1 hour in a day',
    category: 'time',
    icon: '⏱️',
    condition: 'Focus for at least 1 hour in a single day',
    earned: false
  },
  {
    id: 'time-2h',
    name: 'Deep Focus',
    description: 'Focused for 2 hours in a day',
    category: 'time',
    icon: '🧠',
    condition: 'Focus for at least 2 hours in a single day',
    earned: false
  },
  {
    id: 'study-3',
    name: 'Study Session',
    description: 'Completed 3 study rounds in a day',
    category: 'goal',
    icon: '📚',
    condition: 'Complete 3 study rounds in a single day',
    earned: false
  }
];

// Function to get badges with their earned status
export const getBadgesWithStatus = (earnedBadgeIds: string[]): Badge[] => {
  return defaultBadges.map(badge => ({
    ...badge,
    earned: earnedBadgeIds.includes(badge.id)
  }));
};
