import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Task } from './TaskItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
interface TaskCalendarProps {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  open,
  onOpenChange
}) => {
  const {
    theme
  } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get completed tasks by date
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      if (!task.completedAt) return false;
      const taskDate = format(new Date(task.completedAt), 'yyyy-MM-dd');
      return taskDate === dateStr;
    });
  };

  // Get dates with completed tasks
  const getDaysWithTasks = (): Date[] => {
    return tasks.filter(task => task.completed && task.completedAt).map(task => new Date(task.completedAt as string));
  };
  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  const daysWithCompletedTasks = getDaysWithTasks();

  // Custom day rendering for completed tasks
  const hasCompletedTask = (date: Date): boolean => {
    return daysWithCompletedTasks.some(taskDate => format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-task-dark dark:text-task flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Task Calendar
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Track your productivity and completed tasks
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} modifiers={{
          completed: daysWithCompletedTasks
        }} modifiersClassNames={{
          completed: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        }} styles={{
          day: {
            margin: '0'
          },
          caption: {
            padding: '0.5rem'
          },
          nav_button: {
            color: theme === 'dark' ? 'white' : 'black',
            background: theme === 'dark' ? '#334155' : 'white'
          },
          table: {
            width: '100%',
            tableLayout: 'fixed'
          }
        }} className="border dark:border-slate-700 w-full mx-0 px-[63px] py-[15px] rounded-lg" />
        </div>

        {selectedDate && <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 dark:text-gray-300">
              Completed tasks on {format(selectedDate, 'MMMM d, yyyy')}:
            </h4>
            {tasksForSelectedDate.length > 0 ? <div className="space-y-2 max-h-32 overflow-y-auto">
                {tasksForSelectedDate.map(task => <div key={task.id} className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                      {task.text}
                    </Badge>
                  </div>)}
              </div> : <p className="text-sm text-muted-foreground">No tasks completed on this day.</p>}
          </div>}
      </DialogContent>
    </Dialog>;
};
export default TaskCalendar;