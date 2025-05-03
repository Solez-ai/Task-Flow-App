import React, { useState } from 'react';
import TaskItem, { Task } from './TaskItem';
import { ArrowDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartTimer?: (task: Task) => void;
  onShowAIOptions?: (task: Task) => void;
  onUpdateNote?: (id: string, note: string) => void;
  onToggleImportant?: (id: string) => void;
}
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onStartTimer,
  onShowAIOptions,
  onUpdateNote,
  onToggleImportant
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Toggle task selection for download
  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]);
  };

  // Toggle all task selections
  const toggleSelectAll = () => {
    if (selectAll || selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
      setSelectAll(false);
    } else {
      setSelectedTasks(tasks.map(task => task.id));
      setSelectAll(true);
    }
  };

  // Generate task text content for download
  const generateTaskContent = (tasksToDownload: Task[]) => {
    return tasksToDownload.map((task, index) => {
      const multipleTasksFormat = tasksToDownload.length > 1;
      const prefix = multipleTasksFormat ? `${index + 1}. ` : '';
      const status = task.completed ? '(Completed)' : '(Not Completed)';
      return `${prefix}${task.text} --------\n${status}${task.note ? `\nNote: ${task.note}` : ''}\n`;
    }).join('\n');
  };

  // Download tasks as a .txt file
  const downloadTasks = (all: boolean) => {
    const tasksToDownload = all ? tasks : tasks.filter(task => selectedTasks.includes(task.id));
    if (tasksToDownload.length === 0) {
      alert('No tasks selected for download');
      return;
    }
    const content = generateTaskContent(tasksToDownload);
    const fileName = all ? 'all-tasks.txt' : 'selected-tasks.txt';

    // Create a blob and download link
    const element = document.createElement('a');
    const file = new Blob([content], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  if (tasks.length === 0) {
    return <div className="p-8 text-center border border-dashed rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700 my-[29px]">
        <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one to get started!</p>
      </div>;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleSelectAll} className="h-8 flex items-center gap-1 border-task hover:border-task-dark dark:border-task dark:bg-slate-800">
            <Check className="h-3.5 w-3.5" />
            <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
          </Button>
          
          {selectedTasks.length > 0 && <Badge variant="secondary" className="bg-task text-white">
              {selectedTasks.length} selected
            </Badge>}
        </div>
        
        <div className="flex items-center gap-2">
          <ToggleGroup type="single">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="h-8 bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark">
                  <ArrowDown className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                <DropdownMenuItem onClick={() => downloadTasks(true)} className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
                  Download All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadTasks(false)} disabled={selectedTasks.length === 0} className={`${selectedTasks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800`}>
                  Download Selected Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ToggleGroup>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
        {tasks.map(task => <div key={task.id} className="flex items-center">
            <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => toggleTaskSelection(task.id)} className="mr-2 h-4 w-4 rounded border-gray-300 text-task focus:ring-task dark:border-slate-600 dark:bg-slate-800" />
            <div className="flex-1">
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onStartTimer={onStartTimer} onShowAIOptions={onShowAIOptions} onUpdateNote={onUpdateNote} onToggleImportant={onToggleImportant} />
            </div>
          </div>)}
      </div>
    </div>;
};
export default TaskList;