
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timer from './Timer';
import { Task } from './TaskItem';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import AITaskSuggestion from './AITaskSuggestion';
import AIProductivityInsights from './AIProductivityInsights';
import { BrainCircuit } from 'lucide-react';

const TaskFlowTimer: React.FC = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentTab, setCurrentTab] = useState('tasks');

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
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(null);
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

  const showAIOptions = (task: Task) => {
    setSelectedTask(task);
    setCurrentTab('ai');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    if (activeTask?.id === updatedTask.id) {
      setActiveTask(updatedTask);
    }
    
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
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
      
      <Tabs defaultValue="tasks" value={currentTab} onValueChange={setCurrentTab} className="mt-8">
        <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 dark:bg-slate-800">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Task Management
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <span className="flex items-center">
              <BrainCircuit className="w-4 h-4 mr-1" />
              AI Assistant
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
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
                  onShowAIOptions={showAIOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="space-y-6">
            {selectedTask ? (
              <AITaskSuggestion 
                task={selectedTask} 
                onUpdateTask={updateTask} 
              />
            ) : (
              <div className="p-6 border border-dashed rounded-lg text-center bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                <BrainCircuit className="mx-auto h-8 w-8 text-task dark:text-task-light opacity-60 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Select a task to get AI-powered suggestions</p>
              </div>
            )}
            
            <AIProductivityInsights tasks={tasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskFlowTimer;
