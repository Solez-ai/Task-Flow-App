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
    const savedStats = localStorage.getItem('dailyStats');
    const savedDate = localStorage.getItem('dailyStatsDate');
    const today = new Date().toDateString();
    
    if (savedStats && savedDate === today) {
      return JSON.parse(savedStats);
    } else {
      const lastTaskDate = localStorage.getItem('lastTaskDate');
      let streak = 0;
      
      if (lastTaskDate) {
        const formatDate = (date: Date): string => {
          return date.toISOString().split('T')[0];
        };
        
        const lastDate = new Date(lastTaskDate);
        const currentDate = new Date();
        
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (formatDate(lastDate) === formatDate(yesterday)) {
          const oldStats = localStorage.getItem('dailyStats');
          streak = oldStats ? JSON.parse(oldStats).streak : 0;
        }
      }
      
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

  useEffect(() => {
    localStorage.setItem('dailyStats', JSON.stringify(stats));
    localStorage.setItem('dailyStatsDate', new Date().toDateString());
  }, [stats]);

  const addPomodoroSession = (minutes?: number) => {
    setStats(prev => ({
      ...prev,
      pomodoroSessions: prev.pomodoroSessions + 1,
      focusedTimeMinutes: prev.focusedTimeMinutes + (minutes || 25)
    }));
  };

  const addCompletedTask = () => {
    const today = new Date().toISOString();
    
    setStats(prev => {
      const newCompletedTasks = prev.completedTasks + 1;
      let newStreak = prev.streak;
      
      if (newCompletedTasks === 2) {
        newStreak = newStreak === 0 ? 1 : newStreak;
      } 
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
    
    localStorage.setItem('lastTaskDate', new Date().toISOString());
  };
  
  const addStudyModeRound = () => {
    setStats(prev => ({
      ...prev,
      studyModeRounds: prev.studyModeRounds + 1
    }));
  };

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

  return {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
    resetStats
  };
};
