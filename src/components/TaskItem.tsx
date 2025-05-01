
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Clock, StickyNote, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeInMinutes?: number;
  completedAt?: string; // When the task was completed
  note?: string; // Task notes
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartTimer?: (task: Task) => void;
  onShowAIOptions?: (task: Task) => void;
  onUpdateNote?: (id: string, note: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onStartTimer,
  onShowAIOptions,
  onUpdateNote
}) => {
  const [note, setNote] = useState(task.note || '');
  
  const handleNoteChange = (value: string) => {
    setNote(value);
  };
  
  const handleNoteSave = () => {
    if (onUpdateNote) {
      onUpdateNote(task.id, note);
      toast.success("Note saved");
    }
  };

  const hasNote = task.note && task.note.trim().length > 0;

  return (
    <div className={cn(
      "flex items-center justify-between p-3 mb-2 rounded-md border",
      task.completed ? "bg-task-light border-task-completed dark:bg-slate-800 dark:border-green-700" : "bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700"
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
          {hasNote && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <StickyNote className="h-3 w-3 mr-1" /> Has note
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {task.timeInMinutes && !task.completed && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mr-2">
            <Clock className="h-3 w-3 mr-1" />
            {task.timeInMinutes} min
          </div>
        )}
        
        {/* Note Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                hasNote && "text-amber-500 dark:text-amber-400"
              )}
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 dark:bg-slate-900 dark:border-slate-800">
            <div className="space-y-2">
              <h4 className="font-medium text-sm dark:text-gray-200">Notes for: {task.text}</h4>
              <Textarea 
                placeholder="Add some notes..." 
                value={note} 
                onChange={(e) => handleNoteChange(e.target.value)} 
                className="min-h-[100px] dark:bg-slate-800 dark:border-slate-700"
              />
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleNoteSave} 
                  className="bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
                >
                  Save Note
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
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
