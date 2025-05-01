
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timer from './Timer';
import { Task } from './TaskItem';
import { toast } from 'sonner';

const TaskFlowTimer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
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
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const handleSessionComplete = () => {
    const havePendingTasks = tasks.some(task => !task.completed);
    if (havePendingTasks) {
      toast("Don't forget to mark your completed tasks!", {
        description: "Great work on your focus session!",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-task-dark">Task Flow Timer</h1>
      <p className="text-center mb-8 text-gray-600">Manage your time efficiently and complete tasks with structured work sessions.</p>
      
      <Timer onSessionComplete={handleSessionComplete} />
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onAddTask={addTask} />
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskFlowTimer;
