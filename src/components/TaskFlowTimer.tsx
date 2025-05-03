
import React, { useState, useEffect } from 'react';
import { useStats } from '@/contexts/StatsContext';
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

const TaskFlowTimer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const { layoutMode } = useLayout();
  const { userTracks } = useUserTracks();
  const { user } = useAuth();
  
  const {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
  } = useStats();

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Set up data sync with Supabase when user is authenticated
  useSupabaseSync(tasks, userTracks);

  const handleSessionComplete = () => {
    // Update daily stats
    const sessionLength = activeTask?.timeInMinutes || 25;
    addPomodoroSession(sessionLength);

    // If completing a task-specific timer, mark that task as complete
    if (activeTask) {
      setTasks(tasks.map(task => {
        if (task.id === activeTask.id) {
          addCompletedTask(); // Count as completed task in stats
          
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
  };

  const startTaskTimer = (task: Task) => {
    setActiveTask(task);
    toast(`Starting timer for: ${task.text}`, {
      description: `${task.timeInMinutes} minute focus session`
    });
  };

  // Handle toggling task completion status
  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompletedState = !task.completed;
        
        // If marking as complete, update stats
        if (newCompletedState) {
          addCompletedTask();
        }
        
        return {
          ...task,
          completed: newCompletedState,
          completedAt: newCompletedState ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
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
          onToggleComplete={handleToggleComplete}
        />
        
        <MusicSection layoutMode={layoutMode} />
        
        <StatisticsSection layoutMode={layoutMode} />
      </div>
    </div>
  );
};

export default TaskFlowTimer;
