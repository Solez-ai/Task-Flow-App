import React, { useState, useEffect } from 'react';
import { useStats } from '@/contexts/StatsContext';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';
import { Task } from './TaskItem';
import Header from './Header';
import TaskManagement from './task/TaskManagement';
import TimerSection from './timer/TimerSection';
import MusicSection from './music/MusicSection';
import StatisticsSection from './stats/StatisticsSection';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTracks } from '@/hooks/useUserTracks';
import { Navigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { supabase } from '@/integrations/supabase/client';

const TaskFlowTimer: React.FC = () => {
  const { user, session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      // Load tasks from localStorage, but only if they're associated with the current user
      const savedTasks = localStorage.getItem('tasks');
      const savedTasksUserId = localStorage.getItem('tasksUserId');
      
      console.log("Loading tasks. Current user:", user?.id, "Saved tasks user:", savedTasksUserId);
      
      // Only restore tasks if they belong to the current user
      if (savedTasks && user && savedTasksUserId === user.id) {
        return JSON.parse(savedTasks);
      } else if (savedTasks && !user && !savedTasksUserId) {
        // For non-authenticated users, we can still show their local tasks
        return JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
    return [];
  });
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const { layoutMode } = useLayout();
  const { userTracks } = useUserTracks();
  
  const {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
  } = useStats();
  
  const {
    processStats,
  } = useBadges();

  // Fetch tasks from Supabase when user logs in
  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching tasks from Supabase for user", user.id);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Found tasks in Supabase", data);
          
          // Convert from database format to front-end format
          const frontendTasks: Task[] = data.map(dbTask => ({
            id: dbTask.id,
            text: dbTask.text,
            completed: dbTask.completed,
            timeInMinutes: dbTask.time_in_minutes,
            note: dbTask.note || undefined,
            important: dbTask.important || false,
            completedAt: dbTask.completed_at || undefined
          }));
          
          // Merge with local tasks, prioritizing those from the database
          const existingTaskIds = new Set(tasks.map(t => t.id));
          const newTasks = frontendTasks.filter(t => !existingTaskIds.has(t.id));
          
          if (newTasks.length > 0) {
            setTasks(prevTasks => [...prevTasks, ...newTasks]);
          }
        }
      } catch (error) {
        console.error("Error fetching tasks from Supabase:", error);
        toast.error("Failed to load your tasks from the server");
      }
    };
    
    fetchUserTasks();
  }, [user?.id]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      console.log("Saving tasks to localStorage, count:", tasks.length);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      
      // Store the user ID alongside tasks for authentication verification
      if (user) {
        localStorage.setItem('tasksUserId', user.id);
      }
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks, user]);

  // Set up data sync with Supabase when user is authenticated
  useSupabaseSync(tasks, userTracks);

  // Process stats for badges
  useEffect(() => {
    processStats(stats);
  }, [stats, processStats]);

  // Handle auth changes
  useEffect(() => {
    // Listen for auth changes to update local data
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, will load their data');
        // Data loading handled in separate effects
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user-specific data');
        // Keep the current session data in memory, but mark it as not belonging to a user
        localStorage.removeItem('tasksUserId');
        localStorage.removeItem('statsUserId');
        localStorage.removeItem('userMusicUserId');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSessionComplete = () => {
    // Update daily stats
    const sessionLength = activeTask?.timeInMinutes || 25;
    addPomodoroSession(sessionLength);

    // Check for time-based badges
    processStats({
      ...stats,
      focusedTimeMinutes: stats.focusedTimeMinutes + sessionLength
    });

    // If completing a task-specific timer, mark that task as complete
    if (activeTask) {
      setTasks(tasks.map(task => {
        if (task.id === activeTask.id) {
          addCompletedTask(); // Count as completed task
          
          return {
            ...task,
            completed: true,
            completedAt: new Date().toISOString()
          };
        }
        return task;
      }));
      toast.success(`Task "${activeTask.text}" completed!`);
      setActiveTask(null);
    } else {
      // General timer completion
      const havePendingTasks = tasks.some(task => !task.completed);
      if (havePendingTasks) {
        toast("Don't forget to mark your completed tasks!", {
          description: "Great work on your focus session!"
        });
      }
    }
  };

  const handleStudyRoundComplete = () => {
    addStudyModeRound();
    toast.success("Study round completed!", {
      description: "Great job keeping focused!"
    });
    
    // Process stats for possible badges
    processStats(stats);
  };

  const startTaskTimer = (task: Task) => {
    setActiveTask(task);
    toast(`Starting timer for: ${task.text}`, {
      description: `${task.timeInMinutes} minute focus session`
    });
  };

  // Determine container classes based on layout mode
  const containerClasses = layoutMode === 'phone' 
    ? "p-2 py-4 max-w-full" 
    : "p-4 py-8 max-w-3xl";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Header tasks={tasks} />
      <div className={`container mx-auto ${containerClasses}`}>
        <h1 className={`${layoutMode === 'phone' ? 'text-xl' : 'text-3xl'} font-bold text-center mb-4 text-task-dark dark:text-task`}>FocusFlow</h1>
        {layoutMode !== 'phone' && (
          <p className="text-center mb-8 text-gray-600 dark:text-gray-300">Manage your time efficiently and complete tasks with structured work sessions.</p>
        )}
        
        <TimerSection 
          activeTask={activeTask} 
          onSessionComplete={handleSessionComplete} 
          onStudyRoundComplete={handleStudyRoundComplete} 
          onResetActiveTask={() => setActiveTask(null)}
          layoutMode={layoutMode}
        />
        
        <TaskManagement 
          tasks={tasks} 
          setTasks={setTasks} 
          startTaskTimer={startTaskTimer}
          layoutMode={layoutMode}
        />
        
        <MusicSection layoutMode={layoutMode} />
        
        <StatisticsSection layoutMode={layoutMode} />
      </div>
    </div>
  );
};

export default TaskFlowTimer;
