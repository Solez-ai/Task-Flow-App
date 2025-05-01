
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timer from './Timer';
import { Task } from './TaskItem';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

const TaskFlowTimer: React.FC = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, timeInMinutes?: number) => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      timeInMinutes
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
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
    // If completing a task-specific timer, mark that task as complete
    if (activeTask) {
      setTasks(
        tasks.map((task) =>
          task.id === activeTask.id ? { ...task, completed: true } : task
        )
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

  const startTaskTimer = (task: Task) => {
    setActiveTask(task);
    toast(`Starting timer for: ${task.text}`, {
      description: `${task.timeInMinutes} minute focus session`
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-task-dark dark:text-task">FocusFlow</h1>
      <p className="text-center mb-8 text-gray-600 dark:text-gray-300">Manage your time efficiently and complete tasks with structured work sessions.</p>
      
      <Timer 
        onSessionComplete={handleSessionComplete} 
        activeTask={activeTask}
        onResetActiveTask={() => setActiveTask(null)}
      />
      
      <Card className="dark:bg-slate-900 dark:border-slate-800">
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
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskFlowTimer;
