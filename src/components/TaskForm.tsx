
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Clock } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: string, timeInMinutes?: number) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [task, setTask] = useState('');
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [timeInMinutes, setTimeInMinutes] = useState<number>(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task, showTimeInput ? timeInMinutes : undefined);
      setTask('');
      setTimeInMinutes(25);
      setShowTimeInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={() => setShowTimeInput(!showTimeInput)}
          className={cn(
            "transition-colors",
            showTimeInput ? "bg-task text-white hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark" : "dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
          )}
        >
          <Clock className="w-4 h-4" />
        </Button>
      </div>

      {showTimeInput && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">Set time:</div>
          <Input
            type="number"
            min="1"
            max="120"
            value={timeInMinutes}
            onChange={(e) => setTimeInMinutes(parseInt(e.target.value) || 25)}
            className="w-24 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">minutes</div>
        </div>
      )}

      <Button type="submit" className="w-full bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark">
        <Plus className="w-5 h-5" />
        <span className="ml-2">Add Task</span>
      </Button>
    </form>
  );
};

export default TaskForm;

function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
