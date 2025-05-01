
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 mb-2 rounded-md border",
      task.completed ? "bg-task-light border-task-completed" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => onToggle(task.id)} 
          className={cn(
            task.completed ? "border-task-completed" : "border-gray-300"
          )}
        />
        <span 
          className={cn(
            "text-sm transition-all",
            task.completed ? "line-through text-gray-400" : "text-gray-700"
          )}
        >
          {task.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        className="text-gray-500 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskItem;
