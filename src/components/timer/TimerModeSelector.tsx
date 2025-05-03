
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Coffee, GraduationCap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface TimerModeSelectorProps {
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break';
  isStudyActive: boolean;
  onChangeMode: (mode: 'focus' | 'break' | 'mini-focus' | 'long-break') => void;
  onToggleStudy: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const TimerModeSelector: React.FC<TimerModeSelectorProps> = ({
  timerMode,
  isStudyActive,
  onChangeMode,
  onToggleStudy,
  size = 'md'
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="mt-2">
      <h4 className="text-center text-sm font-medium mb-3 dark:text-gray-300">Timer Mode</h4>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button
          variant={timerMode === 'focus' && !isStudyActive ? 'default' : 'outline'}
          className={cn(
            timerMode === 'focus' && !isStudyActive 
              ? "bg-task hover:bg-task-dark" 
              : "dark:border-slate-700 dark:hover:bg-slate-800",
            size === 'sm' ? "text-xs py-1" : ""
          )}
          onClick={() => onChangeMode('focus')}
        >
          <Zap className="mr-1 h-4 w-4" />
          Focus (25m)
        </Button>
        
        <Button
          variant={timerMode === 'break' && !isStudyActive ? 'default' : 'outline'}
          className={cn(
            timerMode === 'break' && !isStudyActive
              ? "bg-green-500 hover:bg-green-600"
              : "dark:border-slate-700 dark:hover:bg-slate-800",
            size === 'sm' ? "text-xs py-1" : ""
          )}
          onClick={() => onChangeMode('break')}
        >
          <Coffee className="mr-1 h-4 w-4" />
          Break (5m)
        </Button>
        
        <Button
          variant={timerMode === 'mini-focus' ? 'default' : 'outline'}
          className={cn(
            timerMode === 'mini-focus'
              ? "bg-indigo-500 hover:bg-indigo-600"
              : "dark:border-slate-700 dark:hover:bg-slate-800",
            size === 'sm' ? "text-xs py-1" : ""
          )}
          onClick={() => onChangeMode('mini-focus')}
        >
          <Clock className="mr-1 h-4 w-4" />
          Quick Focus (10m)
        </Button>
        
        <Button
          variant={timerMode === 'long-break' ? 'default' : 'outline'}
          className={cn(
            timerMode === 'long-break'
              ? "bg-green-600 hover:bg-green-700"
              : "dark:border-slate-700 dark:hover:bg-slate-800",
            size === 'sm' ? "text-xs py-1" : ""
          )}
          onClick={() => onChangeMode('long-break')}
        >
          <Coffee className="mr-1 h-4 w-4" />
          Long Break (15m)
        </Button>
      </div>
      
      <Button
        variant={isStudyActive ? 'default' : 'outline'}
        className={cn(
          "w-full mt-2",
          isStudyActive 
            ? "bg-blue-500 hover:bg-blue-600" 
            : "dark:border-slate-700 dark:hover:bg-slate-800",
          size === 'sm' ? "text-xs py-1" : ""
        )}
        onClick={onToggleStudy}
      >
        <GraduationCap className="mr-2 h-4 w-4" />
        {isStudyActive ? 'Exit Study Mode' : 'Study Mode (4×25m with breaks)'}
      </Button>
    </div>
  );
};

export default TimerModeSelector;
