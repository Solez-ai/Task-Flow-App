
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timer from './Timer';
import DailyStatsPanel from './DailyStatsPanel';
import StreakPanel from './StreakPanel';
import MusicPlayer from './MusicPlayer';
import { Task } from './TaskItem';
import { useStats } from '@/contexts/StatsContext';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';
import Header from './Header';

const TaskFlowTimer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const {
    stats,
    addPomodoroSession,
    addCompletedTask,
    addStudyModeRound,
    resetStats
  } = useStats();
  
  const {
    processStats,
    trackTaskCompletion
  } = useBadges();

  // Process stats for badges
  useEffect(() => {
    processStats(stats);
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, timeInMinutes?: number, important?: boolean) => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      timeInMinutes,
      note: '',
      important
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        // If task is being marked as completed, update daily stats and add completedAt timestamp
        const updatedTask = {
          ...task,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : undefined
        };
        
        if (newCompleted) {
          addCompletedTask();
          // Track for badges
          const totalTasks = trackTaskCompletion();
          // Check for badges with today's task count
          processStats(stats, tasks.filter(t => t.completed).length + 1);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    if (activeTask && activeTask.id === id) {
      setActiveTask(null);
    }
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

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
          trackTaskCompletion(); // Track for badges
          
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

  const updateTaskNote = (id: string, note: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          note
        };
      }
      return task;
    }));
  };

  const toggleImportant = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          important: !task.important
        };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Header tasks={tasks} />
      <div className="container mx-auto max-w-3xl p-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-task-dark dark:text-task">FocusFlow</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">Manage your time efficiently and complete tasks with structured work sessions.</p>
        
        <Timer 
          onSessionComplete={handleSessionComplete} 
          activeTask={activeTask} 
          onResetActiveTask={() => setActiveTask(null)} 
          onStudyRoundComplete={handleStudyRoundComplete}
        />
        
        {/* TASK SECTION */}
        <div className="mt-8 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-task-dark dark:text-task">Task Management</h2>
          
          <Card className="mb-6 dark:bg-slate-900 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm onAddTask={addTask} />
            </CardContent>
          </Card>
          
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="py-[11px] my-[13px]">
              <CardTitle className="dark:text-gray-200">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <TaskList 
                  tasks={tasks} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                  onStartTimer={startTaskTimer} 
                  onUpdateNote={updateTaskNote} 
                  onToggleImportant={toggleImportant} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* MUSIC SECTION */}
        <div className="mt-10 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-task-dark dark:text-task">Music Player</h2>
          <MusicPlayer />
        </div>
        
        <DailyStatsPanel stats={stats} onResetStats={resetStats} />
        
        <StreakPanel streak={stats.streak} completedToday={stats.completedTasks} />
      </div>
    </div>
  );
};

export default TaskFlowTimer;
