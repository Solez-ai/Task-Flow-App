
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    // Initialize with empty stats
    const defaultStats = {
      pomodoroSessions: 0,
      completedTasks: 0,
      focusedTimeMinutes: 0,
      studyModeRounds: 0,
      streak: 0,
      lastTaskDate: null
    };
    
    try {
      const savedStats = localStorage.getItem('dailyStats');
      const savedStatsUserId = localStorage.getItem('statsUserId');
      const today = new Date().toDateString();
      const savedStatsDate = localStorage.getItem('dailyStatsDate');
      
      // Check if stats are from today and belong to current user
      const isToday = savedStatsDate === today;
      const isCurrentUser = (user && savedStatsUserId === user.id) || (!user && !savedStatsUserId);
      
      if (savedStats && isToday && isCurrentUser) {
        console.log("Restoring stats for user", user?.id || "anonymous");
        return JSON.parse(savedStats);
      } else {
        console.log("Creating new stats for user", user?.id || "anonymous");
        // If stats are not from today or user doesn't match, create new stats
        // but check if we have a streak going from yesterday
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
          ...defaultStats,
          streak: streak,
          lastTaskDate: lastTaskDate
        };
      }
    } catch (error) {
      console.error("Error loading stats from localStorage:", error);
      return defaultStats;
    }
  });

  // Initial sync with Supabase for authenticated users
  useEffect(() => {
    const syncStatsFromServer = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching stats from Supabase for user", user.id);
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }
        
        if (data) {
          console.log("Found stats in Supabase", data);
          setStats(prevStats => ({
            pomodoroSessions: data.pomodoro_sessions,
            completedTasks: data.completed_tasks,
            focusedTimeMinutes: data.focused_time_minutes,
            studyModeRounds: data.study_mode_rounds,
            streak: prevStats.streak, // Keep local streak value
            lastTaskDate: prevStats.lastTaskDate // Keep local last task date
          }));
          
          // Also update localStorage
          const statsToSave = {
            pomodoroSessions: data.pomodoro_sessions,
            completedTasks: data.completed_tasks,
            focusedTimeMinutes: data.focused_time_minutes,
            studyModeRounds: data.study_mode_rounds,
            streak: stats.streak,
            lastTaskDate: stats.lastTaskDate
          };
          
          localStorage.setItem('dailyStats', JSON.stringify(statsToSave));
          localStorage.setItem('dailyStatsDate', new Date().toDateString());
          localStorage.setItem('statsUserId', user.id);
        }
      } catch (error) {
        console.error("Error syncing stats from server:", error);
      }
    };
    
    syncStatsFromServer();
  }, [user]);

  // Save stats to localStorage and sync to Supabase whenever they change
  useEffect(() => {
    try {
      // Always save to localStorage regardless of user status
      console.log("Saving updated stats to localStorage:", stats);
      localStorage.setItem('dailyStats', JSON.stringify(stats));
      localStorage.setItem('dailyStatsDate', new Date().toDateString());
      
      // Store the user ID alongside stats for authentication verification
      if (user) {
        localStorage.setItem('statsUserId', user.id);
        
        // Sync to Supabase
        const syncStatsToServer = async () => {
          try {
            const today = new Date().toISOString().split('T')[0];
            
            // Check if we already have stats for today
            const { data: existingStats, error: fetchError } = await supabase
              .from('user_stats')
              .select('*')
              .eq('user_id', user.id)
              .eq('date', today);
              
            if (fetchError && fetchError.code !== 'PGRST116') {
              throw fetchError;
            }
            
            if (existingStats && existingStats.length > 0) {
              // Update existing stats
              console.log("Updating existing stats in Supabase");
              const { error: updateError } = await supabase
                .from('user_stats')
                .update({
                  pomodoro_sessions: stats.pomodoroSessions,
                  completed_tasks: stats.completedTasks,
                  focused_time_minutes: stats.focusedTimeMinutes,
                  study_mode_rounds: stats.studyModeRounds
                })
                .eq('id', existingStats[0].id);
                
              if (updateError) throw updateError;
            } else {
              // Insert new stats for today
              console.log("Inserting new stats in Supabase");
              const { error: insertError } = await supabase
                .from('user_stats')
                .insert({
                  user_id: user.id,
                  date: today,
                  pomodoro_sessions: stats.pomodoroSessions,
                  completed_tasks: stats.completedTasks,
                  focused_time_minutes: stats.focusedTimeMinutes,
                  study_mode_rounds: stats.studyModeRounds
                });
                
              if (insertError) throw insertError;
            }
          } catch (error) {
            console.error('Error syncing stats to server:', error);
          }
        };
        
        syncStatsToServer();
      }
    } catch (error) {
      console.error("Error saving stats to localStorage:", error);
    }
  }, [stats, user]);

  const addPomodoroSession = (minutes?: number) => {
    console.log("Adding pomodoro session", minutes || 25, "minutes");
    setStats(prev => ({
      ...prev,
      pomodoroSessions: prev.pomodoroSessions + 1,
      focusedTimeMinutes: prev.focusedTimeMinutes + (minutes || 25)
    }));
  };

  const addCompletedTask = () => {
    console.log("Adding completed task");
    const today = new Date().toISOString();
    
    setStats(prev => {
      const newCompletedTasks = prev.completedTasks + 1;
      let newStreak = prev.streak;
      
      if (newCompletedTasks === 1) {
        newStreak = newStreak === 0 ? 1 : newStreak + 1;
        toast.success(`Streak: ${newStreak} day${newStreak > 1 ? 's' : ''}!`, {
          description: `Keep up the good work!`
        });
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
    console.log("Adding study mode round");
    setStats(prev => ({
      ...prev,
      studyModeRounds: prev.studyModeRounds + 1
    }));
  };

  const resetStats = () => {
    console.log("Resetting stats");
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
