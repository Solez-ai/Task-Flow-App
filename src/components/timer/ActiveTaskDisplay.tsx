
import React from 'react';
import { Task } from '@/components/TaskItem';

interface ActiveTaskDisplayProps {
  activeTask: Task | null;
  onResetActiveTask: () => void;
}

const ActiveTaskDisplay: React.FC<ActiveTaskDisplayProps> = ({ activeTask }) => {
  if (!activeTask) return null;
  
  return (
    <div className="mb-4 p-3 bg-task-light rounded-md border border-task/20 dark:bg-slate-800 dark:border-slate-700">
      <h4 className="font-medium text-task-dark dark:text-task-light mb-1">Current Task:</h4>
      <p className="text-gray-700 dark:text-gray-300">{activeTask.text}</p>
    </div>
  );
};

export default ActiveTaskDisplay;
