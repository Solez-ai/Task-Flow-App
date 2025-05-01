
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Task } from './TaskItem';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';

interface TaskCalendarProps {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ColorCode = 'default' | 'blue' | 'green' | 'amber' | 'pink';

interface DateColors {
  [date: string]: ColorCode;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, open, onOpenChange }) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [colorCoding, setColorCoding] = useState<ColorCode>('default');
  const [dateColors, setDateColors] = useState<DateColors>(() => {
    // Load saved colors from localStorage on initial load
    const savedColors = localStorage.getItem('focusflow-calendar-colors');
    return savedColors ? JSON.parse(savedColors) : {};
  });

  // Save date colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('focusflow-calendar-colors', JSON.stringify(dateColors));
  }, [dateColors]);

  // Get completed tasks by date
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((task) => {
      if (!task.completedAt) return false;
      const taskDate = format(new Date(task.completedAt), 'yyyy-MM-dd');
      return taskDate === dateStr;
    });
  };

  // Get dates with completed tasks
  const getDaysWithTasks = (): Date[] => {
    return tasks
      .filter(task => task.completed && task.completedAt)
      .map(task => new Date(task.completedAt as string));
  };

  // Apply color to selected date and save it
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      // Only update color if user has selected a color different from default
      if (colorCoding !== 'default') {
        setDateColors(prev => ({
          ...prev,
          [dateStr]: colorCoding
        }));
      }
    }
    setSelectedDate(date);
  };

  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  const modifiers = { completed: getDaysWithTasks() };

  // Custom day rendering for color coding
  const getColorClass = (date?: Date): string => {
    if (!date) return '';
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const savedColor = dateColors[dateStr];
    
    if (savedColor) {
      switch (savedColor) {
        case 'blue':
          return 'bg-blue-500 text-white';
        case 'green':
          return 'bg-green-500 text-white';
        case 'amber':
          return 'bg-amber-500 text-white';
        case 'pink':
          return 'bg-pink-500 text-white';
        default:
          return theme === 'dark' 
            ? 'bg-task dark:text-white' 
            : 'bg-task-light text-task-dark';
      }
    }
    
    // Default color for selected day without a saved color
    return theme === 'dark' 
      ? 'bg-slate-700 text-white' 
      : 'bg-task-light text-task-dark';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-task-dark dark:text-task flex items-center justify-between">
            Task Calendar
            <Select value={colorCoding} onValueChange={(value: ColorCode) => setColorCoding(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800">
                <SelectItem value="default">Purple</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Track your productivity and completed tasks
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border dark:border-slate-700 w-full"
            modifiers={modifiers}
            modifiersStyles={{
              completed: { 
                fontWeight: 'bold',
                textDecoration: 'underline'
              }
            }}
            modifiersClassNames={{
              selected: getColorClass(selectedDate)
            }}
            styles={{
              day: { margin: '0.15rem' },
              caption: { padding: '0.5rem' },
              nav_button: { 
                color: theme === 'dark' ? 'white' : 'black',
                background: theme === 'dark' ? '#334155' : 'white' 
              },
              table: { 
                width: '100%', 
                tableLayout: 'fixed',
                borderSpacing: '0.25rem'
              }
            }}
          />
        </div>

        {selectedDate && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 dark:text-gray-300">
              Completed tasks on {format(selectedDate, 'MMMM d, yyyy')}:
            </h4>
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tasksForSelectedDate.map((task) => (
                  <div key={task.id} className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline" className="bg-task-light dark:bg-task/20">
                      {task.text}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tasks completed on this day.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskCalendar;
