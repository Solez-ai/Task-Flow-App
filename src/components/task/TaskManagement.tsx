
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';
import { Task } from '../TaskItem';
import { useStats } from '@/contexts/StatsContext';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';

interface TaskManagementProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  startTaskTimer: (task: Task) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ 
  tasks, 
  setTasks,
  startTaskTimer 
}) => {
  const {
    addCompletedTask,
    stats
  } = useStats();
  
  const {
    processStats,
    trackTaskCompletion
  } = useBadges();

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
          // Check for badges with updated stats
          processStats({
            ...stats,
            completedTasks: stats.completedTasks + 1
          });
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
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
  );
};

export default TaskManagement;
