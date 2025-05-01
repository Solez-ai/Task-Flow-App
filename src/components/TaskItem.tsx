
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Clock, Tag } from 'lucide-react';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeInMinutes?: number;
  priority?: 'high' | 'medium' | 'low';
  sentiment?: 'positive' | 'negative' | 'neutral';
  project?: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartTimer?: (task: Task) => void;
  onShowAIOptions?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onStartTimer,
  onShowAIOptions
}) => {
  const getPriorityColor = () => {
    if (!task.priority) return "";
    
    switch(task.priority) {
      case 'high': return "border-l-4 border-l-red-500";
      case 'medium': return "border-l-4 border-l-yellow-500";
      case 'low': return "border-l-4 border-l-green-500";
      default: return "";
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 mb-2 rounded-md border",
      task.completed ? "bg-task-light border-task-completed dark:bg-slate-800 dark:border-green-700" : "bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700",
      getPriorityColor()
    )}>
      <div className="flex items-center gap-3 flex-grow">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => onToggle(task.id)} 
          className={cn(
            task.completed ? "border-task-completed" : "border-gray-300 dark:border-slate-500"
          )}
        />
        <div className="flex flex-col">
          <span 
            className={cn(
              "text-sm transition-all",
              task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-200"
            )}
          >
            {task.text}
          </span>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {task.priority && (
              <Badge className={cn(
                "text-xs px-2 py-0.5",
                task.priority === 'high' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                task.priority === 'medium' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {task.priority}
              </Badge>
            )}
            
            {task.project && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Tag className="h-3 w-3" />
                {task.project}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {task.timeInMinutes && !task.completed && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mr-2">
            <Clock className="h-3 w-3 mr-1" />
            {task.timeInMinutes} min
          </div>
        )}
        
        {!task.completed && onShowAIOptions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowAIOptions(task)}
            className="text-task hover:text-task-dark hover:bg-task-light/50 dark:hover:bg-task/30 dark:hover:text-task-light"
          >
            <BrainCircuit className="h-4 w-4" />
          </Button>
        )}
        
        {!task.completed && task.timeInMinutes && onStartTimer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartTimer(task)}
            className="text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 dark:hover:text-green-400"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-gray-500 hover:text-destructive dark:text-gray-400 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
