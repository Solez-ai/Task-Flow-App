
import React from 'react';
import TaskItem, { Task } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartTimer?: (task: Task) => void;
  onShowAIOptions?: (task: Task) => void;
  onUpdateNote?: (id: string, note: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggle, 
  onDelete, 
  onStartTimer,
  onShowAIOptions,
  onUpdateNote
}) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
        <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartTimer={onStartTimer}
          onShowAIOptions={onShowAIOptions}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  );
};

export default TaskList;
