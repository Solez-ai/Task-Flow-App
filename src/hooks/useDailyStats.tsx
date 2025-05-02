
import { useState, useEffect } from 'react';

export interface DailyStats {
  pomodoroSessions: number;
  completedTasks: number;
  focusedTimeMinutes: number;
  studyModeRounds: number;
  streak: number;
  lastTaskDate: string | null;
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
      // Get the last streak and check if we need to maintain it
      const lastTaskDate = localStorage.getItem('lastTaskDate');
      let streak = 0;
      
      if (lastTaskDate) {
        // Format date to YYYY-MM-DD for comparison
        const formatDate = (date: Date): string => {
          return date.toISOString().split('T')[0];
        };
        
        const lastDate = new Date(lastTaskDate);
        const currentDate = new Date();
        
        // Check if yesterday
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (formatDate(lastDate) === formatDate(yesterday)) {
          // If the last task was completed yesterday, maintain streak
          const oldStats = localStorage.getItem('dailyStats');
          streak = oldStats ? JSON.parse(oldStats).streak : 0;
        }
      }
      
      // Reset stats for a new day but keep the streak if applicable
      return {
        pomodoroSessions: 0,
        completedTasks: 0,
        focusedTimeMinutes: 0,
        studyModeRounds: 0,
        streak: streak,
        lastTaskDate: lastTaskDate
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
    const today = new Date().toISOString();
    
    setStats(prev => {
      // Increment completed tasks
      const newCompletedTasks = prev.completedTasks + 1;
      
      // Update streak logic based on new requirements
      let newStreak = prev.streak;
      
      // If this is the second task completed today, start a streak of 1 if not already started
      if (newCompletedTasks === 2) {
        newStreak = newStreak === 0 ? 1 : newStreak;
      } 
      // If they completed more than 2 tasks and did one more, increment the streak
      else if (newCompletedTasks > 2 && newCompletedTasks > prev.completedTasks) {
        newStreak += 1;
      }
      
      return {
        ...prev,
        completedTasks: newCompletedTasks,
        streak: newStreak,
        lastTaskDate: today
      };
    });
    
    // Store last task date separately for streak calculations
    localStorage.setItem('lastTaskDate', new Date().toISOString());
  };
  
  // Add a study mode round
  const addStudyModeRound = () => {
    setStats(prev => ({
      ...prev,
      studyModeRounds: prev.studyModeRounds + 1
    }));
  };

  // Reset stats
  const resetStats = () => {
    setStats({
      pomodoroSessions: 0,
      completedTasks: 0,
      focusedTimeMinutes: 0,
      studyModeRounds: 0,
      streak: 0,
      lastTaskDate: null
    });
    localStorage.removeItem('lastTaskDate');
  };

  // Increment streak (used when completing a day)
  const incrementStreak = () => {
    setStats(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  return {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
    resetStats,
    incrementStreak
  };
};
