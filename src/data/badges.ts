
import { Badge } from '@/types/badges';

export const BADGES: Badge[] = [
  // Streak-Based Badges
  {
    id: 'streak-3',
    name: '3-Day Spark',
    description: 'Used the app for 3 consecutive days',
    icon: '🔥',
    category: 'streak',
    condition: 'Use the app for 3 consecutive days',
    earned: false
  },
  {
    id: 'streak-5',
    name: '5-Day Blaze',
    description: 'Maintained a 5-day streak',
    icon: '🔥',
    category: 'streak',
    condition: '5-day streak',
    earned: false
  },
  {
    id: 'streak-10',
    name: '10-Day Ember',
    description: 'Maintained a 10-day streak',
    icon: '🔥',
    category: 'streak',
    condition: '10-day streak',
    earned: false
  },
  {
    id: 'streak-15',
    name: '15-Day Inferno',
    description: 'Maintained a 15-day streak',
    icon: '🔥',
    category: 'streak',
    condition: '15-day streak',
    earned: false
  },
  {
    id: 'streak-30',
    name: '30-Day Discipline',
    description: 'Maintained a 30-day streak',
    icon: '🔥',
    category: 'streak',
    condition: '30-day streak',
    earned: false
  },
  {
    id: 'streak-100',
    name: 'Streak King',
    description: 'Reached a 100-day streak',
    icon: '👑',
    category: 'streak',
    condition: 'Reach a 100-day streak',
    earned: false
  },

  // Time-Based Badges
  {
    id: 'time-25',
    name: 'Just Getting Started',
    description: 'Completed 25 minutes of focus',
    icon: '⏰',
    category: 'time',
    condition: 'Complete 25 minutes of focus (1 Pomodoro)',
    earned: false
  },
  {
    id: 'time-100',
    name: 'Focused Flow',
    description: 'Completed 100 total minutes focused',
    icon: '⏳',
    category: 'time',
    condition: '100 total minutes focused',
    earned: false
  },
  {
    id: 'time-500',
    name: 'Productivity Surge',
    description: 'Completed 500 total minutes focused',
    icon: '⚡',
    category: 'time',
    condition: '500 total minutes focused',
    earned: false
  },
  {
    id: 'time-1000',
    name: 'Master of Minutes',
    description: 'Completed 1,000 total minutes focused',
    icon: '🧠',
    category: 'time',
    condition: '1,000 total minutes (≈ 16.6 hrs)',
    earned: false
  },
  {
    id: 'time-5000',
    name: 'Time Lord',
    description: 'Completed 5,000 total minutes focused',
    icon: '🕒',
    category: 'time',
    condition: '5,000 total minutes focused',
    earned: false
  },

  // Task-Based Badges
  {
    id: 'task-1',
    name: 'First Task Down',
    description: 'Completed your first task',
    icon: '✅',
    category: 'task',
    condition: 'Complete your first task',
    earned: false
  },
  {
    id: 'task-5',
    name: 'Productive Day',
    description: 'Finished 5 tasks in a single day',
    icon: '✅',
    category: 'task',
    condition: 'Finish 5 tasks in a single day',
    earned: false
  },
  {
    id: 'task-10',
    name: 'Task Terminator',
    description: 'Completed 10 tasks in a single day',
    icon: '✅',
    category: 'task',
    condition: '10 tasks in a single day',
    earned: false
  },
  {
    id: 'task-100',
    name: 'Checklist Champion',
    description: 'Completed 100 total tasks',
    icon: '✅',
    category: 'task',
    condition: '100 total tasks completed',
    earned: false
  },
  {
    id: 'task-1000',
    name: 'The Finisher',
    description: 'Completed 1,000 tasks',
    icon: '✅',
    category: 'task',
    condition: '1,000 tasks completed',
    earned: false
  },

  // Goal-Oriented Badges
  {
    id: 'goal-weekly',
    name: 'Weekly Warrior',
    description: 'Completed all 7 days in one week',
    icon: '🗓',
    category: 'goal',
    condition: 'Complete all 7 days in one week',
    earned: false
  },
  {
    id: 'goal-monthly',
    name: 'Monthly Consistency',
    description: 'Worked on 25+ days in a calendar month',
    icon: '📆',
    category: 'goal',
    condition: 'Work on 25+ days in a calendar month',
    earned: false
  },
  {
    id: 'goal-intent',
    name: 'Daily Intent Hero',
    description: 'Logged your intent 7 days in a row',
    icon: '🚀',
    category: 'goal',
    condition: 'Log your intent 7 days in a row',
    earned: false
  }
];
