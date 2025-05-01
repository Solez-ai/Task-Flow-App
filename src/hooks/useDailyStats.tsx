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
      // Check if we need to reset streak
      const lastTaskDate = localStorage.getItem('lastTaskDate');
      let streak = 0;
      
      if (lastTaskDate) {
        // Get the difference in days between now and the last task completion
        const lastDate = new Date(lastTaskDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If less than 2 days have passed, keep the streak
        if (diffDays < 2) {
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
      
      // Update streak logic
      let newStreak = prev.streak;
      
      // If this is at least the second task, start or continue streak
      if (newCompletedTasks >= 2) {
        newStreak += (prev.streak === 0) ? 1 : 0; // Increment only when starting a new streak
      }
      
      return {
        ...prev,
        completedTasks: newCompletedTasks,
        streak: newStreak > 0 ? newStreak : (newCompletedTasks >= 2 ? 1 : 0),
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
