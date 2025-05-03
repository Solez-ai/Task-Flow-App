
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DailyStats {
  pomodoroSessions: number;
  completedTasks: number;
  focusedTimeMinutes: number;
  studyModeRounds: number;
  streak: number;
  lastTaskDate: string | null;
}

export const useDailyStats = () => {
  const { user } = useAuth();
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

  // Sync with Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      const syncStatsToSupabase = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          
          // Check if we already have stats for today
          const { data: existingStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();
            
          if (existingStats) {
            // Update existing stats
            await supabase
              .from('user_stats')
              .update({
                pomodoro_sessions: stats.pomodoroSessions,
                completed_tasks: stats.completedTasks,
                focused_time_minutes: stats.focusedTimeMinutes,
                study_mode_rounds: stats.studyModeRounds
              })
              .eq('id', existingStats.id);
          } else {
            // Insert new stats
            await supabase
              .from('user_stats')
              .insert({
                user_id: user.id,
                date: today,
                pomodoro_sessions: stats.pomodoroSessions,
                completed_tasks: stats.completedTasks,
                focused_time_minutes: stats.focusedTimeMinutes,
                study_mode_rounds: stats.studyModeRounds
              });
          }
        } catch (error) {
          console.error('Error syncing stats to Supabase:', error);
        }
      };
      
      // Sync immediately when stats change
      syncStatsToSupabase();
      
      // Also set up periodic sync
      const syncTimer = setInterval(syncStatsToSupabase, 30000); // Every 30 seconds
      
      return () => {
        clearInterval(syncTimer);
      };
    }
  }, [user, stats]);

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
      
      if (newCompletedTasks === 1) {
        newStreak = prev.streak === 0 ? 1 : prev.streak;
      } 
      else if (newCompletedTasks > 1) {
        // Check if the last task was completed on a different day
        if (prev.lastTaskDate) {
          const lastTaskDate = new Date(prev.lastTaskDate).toDateString();
          const todayDate = new Date().toDateString();
          const yesterdayDate = new Date(Date.now() - 86400000).toDateString();
          
          if (lastTaskDate === yesterdayDate) {
            // If last task was yesterday, increment streak
            newStreak += 1;
          } else if (lastTaskDate !== todayDate) {
            // If last task was not yesterday and not today, reset streak
            newStreak = 1;
          }
        } else {
          // First task ever
          newStreak = 1;
        }
      }
      
      return {
        ...prev,
        completedTasks: newCompletedTasks,
        streak: newStreak,
        lastTaskDate: today
      };
    });
    
    localStorage.setItem('lastTaskDate', today);
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
