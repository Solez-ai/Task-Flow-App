
import { useState, useEffect } from 'react';
import { BADGES } from '@/data/badges';
import { Badge, BadgeProgress } from '@/types/badges';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DailyStats } from './useDailyStats';

// Badge notification component
const BadgeNotification = ({ badge }: { badge: Badge }) => {
  return (
    <Alert className="border-2 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/30">
      <AlertTitle className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
        <span className="text-2xl">{badge.icon}</span> {badge.name}
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        {badge.description}
      </AlertDescription>
    </Alert>
  );
};

export const useBadges = () => {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('earnedBadges');
    return saved ? JSON.parse(saved) : [];
  });

  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>(() => {
    const saved = localStorage.getItem('badgeProgress');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever badges change
  useEffect(() => {
    localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
  }, [earnedBadges]);

  useEffect(() => {
    localStorage.setItem('badgeProgress', JSON.stringify(badgeProgress));
  }, [badgeProgress]);

  // Check if a badge is already earned
  const isBadgeEarned = (badgeId: string): boolean => {
    return earnedBadges.some(badge => badge.id === badgeId);
  };

  // Function to award a badge
  const awardBadge = (badgeId: string) => {
    if (isBadgeEarned(badgeId)) return;
    
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;
    
    const earnedBadge = {
      ...badge,
      earned: true,
      earnedAt: new Date().toISOString()
    };
    
    setEarnedBadges(prev => [...prev, earnedBadge]);
    
    // Show a notification
    toast.custom(() => <BadgeNotification badge={earnedBadge} />, {
      duration: 6000,
      position: 'top-right'
    });
  };

  // Update progress for a badge
  const updateBadgeProgress = (badgeId: string, progress: number, total: number) => {
    setBadgeProgress(prev => {
      const existing = prev.find(p => p.id === badgeId);
      if (existing) {
        return prev.map(p => p.id === badgeId ? { id: badgeId, progress, total } : p);
      }
      return [...prev, { id: badgeId, progress, total }];
    });
  };

  // Get progress for a specific badge
  const getBadgeProgress = (badgeId: string): BadgeProgress | undefined => {
    return badgeProgress.find(p => p.id === badgeId);
  };

  // Process stats to check for earned badges
  const processStats = (stats: DailyStats, tasksCompletedToday?: number) => {
    // Streak-based badges
    if (stats.streak >= 3) awardBadge('streak-3');
    if (stats.streak >= 5) awardBadge('streak-5');
    if (stats.streak >= 10) awardBadge('streak-10');
    if (stats.streak >= 15) awardBadge('streak-15');
    if (stats.streak >= 30) awardBadge('streak-30');
    if (stats.streak >= 100) awardBadge('streak-100');

    // Time-based badges
    if (stats.focusedTimeMinutes >= 25) awardBadge('time-25');
    if (stats.focusedTimeMinutes >= 100) awardBadge('time-100');
    if (stats.focusedTimeMinutes >= 500) awardBadge('time-500');
    if (stats.focusedTimeMinutes >= 1000) awardBadge('time-1000');
    if (stats.focusedTimeMinutes >= 5000) awardBadge('time-5000');

    // Task-based badges (daily counts)
    if (stats.completedTasks >= 1) awardBadge('task-1');
    
    const dayTasks = tasksCompletedToday || stats.completedTasks;
    if (dayTasks >= 5) awardBadge('task-5');
    if (dayTasks >= 10) awardBadge('task-10');
    
    // We'd need to store total task count in localStorage for total badges
    const totalTasks = Number(localStorage.getItem('totalTasksCompleted') || '0');
    if (totalTasks >= 100) awardBadge('task-100');
    if (totalTasks >= 1000) awardBadge('task-1000');

    // For goal-based badges, we'd need additional data tracking
    // that would be implemented later with authentication
  };

  // Track task completion for badges
  const trackTaskCompletion = () => {
    // Increment total tasks completed
    const totalTasks = Number(localStorage.getItem('totalTasksCompleted') || '0') + 1;
    localStorage.setItem('totalTasksCompleted', totalTasks.toString());
    
    return totalTasks;
  };

  return {
    earnedBadges,
    awardBadge,
    isBadgeEarned,
    updateBadgeProgress,
    getBadgeProgress,
    processStats,
    trackTaskCompletion
  };
};
