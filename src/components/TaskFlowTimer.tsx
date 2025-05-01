
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timer from './Timer';
import DailyStatsPanel from './DailyStatsPanel';
import { Task } from './TaskItem';
import { useDailyStats } from '@/hooks/useDailyStats';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import Header from './Header';

const TaskFlowTimer: React.FC = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { stats, addPomodoroSession, addCompletedTask, addStudyModeRound, resetStats } = useDailyStats();

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, timeInMinutes?: number) => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      timeInMinutes,
      note: ''
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) => {
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
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    if (activeTask && activeTask.id === id) {
      setActiveTask(null);
    }
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const handleSessionComplete = () => {
    // Update daily stats
    const sessionLength = activeTask?.timeInMinutes || 25;
    addPomodoroSession(sessionLength);
    
    // If completing a task-specific timer, mark that task as complete
    if (activeTask) {
      setTasks(
        tasks.map((task) => {
          if (task.id === activeTask.id) {
            addCompletedTask(); // Count as completed task
            return { 
              ...task, 
              completed: true,
              completedAt: new Date().toISOString()
            };
          }
          return task;
        })
      );
      toast.success(`Task "${activeTask.text}" completed!`);
      setActiveTask(null);
    } else {
      // General timer completion
      const havePendingTasks = tasks.some(task => !task.completed);
      if (havePendingTasks) {
        toast("Don't forget to mark your completed tasks!", {
          description: "Great work on your focus session!",
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
  
  const updateTaskNote = (id: string, note: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, note };
        }
        return task;
      })
    );
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
        />
        
        <DailyStatsPanel stats={stats} onResetStats={resetStats} />
        
        <Card className="mt-8 dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onAddTask={addTask} />
            <div className="mt-4">
              <TaskList 
                tasks={tasks} 
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onStartTimer={startTaskTimer}
                onUpdateNote={updateTaskNote}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskFlowTimer;
