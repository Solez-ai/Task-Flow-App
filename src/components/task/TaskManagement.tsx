
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';
import { Task } from '../TaskItem';
import { useStats } from '@/contexts/StatsContext';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
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

  // Function to sync a single task to Supabase
  const syncTaskToSupabase = async (task: Task) => {
    if (!user) return;
    
    try {
      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', task.id)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (existingTask) {
        // Update existing task
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            text: task.text,
            completed: task.completed,
            time_in_minutes: task.timeInMinutes,
            note: task.note || null,
            important: task.important || false,
            completed_at: task.completedAt || null
          })
          .eq('id', task.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new task
        const { error: insertError } = await supabase
          .from('tasks')
          .insert({
            id: task.id,
            user_id: user.id,
            text: task.text,
            completed: task.completed,
            time_in_minutes: task.timeInMinutes,
            note: task.note || null,
            important: task.important || false,
            completed_at: task.completedAt || null
          });
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error syncing task to Supabase:', error);
    }
  };

  const addTask = (text: string, timeInMinutes?: number, important?: boolean) => {
    // Ensure timeInMinutes is a valid number between 1-120, or default to 25
    const validTime = timeInMinutes ? Math.max(1, Math.min(timeInMinutes, 120)) : undefined;
    
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      timeInMinutes: validTime,
      note: '',
      important
    };
    
    setTasks([...tasks, newTask]);
    
    // Immediately sync new task to Supabase
    if (user) {
      syncTaskToSupabase(newTask);
    }
    
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
        
        // Immediately sync updated task to Supabase
        if (user) {
          syncTaskToSupabase(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    // If user is logged in, delete from Supabase
    if (user) {
      supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Error deleting task from Supabase:', error);
          }
        });
    }
    
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const updateTaskNote = (id: string, note: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          note
        };
        
        // Immediately sync updated task to Supabase
        if (user) {
          syncTaskToSupabase(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const toggleImportant = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          important: !task.important
        };
        
        // Immediately sync updated task to Supabase
        if (user) {
          syncTaskToSupabase(updatedTask);
        }
        
        return updatedTask;
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
