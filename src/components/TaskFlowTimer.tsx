
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

const TaskFlowTimer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const { userTracks } = useUserTracks();
  const { user } = useAuth();
  
  const {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
  } = useStats();
  
  const {
    processStats,
  } = useBadges();

  // Set up data sync with Supabase when user is authenticated
  useSupabaseSync(tasks, userTracks);

  // Process stats for badges
  useEffect(() => {
    processStats(stats);
  }, [stats]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Header tasks={tasks} />
      <div className="container mx-auto max-w-3xl p-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-task-dark dark:text-task">FocusFlow</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">Manage your time efficiently and complete tasks with structured work sessions.</p>
        
        <TimerSection 
          activeTask={activeTask} 
          onSessionComplete={handleSessionComplete} 
          onStudyRoundComplete={handleStudyRoundComplete} 
          onResetActiveTask={() => setActiveTask(null)} 
        />
        
        <TaskManagement 
          tasks={tasks} 
          setTasks={setTasks} 
          startTaskTimer={startTaskTimer} 
        />
        
        <MusicSection />
        
        <StatisticsSection />
      </div>
    </div>
  );
};

export default TaskFlowTimer;
