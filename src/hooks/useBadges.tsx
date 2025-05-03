
import { useState, useEffect } from 'react';
import { DailyStats } from './useDailyStats';
import { Badge } from '@/types/badges';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to get badges from local storage
const getSavedBadges = (userId?: string): Badge[] => {
  const savedBadges = localStorage.getItem('earnedBadges');
  const savedBadgesUserId = localStorage.getItem('badgesUserId');
  
  if (savedBadges && (!userId || savedBadgesUserId === userId)) {
    return JSON.parse(savedBadges);
  }
  return [];
};

// Helper function to save badges to local storage
const saveBadges = (badges: Badge[], userId?: string) => {
  localStorage.setItem('earnedBadges', JSON.stringify(badges));
  if (userId) {
    localStorage.setItem('badgesUserId', userId);
  }
};

export const useBadges = () => {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>(getSavedBadges(user?.id));

  // Update badges when user changes
  useEffect(() => {
    setEarnedBadges(getSavedBadges(user?.id));
  }, [user]);

  // Save badges to localStorage when they change
  useEffect(() => {
    saveBadges(earnedBadges, user?.id);
  }, [earnedBadges, user]);

  // Check if badge exists by ID
  const hasBadge = (id: string): boolean => {
    return earnedBadges.some(badge => badge.id === id);
  };

  // Add a new badge if it doesn't exist already
  const awardBadge = (badge: Badge) => {
    if (!hasBadge(badge.id)) {
      setEarnedBadges(prev => [...prev, badge]);
      return true;
    }
    return false;
  };

  // Process stats to potentially award badges
  const processStats = (stats: DailyStats, completedTasksCount?: number): void => {
    // Helper function to try to award badge and return true if newly awarded
    const tryAward = (badge: Badge): boolean => {
      if (!hasBadge(badge.id)) {
        setEarnedBadges(prev => [...prev, badge]);
        return true;
      }
      return false;
    };

    // Task completion badges
    if (completedTasksCount) {
      if (completedTasksCount >= 5 && !hasBadge('task-5')) {
        tryAward({
          id: 'task-5',
          name: 'Task Master',
          description: 'Completed 5 tasks in a day',
          category: 'task',
          icon: '✅'
        });
      }
      if (completedTasksCount >= 10 && !hasBadge('task-10')) {
        tryAward({
          id: 'task-10',
          name: 'Productivity Champion',
          description: 'Completed 10 tasks in a day',
          category: 'task',
          icon: '🏆'
        });
      }
    }

    // Streak badges
    if (stats.streak >= 3 && !hasBadge('streak-3')) {
      tryAward({
        id: 'streak-3',
        name: 'Consistency Starter',
        description: 'Maintained a 3-day streak',
        category: 'streak',
        icon: '🔥'
      });
    }
    if (stats.streak >= 7 && !hasBadge('streak-7')) {
      tryAward({
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        category: 'streak',
        icon: '📆'
      });
    }

    // Focus time badges
    if (stats.focusedTimeMinutes >= 60 && !hasBadge('time-1h')) {
      tryAward({
        id: 'time-1h',
        name: 'Hour of Power',
        description: 'Focused for 1 hour in a day',
        category: 'time',
        icon: '⏱️'
      });
    }
    if (stats.focusedTimeMinutes >= 120 && !hasBadge('time-2h')) {
      tryAward({
        id: 'time-2h',
        name: 'Deep Focus',
        description: 'Focused for 2 hours in a day',
        category: 'time',
        icon: '🧠'
      });
    }

    // Study mode badges
    if (stats.studyModeRounds >= 3 && !hasBadge('study-3')) {
      tryAward({
        id: 'study-3',
        name: 'Study Session',
        description: 'Completed 3 study rounds in a day',
        category: 'goal',
        icon: '📚'
      });
    }
  };

  // Function to track task completion for streaks
  const trackTaskCompletion = (): number => {
    // Get count of tasks completed today
    const totalTasksCompleted = Number(localStorage.getItem('totalTasksCompleted') || '0') + 1;
    localStorage.setItem('totalTasksCompleted', totalTasksCompleted.toString());
    
    return totalTasksCompleted;
  };

  return {
    earnedBadges,
    processStats,
    trackTaskCompletion
  };
};
