
import { useState, useEffect } from 'react';

export interface DailyStats {
  pomodoroSessions: number;
  completedTasks: number;
  focusedTimeMinutes: number;
}

export const useDailyStats = () => {
  const [stats, setStats] = useState<DailyStats>(() => {
    // Try to load from localStorage
    const savedStats = localStorage.getItem('dailyStats');
    const savedDate = localStorage.getItem('dailyStatsDate');
    const today = new Date().toDateString();
    
    // Check if stats are from today
    if (savedStats && savedDate === today) {
      return JSON.parse(savedStats);
    } else {
      // Reset stats for a new day
      return {
        pomodoroSessions: 0,
        completedTasks: 0,
        focusedTimeMinutes: 0
      };
    }
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dailyStats', JSON.stringify(stats));
    localStorage.setItem('dailyStatsDate', new Date().toDateString());
  }, [stats]);

  // Add a Pomodoro session
  const addPomodoroSession = (minutes?: number) => {
    setStats(prev => ({
      ...prev,
      pomodoroSessions: prev.pomodoroSessions + 1,
      focusedTimeMinutes: prev.focusedTimeMinutes + (minutes || 25)
    }));
  };

  // Add a completed task
  const addCompletedTask = () => {
    setStats(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1
    }));
  };

  // Reset stats
  const resetStats = () => {
    setStats({
      pomodoroSessions: 0,
      completedTasks: 0,
      focusedTimeMinutes: 0
    });
  };

  return {
    stats,
    addPomodoroSession,
    addCompletedTask,
    resetStats
  };
};
