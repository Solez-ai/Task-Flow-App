
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Task } from '../TaskItem';
import { cn } from '@/lib/utils';

interface ActiveTaskDisplayProps {
  task?: Task | null;
  onClear?: () => void;
  compact?: boolean;
}

const ActiveTaskDisplay: React.FC<ActiveTaskDisplayProps> = ({ 
  task, 
  onClear,
  compact = false
}) => {
  if (!task) return null;
  
  return (
    <div className={cn(
      "mb-4 p-3 bg-task-light rounded-md border border-task/20 dark:bg-slate-800 dark:border-slate-700",
      compact ? "text-sm" : ""
    )}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-task-dark dark:text-task-light">Current Task:</h4>
        {onClear && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear} 
            className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300">{task.text}</p>
    </div>
  );
};

export default ActiveTaskDisplay;
