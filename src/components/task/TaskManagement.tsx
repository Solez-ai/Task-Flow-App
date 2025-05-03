
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import TaskList from '../TaskList';
import TaskForm from '../TaskForm';
import { Task } from '../TaskItem';

interface TaskManagementProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  startTaskTimer: (task: Task) => void;
  layoutMode?: 'pc' | 'phone';
}

const TaskManagement: React.FC<TaskManagementProps> = ({ 
  tasks, 
  setTasks, 
  startTaskTimer,
  layoutMode = 'pc'
}) => {
  const handleAddTask = (taskText: string, timeInMinutes?: number, important?: boolean) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      timeInMinutes,
      important
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
  };

  const handleUpdateNote = (taskId: string, note: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, note };
      }
      return task;
    }));
  };

  const handleToggleImportant = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, important: !task.important };
      }
      return task;
    }));
  };

  return (
    <Card className={`${layoutMode === 'phone' ? 'mb-4' : 'mb-8'} shadow-md`}>
      <CardHeader className={layoutMode === 'phone' ? 'pb-2' : ''}>
        <CardTitle className={layoutMode === 'phone' ? 'text-lg' : ''}>Tasks</CardTitle>
      </CardHeader>
      <CardContent className={layoutMode === 'phone' ? 'pt-0' : ''}>
        <TaskForm onAddTask={handleAddTask} />
        <TaskList
          tasks={tasks}
          onToggle={handleToggleComplete}
          onDelete={handleDeleteTask}
          onStartTimer={startTaskTimer}
          onShowAIOptions={() => {}}
          onUpdateNote={handleUpdateNote}
          onToggleImportant={handleToggleImportant}
        />
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
